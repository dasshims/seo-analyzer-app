from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for SQLAlchemy models."""


class RecentSite(Base):
    """Stores metadata for recently analyzed URLs."""

    __tablename__ = "recent_sites"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    url: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    last_analyzed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), default=datetime.utcnow, nullable=False
    )
    last_status_code: Mapped[int | None] = mapped_column(Integer, nullable=True)
    last_load_time_ms: Mapped[float | None] = mapped_column(Float, nullable=True)
