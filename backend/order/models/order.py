from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey
from typing import Optional
from datetime import datetime, timezone
from core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    technician_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_medical: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    has_design: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    processing_level: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    current_stage: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    meeting_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    specification: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    print_type: Mapped[str] = mapped_column(String(128), nullable=False)
    printing_material: Mapped[str] = mapped_column(String(128), nullable=False)
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
    user: Mapped["User"] = relationship("User", backref="orders")

