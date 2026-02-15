"""PDF request and response schemas"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.enums.pdf_enum import PdfCategory


class PdfCreate(BaseModel):
    """Create PDF record"""
    title: str = Field(..., min_length=1, max_length=200)
    category: PdfCategory
    is_public: bool = Field(True)


class PdfUpdate(BaseModel):
    """Update PDF metadata"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    is_public: Optional[bool] = None


class PdfResponse(BaseModel):
    """PDF response"""
    id: int
    title: str
    category: PdfCategory
    file_path: str
    upload_date: datetime
    is_public: bool

    class Config:
        from_attributes = True
