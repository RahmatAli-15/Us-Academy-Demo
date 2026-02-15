"""Public routes (no authentication required)"""
from typing import Optional

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.pdf import PdfResponse
from app.schemas.student_view import SchoolInfoResponse
from app.services.pdfs import get_public_pdfs

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/pdfs", response_model=list[PdfResponse])
async def list_public_pdfs(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all public PDF documents.
    
    Returns only PDFs with is_public=True.
    No authentication required.
    
    Optionally filter by category:
    - NOTICE
    - DATESHEET
    - CIRCULAR
    - EVENT
    """
    pdfs = get_public_pdfs(db, category)
    return pdfs


@router.get("/school-info", response_model=SchoolInfoResponse)
async def get_school_info():
    """
    Get public school information.
    
    Returns general school information and available features.
    No authentication required.
    """
    return SchoolInfoResponse()
