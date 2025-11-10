from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from speciality.services.speciality_service import get_full_catalog

speciality_router = APIRouter(prefix="/specialities", tags=["specialities"])


@speciality_router.get("/full_catalog")
def get_full_catalog_endpoint(db: Session = Depends(get_db)):

    try:
        catalog = get_full_catalog(db)
        return catalog
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
