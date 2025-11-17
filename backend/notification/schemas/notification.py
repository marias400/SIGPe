from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NotificationBase(BaseModel):
    user_id: int
    order_id: int
    message: Optional[str] = None
    is_read: bool = False
    type: Optional[str] = None
    current_stage: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class NotificationCreate(BaseModel):
    """Schema para crear una notificación"""

    user_id: int
    order_id: Optional[int] = None
    message: Optional[str] = None
    type: Optional[str] = None
    current_stage: Optional[str] = None


class NotificationUpdate(BaseModel):
    """Schema para actualizar una notificación"""

    is_read: Optional[bool] = None


class NotificationSchema(NotificationBase):
    """Schema para respuesta de notificación"""

    id: int

    class Config:
        from_attributes = True
