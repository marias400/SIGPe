from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey
from typing import Optional
from core.database import Base


class MedicalOrder(Base):
    __tablename__ = "medical_orders"

    order_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("orders.id"), primary_key=True, nullable=False
    )
    patient_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("patients.id"), primary_key=True, nullable=False
    )
    urgency_level: Mapped[Optional[str]] = mapped_column(String(45), nullable=False)
    pathology: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    medical_observations: Mapped[Optional[str]] = mapped_column(
        String(1024), nullable=True
    )
    priority_level: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Relaciones
    order: Mapped["Order"] = relationship("Order", backref="medical_order")
    patient: Mapped["Patient"] = relationship("Patient", backref="medical_orders")
