from sqlalchemy.orm import Session
from fastapi import HTTPException
from notification.models.notification import Notification
from notification.schemas.notification import (
    NotificationCreate,
    NotificationUpdate,
)


def create_notification(db: Session, notification: NotificationCreate):
    """Crea una nueva notificación"""
    db_notification = Notification(
        user_id=notification.user_id,
        order_id=notification.order_id if notification.order_id else None,
        message=notification.message,
        type=notification.type,
        current_stage=notification.current_stage,
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def get_notification(db: Session, notification_id: int):
    """Obtiene una notificación por su ID"""
    return db.query(Notification).filter(Notification.id == notification_id).first()


def get_user_notifications(db: Session, user_id: int):
    """Obtiene todas las notificaciones de un usuario"""
    return db.query(Notification).filter(Notification.user_id == user_id).all()


def get_user_notifications_amount(db: Session, user_id: int):
    """Obtiene la cantidad de notificaciones no leídas de un usuario"""
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .count()
    )


def update_notification(
    db: Session, notification_id: int, notification: NotificationUpdate
):
    """Actualiza una notificación"""
    db_notification = get_notification(db, notification_id)
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")

    if notification.is_read is not None:
        db_notification.is_read = notification.is_read

    db.commit()
    db.refresh(db_notification)
    return db_notification


def delete_notification(db: Session, notification_id: int):
    """Elimina una notificación"""
    db_notification = get_notification(db, notification_id)
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")

    db.delete(db_notification)
    db.commit()
    return {"detail": "Notificación eliminada exitosamente"}
