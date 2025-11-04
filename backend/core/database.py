from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from core.config_loader import settings
from pathlib import Path

# Prefer SQLALCHEMY_DATABASE_URI, then DATABASE_URL, otherwise fallback to a local sqlite file
db_uri = None
if getattr(settings, "SQLALCHEMY_DATABASE_URI", None):
    db_uri = str(settings.SQLALCHEMY_DATABASE_URI)
elif getattr(settings, "DATABASE_URL", None):
    db_uri = str(settings.DATABASE_URL)
else:
    fallback_path = Path(__file__).resolve().parent / "dev.db"
    db_uri = f"sqlite:///{fallback_path}"

connect_args = {"check_same_thread": False} if db_uri.startswith("sqlite") else {}
engine = create_engine(db_uri, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

