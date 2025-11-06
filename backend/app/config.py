from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings


load_dotenv()


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    database_url: str | None = Field(default=None, alias="DATABASE_URL")
    cors_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173"]
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        populate_by_name = True

    @property
    def resolved_database_url(self) -> str:
        if self.database_url:
            return self.database_url
        base_dir = Path(__file__).resolve().parent.parent
        db_path = base_dir / "seo_analyzer.db"
        return f"sqlite:///{db_path}"


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""
    return Settings()
