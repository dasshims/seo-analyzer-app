import json
from functools import lru_cache
from typing import Any

from openai import OpenAI

from ..config import get_settings
from ..schemas import SEOTags
from .fetcher import FetchResult


class AIClientError(RuntimeError):
    """Raised when the OpenAI client cannot be initialised or used."""


@lru_cache
def get_openai_client() -> OpenAI:
    settings = get_settings()
    if not settings.openai_api_key:
        raise AIClientError("OPENAI_API_KEY is not configured.")
    return OpenAI(api_key=settings.openai_api_key)


def _prepare_prompt(seo_tags: SEOTags, fetch_result: FetchResult, issues: list[str]) -> str:
    data = {
        "url": fetch_result.url,
        "status_code": fetch_result.status_code,
        "load_time_ms": round(fetch_result.load_time_ms, 2),
        "issues": issues,
        "seo_tags": seo_tags.model_dump(),
    }
    return json.dumps(data, ensure_ascii=False, indent=2)


def generate_feedback(
    seo_tags: SEOTags,
    fetch_result: FetchResult,
    issues: list[str],
) -> tuple[str, dict[str, str], dict[str, str]]:
    """Call OpenAI Chat Completions to produce SEO feedback and previews."""
    client = get_openai_client()
    payload = _prepare_prompt(seo_tags, fetch_result, issues)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.4,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an SEO expert. Analyse the provided metrics and tags, "
                    "write concise feedback, and craft realistic previews. "
                    "Respond strictly as JSON with fields: ai_feedback (string), "
                    "google_preview (object with title, snippet), "
                    "social_preview (object with title, description). "
                    "The previews should use fallbacks when tags are missing."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Here are the website metrics and tags to analyse:\n"
                    f"{payload}"
                ),
            },
        ],
    )

    message = response.choices[0].message.content
    if not message:
        raise AIClientError("OpenAI returned an empty response.")

    try:
        parsed = json.loads(message)
    except json.JSONDecodeError as exc:
        raise AIClientError("Failed to parse OpenAI response as JSON.") from exc

    ai_feedback = parsed.get("ai_feedback", "").strip()
    google_preview = parsed.get("google_preview") or {}
    social_preview = parsed.get("social_preview") or {}

    def _coerce_preview(data: dict[str, Any], *, defaults: dict[str, str]) -> dict[str, str]:
        return {
            "title": str(data.get("title") or defaults["title"]),
            "snippet" if "snippet" in defaults else "description": str(
                data.get("snippet") or data.get("description") or defaults.get("snippet") or defaults.get("description")
            ),
        }

    google_preview = _coerce_preview(
        google_preview,
        defaults={
            "title": seo_tags.title or "Website",
            "snippet": seo_tags.meta_description or "No meta description provided.",
        },
    )

    social_preview = _coerce_preview(
        social_preview,
        defaults={
            "title": seo_tags.og_title or seo_tags.title or "Website",
            "description": seo_tags.og_description
            or seo_tags.twitter_description
            or seo_tags.meta_description
            or "No social description available.",
        },
    )

    if not ai_feedback:
        ai_feedback = "No feedback generated."

    return ai_feedback, google_preview, social_preview
