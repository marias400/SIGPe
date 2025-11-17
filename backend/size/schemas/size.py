from pydantic import BaseModel
from typing import Optional


class SizeSchema(BaseModel):
    """Schema para respuesta de tamaño"""
    
    id: int
    name: Optional[str] = None
    price_modifier: Optional[float] = None

    class Config:
        from_attributes = True

