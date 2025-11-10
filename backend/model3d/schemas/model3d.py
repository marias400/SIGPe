from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Model3DBase(BaseModel):
    file_name: Optional[str] = None
    file_format: Optional[str] = None
    file_size: Optional[str] = None
    file_path: Optional[str] = None
    s3_key: Optional[str] = None
    s3_url: Optional[str] = None


class Model3DCreate(Model3DBase):
    """Schema para crear un modelo 3D"""
    order_id: int


class Model3DUpdate(BaseModel):
    """Schema para actualizar un modelo 3D"""
    file_name: Optional[str] = None
    file_format: Optional[str] = None
    file_size: Optional[str] = None
    file_path: Optional[str] = None
    s3_key: Optional[str] = None
    s3_url: Optional[str] = None


class Model3DSchema(Model3DBase):
    """Schema para respuesta de modelo 3D"""
    id: int
    order_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PresignedUrlRequest(BaseModel):
    """Schema para solicitar una URL prefirmada"""
    file_name: str
    file_type: Optional[str] = None


class PresignedUrlResponse(BaseModel):
    """Schema para respuesta de URL prefirmada"""
    upload_url: str
    fields: dict
    s3_key: str
    s3_url: str

