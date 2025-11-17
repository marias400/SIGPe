from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from prosthesis.models.prosthesis import Prosthesis
from prosthesis.schemas.prosthesis import ProsthesisCreate, ProsthesisUpdate
from material.models.material import Material
from size.models.size import Size


def create_prosthesis(db: Session, prosthesis: ProsthesisCreate):
    """Crea una nueva prótesis con materiales y tamaños"""
    db_prosthesis = Prosthesis(
        speciality_id=prosthesis.speciality_id,
        name=prosthesis.name,
        description=prosthesis.description,
        base_price=prosthesis.base_price,
        img_url=prosthesis.img_url,
    )
    db.add(db_prosthesis)
    db.flush()  # Para obtener el ID antes del commit
    
    # Asignar materiales
    if prosthesis.material_ids:
        materials = db.query(Material).filter(Material.id.in_(prosthesis.material_ids)).all()
        db_prosthesis.materials = materials
    
    # Asignar tamaños
    if prosthesis.size_ids:
        sizes = db.query(Size).filter(Size.id.in_(prosthesis.size_ids)).all()
        db_prosthesis.sizes = sizes
    
    db.commit()
    db.refresh(db_prosthesis)
    # Recargar con relaciones para devolver datos completos
    return get_prosthesis(db, db_prosthesis.id)


def get_prosthesis(db: Session, prosthesis_id: int):
    """Obtiene una prótesis por su ID con relaciones cargadas"""
    return (
        db.query(Prosthesis)
        .options(
            joinedload(Prosthesis.materials),
            joinedload(Prosthesis.sizes),
        )
        .filter(Prosthesis.id == prosthesis_id)
        .first()
    )


def get_prostheses_by_speciality(db: Session, speciality_id: int):
    """Obtiene todas las prótesis de una especialidad"""
    return db.query(Prosthesis).filter(Prosthesis.speciality_id == speciality_id).all()


def get_all_prostheses(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todas las prótesis"""
    return db.query(Prosthesis).offset(skip).limit(limit).all()


def update_prosthesis(db: Session, prosthesis_id: int, prosthesis_update: ProsthesisUpdate):
    """Actualiza una prótesis y sus relaciones con materiales y tamaños"""
    db_prosthesis = get_prosthesis(db, prosthesis_id)
    if not db_prosthesis:
        raise HTTPException(status_code=404, detail="Prótesis no encontrada")

    # Actualizar campos básicos
    update_data = prosthesis_update.model_dump(exclude_unset=True, exclude={'material_ids', 'size_ids'})
    for field, value in update_data.items():
        setattr(db_prosthesis, field, value)

    # Actualizar materiales si se proporcionan
    if prosthesis_update.material_ids is not None:
        materials = db.query(Material).filter(Material.id.in_(prosthesis_update.material_ids)).all()
        db_prosthesis.materials = materials

    # Actualizar tamaños si se proporcionan
    if prosthesis_update.size_ids is not None:
        sizes = db.query(Size).filter(Size.id.in_(prosthesis_update.size_ids)).all()
        db_prosthesis.sizes = sizes

    db.commit()
    db.refresh(db_prosthesis)
    # Recargar con relaciones para devolver datos completos
    return get_prosthesis(db, prosthesis_id)


def delete_prosthesis(db: Session, prosthesis_id: int):
    """Elimina una prótesis"""
    db_prosthesis = get_prosthesis(db, prosthesis_id)
    if not db_prosthesis:
        raise HTTPException(status_code=404, detail="Prótesis no encontrada")

    db.delete(db_prosthesis)
    db.commit()
    return {"message": "Prótesis eliminada exitosamente"}

