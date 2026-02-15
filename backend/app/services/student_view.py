"""Student-specific data access service"""
from typing import Optional

from sqlalchemy.orm import Session

from app.models import Student


def get_student_by_id(db: Session, student_id: int) -> Optional[Student]:
    """
    Get student by database ID.
    
    Args:
        db: Database session
        student_id: Student database ID
        
    Returns:
        Student object or None
    """
    return db.query(Student).filter(Student.id == student_id).first()
