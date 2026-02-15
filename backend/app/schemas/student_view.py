"""Student profile and summary schemas"""
from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.enums.attendance_enum import AttendanceStatus
from app.enums.subject_enum import SubjectEnum


class StudentProfileResponse(BaseModel):
    """Student's own profile"""
    id: int
    student_id: str
    name: str
    class_: int = Field(..., alias="class")
    dob: date
    phone: Optional[str]
    address: Optional[str]
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True


class StudentAttendanceSummary(BaseModel):
    """Student's attendance summary"""
    date: date
    status: AttendanceStatus

    class Config:
        from_attributes = True


class StudentFeesSummary(BaseModel):
    """Student's fees summary"""
    id: int
    amount: float
    paid_amount: float
    due_amount: float
    payment_date: Optional[datetime]
    remark: Optional[str]

    class Config:
        from_attributes = True


class StudentResultSummary(BaseModel):
    """Student's result summary"""
    id: int
    subject: SubjectEnum
    marks: float
    exam_type: str

    class Config:
        from_attributes = True


class StudentPdfResponse(BaseModel):
    """PDF available to student"""
    id: int
    title: str
    category: str
    upload_date: datetime

    class Config:
        from_attributes = True


class SchoolInfoResponse(BaseModel):
    """Public school information"""
    school_name: str = "School Management System"
    version: str = "1.0.0"
    api_base_url: str = "http://localhost:8000"
    features: List[str] = [
        "Student Management",
        "Attendance Tracking",
        "Fee Management",
        "Result Management",
        "Document Sharing"
    ]
