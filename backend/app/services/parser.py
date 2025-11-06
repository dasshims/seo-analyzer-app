from collections.abc import Mapping
from typing import Any

from bs4 import BeautifulSoup


def _get_meta_content(soup: BeautifulSoup, name: str) -> str | None:
    tag = soup.find("meta", attrs={"name": name})
    return tag.get("content") if tag else None


def _get_property_content(soup: BeautifulSoup, prop: str) -> str | None:
    tag = soup.find("meta", attrs={"property": prop})
    return tag.get("content") if tag else None


def parse_seo_tags(html: str) -> dict[str, str | None]:
    """Extract relevant SEO tags from HTML."""
    soup = BeautifulSoup(html, "html.parser")

    title_tag = soup.find("title")
    canonical_link = soup.find("link", attrs={"rel": ["canonical", "Canonical"]})

    seo_data: dict[str, str | None] = {
        "title": title_tag.get_text(strip=True) if title_tag else None,
        "meta_description": _get_meta_content(soup, "description"),
        "canonical_url": canonical_link.get("href") if canonical_link else None,
        "og_title": _get_property_content(soup, "og:title"),
        "og_description": _get_property_content(soup, "og:description"),
        "og_image": _get_property_content(soup, "og:image"),
        "og_url": _get_property_content(soup, "og:url"),
        "twitter_card": _get_meta_content(soup, "twitter:card"),
        "twitter_title": _get_meta_content(soup, "twitter:title"),
        "twitter_description": _get_meta_content(soup, "twitter:description"),
        "twitter_image": _get_meta_content(soup, "twitter:image"),
    }

    return seo_data
