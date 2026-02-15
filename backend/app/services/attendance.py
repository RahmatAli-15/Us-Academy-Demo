"""Attendance management service"""
from datetime import date
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models import Attendance, Student
from app.enums.attendance_enum import AttendanceStatus


def get_students_for_attendance(db: Session, class_: int) -> List[Student]:
    """
    Get all students in a class for attendance marking.
    
    Args:
        db: Database session
        class_: Class number (1-10)
        
    Returns:
        List of Student objects
    """
    return db.query(Student).filter(Student.class_ == class_).all()


def mark_attendance(
    db: Session,
    student_id: int,
    class_: int,
    attendance_date: date,
    status: AttendanceStatus
) -> Optional[Attendance]:
    """
    Mark or update attendance for a student on a specific date.
    
    Uses upsert logic: updates if exists, creates if doesn't exist.
    
    Args:
        db: Database session
        student_id: Student database ID
        class_: Class number
        attendance_date: Date of attendance
        status: Attendance status enum
        
    Returns:
        Attendance object or None if student doesn't exist
    """
    # Verify student exists
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return None
    
    # Check if attendance already exists
    existing = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.date == attendance_date
    ).first()
    
    if existing:
        # Update existing
        existing.status = status
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new
        new_attendance = Attendance(
            student_id=student_id,
            class_=class_,
            date=attendance_date,
            status=status
        )
        db.add(new_attendance)
        db.commit()
        db.refresh(new_attendance)
        return new_attendance


def mark_attendance_bulk(
    db: Session,
    class_: int,
    attendance_date: date,
    attendances_data: List[dict]
) -> dict:
    """
    Mark attendance for multiple students in bulk.
    
    Args:
        db: Database session
        class_: Class number
        attendance_date: Date of attendance
        attendances_data: List of dicts with student_id and status
        
    Returns:
        Dict with success count, failed count, and failed list
    """
    success_count = 0
    failed_students = []
    
    for attendance_data in attendances_data:
        student_id = attendance_data["student_id"]
        status = attendance_data["status"]
        
        result = mark_attendance(db, student_id, class_, attendance_date, status)
        
        if result:
            success_count += 1
        else:
            failed_students.append(student_id)
    
    return {
        "success": success_count,
        "failed": len(failed_students),
        "failed_student_ids": failed_students
    }


def get_attendance(
    db: Session,
    student_id: int,
    attendance_date: date
) -> Optional[Attendance]:
    """
    Get attendance for a student on a specific date.
    
    Args:
        db: Database session
        student_id: Student database ID
        attendance_date: Date
        
    Returns:
        Attendance object or None
    """
    return db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.date == attendance_date
    ).first()


def get_student_attendance_history(
    db: Session,
    student_id: int
) -> List[Attendance]:
    """
    Get all attendance records for a student.
    
    Args:
        db: Database session
        student_id: Student database ID
        
    Returns:
        List of Attendance objects
    """
    return db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).order_by(Attendance.date.desc()).all()
