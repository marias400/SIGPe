from sqlalchemy.orm import Session
from fastapi import HTTPException
from order.models.order import Order
from order.schemas.order import OrderCreate, OrderUpdate
from user.services.user_service import get_user


def create_order(db: Session, user_id: int, order: OrderCreate):
    """
    Crea una nueva orden de impresión.
    """
    # Verificar que el usuario existe
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Crear la orden
    db_order = Order(
        user_id=user_id,
        is_medical=order.is_medical,
        has_design=order.has_design,
        processing_level=order.processing_level,
        current_stage=order.current_stage,
        meeting_date=order.meeting_date,
        specification=order.specification,
        print_type=order.print_type,
        printing_material=order.printing_material,
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    return db_order


def get_order(db: Session, order_id: int):
    """Obtiene una orden por su ID"""
    return db.query(Order).filter(Order.id == order_id).first()


def get_orders_by_user_id(db: Session, user_id: int):
    """Obtiene todas las órdenes de un usuario"""
    return db.query(Order).filter(Order.user_id == user_id).all()


def get_all_orders(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todas las órdenes con paginación"""
    return db.query(Order).offset(skip).limit(limit).all()


def update_order(db: Session, order_id: int, order_update: OrderUpdate):
    """Actualiza una orden"""
    db_order = get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    # Actualizar solo los campos proporcionados
    update_data = order_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_order, field, value)
    
    db.commit()
    db.refresh(db_order)
    
    return db_order


def delete_order(db: Session, order_id: int):
    """Elimina una orden"""
    db_order = get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    db.delete(db_order)
    db.commit()
    
    return {"message": "Orden eliminada exitosamente"}

