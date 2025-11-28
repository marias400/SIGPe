from sqlalchemy.orm import Session
from size.models.size import Size


def get_all_sizes(db: Session):
    """Obtiene todos los tamaños"""
    return db.query(Size).all()

