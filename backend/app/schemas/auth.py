"""Authentication request and response schemas"""
from datetime import date

from pydantic import BaseModel, Field


class AdminLoginRequest(BaseModel):
    """Admin login request"""
    username: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=1)


class StudentLoginRequest(BaseModel):
    """Student login request"""
    student_id: str = Field(..., min_length=1, max_length=20)
    dob: date = Field(..., description="Date of birth (YYYY-MM-DD)")


class TokenResponse(BaseModel):
    """Token response"""
    access_token: str
    token_type: str = "bearer"
    role: str


class LoginErrorResponse(BaseModel):
    """Login error response"""
    detail: str
