from pydantic import BaseModel
from typing import Optional, List
from material.schemas.material import MaterialSchema
from size.schemas.size import SizeSchema


class ProsthesisBase(BaseModel):
    """Schema base para prótesis"""
    speciality_id: int
    name: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[int] = None
    img_url: Optional[str] = None


class ProsthesisCreate(ProsthesisBase):
    """Schema para crear una nueva prótesis"""
    material_ids: Optional[List[int]] = []
    size_ids: Optional[List[int]] = []


class ProsthesisUpdate(BaseModel):
    """Schema para actualizar una prótesis"""
    speciality_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[int] = None
    img_url: Optional[str] = None
    material_ids: Optional[List[int]] = None
    size_ids: Optional[List[int]] = None


class ProsthesisSchema(ProsthesisBase):
    """Schema para respuesta de prótesis"""
    
    id: int
    materials: Optional[List[MaterialSchema]] = []
    sizes: Optional[List[SizeSchema]] = []

    class Config:
        from_attributes = True
