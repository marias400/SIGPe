from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, ForeignKey
from typing import Optional
from core.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), primary_key=True)
    license_number: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    institution_name: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    speciality: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relación con User (usando string para evitar importación circular)
    user: Mapped["User"] = relationship("User", backref="doctor")

