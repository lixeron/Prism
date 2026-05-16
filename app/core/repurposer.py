"""Content repurposing engine.

Takes a transcript + metadata and generates platform-specific
social media content via the AI provider.
"""

from app.core.models import Platform, PlatformContent
from app.services.ai import get_ai

# Platform-specific prompt templates
PLATFORM_PROMPTS: dict[Platform, str] = {
    Platform.TWITTER: """Create a compelling X/Twitter thread (3-7 tweets) from this content.
Rules:
- Each tweet must be under 280 characters
- First tweet is a hook that makes people stop scrolling
- Use line breaks between tweets, numbered as 1/, 2/, etc.
- End with a takeaway or call to action
- No generic filler — every tweet must deliver value
- Suggest 2-3 relevant hashtags at the end (not in every tweet)""",
    Platform.LINKEDIN: """Write a LinkedIn post from this content.
Rules:
- Open with a bold first line (the hook visible before "see more")
- Use short paragraphs (1-2 sentences each) with line breaks
- Professional but human tone — not corporate speak
- Include a personal insight or hot take angle
- End with a question to drive engagement
- 1000-1500 characters ideal
- Suggest 3-5 hashtags at the bottom""",
    Platform.INSTAGRAM: """Write an Instagram caption from this content.
Rules:
- Hook in the first line (visible before "more")
- Tell a micro-story or share a key insight
- Conversational, authentic tone
- End with a call to action (save this, share with someone, drop a comment)
- Under 2200 characters
- Suggest 15-20 relevant hashtags grouped at the end""",
    Platform.NEWSLETTER: """Write a newsletter blurb (email-ready) from this content.
Rules:
- Subject line suggestion at the top
- Opening line that hooks the reader immediately
- 200-400 words summarizing the key insights
- Use subheadings if covering multiple points
- End with a CTA (watch the full video, reply with thoughts, etc.)
- Tone: like a smart friend sharing something interesting""",
}


SYSTEM_PROMPT = """You are Prism, a content repurposing engine for creators.
Your job is to transform video transcripts into platform-specific social media content.

Key principles:
- Capture the SUBSTANCE, not just summarize — pull out insights, stories, data points
- Match the creator's tone: {tone}
- Every piece of content must stand alone (reader hasn't seen the video)
- Be specific — use actual quotes, numbers, and examples from the transcript
- Never start with "In this video..." or "The creator discusses..."
- Write like a human, not a bot

{context}"""


async def repurpose(
    transcript: str,
    title: str,
    platforms: list[Platform],
    tone: str = "professional yet conversational",
    context: str = "",
) -> list[PlatformContent]:
    """
    Generate platform-specific content from a transcript.

    Args:
        transcript: Full video transcript text
        title: Video title (for context)
        platforms: Which platforms to generate for
        tone: Creator's preferred tone
        context: Optional brand voice notes

    Returns:
        List of PlatformContent for each requested platform
    """
    ai = get_ai()
    results: list[PlatformContent] = []

    system = SYSTEM_PROMPT.format(
        tone=tone,
        context=f"Creator context: {context}" if context else "",
    )

    for platform in platforms:
        platform_instructions = PLATFORM_PROMPTS[platform]

        prompt = f"""Video Title: {title}

Transcript:
{transcript[:12000]}

---

{platform_instructions}

Generate the {platform.value} content now:"""

        response = await ai.generate(prompt=prompt, system=system)

        # Extract hashtags from response (simple parse)
        content = response.text
        hashtags: list[str] = []
        for word in content.split():
            if word.startswith("#") and len(word) > 1:
                hashtags.append(word)

        results.append(
            PlatformContent(
                platform=platform,
                content=content,
                character_count=len(content),
                hashtags=hashtags[:20],  # Cap hashtags
            )
        )

    return results
