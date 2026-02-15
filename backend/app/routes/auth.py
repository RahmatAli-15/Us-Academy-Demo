"""Authentication routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import AdminLoginRequest, StudentLoginRequest, TokenResponse
from app.services.auth import authenticate_admin, authenticate_student

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(
    request: AdminLoginRequest,
    db: Session = Depends(get_db)
):
    """Admin login endpoint.
    
    Login using username and password.
    Returns JWT token with admin role.
    """
    result = authenticate_admin(db, request.username, request.password)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    return result


@router.post("/student/login", response_model=TokenResponse)
async def student_login(
    request: StudentLoginRequest,
    db: Session = Depends(get_db)
):
    """Student login endpoint.
    
    Login using student_id and date of birth.
    Returns JWT token with student role.
    """
    result = authenticate_student(db, request.student_id, request.dob)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid student ID or date of birth"
        )
    
    return result
