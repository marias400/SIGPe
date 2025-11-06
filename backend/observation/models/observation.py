from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey
from typing import Optional
from datetime import datetime, timezone
from core.database import Base


class Observation(Base):
    __tablename__ = "observations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    order_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("orders.id"), nullable=False
    )
    type: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    comment: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
        nullable=False,
    )
    # Relación con User (usando string para evitar importación circular)
    user: Mapped["User"] = relationship("User", backref="observations")
    # Relación con Order (usando string para evitar importación circular)
    order: Mapped["Order"] = relationship("Order", backref="observations")
