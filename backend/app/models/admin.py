"""Admin model"""
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from app.core.database import Base


class Admin(Base):
    """Admin user model"""
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    email_otp_code = Column(String(6), nullable=True)
    email_otp_expires_at = Column(DateTime, nullable=True)
    email_otp_last_sent_at = Column(DateTime, nullable=True)
    email_otp_request_count = Column(Integer, nullable=False, default=0)
    email_otp_request_window_started_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Admin(id={self.id}, username={self.username})>"
