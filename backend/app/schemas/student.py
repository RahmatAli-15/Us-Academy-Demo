"""Student request and response schemas"""
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field
from app.enums.class_enum import ClassEnum

class StudentDetailsBase(BaseModel):
    """Shared student fields for create, update, and responses."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    class_: Optional[ClassEnum] = Field(None, alias="class", description="School class")
    dob: Optional[date] = Field(None, description="Date of birth (YYYY-MM-DD)")
    aadhaar_number: Optional[str] = Field(None, min_length=12, max_length=12, description="12-digit Aadhaar number")
    dob_in_words: Optional[str] = Field(None, max_length=100)
    pen_number: Optional[str] = Field(None, max_length=50)
    apaar_id: Optional[str] = Field(None, max_length=50)
    admission_class: Optional[str] = Field(None, max_length=20)
    subject: Optional[str] = Field(None, max_length=100)
    father_name: Optional[str] = Field(None, max_length=100)
    father_aadhaar_number: Optional[str] = Field(None, max_length=12)
    mother_name: Optional[str] = Field(None, max_length=100)
    mother_aadhaar_number: Optional[str] = Field(None, max_length=12)
    guardian_name: Optional[str] = Field(None, max_length=100)
    guardian_aadhaar_number: Optional[str] = Field(None, max_length=12)
    guardian_relationship: Optional[str] = Field(None, max_length=100)
    admission_date: Optional[date] = None
    previous_class: Optional[str] = Field(None, max_length=20)
    previous_school: Optional[str] = Field(None, max_length=255)
    gender: Optional[str] = Field(None, max_length=20)
    religion: Optional[str] = Field(None, max_length=50)
    caste: Optional[str] = Field(None, max_length=50)
    sub_caste: Optional[str] = Field(None, max_length=50)
    residence_period_uttar_pradesh: Optional[str] = Field(None, max_length=100)
    disability: Optional[str] = Field(None, max_length=20)
    disability_type: Optional[str] = Field(None, max_length=100)
    disability_percentage: Optional[str] = Field(None, max_length=20)
    ration_card_type: Optional[str] = Field(None, max_length=50)
    father_education: Optional[str] = Field(None, max_length=100)
    father_occupation: Optional[str] = Field(None, max_length=100)
    mother_education: Optional[str] = Field(None, max_length=100)
    mother_occupation: Optional[str] = Field(None, max_length=100)
    category_bpl: Optional[str] = Field(None, max_length=20)
    indian_citizenship: Optional[str] = Field(None, max_length=20)
    out_of_school_child: Optional[str] = Field(None, max_length=20)
    last_academic_result: Optional[str] = Field(None, max_length=255)
    previous_academic_marks: Optional[str] = Field(None, max_length=100)
    school_last_attended_days: Optional[str] = Field(None, max_length=50)
    mobile_number_1: Optional[str] = Field(None, max_length=15)
    whatsapp_number_2: Optional[str] = Field(None, max_length=15)
    phone: Optional[str] = Field(None, max_length=15)
    address: Optional[str] = Field(None, max_length=255)
    pin_code: Optional[str] = Field(None, max_length=10)
    account_holder_name: Optional[str] = Field(None, max_length=100)
    account_holder_aadhaar_number: Optional[str] = Field(None, max_length=12)
    bank_name: Optional[str] = Field(None, max_length=100)
    branch_name: Optional[str] = Field(None, max_length=100)
    ifsc_code: Optional[str] = Field(None, max_length=20)
    aadhaar_registered_mobile: Optional[str] = Field(None, max_length=15)
    aadhaar_registered_pin_code: Optional[str] = Field(None, max_length=10)
    email: Optional[str] = Field(None, max_length=100)
    blood_group: Optional[str] = Field(None, max_length=10)
    weight: Optional[str] = Field(None, max_length=20)
    height: Optional[str] = Field(None, max_length=20)
    profile_photo_path: Optional[str] = Field(None, max_length=255)
    guardian_declaration: Optional[str] = Field(None, max_length=500)

    class Config:
        populate_by_name = True


class StudentCreate(StudentDetailsBase):
    """Student creation request"""
    name: str = Field(..., min_length=1, max_length=100)
    class_: ClassEnum = Field(..., alias="class", description="School class")
    dob: date = Field(..., description="Date of birth (YYYY-MM-DD)")
    aadhaar_number: str = Field(..., min_length=12, max_length=12, description="12-digit Aadhaar number")


class StudentUpdate(StudentDetailsBase):
    """Student update request"""

    class Config:
        populate_by_name = True


class StudentResponse(StudentDetailsBase):
    """Student response"""
    id: int
    student_id: str
    name: str
    class_: ClassEnum = Field(..., alias="class")
    dob: date
    aadhaar_number: str
    profile_photo_url: Optional[str] = None
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True
