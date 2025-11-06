from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth.services.auth_service import get_current_active_user
from core.database import get_db
from observation.schemas.observation import (
    ObservationCreate,
    ObservationUpdate,
    ObservationSchema,
)
from observation.services.observation_services import (
    create_observation,
    get_observation,
    update_observation,
    delete_observation,
)
from user.models.user import User

observation_router = APIRouter(prefix="/observations", tags=["Observations"])


@observation_router.post("/", response_model=ObservationCreate)
def create_new_observation(
    observation: ObservationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Crea una nueva observación para una orden.
    El usuario autenticado será el creador de la observación.
    """
    return create_observation(db, current_user.id, observation)


@observation_router.get("/{observation_id}", response_model=ObservationSchema)
def read_observation(
    observation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene una observación por su ID.
    """
    db_observation = get_observation(db, observation_id)
    if not db_observation:
        raise HTTPException(status_code=404, detail="Observación no encontrada")
    return db_observation


@observation_router.put("/{observation_id}", response_model=ObservationSchema)
def update_existing_observation(
    observation_id: int,
    observation: ObservationUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Actualiza una observación existente.
    """
    return update_observation(db, observation_id, observation)


@observation_router.delete("/{observation_id}")
def delete_existing_observation(
    observation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Elimina una observación existente.
    """
    return delete_observation(db, observation_id)
