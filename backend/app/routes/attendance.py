"""Attendance management routes"""
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.schemas.attendance import (
    AttendanceMarkBulkRequest,
    AttendanceResponse,
    StudentAttendanceResponse,
)
from app.services.attendance import (
    get_students_for_attendance,
    get_student_attendance_history,
    mark_attendance_bulk,
)

router = APIRouter(prefix="/admin/attendance", tags=["admin-attendance"])


@router.get("/students/{class_}/{date}", response_model=list[StudentAttendanceResponse])
async def get_class_students_for_attendance(
    class_: int,
    date: date,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get all students in a class for attendance marking.
    
    Returns student list for the admin to mark attendance.
    Only admin can access.
    """
    if class_ < 1 or class_ > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Class must be between 1 and 10"
        )
    
    students = get_students_for_attendance(db, class_)
    
    return [StudentAttendanceResponse.from_orm(student) for student in students]


@router.post("/mark", status_code=status.HTTP_201_CREATED)
async def mark_attendance(
    request: AttendanceMarkBulkRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Mark attendance for multiple students.
    
    Flow:
    1. Admin selects class + date
    2. Gets student list from /students/{class}/{date}
    3. Submits list with student_id + status
    
    Rules:
    - One attendance per student per date
    - If exists → update
    - Prevents duplicate entries (upsert logic)
    
    Only admin can access.
    """
    if request.class_ < 1 or request.class_ > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Class must be between 1 and 10"
        )
    
    # Convert attendances to dict format
    attendances_data = [
        {
            "student_id": att.student_id,
            "status": att.status
        }
        for att in request.attendances
    ]
    
    result = mark_attendance_bulk(db, request.class_, request.date, attendances_data)
    
    return {
        "message": "Attendance marked successfully",
        "date": request.date,
        "class": request.class_,
        "success": result["success"],
        "failed": result["failed"],
        "failed_student_ids": result["failed_student_ids"]
    }


@router.get("/student/{student_id}", response_model=list[AttendanceResponse])
async def get_student_attendance(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get attendance history for a student.
    
    Returns all attendance records for the student.
    Only admin can access.
    """
    attendances = get_student_attendance_history(db, student_id)
    
    return [AttendanceResponse.from_orm(att) for att in attendances]
