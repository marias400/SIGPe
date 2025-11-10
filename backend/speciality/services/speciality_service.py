from sqlalchemy.orm import Session, joinedload
from speciality.models import Speciality
from prosthesis.models import Prosthesis
from material.models import Material
from size.models import Size


def get_full_catalog(db: Session):
    # Trae especialidades con prótesis, materiales y talles en una sola query
    # Importar Material y Size asegura que estén registrados en SQLAlchemy
    # para que pueda resolver las relaciones por nombre
    query = (
        db.query(Speciality)
        .options(
            joinedload(Speciality.prostheses).joinedload(Prosthesis.materials),
            joinedload(Speciality.prostheses).joinedload(Prosthesis.sizes),
        )
        .order_by(Speciality.name)
    )
    return query.all()
