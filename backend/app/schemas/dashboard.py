"""Dashboard response schemas"""
from pydantic import BaseModel


class AdminDashboardSummaryResponse(BaseModel):
    """Admin dashboard summary metrics."""
    total_students: int
    today_attendance_percentage: float
    total_fees_collected: float
    total_pending_fees: float
    total_pdfs: int
