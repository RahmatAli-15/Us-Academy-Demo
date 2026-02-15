"""Student personal data routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_student
from app.schemas.student_view import (
    StudentAttendanceSummary,
    StudentFeesSummary,
    StudentProfileResponse,
    StudentPdfResponse,
    StudentResultSummary,
)
from app.services.attendance import get_student_attendance_history
from app.services.fees import get_student_fees
from app.services.pdfs import get_public_pdfs
from app.services.results import get_student_results
from app.services.student_view import get_student_by_id

router = APIRouter(prefix="/student", tags=["student"])


@router.get("/me", response_model=StudentProfileResponse)
async def get_student_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student)
):
    """
    Get current student's own profile.
    
    Returns own student information.
    Only student can access own profile.
    """
    student_id = int(current_user.get("sub"))
    
    student = get_student_by_id(db, student_id)
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    return student


@router.get("/attendance", response_model=list[StudentAttendanceSummary])
async def get_student_attendance(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student)
):
    """
    Get current student's attendance history.
    
    Returns all attendance records for the student.
    Only student can access own attendance.
    """
    student_id = int(current_user.get("sub"))
    
    attendances = get_student_attendance_history(db, student_id)
    
    return [StudentAttendanceSummary.from_orm(att) for att in attendances]


@router.get("/fees", response_model=list[StudentFeesSummary])
async def get_student_fees_list(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student)
):
    """
    Get current student's fee records.
    
    Returns all fee records with due amount calculation.
    Only student can access own fees.
    """
    student_id = int(current_user.get("sub"))
    
    fees = get_student_fees(db, student_id)
    
    return [StudentFeesSummary.from_orm(fee) for fee in fees]


@router.get("/results", response_model=list[StudentResultSummary])
async def get_student_results_list(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student)
):
    """
    Get current student's result records.
    
    Returns all exam results across all subjects and exam types.
    Only student can access own results.
    """
    student_id = int(current_user.get("sub"))
    
    results = get_student_results(db, student_id)
    
    return [StudentResultSummary.from_orm(result) for result in results]


@router.get("/pdfs", response_model=list[StudentPdfResponse])
async def get_student_available_pdfs(
    category: str = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student)
):
    """
    Get public PDF documents available to student.
    
    Returns only is_public=True PDFs.
    Student can optionally filter by category.
    """
    pdfs = get_public_pdfs(db, category)
    
    return [StudentPdfResponse.from_orm(pdf) for pdf in pdfs]
