"""Authentication routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.schemas.auth import (
    AdminLoginRequest,
    AdminLoginResponse,
    AdminOtpResendRequest,
    AdminOtpVerifyRequest,
    StudentLoginRequest,
    TokenResponse,
)
from app.services.auth import (
    authenticate_admin_password,
    authenticate_student,
    OtpRateLimitError,
    resend_admin_otp,
    start_admin_otp_challenge,
    verify_admin_otp,
)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(
    request: AdminLoginRequest,
    db: Session = Depends(get_db)
):
    """Admin login endpoint.
    
    Login using username and password.
    Returns JWT token with admin role.
    """
    admin = authenticate_admin_password(db, request.username, request.password)

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    try:
        return start_admin_otp_challenge(admin, db)
    except OtpRateLimitError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(exc),
            headers={"Retry-After": str(exc.retry_after_seconds)},
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc) or f"Unable to send OTP email to {settings.ADMIN_OTP_EMAIL}",
        ) from exc


@router.post("/admin/resend-otp", response_model=AdminLoginResponse)
async def admin_resend_otp(
    request: AdminOtpResendRequest,
    db: Session = Depends(get_db)
):
    """Resend admin OTP with cooldown and rate limiting."""
    try:
        result = resend_admin_otp(db, request.otp_session_token)
    except OtpRateLimitError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(exc),
            headers={"Retry-After": str(exc.retry_after_seconds)},
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc) or f"Unable to send OTP email to {settings.ADMIN_OTP_EMAIL}",
        ) from exc

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP session"
        )

    return result


@router.post("/admin/verify-otp", response_model=TokenResponse)
async def admin_verify_otp(
    request: AdminOtpVerifyRequest,
    db: Session = Depends(get_db)
):
    """Verify admin OTP and return the final JWT token."""
    result = verify_admin_otp(db, request.otp_session_token, request.otp_code)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP code"
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
