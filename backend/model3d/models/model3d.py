from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey
from typing import Optional
from datetime import datetime, timezone
from core.database import Base


class Model3D(Base):
    __tablename__ = "3d_models"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"), nullable=False)
    file_name: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    file_format: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    file_size: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    file_path: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
        nullable=False,
    )

    # Relación con Order (usando string para evitar importación circular)
    order: Mapped["Order"] = relationship("Order", backref="models_3d")

