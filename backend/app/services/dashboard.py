"""Dashboard metrics service"""
from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.enums.attendance_enum import AttendanceStatus
from app.models import Attendance, Fees, PDF, Student


def get_admin_dashboard_summary(db: Session) -> dict:
    """
    Build admin dashboard summary metrics.

    Returns zeros for all aggregate fields when records are missing.
    """
    total_students = db.query(func.count(Student.id)).scalar() or 0

    total_attendance_today = db.query(func.count(Attendance.id)).filter(
        Attendance.date == date.today()
    ).scalar() or 0

    present_attendance_today = db.query(func.count(Attendance.id)).filter(
        Attendance.date == date.today(),
        Attendance.status == AttendanceStatus.PRESENT
    ).scalar() or 0

    if total_attendance_today > 0:
        today_attendance_percentage = (
            present_attendance_today / total_attendance_today
        ) * 100.0
    else:
        today_attendance_percentage = 0.0

    total_fees_collected = db.query(
        func.coalesce(func.sum(Fees.paid_amount), 0.0)
    ).scalar() or 0.0

    total_pending_fees = db.query(
        func.coalesce(func.sum(Fees.due_amount), 0.0)
    ).scalar() or 0.0

    total_pdfs = db.query(func.count(PDF.id)).scalar() or 0

    return {
        "total_students": int(total_students),
        "today_attendance_percentage": float(today_attendance_percentage),
        "total_fees_collected": float(total_fees_collected),
        "total_pending_fees": float(total_pending_fees),
        "total_pdfs": int(total_pdfs),
    }
