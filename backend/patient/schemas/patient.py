from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PatientBase(BaseModel):
    name: Optional[str] = None
    lastname: Optional[str] = None


class PatientCreate(PatientBase):
    """Schema para crear un paciente"""

    doctor_id: Optional[int] = None  # Si no se proporciona, se usa el doctor actual


class PatientUpdate(BaseModel):
    """Schema para actualizar un paciente"""

    name: Optional[str] = None
    lastname: Optional[str] = None
    doctor_id: Optional[int] = None


class PatientSchema(PatientBase):
    """Schema para respuesta de paciente"""

    id: int
    doctor_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
