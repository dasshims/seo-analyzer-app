from dataclasses import dataclass
from time import perf_counter
from typing import Any

import httpx


class FetchError(Exception):
    """Raised when fetching a URL fails."""

    def __init__(self, message: str, *, status_code: int | None = None) -> None:
        super().__init__(message)
        self.status_code = status_code


@dataclass(slots=True)
class FetchResult:
    url: str
    status_code: int
    load_time_ms: float
    html: str


async def fetch_html(url: str, *, timeout: float = 15.0) -> FetchResult:
    """Fetch HTML content for the provided URL and measure load time."""
    async with httpx.AsyncClient(follow_redirects=True, timeout=timeout) as client:
        start_time = perf_counter()
        try:
            response = await client.get(url)
        except httpx.RequestError as exc:
            raise FetchError(f"Failed to fetch URL: {exc}") from exc
        load_time_ms = (perf_counter() - start_time) * 1000
        if response.status_code >= 400:
            raise FetchError(
                f"Received HTTP {response.status_code} from URL.",
                status_code=response.status_code,
            )
        return FetchResult(
            url=str(response.url),
            status_code=response.status_code,
            load_time_ms=load_time_ms,
            html=response.text,
        )
