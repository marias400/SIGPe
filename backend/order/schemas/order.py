from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class OrderBase(BaseModel):
    is_medical: bool = False
    has_design: bool = False
    processing_level: Optional[str] = None
    current_stage: Optional[str] = None
    meeting_date: Optional[datetime] = None
    specification: Optional[str] = None
    print_type: str
    printing_material: str


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
    meeting_date: Optional[datetime] = None
    specification: Optional[str] = None
    print_type: Optional[str] = None
    printing_material: Optional[str] = None


class OrderSchema(OrderBase):
    """Schema para respuesta de orden"""
    id: int
    user_id: int
    technician_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

