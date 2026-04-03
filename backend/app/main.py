"""FastAPI application entry point"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.models import Admin, Attendance, Fees, PDF, Result, Student  # noqa: F401
from app.routes.admin import router as admin_router
from app.routes.attendance import router as attendance_router
from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.fees import router as fees_router
from app.routes.pdfs import router as pdfs_router
from app.routes.public import router as public_router
from app.routes.results import router as results_router
from app.routes.student import router as student_router
from app.routes.test import router as test_router
from app.services.auth import create_default_admin
from app.services.pdfs import normalize_legacy_pdf_paths


def _ensure_subject_enum_values() -> None:
    """
    Ensure PostgreSQL enum for results subjects includes new values.
    This is safe to run repeatedly.
    """
    if engine.dialect.name != "postgresql":
        return

    enum_values = [
        "ENGLISH_GRAMMAR",
        "HINDI_GRAMMAR",
        "EVS_SCIENCE",
        "MS_SST",
        "URDU",
        "GK",
        "PT",
        "SCIENCE",
        "SOCIAL_STUDIES",
        "PHYSICAL_EDUCATION",
        "ART",
    ]

    with engine.connect() as conn:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
        for enum_value in enum_values:
            conn.execute(
                text(f"ALTER TYPE subjectenum ADD VALUE IF NOT EXISTS '{enum_value}'")
            )


def _ensure_student_columns() -> None:
    """Add newly introduced optional student columns to existing databases."""
    inspector = inspect(engine)
    if "students" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("students")}
    student_columns = {
        "dob_in_words": "VARCHAR(100)",
        "pen_number": "VARCHAR(50)",
        "apaar_id": "VARCHAR(50)",
        "admission_class": "VARCHAR(20)",
        "subject": "VARCHAR(100)",
        "father_aadhaar_number": "VARCHAR(12)",
        "mother_aadhaar_number": "VARCHAR(12)",
        "guardian_name": "VARCHAR(100)",
        "guardian_aadhaar_number": "VARCHAR(12)",
        "guardian_relationship": "VARCHAR(100)",
        "admission_date": "DATE",
        "previous_class": "VARCHAR(20)",
        "previous_school": "VARCHAR(255)",
        "gender": "VARCHAR(20)",
        "religion": "VARCHAR(50)",
        "caste": "VARCHAR(50)",
        "sub_caste": "VARCHAR(50)",
        "residence_period_uttar_pradesh": "VARCHAR(100)",
        "disability": "VARCHAR(20)",
        "disability_type": "VARCHAR(100)",
        "disability_percentage": "VARCHAR(20)",
        "ration_card_type": "VARCHAR(50)",
        "father_education": "VARCHAR(100)",
        "father_occupation": "VARCHAR(100)",
        "mother_education": "VARCHAR(100)",
        "mother_occupation": "VARCHAR(100)",
        "category_bpl": "VARCHAR(20)",
        "indian_citizenship": "VARCHAR(20)",
        "out_of_school_child": "VARCHAR(20)",
        "last_academic_result": "VARCHAR(255)",
        "previous_academic_marks": "VARCHAR(100)",
        "school_last_attended_days": "VARCHAR(50)",
        "mobile_number_1": "VARCHAR(15)",
        "whatsapp_number_2": "VARCHAR(15)",
        "pin_code": "VARCHAR(10)",
        "account_holder_name": "VARCHAR(100)",
        "account_holder_aadhaar_number": "VARCHAR(12)",
        "bank_name": "VARCHAR(100)",
        "branch_name": "VARCHAR(100)",
        "ifsc_code": "VARCHAR(20)",
        "aadhaar_registered_mobile": "VARCHAR(15)",
        "aadhaar_registered_pin_code": "VARCHAR(10)",
        "email": "VARCHAR(100)",
        "blood_group": "VARCHAR(10)",
        "weight": "VARCHAR(20)",
        "height": "VARCHAR(20)",
        "profile_photo_path": "VARCHAR(255)",
        "guardian_declaration": "VARCHAR(500)",
    }

    with engine.begin() as conn:
        for column_name, column_type in student_columns.items():
            if column_name in existing_columns:
                continue
            conn.execute(
                text(f'ALTER TABLE students ADD COLUMN "{column_name}" {column_type}')
            )


def _ensure_admin_columns() -> None:
    """Add OTP-related admin columns to existing databases."""
    inspector = inspect(engine)
    if "admins" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("admins")}
    admin_columns = {
        "email": "VARCHAR(255)",
        "email_otp_code": "VARCHAR(6)",
        "email_otp_expires_at": "TIMESTAMP",
        "email_otp_last_sent_at": "TIMESTAMP",
        "email_otp_request_count": "INTEGER NOT NULL DEFAULT 0",
        "email_otp_request_window_started_at": "TIMESTAMP",
    }

    with engine.begin() as conn:
        for column_name, column_type in admin_columns.items():
            if column_name in existing_columns:
                continue
            conn.execute(
                text(f'ALTER TABLE admins ADD COLUMN "{column_name}" {column_type}')
            )


def _ensure_class_columns_are_text() -> None:
    """Convert class_ columns from integer to text before label normalization."""
    inspector = inspect(engine)

    with engine.begin() as conn:
        for table_name in ("students", "results", "attendances"):
            if table_name not in inspector.get_table_names():
                continue

            column_info = next(
                (column for column in inspector.get_columns(table_name) if column["name"] == "class_"),
                None,
            )
            if not column_info:
                continue

            column_type = str(column_info["type"]).lower()
            if any(token in column_type for token in ("char", "text", "string", "varchar")):
                continue

            if engine.dialect.name == "postgresql":
                conn.execute(
                    text(
                        f'ALTER TABLE "{table_name}" '
                        'ALTER COLUMN class_ TYPE VARCHAR(20) USING class_::text'
                    )
                )
            elif engine.dialect.name == "sqlite":
                # SQLite uses dynamic typing, so existing integer values can be left as-is.
                continue


def _normalize_class_labels() -> None:
    """Normalize persisted class values to the new label format."""
    class_mapping = {
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "Nursery": "Nursery",
        "LKG": "LKG",
        "UKG": "UKG",
    }

    with engine.begin() as conn:
        for table_name in ("students", "results", "attendances"):
            inspector = inspect(engine)
            if table_name not in inspector.get_table_names():
                continue

            for old_value, new_value in class_mapping.items():
                conn.execute(
                    text(f'UPDATE "{table_name}" SET class_ = :new_value WHERE CAST(class_ AS TEXT) = :old_value'),
                    {"new_value": new_value, "old_value": old_value},
                )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage FastAPI application lifespan.
    
    Startup: Create all database tables and default admin
    Shutdown: Clean up resources if needed
    """
    # Startup
    Base.metadata.create_all(bind=engine)
    _ensure_admin_columns()
    _ensure_student_columns()
    _ensure_class_columns_are_text()
    _normalize_class_labels()
    _ensure_subject_enum_values()
    
    # Create default admin
    db: Session = SessionLocal()
    try:
        create_default_admin(db)
        normalize_legacy_pdf_paths(db)
    finally:
        db.close()
    
    yield
    
    # Shutdown (add cleanup code here if needed)


