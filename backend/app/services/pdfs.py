"""PDF management service"""
import os
from pathlib import Path
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models import PDF


# Ensure uploads directory exists
UPLOADS_DIR = Path(__file__).parent.parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)


def get_category_upload_path(category: str) -> Path:
    """
    Get upload path for a category and create if doesn't exist.
    
    Args:
        category: PDF category (NOTICE, DATESHEET, CIRCULAR, EVENT)
        
    Returns:
        Path object for the category directory
    """
    category_path = UPLOADS_DIR / category.lower()
    category_path.mkdir(exist_ok=True, parents=True)
    return category_path


def create_pdf(
    db: Session,
    title: str,
    category: str,
    file_path: str,
    is_public: bool = True
) -> PDF:
    """
    Create a PDF record in the database.
    
    Args:
        db: Database session
        title: PDF title
        category: PDF category
        file_path: Relative path to uploaded file
        is_public: Whether PDF is publicly accessible
        
    Returns:
        Created PDF object
    """
    new_pdf = PDF(
        title=title,
        category=category,
        file_path=file_path,
        is_public=is_public
    )
    
    db.add(new_pdf)
    db.commit()
    db.refresh(new_pdf)
    return new_pdf


def normalize_legacy_pdf_paths(db: Session) -> None:
    """
    Normalize legacy PDF file_path values where category folder was stored
    in uppercase (e.g. uploads/NOTICE/file.pdf) or without the uploads prefix
    (e.g. notice/file.pdf). Current storage uses uploads/{category}/{filename}
    with lowercase category names.
    """
    pdfs = db.query(PDF).all()
    updated = False

    for pdf in pdfs:
        if not pdf.file_path:
            continue

        normalized_input = pdf.file_path.replace("\\", "/").lstrip("/")
        parts = normalized_input.split("/", 2)

        normalized_path = None
        if len(parts) == 3 and parts[0].lower() == "uploads":
            normalized_path = f"uploads/{parts[1].lower()}/{parts[2]}"
        elif len(parts) == 2:
            normalized_path = f"uploads/{parts[0].lower()}/{parts[1]}"

        if not normalized_path:
            continue

        if normalized_path != pdf.file_path:
            pdf.file_path = normalized_path
            updated = True

    if updated:
        db.commit()


def get_pdf(db: Session, pdf_id: int) -> Optional[PDF]:
    """
    Get a PDF record by ID.
    
    Args:
        db: Database session
        pdf_id: PDF ID
        
    Returns:
        PDF object or None
    """
    return db.query(PDF).filter(PDF.id == pdf_id).first()


def get_all_pdfs(db: Session, category: Optional[str] = None) -> List[PDF]:
    """
    Get all PDFs, optionally filtered by category.
    
    Args:
        db: Database session
        category: Optional category filter
        
    Returns:
        List of PDF objects
    """
    query = db.query(PDF)
    
    if category:
        query = query.filter(PDF.category == category.upper())
    
    return query.order_by(PDF.upload_date.desc()).all()


def get_public_pdfs(db: Session, category: Optional[str] = None) -> List[PDF]:
    """
    Get only public PDFs.
    
    Args:
        db: Database session
        category: Optional category filter
        
    Returns:
        List of public PDF objects
    """
    query = db.query(PDF).filter(PDF.is_public == True)
    
    if category:
        query = query.filter(PDF.category == category.upper())
    
    return query.order_by(PDF.upload_date.desc()).all()


def update_pdf(
    db: Session,
    pdf_id: int,
    title: Optional[str] = None,
    is_public: Optional[bool] = None
) -> Optional[PDF]:
    """
    Update PDF metadata.
    
    Args:
        db: Database session
        pdf_id: PDF ID
        title: Updated title
        is_public: Updated public status
        
    Returns:
        Updated PDF object or None if not found
    """
    pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    
    if not pdf:
        return None
    
    if title is not None:
        pdf.title = title
    
    if is_public is not None:
        pdf.is_public = is_public
    
    db.commit()
    db.refresh(pdf)
    return pdf


def delete_pdf(db: Session, pdf_id: int) -> bool:
    """
    Delete a PDF record and its file.
    
    Args:
        db: Database session
        pdf_id: PDF ID
        
    Returns:
        True if deleted, False if not found
    """
    pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    
    if not pdf:
        return False
    
    # Delete file if it exists
    file_path = UPLOADS_DIR.parent / pdf.file_path
    if file_path.exists():
        try:
            file_path.unlink()
        except Exception:
            pass  # Continue even if file deletion fails
    
    # Delete from database
    db.delete(pdf)
    db.commit()
    return True
