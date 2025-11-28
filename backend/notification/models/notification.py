from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey
from typing import Optional
from datetime import datetime, timezone
from core.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    order_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("orders.id"), nullable=True
    )
    message: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    is_read: Mapped[bool] = mapped_column(nullable=False, default=False)
    type: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    current_stage: Mapped[Optional[str]] = mapped_column(
        String(128), nullable=True, default=None
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
        nullable=False,
    )
