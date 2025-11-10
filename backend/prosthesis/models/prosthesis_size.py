from sqlalchemy import Table, Column, Integer, ForeignKey
from core.database import Base

prosthesis_size = Table(
    "prosthesis_size",
    Base.metadata,
    Column("prosthesis_id", Integer, ForeignKey("prostheses.id"), primary_key=True),
    Column("size_id", Integer, ForeignKey("sizes.id"), primary_key=True),
)
