"""Student management service"""
from typing import List, Optional

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Student


def _extract_roll_number(student_id: str, class_: int) -> Optional[int]:
    """Extract numeric roll part from student_id for a class."""
    prefix = f"STU{class_}"

    if not student_id.startswith(prefix):
        return None

    suffix = student_id[len(prefix):]
    if not suffix.isdigit():
        return None

    return int(suffix)


def _generate_next_student_id(db: Session, class_: int) -> str:
    """
    Generate next student_id for a class in STU{class}{roll:03d} format.

    Example:
    - class 1 -> STU1001
    - class 10 -> STU10001
    """
    existing_ids = db.query(Student.student_id).filter(
        Student.class_ == class_
    ).with_for_update().all()

    max_roll = 0
    for (student_id,) in existing_ids:
        roll = _extract_roll_number(student_id, class_)
        if roll is not None and roll > max_roll:
            max_roll = roll

    next_roll = max_roll + 1

    # Double-check uniqueness and advance until free (rare race/collision safeguard).
    while True:
        candidate_id = f"STU{class_}{next_roll:03d}"
        exists = db.query(Student.id).filter(
            Student.student_id == candidate_id
        ).with_for_update().first()

        if not exists:
            return candidate_id

        next_roll += 1


def _is_student_id_conflict(error: IntegrityError) -> bool:
    """Check whether an IntegrityError is due to student_id uniqueness."""
    message = str(getattr(error, "orig", error)).lower()
    return "student_id" in message and "unique" in message


def create_student(db: Session, student_data: dict) -> Optional[Student]:
    """
    Create a new student with auto-generated student_id.

    Args:
        db: Database session
        student_data: Student data dictionary (without student_id)

    Returns:
        Created Student object or None if create fails
    """
    class_ = student_data.get("class_")
    if class_ is None:
        return None

    # Retry to handle concurrent inserts generating the same student_id.
    for _ in range(5):
        try:
            payload = dict(student_data)
            payload["student_id"] = _generate_next_student_id(db, class_)

            new_student = Student(**payload)
            db.add(new_student)
            db.commit()
            db.refresh(new_student)
            return new_student
        except IntegrityError as error:
            db.rollback()
            if _is_student_id_conflict(error):
                continue
            raise

    return None


def get_student(db: Session, student_id: int) -> Optional[Student]:
    """
    Get student by ID.

    Args:
        db: Database session
        student_id: Student database ID

    Returns:
        Student object or None if not found
    """
    return db.query(Student).filter(Student.id == student_id).first()


def get_students_by_class(db: Session, class_: int) -> List[Student]:
    """
    Get all students in a specific class.

    Args:
        db: Database session
        class_: Class number (1-10)

    Returns:
        List of Student objects
    """
    return db.query(Student).filter(Student.class_ == class_).all()


def get_all_students(db: Session) -> List[Student]:
    """
    Get all students.

    Args:
        db: Database session

    Returns:
        List of Student objects
    """
    return db.query(Student).order_by(Student.created_at.desc()).all()


def update_student(
    db: Session,
    student_id: int,
    student_data: dict
) -> Optional[Student]:
    """
    Update a student.

    Args:
        db: Database session
        student_id: Student database ID
        student_data: Updated student data (only non-None fields)

    Returns:
        Updated Student object or None if not found
    """
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        return None

    # Update only provided fields
    for key, value in student_data.items():
        if value is not None:
            setattr(student, key, value)

    db.commit()
    db.refresh(student)
    return student


def delete_student(db: Session, student_id: int) -> bool:
    """
    Delete a student.

    Args:
        db: Database session
        student_id: Student database ID

    Returns:
        True if deleted, False if not found
    """
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        return False

    db.delete(student)
    db.commit()
    return True
