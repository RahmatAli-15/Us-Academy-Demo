"""Contact form schemas"""
from pydantic import BaseModel, Field


class ContactRequest(BaseModel):
    """Contact form submission request"""
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=1, max_length=100)
    message: str = Field(..., min_length=1, max_length=1000)


class ContactResponse(BaseModel):
    """Contact form submission response"""
    message: str = "Thank you for your message. We will get back to you soon."