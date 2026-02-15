"""Results management routes"""
import os
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models import Student
from app.enums.subject_enum import SubjectEnum
from app.schemas.result import (
    ResultCreate,
    ResultResponse,
    ResultUpdate,
)
from app.services.results import (
    create_result,
    delete_result,
    get_class_results,
    get_result,
    get_student_results,
    update_result,
)

router = APIRouter(prefix="/admin/results", tags=["admin-results"])


@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", include_in_schema=False, status_code=status.HTTP_201_CREATED)
async def add_result(
    request: ResultCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Add result for a student across subjects in one request.
    
    Flow:
    1. Select class
    2. Select student
    3. Add marks for 7 subjects
    
    Rules:
    - One subject per exam_type per student
    - Prevents duplicate subject entries
    
    Only admin can access.
    """
    class_value = request.student_class

    if class_value is not None and (class_value < 1 or class_value > 10):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Class must be between 1 and 10"
        )

    required_subjects = {
        "HINDI",
        "ENGLISH",
        "MATHS",
        "SCIENCE",
        "SOCIAL_STUDIES",
        "PHYSICAL_EDUCATION",
        "ART",
    }

    incoming_subjects = {str(subject).upper() for subject in request.marks.keys()}
    if incoming_subjects != required_subjects:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Marks must include exactly: HINDI, ENGLISH, MATHS, SCIENCE, SOCIAL_STUDIES, PHYSICAL_EDUCATION, ART"
        )

    normalized_marks = {}
    for subject_name, subject_marks in request.marks.items():
        subject_key = str(subject_name).upper()
        if subject_key not in SubjectEnum.__members__:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid subject: {subject_name}"
            )

        if subject_marks < 0 or subject_marks > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Marks for {subject_key} must be between 0 and 100"
            )

        normalized_marks[subject_key] = subject_marks

    student = db.query(Student).filter(
        Student.id == request.student_id
    ).first()

    if not student:
        print("Available student primary keys:", db.query(Student.id).all())
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {request.student_id} not found"
        )

    if str(student.class_) != str(request.student_class):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student class mismatch"
        )

    try:
        results = create_result(
            db,
            student_id=request.student_id,
            class_=student.class_,
            exam_type=request.exam_type,
            marks=normalized_marks
        )
    except Exception as error:
        print(f"Error while creating results: {str(error)}")
        is_dev = os.getenv("ENV", "development").lower() == "development"
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error) if is_dev else "Failed to save results"
        )
    
    if results is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {request.student_id} not found"
        )

    return {
        "message": "Results saved successfully",
        "student_id": request.student_id,
        "exam_type": request.exam_type,
        "created_count": len(results),
    }


@router.get("/{result_id}", response_model=ResultResponse)
async def get_result_record(
    result_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get a specific result record.
    
    Only admin can access.
    """
    result = get_result(db, result_id)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found"
        )
    
    return result


@router.get("/student/{student_id}", response_model=list[ResultResponse])
async def get_student_results_list(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get all results for a student.
    
    Only admin can access.
    """
    results = get_student_results(db, student_id)
    return [ResultResponse.from_orm(r) for r in results]


@router.get("/class/{class_}", response_model=list[ResultResponse])
async def get_class_results_list(
    class_: int,
    exam_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get results for all students in a class.
    
    Optionally filter by exam_type.
    
    Only admin can access.
    """
    if class_ < 1 or class_ > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Class must be between 1 and 10"
        )
    
    results = get_class_results(db, class_, exam_type)
    return [ResultResponse.from_orm(r) for r in results]


@router.put("/{result_id}", response_model=ResultResponse)
async def update_result_marks(
    result_id: int,
    request: ResultUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Update marks for a result.
    
    Only admin can access.
    """
    result = update_result(db, result_id, request.marks)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found"
        )
    
    return result


@router.delete("/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_result_record(
    result_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Delete a result record.
    
    Only admin can access.
    """
    deleted = delete_result(db, result_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found"
        )
    
    return None
