from pydantic import BaseModel
from typing import Optional


class MaterialSchema(BaseModel):
    """Schema para respuesta de material"""
    
    id: int
    name: str
    price_modifier: Optional[float] = None
    amount_mts: Optional[float] = None

    class Config:
        from_attributes = True

