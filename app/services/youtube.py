"""YouTube transcript and metadata extraction via yt-dlp Python API."""

import asyncio
import json
import os
import re
import tempfile
from dataclasses import dataclass

import yt_dlp


@dataclass
class VideoMetadata:
    """Extracted YouTube video metadata."""

    video_id: str
    title: str
    channel: str
    duration_seconds: int
    description: str
    tags: list[str]
    view_count: int
    upload_date: str


@dataclass
class TranscriptResult:
    """Complete transcript extraction result."""

    metadata: VideoMetadata
    transcript: str
    word_count: int
    language: str
    source: str  # "captions" or "auto-generated"


# Regex patterns for YouTube URL formats
YT_PATTERNS = [
    r"(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})",
]


def extract_video_id(url: str) -> str | None:
    """Extract the 11-character video ID from any YouTube URL format."""
    for pattern in YT_PATTERNS:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def _extract_sync(url: str, video_id: str) -> tuple[VideoMetadata, str, str, str]:
    """
    Synchronous extraction using yt-dlp Python API.
    Runs in a thread to avoid blocking the event loop.
    """
    tmp_dir = tempfile.gettempdir()
    output_path = os.path.join(tmp_dir, f"prism_{video_id}")

    # --- SECURE COOKIE HANDLING ---
    cookie_file_path = None
    cookie_data = os.environ.get('YOUTUBE_COOKIES')

    if cookie_data:
        # Create a temporary file that won't auto-delete on close so yt-dlp can open it
        fd, cookie_file_path = tempfile.mkstemp(suffix='.txt', text=True)
        with os.fdopen(fd, 'w') as f:
            f.write(cookie_data)

    try:
        # Step 1: Get metadata
        meta_opts = {
            "quiet": True,
            "no_warnings": True,
            "no_playlist": True,
        }
        # Inject the cookies into the yt-dlp options
        if cookie_file_path:
            meta_opts['cookiefile'] = cookie_file_path

        with yt_dlp.YoutubeDL(meta_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        metadata = VideoMetadata(
            video_id=video_id,
            title=info.get("title", ""),
            channel=info.get("channel", info.get("uploader", "")),
            duration_seconds=info.get("duration", 0),
            description=info.get("description", ""),
            tags=info.get("tags") or [],
            view_count=info.get("view_count", 0),
            upload_date=info.get("upload_date", ""),
        )

        # Step 2: Try to get transcript — manual subs first, then auto
        for write_key, source_label in [
            ("writesubtitles", "captions"),
            ("writeautomaticsub", "auto-generated"),
        ]:
            sub_opts = {
                "quiet": True,
                "no_warnings": True,
                "no_playlist": True,
                "skip_download": True,
                write_key: True,
                "subtitleslangs": ["en"],
                "subtitlesformat": "json3",
                "outtmpl": output_path,
            }
            # Inject the cookies here as well
            if cookie_file_path:
                sub_opts['cookiefile'] = cookie_file_path

            with yt_dlp.YoutubeDL(sub_opts) as ydl:
                ydl.download([url])

            # Look for the subtitle file
            sub_path = f"{output_path}.en.json3"
            try:
                with open(sub_path, encoding="utf-8") as f:
                    sub_data = json.load(f)
                # Clean up subtitle temp file
                os.remove(sub_path)
            except FileNotFoundError:
                continue

            # Parse json3 subtitle format
            segments = sub_data.get("events", [])
            lines = []
            for event in segments:
                segs = event.get("segs", [])
                text = "".join(s.get("utf8", "") for s in segs).strip()
                if text and text != "\n":
                    lines.append(text)

            transcript = " ".join(lines)
            transcript = re.sub(r"\s+", " ", transcript).strip()

            if transcript:
                return metadata, transcript, "en", source_label

        raise RuntimeError(
            "No English transcript available for this video. "
            "The video may not have captions enabled."
        )

    finally:
        # --- CLEANUP COOKIE FILE ---
        # Ensure the sensitive cookie file is destroyed even if the extraction crashes
        if cookie_file_path and os.path.exists(cookie_file_path):
            os.remove(cookie_file_path)


async def extract(url: str) -> TranscriptResult:
    """
    Full extraction pipeline: validate URL, fetch metadata + transcript.
    Runs yt-dlp in a thread to stay async-friendly.
    """
    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError(f"Invalid YouTube URL: {url}")

    # Run synchronous yt-dlp work in a thread
    metadata, transcript, language, source = await asyncio.to_thread(_extract_sync, url, video_id)

    return TranscriptResult(
        metadata=metadata,
        transcript=transcript,
        word_count=len(transcript.split()),
        language=language,
        source=source,
    )
