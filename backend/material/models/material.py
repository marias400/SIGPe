from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Float
from typing import Optional
from core.database import Base
from prosthesis.models.prosthesis_material import prosthesis_material


class Material(Base):
    __tablename__ = "materials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    price_modifier: Mapped[Optional[float]] = mapped_column(nullable=True)
    amount_mts: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    prostheses = relationship(
        "Prosthesis", secondary=prosthesis_material, back_populates="materials"
    )