# Initialize FastAPI application
app = FastAPI(
    title="School Management API",
    description="Production-ready FastAPI backend for school management",
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routers
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(attendance_router)
app.include_router(fees_router)
app.include_router(dashboard_router)
app.include_router(results_router)
app.include_router(pdfs_router)
app.include_router(student_router)
app.include_router(public_router)
app.include_router(test_router)

# Serve uploaded files so frontend can download PDFs via /uploads/*
# Keep this aligned with app.services.pdfs.UPLOADS_DIR (backend/uploads).
uploads_dir = Path(__file__).resolve().parents[1] / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Backward-compatible static path for legacy PDF links like /notice/<file>.pdf
notice_dir = uploads_dir / "notice"
notice_dir.mkdir(parents=True, exist_ok=True)
app.mount("/notice", StaticFiles(directory=str(notice_dir)), name="notice")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/favicon.ico")
async def favicon():
    """Serve a default favicon to prevent 404 errors."""
    # Return a simple transparent 16x16 PNG as favicon
    # This is a minimal 16x16 transparent PNG
    favicon_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x10\x08\x06\x00\x00\x00\x1f\xf3\xff\x1f\x00\x00\x00\x01sRGB\x00\xae\xce\x1c\xe9\x00\x00\x00\x04gAMA\x00\x00\xb1\x8f\x0b\xfca\x05\x00\x00\x00\tpHYs\x00\x00\x0e\xc3\x00\x00\x0e\xc3\x01\xc7o\xa8d\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    return Response(content=favicon_data, media_type="image/png")
