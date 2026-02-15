"""PDF management routes"""
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin, get_current_user_optional
from app.schemas.pdf import PdfCreate, PdfResponse, PdfUpdate
from app.services.pdfs import (
    create_pdf,
    delete_pdf,
    get_all_pdfs,
    get_pdf,
    get_public_pdfs,
    get_category_upload_path,
    update_pdf,
)

router = APIRouter(prefix="/pdfs", tags=["pdfs"])


@router.post("/upload", response_model=PdfResponse, status_code=status.HTTP_201_CREATED)
async def upload_pdf(
    file: UploadFile = File(...),
    title: str = Form(...),
    category: str = Form(...),
    is_public: bool = Form(True),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Upload a PDF file.
    
    Flow:
    - Save file in uploads/{category}/
    - Store file path in database
    - Only admin can upload
    
    Only admin can access.
    """
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category is required"
        )
    
    if not title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required"
        )
    
    # Validate category
    valid_categories = ["NOTICE", "DATESHEET", "CIRCULAR", "EVENT"]
    if category.upper() not in valid_categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category must be one of: {', '.join(valid_categories)}"
        )
    
    try:
        # Get upload path for category
        category_path = get_category_upload_path(category.upper())
        
        # Generate safe filename
        import uuid
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "pdf"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = category_path / unique_filename
        
        # Save file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Store relative path in database
        relative_path = f"uploads/{category_path.name}/{unique_filename}"
        
        pdf = create_pdf(db, title, category.upper(), relative_path, is_public)
        
        return pdf
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File upload failed: {str(e)}"
        )


@router.get("", response_model=list[PdfResponse])
async def list_public_pdfs(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    List public PDFs.
    
    Public users can only see is_public=True PDFs.
    Optionally filter by category.
    """
    pdfs = get_public_pdfs(db, category)
    return pdfs


@router.get("/admin/all", response_model=list[PdfResponse])
async def list_all_pdfs(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    List all PDFs (admin view).
    
    Only admin can access. Shows both public and private PDFs.
    Optionally filter by category.
    """
    pdfs = get_all_pdfs(db, category)
    return pdfs


@router.get("/download/{filename}")
async def download_pdf(filename: str):
    file_path = Path("uploads/notice") / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename,
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )


@router.get("/{pdf_id}", response_model=PdfResponse)
async def get_pdf_details(
    pdf_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Get PDF details.
    
    Public users can only see if is_public=True.
    Admin can see all PDFs.
    """
    pdf = get_pdf(db, pdf_id)
    
    if not pdf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PDF not found"
        )
    
    # Check access
    is_admin = current_user and current_user.get("role") == "admin"
    if not pdf.is_public and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return pdf


@router.put("/{pdf_id}", response_model=PdfResponse)
async def update_pdf_metadata(
    pdf_id: int,
    request: PdfUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Update PDF metadata.
    
    Only admin can access.
    """
    pdf = update_pdf(db, pdf_id, request.title, request.is_public)
    
    if not pdf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PDF not found"
        )
    
    return pdf


@router.delete("/{pdf_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pdf_record(
    pdf_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Delete a PDF file and its database record.
    
    Only admin can access.
    Deletes the actual file from disk.
    """
    deleted = delete_pdf(db, pdf_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PDF not found"
        )
    
    return None
