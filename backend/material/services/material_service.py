from sqlalchemy.orm import Session
from material.models.material import Material


def get_all_materials(db: Session):
    """Obtiene todos los materiales"""
    return db.query(Material).all()

