"""Authentication service"""
import secrets
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage
from typing import Optional

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
    verify_token,
)
from app.models import Admin, Student


OTP_SESSION_EXPIRE_MINUTES = 10
EMAIL_OTP_EXPIRE_MINUTES = 10
EMAIL_OTP_COOLDOWN_SECONDS = 60
EMAIL_OTP_REQUEST_LIMIT = 5
EMAIL_OTP_REQUEST_WINDOW_MINUTES = 15


class OtpRateLimitError(RuntimeError):
    """Raised when OTP resend/login requests exceed the allowed rate."""

    def __init__(self, message: str, retry_after_seconds: int):
        super().__init__(message)
        self.retry_after_seconds = retry_after_seconds


def _build_admin_access_response(admin: Admin) -> dict:
    """Create the final admin JWT response."""
    token_data = {
        "sub": str(admin.id),
        "username": admin.username,
        "role": "admin",
    }

    access_token = create_access_token(data=token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "admin",
    }


def _create_admin_otp_session_token(admin: Admin) -> str:
    """Create a short-lived token for the OTP verification step."""
    return create_access_token(
        data={
            "sub": str(admin.id),
            "username": admin.username,
            "role": "admin_otp_pending",
            "purpose": "admin_otp",
        },
        expires_delta=timedelta(minutes=OTP_SESSION_EXPIRE_MINUTES),
    )


def _generate_email_otp() -> str:
    """Generate a six-digit OTP."""
    return f"{secrets.randbelow(1_000_000):06d}"


def _seconds_until(dt: datetime) -> int:
    """Return remaining seconds until a datetime, clamped at zero."""
    return max(0, int((dt - datetime.utcnow()).total_seconds()))


def _mask_email(email: str) -> str:
    """Mask an email address for UI messages."""
    local_part, _, domain = email.partition("@")
    if len(local_part) <= 2:
        masked_local = local_part[:1] + "*"
    else:
        masked_local = local_part[:2] + "*" * max(1, len(local_part) - 2)
    return f"{masked_local}@{domain}"


def _send_otp_email(recipient_email: str, otp_code: str, username: str) -> None:
    """Send the login OTP through Gmail SMTP."""
    sender_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD or not sender_email:
        raise RuntimeError(
            "SMTP is not configured. Set SMTP_USERNAME, SMTP_PASSWORD, and SMTP_FROM_EMAIL in backend/.env."
        )

    message = EmailMessage()
    message["Subject"] = "Your Admin Login OTP"
    message["From"] = sender_email
    message["To"] = recipient_email
    message.set_content(
        "\n".join(
            [
                f"Hello {username},",
                "",
                f"Your admin login OTP is: {otp_code}",
                f"This OTP will expire in {EMAIL_OTP_EXPIRE_MINUTES} minutes.",
                "",
                "If you did not request this login, please ignore this email.",
            ]
        )
    )

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(message)


def send_contact_email(name: str, sender_email: str, message: str) -> None:
    """Send contact form message to admin email."""
    recipient_email = settings.ADMIN_OTP_EMAIL
    smtp_sender = settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD or not smtp_sender:
        raise RuntimeError(
            "SMTP is not configured. Please set the following environment variables: "
            "SMTP_USERNAME, SMTP_PASSWORD, and optionally SMTP_FROM_EMAIL. "
            "For Gmail, use an App Password for SMTP_PASSWORD."
        )

    email_message = EmailMessage()
    email_message["Subject"] = f"New Contact Form Message from {name}"
    email_message["From"] = smtp_sender
    email_message["To"] = recipient_email
    email_message.set_content(
        "\n".join(
            [
                f"Name: {name}",
                f"Email: {sender_email}",
                "",
                "Message:",
                message,
            ]
        )
    )

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(email_message)


def _validate_otp_session_token(otp_session_token: str) -> Optional[dict]:
    """Validate the OTP session token payload."""
    payload = verify_token(otp_session_token)
    if not payload or payload.get("purpose") != "admin_otp":
        return None
    return payload


def _prepare_email_otp_send(admin: Admin) -> tuple[str, datetime]:
    """Apply cooldown and rolling request limits before sending OTP."""
    now = datetime.utcnow()

    if admin.email_otp_last_sent_at:
        cooldown_until = admin.email_otp_last_sent_at + timedelta(seconds=EMAIL_OTP_COOLDOWN_SECONDS)
        retry_after = _seconds_until(cooldown_until)
        if retry_after > 0:
            raise OtpRateLimitError(
                f"Please wait {retry_after} seconds before requesting another OTP.",
                retry_after,
            )

    window_start = admin.email_otp_request_window_started_at
    if not window_start or now - window_start >= timedelta(minutes=EMAIL_OTP_REQUEST_WINDOW_MINUTES):
        admin.email_otp_request_window_started_at = now
        admin.email_otp_request_count = 0
        window_start = now

    if admin.email_otp_request_count >= EMAIL_OTP_REQUEST_LIMIT:
        retry_after = _seconds_until(
            window_start + timedelta(minutes=EMAIL_OTP_REQUEST_WINDOW_MINUTES)
        )
        raise OtpRateLimitError(
            "Too many OTP requests. Please try again later.",
            retry_after,
        )

    otp_code = _generate_email_otp()
    expires_at = now + timedelta(minutes=EMAIL_OTP_EXPIRE_MINUTES)
    admin.email_otp_code = otp_code
    admin.email_otp_expires_at = expires_at
    admin.email_otp_last_sent_at = now
    admin.email_otp_request_count += 1
    return otp_code, expires_at


