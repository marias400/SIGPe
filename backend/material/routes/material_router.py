from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from material.schemas.material import MaterialSchema
from material.services.material_service import get_all_materials

material_router = APIRouter(prefix="/materials", tags=["Materials"])


@material_router.get("/", response_model=list[MaterialSchema])
def list_all_materials(db: Session = Depends(get_db)):
    """
    Lista todos los materiales disponibles.
    """
    return get_all_materials(db)

