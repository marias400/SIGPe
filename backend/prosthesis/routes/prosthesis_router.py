from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth.services.auth_service import get_current_technician_user
from core.database import get_db
from prosthesis.schemas.prosthesis import (
    ProsthesisCreate,
    ProsthesisSchema,
    ProsthesisUpdate,
)
from prosthesis.services.prosthesis_service import (
    create_prosthesis,
    get_prosthesis,
    get_prostheses_by_speciality,
    get_all_prostheses,
    update_prosthesis,
    delete_prosthesis,
)
from user.models.user import User

prosthesis_router = APIRouter(prefix="/prostheses", tags=["Prostheses"])


@prosthesis_router.post("/", response_model=ProsthesisSchema)
def create_new_prosthesis(
    prosthesis: ProsthesisCreate,
    current_user: User = Depends(get_current_technician_user),
    db: Session = Depends(get_db),
):
    """
    Crea una nueva prótesis.
    Solo los técnicos pueden crear prótesis.
    """
    return create_prosthesis(db, prosthesis)


@prosthesis_router.get("/{prosthesis_id}", response_model=ProsthesisSchema)
def get_prosthesis_detail(
    prosthesis_id: int,
    db: Session = Depends(get_db),
):
    """
    Obtiene los detalles de una prótesis específica.
    """
    prosthesis = get_prosthesis(db, prosthesis_id)
    if not prosthesis:
        raise HTTPException(status_code=404, detail="Prótesis no encontrada")
    return prosthesis


@prosthesis_router.get("/speciality/{speciality_id}", response_model=list[ProsthesisSchema])
def get_prostheses_by_speciality_endpoint(
    speciality_id: int,
    db: Session = Depends(get_db),
):
    """
    Obtiene todas las prótesis de una especialidad.
    """
    return get_prostheses_by_speciality(db, speciality_id)


@prosthesis_router.get("/", response_model=list[ProsthesisSchema])
def list_all_prostheses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """
    Lista todas las prótesis.
    """
    return get_all_prostheses(db, skip=skip, limit=limit)


@prosthesis_router.put("/{prosthesis_id}", response_model=ProsthesisSchema)
def update_prosthesis_detail(
    prosthesis_id: int,
    prosthesis_update: ProsthesisUpdate,
    current_user: User = Depends(get_current_technician_user),
    db: Session = Depends(get_db),
):
    """
    Actualiza una prótesis.
    Solo los técnicos pueden actualizar prótesis.
    """
    return update_prosthesis(db, prosthesis_id, prosthesis_update)


@prosthesis_router.delete("/{prosthesis_id}")
def delete_prosthesis_detail(
    prosthesis_id: int,
    current_user: User = Depends(get_current_technician_user),
    db: Session = Depends(get_db),
):
    """
    Elimina una prótesis.
    Solo los técnicos pueden eliminar prótesis.
    """
    return delete_prosthesis(db, prosthesis_id)

