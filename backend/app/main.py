"""FastAPI application entry point"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage FastAPI application lifespan.
    
    Startup: Create all database tables and default admin
    Shutdown: Clean up resources if needed
    """
    # Startup
    Base.metadata.create_all(bind=engine)
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
    allow_origin_regex=settings.CORS_ALLOW_ORIGIN_REGEX,
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
