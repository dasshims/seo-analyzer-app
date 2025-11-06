from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, sessionmaker

from ..config import get_settings
from ..models import Base, RecentSite


settings = get_settings()

from sqlalchemy import create_engine

engine = create_engine(
    settings.resolved_database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.resolved_database_url else {},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def get_session() -> Session:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def record_recent_site(
    session: Session,
    *,
    url: str,
    status_code: int | None,
    load_time_ms: float | None,
) -> None:
    """Insert or update a recently analysed site."""
    instance = session.scalars(select(RecentSite).where(RecentSite.url == url)).first()
    timestamp = datetime.utcnow()
    if instance:
        instance.last_status_code = status_code
        instance.last_load_time_ms = load_time_ms
        instance.last_analyzed_at = timestamp
    else:
        instance = RecentSite(
            url=url,
            last_status_code=status_code,
            last_load_time_ms=load_time_ms,
            last_analyzed_at=timestamp,
        )
        session.add(instance)
    session.commit()


def fetch_recent_sites(session: Session, *, limit: int = 20) -> list[RecentSite]:
    """Return recent sites ordered by most recent analysis."""
    stmt = select(RecentSite).order_by(RecentSite.last_analyzed_at.desc()).limit(limit)
    return list(session.scalars(stmt).all())
