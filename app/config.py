"""Application configuration via environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings loaded from environment variables."""

    # App
    app_name: str = "Prism"
    app_version: str = "0.1.0"
    debug: bool = False

    # AI Provider
    gemini_api_key: str = ""

    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""

    # Stripe (Sprint 4)
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

    # Rate limits
    free_tier_limit: int = 3  # repurposes per month
    trial_duration_days: int = 14

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()
