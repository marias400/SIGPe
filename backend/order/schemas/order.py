from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from user.schemas.user import UserSchema
from prosthesis.schemas.prosthesis import ProsthesisSchema
from material.schemas.material import MaterialSchema


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
    notification_message: Optional[str] = None  # Mensaje para crear notificación cuando cambia current_stage


class OrderSchema(OrderBase):
    """Schema para respuesta de orden con relaciones cargadas"""

    id: int
    technician_id: Optional[int] = None
    full_price: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    
    # Objetos relacionados
    user: Optional[UserSchema] = None
    prosthesis: Optional[ProsthesisSchema] = None
    material: Optional[MaterialSchema] = None
    technician: Optional[UserSchema] = None

    class Config:
        from_attributes = True
