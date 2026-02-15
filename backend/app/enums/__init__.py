"""Application enums"""
from app.enums.attendance_enum import AttendanceStatus
from app.enums.class_enum import ClassEnum
from app.enums.pdf_enum import PdfCategory
from app.enums.subject_enum import SubjectEnum

__all__ = [
    "ClassEnum",
    "SubjectEnum",
    "AttendanceStatus",
    "PdfCategory",
]
