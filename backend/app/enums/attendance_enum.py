"""Attendance status enumeration"""
from enum import Enum


class AttendanceStatus(str, Enum):
    """Attendance status values"""
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    HOLIDAY = "HOLIDAY"
