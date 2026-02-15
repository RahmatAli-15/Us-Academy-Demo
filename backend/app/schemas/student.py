"""Student request and response schemas"""
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.enums.class_enum import ClassEnum


class StudentCreate(BaseModel):
    """Student creation request"""
    name: str = Field(..., min_length=1, max_length=100)
    class_: int = Field(..., ge=1, le=10, alias="class", description="Class (1-10)")
    dob: date = Field(..., description="Date of birth (YYYY-MM-DD)")
    aadhaar_number: str = Field(..., min_length=12, max_length=12, description="12-digit Aadhaar number")
    father_name: Optional[str] = Field(None, max_length=100)
    mother_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=15)
    address: Optional[str] = Field(None, max_length=255)

    class Config:
        populate_by_name = True


class StudentUpdate(BaseModel):
    """Student update request"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    class_: Optional[int] = Field(None, ge=1, le=10, alias="class", description="Class (1-10)")
    father_name: Optional[str] = Field(None, max_length=100)
    mother_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=15)
    address: Optional[str] = Field(None, max_length=255)

    class Config:
        populate_by_name = True


class StudentResponse(BaseModel):
    """Student response"""
    id: int
    student_id: str
    name: str
    class_: int = Field(..., alias="class")
    dob: date
    aadhaar_number: str
    father_name: Optional[str]
    mother_name: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True
