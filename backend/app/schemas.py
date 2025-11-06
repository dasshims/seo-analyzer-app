from datetime import datetime
from typing import Any

from pydantic import BaseModel, HttpUrl, field_validator


class AnalyzeRequest(BaseModel):
    url: HttpUrl

    @field_validator("url")
    @classmethod
    def normalize_url(cls, value: HttpUrl) -> HttpUrl:
        # Ensure we have a normalized URL string (pydantic's HttpUrl already validates).
        return value


class SEOTags(BaseModel):
    title: str | None = None
    meta_description: str | None = None
    canonical_url: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None
    og_url: str | None = None
    twitter_card: str | None = None
    twitter_title: str | None = None
    twitter_description: str | None = None
    twitter_image: str | None = None


class GooglePreview(BaseModel):
    title: str
    snippet: str


class SocialPreview(BaseModel):
    title: str
    description: str


class AnalyzeResponse(BaseModel):
    url: str
    status_code: int
    load_time_ms: float
    seo_tags: SEOTags
    issues: list[str]
    ai_feedback: str
    google_preview: GooglePreview
    social_preview: SocialPreview


class RecentSite(BaseModel):
    url: str
    last_analyzed_at: datetime
    last_status_code: int | None = None
    last_load_time_ms: float | None = None


class TracerouteRequest(BaseModel):
    url: HttpUrl


class TracerouteHop(BaseModel):
    hop: int
    details: str


class TracerouteResponse(BaseModel):
    target: str
    hops: list[TracerouteHop]
    raw_output: str


class ErrorResponse(BaseModel):
    detail: Any
