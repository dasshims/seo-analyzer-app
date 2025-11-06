from collections.abc import Iterable

from .fetcher import FetchResult

MAX_TITLE_LENGTH = 60
MIN_TITLE_LENGTH = 10
MAX_DESCRIPTION_LENGTH = 160
MIN_DESCRIPTION_LENGTH = 50


def evaluate_seo_issues(
    seo_tags: dict[str, str | None],
    *,
    fetch_result: FetchResult | None = None,
) -> list[str]:
    """Return human-readable SEO issues based on simple heuristics."""
    issues: list[str] = []

    title = seo_tags.get("title")
    description = seo_tags.get("meta_description")

    if not title:
        issues.append("Title tag is missing.")
    else:
        length = len(title)
        if length < MIN_TITLE_LENGTH:
            issues.append("Title is shorter than recommended 10 characters.")
        if length > MAX_TITLE_LENGTH:
            issues.append("Title is longer than 60 characters.")

    if not description:
        issues.append("Meta description is missing.")
    else:
        length = len(description)
        if length < MIN_DESCRIPTION_LENGTH:
            issues.append("Meta description is shorter than 50 characters.")
        if length > MAX_DESCRIPTION_LENGTH:
            issues.append("Meta description exceeds 160 characters.")

    if not seo_tags.get("og_title") or not seo_tags.get("og_description"):
        issues.append("Open Graph title/description tags are missing.")

    if not seo_tags.get("twitter_card"):
        issues.append("Twitter card meta tag is missing.")

    if fetch_result and fetch_result.load_time_ms > 3000:
        issues.append("Page load time exceeds 3 seconds; consider performance optimizations.")

    return issues
