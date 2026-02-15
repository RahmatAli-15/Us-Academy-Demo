"""Authentication service"""
from datetime import timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models import Admin, Student


def authenticate_admin(db: Session, username: str, password: str) -> Optional[dict]:
    """Authenticate admin with username and password.
    
    Args:
        db: Database session
        username: Admin username
        password: Plain text password
        
    Returns:
        Dict with token and role if authentication successful, None otherwise
    """
    admin = db.query(Admin).filter(Admin.username == username).first()
    
    if not admin or not verify_password(password, admin.hashed_password):
        return None
    
    # Create JWT token with admin role
    token_data = {
        "sub": str(admin.id),
        "username": admin.username,
        "role": "admin"
    }
    
    access_token = create_access_token(data=token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "admin"
    }


def authenticate_student(db: Session, student_id: str, dob) -> Optional[dict]:
    """Authenticate student with student_id and date of birth.
    
    Args:
        db: Database session
        student_id: Student ID
        dob: Date of birth (date object)
        
    Returns:
        Dict with token and role if authentication successful, None otherwise
    """
    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()
    
    if not student or student.dob != dob:
        return None
    
    # Create JWT token with student role
    token_data = {
        "sub": str(student.id),
        "student_id": student.student_id,
        "role": "student"
    }
    
    access_token = create_access_token(data=token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "student"
    }


def create_default_admin(db: Session) -> bool:
    """Create default admin if it doesn't exist.
    
    Args:
        db: Database session
        
    Returns:
        True if admin was created or already exists, False otherwise
    """
    default_username = "admin"
    default_password = "Admin@123"
    
    # Check if admin already exists
    existing_admin = db.query(Admin).filter(
        Admin.username == default_username
    ).first()
    
    if existing_admin:
        return True
    
    # Create default admin
    hashed_password = hash_password(default_password)
    
    new_admin = Admin(
        username=default_username,
        hashed_password=hashed_password
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    return True
