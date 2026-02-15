"""Student model"""
from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.enums.class_enum import ClassEnum


class Student(Base):
    """Student model for school management system"""
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    class_ = Column(Integer, nullable=False)  # Maps to ClassEnum (1-10)
    dob = Column(Date, nullable=False)
    aadhaar_number = Column(String(12), unique=True, nullable=False)
    father_name = Column(String(100), nullable=True)
    mother_name = Column(String(100), nullable=True)
    phone = Column(String(15), nullable=True)
    address = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    attendances = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    fees = relationship("Fees", back_populates="student", cascade="all, delete-orphan")
    results = relationship("Result", back_populates="student", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Student(id={self.id}, student_id={self.student_id}, name={self.name})>"
