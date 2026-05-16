"""Health check endpoint."""

from fastapi import APIRouter

from app.config import get_settings

router = APIRouter()
settings = get_settings()


@router.get("/health")
async def health() -> dict:
    """Basic health check."""
    return {
        "status": "ok",
        "app": settings.app_name,
        "version": settings.app_version,
    }
