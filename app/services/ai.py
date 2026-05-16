"""AI provider abstraction layer.

Designed to be provider-agnostic so we can swap between
Gemini, Claude, OpenAI, etc. without touching business logic.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass

from app.config import get_settings


@dataclass
class AIResponse:
    """Standardized AI response."""

    text: str
    model: str
    input_tokens: int
    output_tokens: int


class AIProvider(ABC):
    """Abstract base for AI providers."""

    @abstractmethod
    async def generate(self, prompt: str, system: str = "") -> AIResponse:
        """Generate a completion from a prompt."""
        ...


class GeminiProvider(AIProvider):
    """Google Gemini 2.5 Flash provider."""

    def __init__(self) -> None:
        import google.generativeai as genai

        settings = get_settings()
        genai.configure(api_key=settings.gemini_api_key)
        self._genai = genai
        self.model_name = "gemini-2.5-flash"
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            system_instruction=None,
        )

    async def generate(self, prompt: str, system: str = "") -> AIResponse:
        """Generate content using Gemini."""
        model = self.model
        if system:
            model = self._genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system,
            )

        response = model.generate_content(prompt)

        # Extract token usage
        usage = response.usage_metadata
        return AIResponse(
            text=response.text,
            model=self.model_name,
            input_tokens=getattr(usage, "prompt_token_count", 0),
            output_tokens=getattr(usage, "candidates_token_count", 0),
        )


# Default provider — swap this to change AI backend globally
_provider: AIProvider | None = None


def get_ai() -> AIProvider:
    """Get the configured AI provider (singleton)."""
    global _provider
    if _provider is None:
        _provider = GeminiProvider()
    return _provider
