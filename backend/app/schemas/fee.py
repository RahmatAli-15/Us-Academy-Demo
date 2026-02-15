"""Fees request and response schemas"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class FeeCreate(BaseModel):
    """Create fee record for a student"""
    student_id: int = Field(..., description="Student database ID")
    amount: float = Field(..., gt=0, description="Total fee amount")
    paid_amount: float = Field(0, ge=0, description="Amount paid")
    remark: Optional[str] = Field(None, max_length=255)


class FeeUpdate(BaseModel):
    """Update fee record"""
    paid_amount: Optional[float] = Field(None, ge=0)
    remark: Optional[str] = Field(None, max_length=255)


class FeeResponse(BaseModel):
    """Fee response"""
    id: int
    student_id: int
    amount: float
    paid_amount: float
    due_amount: float
    payment_date: Optional[datetime]
    remark: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
