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
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Admin(id={self.id}, username={self.username})>"
