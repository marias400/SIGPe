from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth.services.auth_service import (
    get_current_active_user,
    get_current_technician_user,
)
from core.database import get_db
from doctor.schemas.doctor import (
    DoctorRequest,
    DoctorSchema,
    DoctorUpdate,
    DoctorWithUserSchema,
)
from doctor.services.doctor_service import (
    request_doctor_status,
    validate_doctor_request,
    get_doctor_by_user_id,
    get_all_pending_doctor_requests,
    update_doctor_info,
    get_all_doctors,
)
from user.models.user import User

doctor_router = APIRouter(prefix="/doctors", tags=["Doctors"])


@doctor_router.post("/request", response_model=DoctorSchema)
def request_doctor(
    doctor_request: DoctorRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Permite a un usuario autenticado solicitar ser doctor.
    Crea un registro en doctors con is_verified=False
    """
    return request_doctor_status(db, current_user.id, doctor_request)


@doctor_router.get("/pending", response_model=list[DoctorSchema])
def get_pending_requests(
    current_user: User = Depends(get_current_technician_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene todas las solicitudes de doctor pendientes.
    Solo usuarios de tipo 'tecnico' pueden acceder a esta información.
    """
    return get_all_pending_doctor_requests(db)


@doctor_router.post("/{user_id}/validate", response_model=DoctorSchema)
def validate_doctor(
    user_id: int,
    doctor_update: DoctorUpdate | None = None,
    current_user: User = Depends(get_current_technician_user),
    db: Session = Depends(get_db),
):
    """
    Valida una solicitud de doctor.
    Actualiza user_type a "doctor" y marca is_verified=True.
    Solo usuarios de tipo 'tecnico' pueden validar solicitudes de doctor.
    """
    # Si es técnico, puede validar al médico
    if current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403, detail="No tienes permiso para actualizar esta información"
        )
    elif doctor_update is None:
        doctor_update = DoctorUpdate()
    return validate_doctor_request(db, user_id, doctor_update)


@doctor_router.get("/me", response_model=DoctorSchema)
def get_my_doctor_info(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Obtiene la información de doctor del usuario autenticado"""
    doctor = get_doctor_by_user_id(db, current_user.id)
    if not doctor:
        raise HTTPException(
            status_code=404, detail="No se encontró información de doctor"
        )
    return doctor


@doctor_router.get("/all", response_model=list[DoctorWithUserSchema])
def get_all_doctors_endpoint(
    current_user: User = Depends(get_current_technician_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene todos los doctores del sistema con su información de usuario.
    Solo usuarios de tipo 'tecnico' pueden acceder a esta información.
    """
    return get_all_doctors(db)


@doctor_router.get("/{user_id}", response_model=DoctorSchema)
def get_doctor(
    user_id: int,
    db: Session = Depends(get_db),
):
    """Obtiene la información de doctor de un usuario específico"""
    doctor = get_doctor_by_user_id(db, user_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor no encontrado")
    return doctor


@doctor_router.put("/{user_id}", response_model=DoctorSchema)
def update_doctor(
    user_id: int,
    doctor_update: DoctorUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Actualiza la información de un doctor.
    - El propio doctor puede actualizar su información (excepto is_verified)
    - Los técnicos pueden actualizar cualquier información de cualquier doctor
    """
    # Si el usuario actual es el mismo doctor que se está actualizando
    if current_user.id == user_id:
        # El doctor no puede modificar su propio is_verified
        if doctor_update.is_verified is not None:
            raise HTTPException(
                status_code=403,
                detail="No puedes modificar tu propio estado de verificación",
            )
    # Si es técnico, puede modificar cualquier información
    elif current_user.user_type != "tecnico":
        # Si no es el mismo doctor ni es técnico, no tiene permiso
        raise HTTPException(
            status_code=403, detail="No tienes permiso para actualizar esta información"
        )

    return update_doctor_info(db, user_id, doctor_update)
