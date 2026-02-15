"""Admin management routes"""
import os

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.schemas.student import StudentCreate, StudentResponse, StudentUpdate
from app.services.students import (
    create_student,
    delete_student,
    get_all_students,
    get_student,
    get_students_by_class,
    update_student,
)

router = APIRouter(prefix="/admin/students", tags=["admin"])


@router.get("", response_model=list[StudentResponse])
async def get_students_list(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get all students.

    Only admin can access this endpoint.
    """
    return get_all_students(db)


@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def add_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Add a new student.
    
    Only admin can access this endpoint.
    student_id is auto-generated based on class.
    """
    # Convert student_data to dict for service
    student_dict = student_data.model_dump(by_alias=False)

    try:
        new_student = create_student(db, student_dict)

        if not new_student:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Student ID already exists"
            )

        return new_student

    except IntegrityError as error:
        error_message = str(getattr(error, "orig", error))
        print(f"IntegrityError while creating student: {error_message}")

        normalized_message = error_message.lower()
        if "student_id" in normalized_message and "unique" in normalized_message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Student ID already exists"
            )

        if "aadhaar" in normalized_message and "unique" in normalized_message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Aadhaar number already exists"
            )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=error_message
        )

    except HTTPException:
        raise

    except Exception as error:
        print(f"Unexpected error while creating student: {str(error)}")
        is_dev = os.getenv("ENV", "development").lower() == "development"

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error) if is_dev else "Internal server error"
        )


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student_by_id(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get a specific student by ID.
    
    Only admin can access this endpoint.
    """
    student = get_student(db, student_id)
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return student


@router.get("/class/{class_}", response_model=list[StudentResponse])
async def get_students_in_class(
    class_: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get all students in a specific class.
    
    Only admin can access this endpoint.
    Class must be between 1-10.
    """
    if class_ < 1 or class_ > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Class must be between 1 and 10"
        )
    
    students = get_students_by_class(db, class_)
    
    return students


@router.put("/{student_id}", response_model=StudentResponse)
async def update_student_info(
    student_id: int,
    student_data: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Update a student's information.
    
    Only admin can access this endpoint.
    Only provided fields will be updated.
    """
    # Convert to dict and remove None values
    update_dict = student_data.model_dump(exclude_unset=True, by_alias=False)
    
    # Rename class_ if present
    if "class" in update_dict:
        update_dict["class_"] = update_dict.pop("class")
    
    updated_student = update_student(db, student_id, update_dict)
    
    if not updated_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return updated_student


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student_record(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Delete a student.
    
    Only admin can access this endpoint.
    Also deletes related attendance, fees, and results records.
    """
    deleted = delete_student(db, student_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return None
