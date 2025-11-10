from pydantic import BaseModel
from typing import Optional


class OrderBase(BaseModel):
    order_id: int
    patient_id: int
    urgency_level: Optional[str] = None
    pathology: Optional[str] = None
    medical_observations: Optional[str] = None
    priority_level: Optional[int] = None


class MedicalOrderCreate(OrderBase):
    """Schema para crear una nueva orden médica"""

    pass


class MedicalOrderSchema(OrderBase):
    """Schema para respuesta de orden médica"""

    class Config:
        from_attributes = True
