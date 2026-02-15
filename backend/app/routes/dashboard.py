"""Admin dashboard routes"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.schemas.dashboard import AdminDashboardSummaryResponse
from app.services.dashboard import get_admin_dashboard_summary

router = APIRouter(prefix="/admin/dashboard", tags=["admin-dashboard"])


@router.get("/summary", response_model=AdminDashboardSummaryResponse)
async def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """Get admin dashboard summary metrics."""
    return get_admin_dashboard_summary(db)
