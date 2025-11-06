from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth.services.auth_service import (
    get_current_active_user,
    get_current_verified_doctor_user,
    get_current_technician_user,
)
from core.database import get_db
from patient.schemas.patient import PatientCreate, PatientSchema, PatientUpdate
from patient.services.patient_service import (
    create_patient,
    get_patient,
    get_patients_by_doctor_id,
    get_all_patients,
    update_patient,
    delete_patient,
)
from doctor.services.doctor_service import get_doctor_by_user_id
from user.models.user import User

patient_router = APIRouter(prefix="/patients", tags=["Patients"])


@patient_router.post("/", response_model=PatientSchema)
def create_new_patient(
    patient: PatientCreate,
    current_user: User = Depends(get_current_verified_doctor_user),
    db: Session = Depends(get_db),
):
    """
    Crea un nuevo paciente.
    Solo los doctores verificados pueden crear pacientes.
    Si no se proporciona doctor_id, se usa el doctor actual.
    """
    # Si no se proporciona doctor_id, usar el doctor actual
    doctor_id = patient.doctor_id if patient.doctor_id else current_user.id
    
    # Verificar que el doctor_id es el actual o el usuario es técnico
    if doctor_id != current_user.id and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No puedes crear pacientes para otros doctores"
        )
    
    return create_patient(db, patient, doctor_id)


@patient_router.get("/my-patients", response_model=list[PatientSchema])
def get_my_patients(
    current_user: User = Depends(get_current_verified_doctor_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene todos los pacientes del doctor autenticado.
    Solo los doctores verificados pueden ver sus pacientes.
    """
    return get_patients_by_doctor_id(db, current_user.id)


@patient_router.get("/doctor/{doctor_id}", response_model=list[PatientSchema])
def get_patients_by_doctor(
    doctor_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene todos los pacientes de un doctor específico.
    Solo el mismo doctor o un técnico puede ver los pacientes de un doctor.
    """
    # Verificar permisos
    if current_user.id != doctor_id and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para ver los pacientes de este doctor"
        )
    
    return get_patients_by_doctor_id(db, doctor_id)


@patient_router.get("/all", response_model=list[PatientSchema])
def list_all_patients(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_technician_user),
    db: Session = Depends(get_db),
):
    """
    Lista todos los pacientes del sistema.
    Solo los técnicos pueden ver todos los pacientes.
    """
    return get_all_patients(db, skip=skip, limit=limit)


@patient_router.get("/{patient_id}", response_model=PatientSchema)
def get_patient_detail(
    patient_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene los detalles de un paciente específico.
    Solo el doctor asociado o un técnico puede verlo.
    """
    db_patient = get_patient(db, patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Verificar permisos
    if (
        not db_patient.doctor_id
        or db_patient.doctor_id != current_user.id
    ) and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para ver este paciente"
        )
    
    return db_patient


@patient_router.put("/{patient_id}", response_model=PatientSchema)
def update_patient_detail(
    patient_id: int,
    patient_update: PatientUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Actualiza un paciente.
    Solo el doctor asociado o un técnico puede actualizarlo.
    """
    db_patient = get_patient(db, patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Verificar permisos
    if (
        not db_patient.doctor_id
        or db_patient.doctor_id != current_user.id
    ) and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para actualizar este paciente"
        )
    
    # Si se intenta cambiar el doctor_id, solo técnicos pueden hacerlo
    if (
        patient_update.doctor_id is not None
        and patient_update.doctor_id != db_patient.doctor_id
        and current_user.user_type != "tecnico"
    ):
        raise HTTPException(
            status_code=403,
            detail="Solo los técnicos pueden cambiar el doctor asociado a un paciente"
        )
    
    return update_patient(db, patient_id, patient_update)


@patient_router.delete("/{patient_id}")
def delete_patient_detail(
    patient_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Elimina un paciente.
    Solo el doctor asociado o un técnico puede eliminarlo.
    """
    db_patient = get_patient(db, patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Verificar permisos
    if (
        not db_patient.doctor_id
        or db_patient.doctor_id != current_user.id
    ) and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para eliminar este paciente"
        )
    
    return delete_patient(db, patient_id)

