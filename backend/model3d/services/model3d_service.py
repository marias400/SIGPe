from sqlalchemy.orm import Session
from fastapi import HTTPException
from model3d.models.model3d import Model3D
from model3d.schemas.model3d import Model3DCreate, Model3DUpdate
from order.services.order_service import get_order


def create_model3d(db: Session, model3d: Model3DCreate):
    """
    Crea un nuevo modelo 3D asociado a una orden.
    Por ahora, solo se guarda la información del archivo en la base de datos.
    La lógica de almacenamiento físico (S3, etc.) se implementará en el futuro.
    """
    # Verificar que la orden existe
    order = get_order(db, model3d.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    # Crear el modelo 3D
    db_model3d = Model3D(
        order_id=model3d.order_id,
        file_name=model3d.file_name,
        file_format=model3d.file_format,
        file_size=model3d.file_size,
        file_path=model3d.file_path,
        s3_key=model3d.s3_key,
        s3_url=model3d.s3_url,
    )
    
    db.add(db_model3d)
    db.commit()
    db.refresh(db_model3d)
    
    return db_model3d


def get_model3d(db: Session, model3d_id: int):
    """Obtiene un modelo 3D por su ID"""
    return db.query(Model3D).filter(Model3D.id == model3d_id).first()


def get_models3d_by_order_id(db: Session, order_id: int):
    """Obtiene todos los modelos 3D de una orden"""
    # Verificar que la orden existe
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    return db.query(Model3D).filter(Model3D.order_id == order_id).all()


def get_all_models3d(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todos los modelos 3D con paginación"""
    return db.query(Model3D).offset(skip).limit(limit).all()


def update_model3d(db: Session, model3d_id: int, model3d_update: Model3DUpdate):
    """Actualiza un modelo 3D"""
    db_model3d = get_model3d(db, model3d_id)
    if not db_model3d:
        raise HTTPException(status_code=404, detail="Modelo 3D no encontrado")
    
    # Actualizar solo los campos proporcionados
    update_data = model3d_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_model3d, field, value)
    
    # TODO: Si se actualiza el archivo, aquí se implementaría la lógica de actualización en S3
    
    db.commit()
    db.refresh(db_model3d)
    
    return db_model3d


def delete_model3d(db: Session, model3d_id: int):
    """Elimina un modelo 3D"""
    db_model3d = get_model3d(db, model3d_id)
    if not db_model3d:
        raise HTTPException(status_code=404, detail="Modelo 3D no encontrado")
    
    # Eliminar el archivo de S3 si existe
    if db_model3d.s3_key:
        from model3d.services.s3_service import delete_file_from_s3
        delete_file_from_s3(db_model3d.s3_key)
    
    db.delete(db_model3d)
    db.commit()
    
    return {"message": "Modelo 3D eliminado exitosamente"}

