from pydantic import BaseModel
from typing import Optional


class DoctorCreate(BaseModel):
    license_number: Optional[str] = None
    institution_name: Optional[str] = None
    speciality: Optional[str] = None


class DoctorRequest(BaseModel):
    """Schema para solicitud de ser doctor"""

    license_number: Optional[str] = None
    institution_name: Optional[str] = None
    speciality: Optional[str] = None


class DoctorUpdate(BaseModel):
    """Schema para actualizar datos de doctor"""

    license_number: Optional[str] = None
    institution_name: Optional[str] = None
    speciality: Optional[str] = None
    is_verified: Optional[bool] = None


class DoctorSchema(BaseModel):
    user_id: int
    license_number: Optional[str] = None
    institution_name: Optional[str] = None
    speciality: Optional[str] = None
    is_verified: bool

    class Config:
        from_attributes = True
