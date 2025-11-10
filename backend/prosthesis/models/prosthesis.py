from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey
from typing import Optional
from core.database import Base
from prosthesis.models.prosthesis_material import (
    prosthesis_material,
)


class Prosthesis(Base):
    __tablename__ = "prostheses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    speciality_id: Mapped[int] = mapped_column(
        ForeignKey("specialities.id"), nullable=False
    )
    name: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(
        String(1024), nullable=True, default=None
    )
    base_price: Mapped[Optional[int]] = mapped_column(nullable=False, default=None)
    img_url: Mapped[Optional[str]] = mapped_column(
        String(128), nullable=True, default=None
    )

    speciality = relationship("Speciality", back_populates="prostheses")
    materials = relationship(
        "Material", secondary=prosthesis_material, back_populates="prostheses"
    )

    sizes = relationship(
        "Size", secondary="prosthesis_size", back_populates="prostheses"
    )
