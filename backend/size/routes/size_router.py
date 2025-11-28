from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from size.schemas.size import SizeSchema
from size.services.size_service import get_all_sizes

size_router = APIRouter(prefix="/sizes", tags=["Sizes"])


@size_router.get("/", response_model=list[SizeSchema])
def list_all_sizes(db: Session = Depends(get_db)):
    """
    Lista todos los tamaños disponibles.
    """
    return get_all_sizes(db)

