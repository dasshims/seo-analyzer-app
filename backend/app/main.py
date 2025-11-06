from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException, Path, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import get_settings
from .schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    GooglePreview,
    RecentSite as RecentSiteSchema,
    SEOTags,
    SocialPreview,
    TracerouteRequest,
    TracerouteResponse,
    TracerouteHop,
)
from .services.ai_feedback import AIClientError, generate_feedback
from .services.fetcher import FetchError, fetch_html
from .services.parser import parse_seo_tags
from .services.seo_rules import evaluate_seo_issues
from .services.storage import fetch_recent_sites, get_session, init_db, record_recent_site
from .services.traceroute import (
    TracerouteError,
    TracerouteTimeoutError,
    TracerouteUnavailableError,
    run_traceroute,
)


settings = get_settings()

app = FastAPI(
    title="SEO Analyzer API",
    version="0.1.0",
    description="Backend API for analysing website SEO performance.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _on_startup() -> None:
    init_db()


@app.post("/analyze", response_model=AnalyzeResponse, status_code=status.HTTP_200_OK)
async def analyze_endpoint(
    payload: AnalyzeRequest,
    session: Session = Depends(get_session),
) -> AnalyzeResponse:
    """Fetch and analyse a website's SEO metadata."""
    url = str(payload.url)
    try:
        fetch_result = await fetch_html(url)
    except FetchError as exc:
        raise HTTPException(
            status_code=exc.status_code or status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    seo_data = parse_seo_tags(fetch_result.html)
    seo_tags = SEOTags(**seo_data)
    issues = evaluate_seo_issues(seo_data, fetch_result=fetch_result)

    record_recent_site(
        session,
        url=fetch_result.url,
        status_code=fetch_result.status_code,
        load_time_ms=fetch_result.load_time_ms,
    )

    try:
        ai_feedback, google_preview_raw, social_preview_raw = generate_feedback(
            seo_tags, fetch_result, issues
        )
    except AIClientError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    google_preview = GooglePreview(**google_preview_raw)
    social_preview = SocialPreview(
        title=social_preview_raw["title"],
        description=social_preview_raw["description"],
    )

    return AnalyzeResponse(
        url=fetch_result.url,
        status_code=fetch_result.status_code,
        load_time_ms=fetch_result.load_time_ms,
        seo_tags=seo_tags,
        issues=issues,
        ai_feedback=ai_feedback,
        google_preview=google_preview,
        social_preview=social_preview,
    )


@app.get("/analyze/{raw_url}", response_model=AnalyzeResponse)
async def analyze_via_path(
    raw_url: str = Path(..., description="URL-encoded website URL to analyse."),
    session: Session = Depends(get_session),
) -> AnalyzeResponse:
    """Convenience wrapper around POST /analyze using a path parameter."""
    # Normalise the incoming URL by ensuring scheme.
    if not raw_url.startswith(("http://", "https://")):
        raw_url = f"https://{raw_url}"
    request = AnalyzeRequest(url=raw_url)
    return await analyze_endpoint(request, session=session)


@app.get("/recent", response_model=list[RecentSiteSchema])
def recent_sites(session: Session = Depends(get_session)) -> list[RecentSiteSchema]:
    """Return a list of recently analysed sites."""
    records = fetch_recent_sites(session)
    return [
        RecentSiteSchema(
            url=record.url,
            last_analyzed_at=record.last_analyzed_at,
            last_status_code=record.last_status_code,
            last_load_time_ms=record.last_load_time_ms,
        )
        for record in records
    ]


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/traceroute", response_model=TracerouteResponse)
async def traceroute_endpoint(payload: TracerouteRequest) -> TracerouteResponse:
    """Run a traceroute to the provided URL's host."""
    host = payload.url.host
    if not host:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to determine host from URL.",
        )

    try:
        result = await run_traceroute(host)
    except TracerouteUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=str(exc)
        ) from exc
    except TracerouteTimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(exc)
        ) from exc
    except TracerouteError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)
        ) from exc

    hops = [TracerouteHop(hop=hop, details=details) for hop, details in result.hops]
    return TracerouteResponse(target=result.target, hops=hops, raw_output=result.raw_output)
