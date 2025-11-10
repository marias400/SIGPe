from sqlalchemy import Table, Column, Integer, ForeignKey
from core.database import Base

prosthesis_material = Table(
    "prosthesis_material",
    Base.metadata,
    Column("prosthesis_id", Integer, ForeignKey("prostheses.id"), primary_key=True),
    Column("material_id", Integer, ForeignKey("materials.id"), primary_key=True),
)
