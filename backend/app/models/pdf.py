"""PDF/Document model"""
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, String

from app.core.database import Base
from app.enums.pdf_enum import PdfCategory


class PDF(Base):
    """PDF documents and notices model"""
    __tablename__ = "pdfs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(Enum(PdfCategory), nullable=False, index=True)
    file_path = Column(String(500), nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    is_public = Column(Boolean, default=True, nullable=False)

    def __repr__(self):
        return f"<PDF(id={self.id}, title={self.title}, category={self.category})>"
