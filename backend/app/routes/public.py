"""Public routes (no authentication required)"""
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.contact import ContactRequest, ContactResponse
from app.schemas.pdf import PdfResponse
from app.schemas.student_view import SchoolInfoResponse
from app.services.auth import send_contact_email
from app.services.pdfs import get_public_pdfs

router = APIRouter(prefix="/public", tags=["public"])

# Simple in-memory rate limiter
# In production, consider using Redis or a database
_contact_submissions = defaultdict(list)
MAX_SUBMISSIONS_PER_HOUR = 3
RATE_LIMIT_WINDOW_HOURS = 1


def _check_rate_limit(client_ip: str) -> bool:
    """Check if client has exceeded rate limit."""
    now = datetime.utcnow()
    window_start = now - timedelta(hours=RATE_LIMIT_WINDOW_HOURS)
    
    # Clean old entries
    _contact_submissions[client_ip] = [
        timestamp for timestamp in _contact_submissions[client_ip]
        if timestamp > window_start
    ]
    
    # Check if under limit
    return len(_contact_submissions[client_ip]) < MAX_SUBMISSIONS_PER_HOUR


def _record_submission(client_ip: str) -> None:
    """Record a contact form submission."""
    _contact_submissions[client_ip].append(datetime.utcnow())


@router.post("/contact", response_model=ContactResponse)
async def submit_contact_form(
    request: ContactRequest,
    req: Request,
    db: Session = Depends(get_db)
):
    """
    Submit contact form.
    
    Sends an email to the admin with the contact details.
    Rate limited to 3 submissions per hour per IP address.
    No authentication required.
    """
    client_ip = req.client.host
    
    if not _check_rate_limit(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many contact form submissions. Please wait {RATE_LIMIT_WINDOW_HOURS} hour(s) before submitting again.",
            headers={"Retry-After": str(RATE_LIMIT_WINDOW_HOURS * 3600)},
        )
    
    try:
        send_contact_email(request.name, request.email, request.message)
        _record_submission(client_ip)
        return ContactResponse()
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc) or "Unable to send contact email.",
        ) from exc


@router.get("/pdfs", response_model=list[PdfResponse])
async def list_public_pdfs(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all public PDF documents.
    
    Returns only PDFs with is_public=True.
    No authentication required.
    
    Optionally filter by category:
    - NOTICE
    - DATESHEET
    - CIRCULAR
    - EVENT
    """
    pdfs = get_public_pdfs(db, category)
    return pdfs


@router.get("/school-info", response_model=SchoolInfoResponse)
async def get_school_info():
    """
    Get public school information.
    
    Returns general school information and available features.
    No authentication required.
    """
    return SchoolInfoResponse()
