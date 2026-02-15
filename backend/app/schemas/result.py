"""Result request and response schemas"""
from datetime import datetime
from typing import Dict, List

from pydantic import BaseModel, Field

from app.enums.class_enum import ClassEnum
from app.enums.subject_enum import SubjectEnum


class ResultCreate(BaseModel):
    """Create results for a student using subject->marks map."""
    student_id: int = Field(..., description="Student database ID")
    student_class: ClassEnum = Field(..., description="Student class (1-10)")
    exam_type: str = Field(..., min_length=1, max_length=50, description="e.g., Midterm, Final")
    marks: Dict[str, int] = Field(..., description="Subject to marks mapping")


class ResultUpdate(BaseModel):
    """Update result marks"""
    marks: float = Field(..., ge=0, le=100)


class SubjectMarksResponse(BaseModel):
    """Subject and its marks"""
    subject: SubjectEnum
    marks: float


class ResultResponse(BaseModel):
    """Result response"""
    id: int
    student_id: int
    class_: int = Field(..., alias="class")
    subject: SubjectEnum
    marks: float
    exam_type: str

    class Config:
        populate_by_name = True
        from_attributes = True


class ResultDetailedResponse(BaseModel):
    """Detailed result with all subjects"""
    student_id: int
    class_: int = Field(..., alias="class")
    exam_type: str
    subjects_marks: List[SubjectMarksResponse]

    class Config:
        populate_by_name = True
