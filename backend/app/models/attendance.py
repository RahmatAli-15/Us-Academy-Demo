"""Attendance model"""
from datetime import datetime

from sqlalchemy import Column, Date, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.enums.attendance_enum import AttendanceStatus


class Attendance(Base):
    """Attendance tracking model"""
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, index=True)
    class_ = Column(Integer, nullable=False)  # Maps to ClassEnum (1-10)
    date = Column(Date, default=datetime.utcnow, nullable=False, index=True)
    status = Column(
        Enum(AttendanceStatus),
        default=AttendanceStatus.PRESENT,
        nullable=False
    )

    # Relationships
    student = relationship("Student", back_populates="attendances")

    def __repr__(self):
        return f"<Attendance(id={self.id}, student_id={self.student_id}, date={self.date}, status={self.status})>"
