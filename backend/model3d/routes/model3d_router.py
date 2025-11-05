from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth.services.auth_service import get_current_active_user
from core.database import get_db
from model3d.schemas.model3d import Model3DCreate, Model3DSchema, Model3DUpdate
from model3d.services.model3d_service import (
    create_model3d,
    get_model3d,
    get_models3d_by_order_id,
    get_all_models3d,
    update_model3d,
    delete_model3d,
)
from order.services.order_service import get_order
from user.models.user import User

model3d_router = APIRouter(prefix="/models3d", tags=["3D Models"])


@model3d_router.post("/", response_model=Model3DSchema)
def create_new_model3d(
    model3d: Model3DCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Crea un nuevo modelo 3D asociado a una orden.
    Solo el propietario de la orden o un técnico puede crear modelos 3D.
    """
    # Verificar que la orden existe
    order = get_order(db, model3d.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    # Verificar permisos: solo el dueño de la orden o un técnico puede crear modelos 3D
    if order.user_id != current_user.id and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para crear modelos 3D para esta orden"
        )
    
    return create_model3d(db, model3d)


@model3d_router.get("/order/{order_id}", response_model=list[Model3DSchema])
def get_models3d_by_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene todos los modelos 3D de una orden específica.
    Solo el propietario de la orden o un técnico puede verlos.
    """
    # Verificar que la orden existe
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    # Verificar permisos
    if order.user_id != current_user.id and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para ver los modelos 3D de esta orden"
        )
    
    return get_models3d_by_order_id(db, order_id)


@model3d_router.get("/all", response_model=list[Model3DSchema])
def list_all_models3d(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Lista todos los modelos 3D del sistema.
    Solo los técnicos pueden ver todos los modelos.
    """
    if current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="Solo los técnicos pueden ver todos los modelos 3D"
        )
    
    return get_all_models3d(db, skip=skip, limit=limit)


@model3d_router.get("/{model3d_id}", response_model=Model3DSchema)
def get_model3d_detail(
    model3d_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Obtiene los detalles de un modelo 3D específico.
    Solo el propietario de la orden asociada o un técnico puede verlo.
    """
    db_model3d = get_model3d(db, model3d_id)
    if not db_model3d:
        raise HTTPException(status_code=404, detail="Modelo 3D no encontrado")
    
    # Verificar permisos: obtener la orden asociada
    order = get_order(db, db_model3d.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Orden asociada no encontrada")
    
    if order.user_id != current_user.id and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para ver este modelo 3D"
        )
    
    return db_model3d


@model3d_router.put("/{model3d_id}", response_model=Model3DSchema)
def update_model3d_detail(
    model3d_id: int,
    model3d_update: Model3DUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Actualiza un modelo 3D.
    Solo el propietario de la orden asociada o un técnico puede actualizarlo.
    """
    db_model3d = get_model3d(db, model3d_id)
    if not db_model3d:
        raise HTTPException(status_code=404, detail="Modelo 3D no encontrado")
    
    # Verificar permisos: obtener la orden asociada
    order = get_order(db, db_model3d.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Orden asociada no encontrada")
    
    if order.user_id != current_user.id and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para actualizar este modelo 3D"
        )
    
    return update_model3d(db, model3d_id, model3d_update)


@model3d_router.delete("/{model3d_id}")
def delete_model3d_detail(
    model3d_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Elimina un modelo 3D.
    Solo el propietario de la orden asociada o un técnico puede eliminarlo.
    """
    db_model3d = get_model3d(db, model3d_id)
    if not db_model3d:
        raise HTTPException(status_code=404, detail="Modelo 3D no encontrado")
    
    # Verificar permisos: obtener la orden asociada
    order = get_order(db, db_model3d.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Orden asociada no encontrada")
    
    if order.user_id != current_user.id and current_user.user_type != "tecnico":
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para eliminar este modelo 3D"
        )
    
    return delete_model3d(db, model3d_id)

