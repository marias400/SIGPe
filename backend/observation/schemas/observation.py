from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ObservationCreate(BaseModel):
    user_id: int
    order_id: int
    type: Optional[str] = None
    comment: Optional[str] = None


class ObservationUpdate(BaseModel):
    type: Optional[str] = None
    comment: Optional[str] = None


class ObservationSchema(BaseModel):
    id: int
    user_id: int
    order_id: int
    type: Optional[str] = None
    comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
