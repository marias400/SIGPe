from sqlalchemy.orm import Session
from fastapi import HTTPException
from patient.models.patient import Patient
from patient.schemas.patient import PatientCreate, PatientUpdate
from doctor.services.doctor_service import get_doctor_by_user_id


def create_patient(db: Session, patient: PatientCreate, doctor_id: int):
    """
    Crea un nuevo paciente asociado a un doctor.
    """
    # Verificar que el doctor existe
    doctor = get_doctor_by_user_id(db, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor no encontrado")

    # Verificar que el doctor esté verificado
    if not doctor.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Solo los doctores verificados pueden crear pacientes",
        )

    # Si se proporciona un doctor_id diferente al actual, verificar que existe
    target_doctor_id = patient.doctor_id if patient.doctor_id else doctor_id
    if target_doctor_id != doctor_id:
        target_doctor = get_doctor_by_user_id(db, target_doctor_id)
        if not target_doctor:
            raise HTTPException(status_code=404, detail="Doctor objetivo no encontrado")
        if not target_doctor.is_verified:
            raise HTTPException(
                status_code=403, detail="El doctor objetivo no está verificado"
            )

    # Crear el paciente
    db_patient = Patient(
        doctor_id=target_doctor_id,
        name=patient.name,
        lastname=patient.lastname,
    )

    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)

    return db_patient


def get_patient(db: Session, patient_id: int):
    """Obtiene un paciente por su ID"""
    return db.query(Patient).filter(Patient.id == patient_id).first()


def get_patients_by_doctor_id(db: Session, doctor_id: int):
    """Obtiene todos los pacientes de un doctor"""
    # Verificar que el doctor existe
    doctor = get_doctor_by_user_id(db, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor no encontrado")

    return db.query(Patient).filter(Patient.doctor_id == doctor_id).all()


def get_all_patients(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todos los pacientes con paginación"""
    return db.query(Patient).offset(skip).limit(limit).all()


def update_patient(db: Session, patient_id: int, patient_update: PatientUpdate):
    """Actualiza un paciente"""
    db_patient = get_patient(db, patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    # Si se actualiza el doctor_id, verificar que el nuevo doctor existe y está verificado
    if patient_update.doctor_id is not None:
        new_doctor = get_doctor_by_user_id(db, patient_update.doctor_id)
        if not new_doctor:
            raise HTTPException(status_code=404, detail="Doctor no encontrado")
        if not new_doctor.is_verified:
            raise HTTPException(
                status_code=403, detail="El doctor objetivo no está verificado"
            )
    if patient_update.name is not None:
        db_patient.name = patient_update.name
    if patient_update.lastname is not None:
        db_patient.lastname = patient_update.lastname
    if patient_update.doctor_id is not None:
        db_patient.doctor_id = patient_update.doctor_id

    db.commit()
    db.refresh(db_patient)

    return db_patient


def delete_patient(db: Session, patient_id: int):
    """Elimina un paciente"""
    db_patient = get_patient(db, patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    db.delete(db_patient)
    db.commit()

    return {"message": "Paciente eliminado exitosamente"}
