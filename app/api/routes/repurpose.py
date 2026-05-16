"""Repurpose endpoint — full pipeline: URL → transcript → social content."""

from fastapi import APIRouter, HTTPException

from app.core.models import RepurposeRequest, RepurposeResponse
from app.core.repurposer import repurpose
from app.services.youtube import extract

router = APIRouter()


@router.post("/repurpose", response_model=RepurposeResponse)
async def repurpose_video(req: RepurposeRequest) -> RepurposeResponse:
    """
    Full repurposing pipeline.

    1. Extract transcript from YouTube URL
    2. Generate platform-specific content via AI
    3. Return formatted results
    """
    # Step 1: Extract transcript
    try:
        transcript_result = await extract(req.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Step 2: Generate content for each platform
    try:
        platform_content = await repurpose(
            transcript=transcript_result.transcript,
            title=transcript_result.metadata.title,
            platforms=req.platforms,
            tone=req.tone,
            context=req.context,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {str(e)}",
        )

    # Step 3: Return results
    return RepurposeResponse(
        video_title=transcript_result.metadata.title,
        platforms=platform_content,
        transcript_word_count=transcript_result.word_count,
        model_used="gemini-2.5-flash",
    )
