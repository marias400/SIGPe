from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey
from typing import Optional
from datetime import datetime, timezone
from core.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    doctor_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("doctors.user_id"), nullable=True
    )
    name: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    lastname: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
        nullable=False,
    )

    # Relación con Doctor (usando string para evitar importación circular)
    doctor: Mapped[Optional["Doctor"]] = relationship("Doctor", backref="patients")

