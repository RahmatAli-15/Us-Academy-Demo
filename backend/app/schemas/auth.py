"""Authentication request and response schemas"""
from datetime import date

from pydantic import BaseModel, Field


class AdminLoginRequest(BaseModel):
    """Admin login request"""
    username: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=1)


class AdminOtpVerifyRequest(BaseModel):
    """Admin OTP verification request"""
    otp_session_token: str = Field(..., min_length=1)
    otp_code: str = Field(..., min_length=6, max_length=6)


class AdminOtpResendRequest(BaseModel):
    """Admin OTP resend request"""
    otp_session_token: str = Field(..., min_length=1)


class StudentLoginRequest(BaseModel):
    """Student login request"""
    student_id: str = Field(..., min_length=1, max_length=20)
    dob: date = Field(..., description="Date of birth (YYYY-MM-DD)")


class AdminLoginResponse(BaseModel):
    """Admin login response for password and OTP stages"""
    access_token: str | None = None
    token_type: str = "bearer"
    role: str | None = None
    requires_otp: bool = False
    otp_session_token: str | None = None
    otp_delivery_email: str | None = None
    cooldown_seconds: int = 0
    message: str | None = None


class TokenResponse(BaseModel):
    """Token response"""
    access_token: str
    token_type: str = "bearer"
    role: str


class LoginErrorResponse(BaseModel):
    """Login error response"""
    detail: str
