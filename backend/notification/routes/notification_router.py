from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth.services.auth_service import get_current_active_user
from core.database import get_db
from notification.schemas.notification import (
    NotificationSchema,
    NotificationCreate,
    NotificationUpdate,
)
from notification.services import (
    create_notification,
    get_notification,
    get_user_notifications,
    get_user_notifications_amount,
    update_notification,
    delete_notification,
)
from order.services.order_service import get_order
from user.models.user import User

notification_router = APIRouter(prefix="/notifications", tags=["Notifications"])


@notification_router.get("/all", response_model=list[NotificationSchema])
def get_all_notifications(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene todas las notificaciones.
    """
    if current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para ver las notificaciones de todos los usuarios",
        )
    return get_user_notifications(db, user_id)


@notification_router.get("/my-notifications", response_model=list[NotificationSchema])
def get_my_notifications(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene todas las notificaciones del usuario autenticado.
    """
    return get_user_notifications(db, current_user.id)


@notification_router.get("/my-notifications/count", response_model=int)
def get_my_notifications_count(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene la cantidad de notificaciones del usuario autenticado.
    """
    return get_user_notifications_amount(db, current_user.id)


@notification_router.post("/", response_model=NotificationCreate)
def create_new_notification(
    notification: NotificationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Crea una nueva notificación.
    El usuario autenticado será el propietario de la notificación.
    """
    if current_user.id != notification.user_id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para crear una notificación para otro usuario",
        )

    # Si hay order_id, verificar que la orden existe y pertenece al usuario
    if notification.order_id:
        db_order = get_order(db, notification.order_id)
        if not db_order:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        if db_order.user_id != current_user.id:
            raise HTTPException(
                status_code=403, detail="No tienes permiso para modificar esta orden"
            )

    return create_notification(db, notification)


@notification_router.put("/{notification_id}", response_model=NotificationUpdate)
def update_existing_notification(
    notification_id: int,
    notification_update: NotificationUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Actualiza una notificación existente.
    Solo el propietario de la notificación puede actualizarla.
    """
    db_notification = get_notification(db, notification_id)
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")

    if db_notification.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para actualizar esta notificación",
        )

    return update_notification(db, notification_id, notification_update)


@notification_router.delete("/{notification_id}")
def delete_existing_notification(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Elimina una notificación existente.
    Solo el propietario de la notificación puede eliminarla.
    """
    db_notification = get_notification(db, notification_id)
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")

    if db_notification.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para eliminar esta notificación",
        )

    return delete_notification(db, notification_id)
