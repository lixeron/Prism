"""Prism API — Content Repurposing Engine."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, repurpose, transcribe
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Content goes in. A spectrum of posts comes out.",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Keep this so local development still works
        "https://prism-five-xi.vercel.app",  # Your new Vercel frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router, tags=["health"])
app.include_router(transcribe.router, prefix="/api/v1", tags=["transcribe"])
app.include_router(repurpose.router, prefix="/api/v1", tags=["repurpose"])
