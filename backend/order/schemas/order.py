from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class OrderBase(BaseModel):
    user_id: int
    prosthesis_id: int
    material_id: int
    is_medical: bool = False
    has_design: bool = False
    processing_level: Optional[str] = None
    current_stage: Optional[str] = None
    delivery_date: Optional[datetime] = None
    is_completed: bool = False
    specification: Optional[str] = None


class OrderCreate(OrderBase):
    """Schema para crear una nueva orden"""

    pass


class OrderUpdate(BaseModel):
    """Schema para actualizar una orden"""

    technician_id: Optional[int] = None
    is_medical: Optional[bool] = None
    has_design: Optional[bool] = None
    processing_level: Optional[str] = None
    current_stage: Optional[str] = None
    delivery_date: Optional[datetime] = None
    is_completed: Optional[bool] = None
    specification: Optional[str] = None


class OrderSchema(OrderBase):
    """Schema para respuesta de orden"""

    id: int
    technician_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
