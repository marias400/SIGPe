from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean
from core.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    user_id: Mapped[int] = mapped_column(
        Integer, nullable=False, unique=False, primary_key=True
    )
    license_number: Mapped[str] = mapped_column(String(45), unique=True, nullable=True)
    institution_name: Mapped[str] = mapped_column(String(128), nullable=True)
    speciality: Mapped[str] = mapped_column(String(128), nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    user = relationship("User", back_populates="doctor")
