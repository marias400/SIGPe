from sqlalchemy.orm import Session
from typing import Optional
from fastapi import HTTPException
from observation.models.observation import Observation
from observation.schemas.observation import ObservationCreate, ObservationUpdate
from user.services.user_service import get_user
from order.services.order_service import get_order


def comment():
    """
    hay que verificar que logica de negocio se va a querer usar aca.
    originalmente se supone que las observaciones son hechas unicamente por el tecnico
    """
    pass


def create_observation(db: Session, user_id: int, observation: ObservationCreate):
    """
    Crea una nueva observación para una orden.
    """
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    order = get_order(db, observation.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")

    db_observation = Observation(
        user_id=user_id,
        order_id=observation.order_id,
        type=observation.type,
        comment=observation.comment,
    )

    db.add(db_observation)
    db.commit()
    db.refresh(db_observation)

    return db_observation


def get_observation(db: Session, observation_id: int):
    """Obtiene una observación por su ID"""
    return db.query(Observation).filter(Observation.id == observation_id).first()


def update_observation(
    db: Session, observation_id: int, observation: ObservationUpdate
):
    """Actualiza una observación existente"""
    db_observation = get_observation(db, observation_id)
    if not db_observation:
        raise HTTPException(status_code=404, detail="Observación no encontrada")

    if observation.type is not None:
        db_observation.type = observation.type
    if observation.comment is not None:
        db_observation.comment = observation.comment

    db.commit()
    db.refresh(db_observation)
    return db_observation


def delete_observation(db: Session, observation_id: int):
    """Elimina una observación por su ID"""
    db_observation = get_observation(db, observation_id)
    if not db_observation:
        raise HTTPException(status_code=404, detail="Observación no encontrada")
    db.delete(db_observation)
    db.commit()
    return {"message": "Observación eliminada exitosamente"}
