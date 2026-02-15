"""Fees/Payment model"""
from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Fees(Base):
    """Fees payment tracking model"""
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    paid_amount = Column(Float, default=0.0, nullable=False)
    due_amount = Column(Float, nullable=False)
    payment_date = Column(DateTime, nullable=True)
    remark = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    student = relationship("Student", back_populates="fees")

    def __repr__(self):
        return f"<Fees(id={self.id}, student_id={self.student_id}, amount={self.amount})>"
