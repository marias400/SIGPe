from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String
from typing import Optional
from core.database import Base


class Speciality(Base):
    __tablename__ = "specialities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[Optional[str]] = mapped_column(
        String(128), nullable=True, default=None
    )

    prostheses = relationship("Prosthesis", back_populates="speciality")
