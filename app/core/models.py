"""Pydantic models for API requests and responses."""

from enum import Enum

from pydantic import BaseModel


class Platform(str, Enum):
    """Supported output platforms."""

    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    INSTAGRAM = "instagram"
    NEWSLETTER = "newsletter"


# --- Transcription ---


class TranscribeRequest(BaseModel):
    """Request to transcribe a YouTube video."""

    url: str  # YouTube URL


class VideoMeta(BaseModel):
    """Video metadata in API responses."""

    video_id: str
    title: str
    channel: str
    duration_seconds: int
    view_count: int


class TranscribeResponse(BaseModel):
    """Transcription result."""

    metadata: VideoMeta
    transcript: str
    word_count: int
    source: str


# --- Repurpose ---


class RepurposeRequest(BaseModel):
    """Request to repurpose content into social posts."""

    url: str
    platforms: list[Platform] = [
        Platform.TWITTER,
        Platform.LINKEDIN,
        Platform.INSTAGRAM,
        Platform.NEWSLETTER,
    ]
    tone: str = "professional yet conversational"
    context: str = ""  # Optional creator context / brand voice notes


class PlatformContent(BaseModel):
    """Generated content for a single platform."""

    platform: Platform
    content: str
    character_count: int
    hashtags: list[str] = []


class RepurposeResponse(BaseModel):
    """Full repurposing result."""

    video_title: str
    platforms: list[PlatformContent]
    transcript_word_count: int
    model_used: str
    model_config = {"protected_namespaces": ()}
