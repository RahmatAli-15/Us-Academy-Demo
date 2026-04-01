"""Admin management routes"""
import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.enums.class_enum import is_valid_class_label
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
STUDENT_PHOTO_DIR = Path(__file__).resolve().parents[2] / "uploads" / "students"
STUDENT_PHOTO_DIR.mkdir(parents=True, exist_ok=True)


def _normalize_student_payload(data: dict) -> dict:
    """Convert blank strings from forms into nulls for optional fields."""
    required_fields = {"name", "class_", "dob", "aadhaar_number"}
    normalized = {}

    for key, value in data.items():
        if hasattr(value, "value"):
            value = value.value
        if isinstance(value, str):
            value = value.strip()
            if value == "" and key not in required_fields:
                normalized[key] = None
                continue
        normalized[key] = value

    return normalized


def _save_student_photo(photo: UploadFile) -> str:
    """Persist an uploaded student profile photo and return its relative path."""
    extension = Path(photo.filename or "").suffix.lower()
    if extension not in {".jpg", ".jpeg", ".png", ".webp"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile photo must be JPG, PNG, or WEBP"
        )

    filename = f"{uuid.uuid4().hex}{extension}"
    destination = STUDENT_PHOTO_DIR / filename

    with destination.open("wb") as output:
        output.write(photo.file.read())

    return f"uploads/students/{filename}"


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
    student_dict = _normalize_student_payload(student_data.model_dump(by_alias=False))

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
    class_: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get all students in a specific class.
    
    Only admin can access this endpoint.
    Class must be a supported label.
    """
    if not is_valid_class_label(class_):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid class"
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
    update_dict = _normalize_student_payload(
        student_data.model_dump(exclude_unset=True, by_alias=False)
    )
    
    updated_student = update_student(db, student_id, update_dict)
    
    if not updated_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return updated_student


@router.post("/{student_id}/photo", response_model=StudentResponse)
async def upload_student_photo(
    student_id: int,
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """Upload or replace a student's profile photo."""
    student = get_student(db, student_id)

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    relative_path = _save_student_photo(photo)

    old_photo_path = student.profile_photo_path
    updated_student = update_student(db, student_id, {"profile_photo_path": relative_path})

    if old_photo_path:
        old_file = Path(__file__).resolve().parents[2] / old_photo_path
        if old_file.exists():
            old_file.unlink(missing_ok=True)

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
