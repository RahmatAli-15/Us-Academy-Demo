"""Results management service"""
from typing import Dict, List, Optional

from sqlalchemy.orm import Session

from app.models import Result, Student
from app.enums.subject_enum import SubjectEnum


def create_result(
    db: Session,
    student_id: int,
    class_: Optional[int],
    exam_type: str,
    marks: Dict[str, float]
) -> Optional[List[Result]]:
    """
    Create result records for a student across all 7 subjects.
    
    Prevents duplicate entries (one subject per exam_type per student).
    
    Args:
        db: Database session
        student_id: Student database ID
        class_: Class number (1-10), optional (derived from student if missing)
        exam_type: Type of exam (e.g., Midterm, Final)
        marks: Dict of subject->marks
        
    Returns:
        List of created Result objects or None if student doesn't exist
    """
    resolved_class = class_
    if resolved_class is None:
        # Backward-safe fallback: resolve class from student if caller didn't pass it.
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return None
        resolved_class = student.class_
    
    created_results = []
    
    try:
        for subject_name, subject_marks in marks.items():
            subject = SubjectEnum(str(subject_name).upper())
            
            # Check if this subject already exists for this exam_type
            existing = db.query(Result).filter(
                Result.student_id == student_id,
                Result.class_ == resolved_class,
                Result.subject == subject,
                Result.exam_type == exam_type
            ).first()
            
            if existing:
                # Skip or update (we'll skip to prevent duplicates)
                continue
            
            new_result = Result(
                student_id=student_id,
                class_=resolved_class,
                subject=subject,
                marks=subject_marks,
                exam_type=exam_type
            )
            db.add(new_result)
            created_results.append(new_result)
        
        db.commit()
        
        # Refresh all created results
        for result in created_results:
            db.refresh(result)
        
        return created_results
    except Exception:
        db.rollback()
        raise


def get_result(db: Session, result_id: int) -> Optional[Result]:
    """
    Get a specific result record.
    
    Args:
        db: Database session
        result_id: Result ID
        
    Returns:
        Result object or None
    """
    return db.query(Result).filter(Result.id == result_id).first()


def get_student_results(db: Session, student_id: int) -> List[Result]:
    """
    Get all results for a student grouped by exam_type.
    
    Args:
        db: Database session
        student_id: Student database ID
        
    Returns:
        List of Result objects
    """
    return db.query(Result).filter(
        Result.student_id == student_id
    ).order_by(Result.exam_type, Result.subject).all()


def get_class_results(db: Session, class_: int, exam_type: Optional[str] = None) -> List[Result]:
    """
    Get results for all students in a class.
    
    Args:
        db: Database session
        class_: Class number (1-10)
        exam_type: Optional filter by exam type
        
    Returns:
        List of Result objects
    """
    query = db.query(Result).filter(Result.class_ == class_)
    
    if exam_type:
        query = query.filter(Result.exam_type == exam_type)
    
    return query.order_by(Result.student_id, Result.subject).all()


def update_result(
    db: Session,
    result_id: int,
    marks: float
) -> Optional[Result]:
    """
    Update marks for a result.
    
    Args:
        db: Database session
        result_id: Result ID
        marks: Updated marks
        
    Returns:
        Updated Result object or None if not found
    """
    result = db.query(Result).filter(Result.id == result_id).first()
    
    if not result:
        return None
    
    result.marks = marks
    db.commit()
    db.refresh(result)
    return result


def delete_result(db: Session, result_id: int) -> bool:
    """
    Delete a result record.
    
    Args:
        db: Database session
        result_id: Result ID
        
    Returns:
        True if deleted, False if not found
    """
    result = db.query(Result).filter(Result.id == result_id).first()
    
    if not result:
        return False
    
    db.delete(result)
    db.commit()
    return True
