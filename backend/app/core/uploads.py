"""Shared upload storage paths."""
from pathlib import Path

from app.core.config import settings


def get_uploads_dir() -> Path:
    """Return the absolute directory used for public uploaded files."""
    if settings.UPLOADS_DIR:
        return Path(settings.UPLOADS_DIR).expanduser().resolve()

    return Path(__file__).resolve().parents[2] / "uploads"


def resolve_public_upload_path(relative_path: str) -> Path:
    """Resolve a stored public uploads/... path to the configured file location."""
    normalized = relative_path.replace("\\", "/").lstrip("/")
    if normalized.startswith("uploads/"):
        normalized = normalized[len("uploads/"):]

    return get_uploads_dir() / normalized
