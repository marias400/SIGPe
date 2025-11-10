from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth.services.auth_service import get_current_active_user
from core.database import get_db
from order.schemas.order import OrderCreate, OrderSchema, OrderUpdate
from order.schemas.medical_order import MedicalOrderCreate, MedicalOrderSchema
from order.services.order_service import (
    create_order,
    get_order,
    get_orders_by_user_id,
    get_all_orders,
    update_order,
    delete_order,
    create_medical_order,
)
from user.models.user import User

order_router = APIRouter(prefix="/orders", tags=["Orders"])


@order_router.post("/create", response_model=OrderSchema)
def create_new_order(
    order: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Crea una nueva orden de impresión.
    El usuario autenticado será el propietario de la orden.
    """
    return create_order(db, current_user.id, order)


@order_router.post("/create-medical", response_model=MedicalOrderSchema)
def create_new_medical_order(
    medical_order: MedicalOrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Crea una nueva orden médica.
    El usuario autenticado será el propietario de la orden médica.
    """
    return create_medical_order(db, current_user.id, medical_order)


# @order_router.get("/", response_model=list[OrderSchema])
# def list_orders(
#     skip: int = 0,
#     limit: int = 100,
#     current_user: User = Depends(get_current_active_user),
#     db: Session = Depends(get_db),
# ):
#     """
#     Lista todas las órdenes.
#     Por defecto, solo muestra las órdenes del usuario autenticado.
#     """
#     # Por defecto, mostrar solo las órdenes del usuario actual
#     return get_orders_by_user_id(db, current_user.id)


@order_router.get("/all", response_model=list[OrderSchema])
def list_all_orders(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Lista todas las órdenes del sistema.
    Requiere autenticación.
    """
    # Si es técnico, puede ver las ordenes de todos los usuarios
    if current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403, detail="No tienes permiso para ver esta información"
        )

    return get_all_orders(db, skip=skip, limit=limit)


@order_router.get("/my-orders", response_model=list[OrderSchema])
def get_my_orders(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene todas las órdenes del usuario autenticado.
    """
    return get_orders_by_user_id(db, current_user.id)


@order_router.get("/{order_id}", response_model=OrderSchema)
def get_order_detail(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene los detalles de una orden específica.
    Solo el propietario de la orden o un técnico puede verla.
    """
    db_order = get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")

    # Verificar permisos: solo el dueño o un técnico puede ver la orden
    if db_order.user_id != current_user.id and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403, detail="No tienes permiso para ver esta orden"
        )

    return db_order


@order_router.put("/{order_id}", response_model=OrderSchema)
def update_order_detail(
    order_id: int,
    order_update: OrderUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Actualiza una orden.
    El propietario puede actualizar ciertos campos, los técnicos pueden actualizar todos.
    """
    db_order = get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")

    # Verificar permisos
    if db_order.user_id != current_user.id and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403, detail="No tienes permiso para actualizar esta orden"
        )

    # Si es el propietario (no técnico), no puede modificar ciertos campos técnicos
    if db_order.user_id == current_user.id and current_user.user_type != "tecnico":
        # El propietario no puede modificar technician_id, processing_level, current_stage
        if order_update.technician_id is not None:
            raise HTTPException(
                status_code=403, detail="No puedes asignar un técnico a tu propia orden"
            )
        # Puede actualizar otros campos como specification, delivery_date, etc.

    return update_order(db, order_id, order_update)


@order_router.delete("/{order_id}")
def delete_order_detail(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Elimina una orden.
    Solo el propietario de la orden puede eliminarla.
    """
    db_order = get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")

    # Solo el propietario puede eliminar la orden
    if db_order.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="No tienes permiso para eliminar esta orden"
        )

    return delete_order(db, order_id)
