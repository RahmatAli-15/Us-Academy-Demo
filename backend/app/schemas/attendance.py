"""Attendance request and response schemas"""
from datetime import date, datetime
from typing import List

from pydantic import BaseModel, Field

from app.enums.attendance_enum import AttendanceStatus
from app.enums.class_enum import ClassEnum


class AttendanceMarkRequest(BaseModel):
    """Mark attendance for a student"""
    student_id: int = Field(..., description="Student database ID")
    status: AttendanceStatus


class AttendanceMarkBulkRequest(BaseModel):
    """Mark attendance for multiple students"""
    class_: ClassEnum = Field(..., alias="class")
    date: date
    attendances: List[AttendanceMarkRequest]

    class Config:
        populate_by_name = True


class AttendanceResponse(BaseModel):
    """Attendance response"""
    id: int
    student_id: int
    class_: ClassEnum = Field(..., alias="class")
    date: date
    status: AttendanceStatus

    class Config:
        populate_by_name = True
        from_attributes = True


class StudentAttendanceResponse(BaseModel):
    """Student for attendance selection"""
    id: int
    student_id: str
    name: str
    class_: ClassEnum = Field(..., alias="class")

    class Config:
        populate_by_name = True
        from_attributes = True
