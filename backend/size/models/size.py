from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String
from typing import Optional
from core.database import Base


class Size(Base):
    __tablename__ = "sizes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    price_modifier: Mapped[Optional[float]] = mapped_column(nullable=True)

    prostheses = relationship(
        "Prosthesis", secondary="prosthesis_size", back_populates="sizes"
    )
