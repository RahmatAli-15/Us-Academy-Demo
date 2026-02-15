"""Student result/marks model"""
from datetime import datetime

from sqlalchemy import Column, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.enums.subject_enum import SubjectEnum


class Result(Base):
    """Student examination result model"""
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, index=True)
    class_ = Column(Integer, nullable=False)  # Maps to ClassEnum (1-10)
    subject = Column(Enum(SubjectEnum), nullable=False, index=True)
    marks = Column(Float, nullable=False)
    exam_type = Column(String(50), nullable=False)  # e.g., "Midterm", "Final", "Unit Test"

    # Relationships
    student = relationship("Student", back_populates="results")

    def __repr__(self):
        return f"<Result(id={self.id}, student_id={self.student_id}, subject={self.subject}, marks={self.marks})>"