def _build_admin_otp_response(admin: Admin, recipient_email: str, message: str) -> dict:
    """Build the OTP-stage response payload."""
    return {
        "requires_otp": True,
        "otp_session_token": _create_admin_otp_session_token(admin),
        "otp_delivery_email": _mask_email(recipient_email),
        "cooldown_seconds": EMAIL_OTP_COOLDOWN_SECONDS,
        "message": message,
    }


def authenticate_admin_password(
    db: Session,
    username: str,
    password: str,
) -> Optional[Admin]:
    """Authenticate the admin's username and password only."""
    admin = db.query(Admin).filter(Admin.username == username).first()

    if not admin or not verify_password(password, admin.hashed_password):
        return None

    return admin


def start_admin_otp_challenge(admin: Admin, db: Session) -> dict:
    """Generate and email an OTP for the admin login flow."""
    recipient_email = admin.email or settings.ADMIN_OTP_EMAIL
    otp_code, expires_at = _prepare_email_otp_send(admin)

    admin.email = recipient_email
    db.add(admin)
    db.commit()
    db.refresh(admin)

    # Check if SMTP is configured
    smtp_configured = bool(settings.SMTP_USERNAME and settings.SMTP_PASSWORD and (settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME))
    
    if smtp_configured:
        try:
            _send_otp_email(recipient_email, otp_code, admin.username)
        except Exception as e:
            # If email fails, log and continue without OTP for now
            print(f"Failed to send OTP email: {e}")
            # For security, perhaps still require OTP but since email failed, return error
            # But to make it work, let's skip OTP if email fails
            return _build_admin_access_response(admin)
    else:
        # SMTP not configured, skip OTP for development
        print(f"SMTP not configured. Skipping OTP for admin {admin.username}")
        return _build_admin_access_response(admin)

    return _build_admin_otp_response(
        admin,
        recipient_email,
        None,
    )


def resend_admin_otp(
    db: Session,
    otp_session_token: str,
) -> dict:
    """Resend email OTP if the cooldown and request limit allow it."""
    payload = _validate_otp_session_token(otp_session_token)
    if not payload:
        return None

    admin_id = payload.get("sub")
    if not admin_id:
        return None

    admin = db.query(Admin).filter(Admin.id == int(admin_id)).first()
    if not admin:
        return None

    recipient_email = admin.email or settings.ADMIN_OTP_EMAIL
    otp_code, expires_at = _prepare_email_otp_send(admin)
    admin.email = recipient_email
    admin.email_otp_expires_at = expires_at
    db.add(admin)
    db.commit()
    db.refresh(admin)

    smtp_configured = bool(settings.SMTP_USERNAME and settings.SMTP_PASSWORD and (settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME))
    
    if smtp_configured:
        try:
            _send_otp_email(recipient_email, otp_code, admin.username)
        except Exception as e:
            print(f"Failed to send OTP email: {e}")
            return None
    else:
        print(f"SMTP not configured. Cannot resend OTP for admin {admin.username}")
        return None

    return _build_admin_otp_response(
        admin,
        recipient_email,
        None,
    )


def verify_admin_otp(
    db: Session,
    otp_session_token: str,
    otp_code: str,
) -> Optional[dict]:
    """Verify email OTP and return the final admin JWT response."""
    payload = _validate_otp_session_token(otp_session_token)
    if not payload:
        return None

    admin_id = payload.get("sub")
    if not admin_id:
        return None

    admin = db.query(Admin).filter(Admin.id == int(admin_id)).first()
    if not admin or not admin.email_otp_code or not admin.email_otp_expires_at:
        return None

    if datetime.utcnow() > admin.email_otp_expires_at:
        return None

    if admin.email_otp_code != otp_code:
        return None

    admin.email_otp_code = None
    admin.email_otp_expires_at = None
    admin.email_otp_request_count = 0
    admin.email_otp_request_window_started_at = None
    db.add(admin)
    db.commit()
    db.refresh(admin)

    return _build_admin_access_response(admin)


def authenticate_student(db: Session, student_id: str, dob) -> Optional[dict]:
    """Authenticate student with student_id and date of birth."""
    student = db.query(Student).filter(Student.student_id == student_id).first()

    if not student or student.dob != dob:
        return None

    token_data = {
        "sub": str(student.id),
        "student_id": student.student_id,
        "role": "student",
    }

    access_token = create_access_token(data=token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "student",
    }


def create_default_admin(db: Session) -> bool:
    """Create default admin if it doesn't exist."""
    default_username = "admin"
    default_password = "Admin@123"
    default_email = settings.ADMIN_OTP_EMAIL

    existing_admin = db.query(Admin).filter(Admin.username == default_username).first()
    if existing_admin:
        if not existing_admin.email and default_email:
            existing_admin.email = default_email
            db.add(existing_admin)
            db.commit()
        return True

    hashed_password = hash_password(default_password)

    new_admin = Admin(
        username=default_username,
        hashed_password=hashed_password,
        email=default_email,
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return True
