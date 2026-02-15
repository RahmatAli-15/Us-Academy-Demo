"""Database models"""
from app.models.admin import Admin
from app.models.attendance import Attendance
from app.models.fees import Fees
from app.models.pdf import PDF
from app.models.result import Result
from app.models.student import Student

__all__ = [
    "Admin",
    "Student",
    "Attendance",
    "Fees",
    "Result",
    "PDF",
]
