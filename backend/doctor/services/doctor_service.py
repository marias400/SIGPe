from sqlalchemy.orm import Session, joinedload
from typing import Optional
from fastapi import HTTPException
from doctor.models.doctor import Doctor
from doctor.schemas.doctor import DoctorRequest, DoctorUpdate
from user.models.user import User
from user.services.user_service import get_user


def get_doctor_by_user_id(db: Session, user_id: int):
    """Obtiene un doctor por su user_id"""
    return db.query(Doctor).filter(Doctor.user_id == user_id).first()


def request_doctor_status(db: Session, user_id: int, doctor_request: DoctorRequest):
    """
    Permite a un usuario solicitar ser doctor.
    Crea un registro en la tabla doctors con is_verified=False
    """
    # Verificar que el usuario existe
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar que el usuario no sea ya doctor
    existing_doctor = get_doctor_by_user_id(db, user_id)
    if existing_doctor:
        raise HTTPException(
            status_code=400, 
            detail="El usuario ya es doctor o ya tiene una solicitud pendiente"
        )
    
    # Verificar que el usuario no tenga ya un user_type diferente
    if user.user_type == "doctor":
        raise HTTPException(
            status_code=400,
            detail="El usuario ya es doctor"
        )
    
    # Crear registro en doctors con is_verified=False
    db_doctor = Doctor(
        user_id=user_id,
        license_number=doctor_request.license_number,
        institution_name=doctor_request.institution_name,
        speciality=doctor_request.speciality,
        is_verified=False
    )
    
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    
    return db_doctor


def validate_doctor_request(db: Session, user_id: int, doctor_update: Optional[DoctorUpdate] = None):
    """
    Valida una solicitud de doctor.
    Actualiza user_type a "doctor" y marca is_verified=True en doctors
    """
    # Verificar que el usuario existe
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar que existe una solicitud de doctor
    doctor = get_doctor_by_user_id(db, user_id)
    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="No se encontró una solicitud de doctor para este usuario"
        )
    
    # Si ya está verificado, no hacer nada
    if doctor.is_verified:
        raise HTTPException(
            status_code=400,
            detail="El doctor ya está verificado"
        )
    
    # Actualizar datos del doctor si se proporcionan
    if doctor_update:
        if doctor_update.license_number is not None:
            doctor.license_number = doctor_update.license_number
        if doctor_update.institution_name is not None:
            doctor.institution_name = doctor_update.institution_name
        if doctor_update.speciality is not None:
            doctor.speciality = doctor_update.speciality
    
    # Marcar como verificado
    doctor.is_verified = True
    
    # Actualizar user_type a "doctor"
    user.user_type = "doctor"
    
    db.commit()
    db.refresh(doctor)
    db.refresh(user)
    
    return doctor


def get_all_pending_doctor_requests(db: Session):
    """Obtiene todas las solicitudes de doctor pendientes (is_verified=False)"""
    return db.query(Doctor).filter(Doctor.is_verified == False).all()


def update_doctor_info(db: Session, user_id: int, doctor_update: DoctorUpdate):
    """Actualiza la información de un doctor"""
    doctor = get_doctor_by_user_id(db, user_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor no encontrado")
    
    if doctor_update.license_number is not None:
        doctor.license_number = doctor_update.license_number
    if doctor_update.institution_name is not None:
        doctor.institution_name = doctor_update.institution_name
    if doctor_update.speciality is not None:
        doctor.speciality = doctor_update.speciality
    if doctor_update.is_verified is not None:
        doctor.is_verified = doctor_update.is_verified
    
    db.commit()
    db.refresh(doctor)
    return doctor


def get_all_doctors(db: Session):
    """Obtiene todos los doctores con la información del usuario"""
    return (
        db.query(Doctor)
        .options(joinedload(Doctor.user))
        .all()
    )

