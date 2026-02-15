"""Test routes for demonstrating role-based access control"""
from fastapi import APIRouter, Depends

from app.core.dependencies import require_admin, require_student

router = APIRouter(prefix="/test", tags=["testing"])


@router.get("/admin-only")
async def admin_only_route(current_user: dict = Depends(require_admin)):
    """
    Admin-only test route.
    
    Requires admin role. Returns admin information.
    """
    return {
        "message": "This is an admin-only route",
        "user_id": current_user.get("sub"),
        "username": current_user.get("username"),
        "role": current_user.get("role")
    }


@router.get("/student-only")
async def student_only_route(current_user: dict = Depends(require_student)):
    """
    Student-only test route.
    
    Requires student role. Returns student information.
    """
    return {
        "message": "This is a student-only route",
        "user_id": current_user.get("sub"),
        "student_id": current_user.get("student_id"),
        "role": current_user.get("role")
    }
