"""Transcription endpoint — extract transcript from YouTube URL."""

import traceback

from fastapi import APIRouter, HTTPException

from app.core.models import TranscribeRequest, TranscribeResponse, VideoMeta
from app.services.youtube import extract

router = APIRouter()


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_video(req: TranscribeRequest) -> TranscribeResponse:
    try:
        result = await extract(req.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=422, detail=str(e) or "Transcript extraction failed")
    except Exception as e:
        # Catch-all: print the full traceback to the server terminal
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")

    return TranscribeResponse(
        metadata=VideoMeta(
            video_id=result.metadata.video_id,
            title=result.metadata.title,
            channel=result.metadata.channel,
            duration_seconds=result.metadata.duration_seconds,
            view_count=result.metadata.view_count,
        ),
        transcript=result.transcript,
        word_count=result.word_count,
        source=result.source,
    )