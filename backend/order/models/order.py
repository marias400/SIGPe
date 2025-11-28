from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey, Float
from typing import Optional
from datetime import datetime, timezone
from core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    technician_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=True
    )
    prosthesis_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("prostheses.id"), nullable=True
    )
    material_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("materials.id"), nullable=False
    )
    is_medical: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    has_design: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    processing_level: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    current_stage: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    delivery_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    specification: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    full_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
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
    user = relationship("User", foreign_keys=[user_id])
    technician = relationship("User", foreign_keys=[technician_id])
    prosthesis = relationship("Prosthesis")
    material = relationship("Material")
