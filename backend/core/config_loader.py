from core.config import Settings
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator
from typing import List, Optional, Union
import secrets
import json
SQLALCHEMY_DATABASE_URL = "SQLALCHEMY_DATABASE_URL = sqlite:///./backend/sigpe.db"

class Settings(BaseSettings):
    # --- CORS ---
    # accept either a list or a comma/JSON string from env
    BACKEND_CORS_ORIGINS: List[str] | str = Field(
        default_factory=lambda: [
            "http://localhost:3306",
            "http://128.0.0.1:3306",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:8000",
            "http://127.0.0.1:8000"]
    )

    # --- Auth/JWT ---
    JWT_SECRET_KEY: str = Field(default_factory=lambda: secrets.token_urlsafe(32))
    JWT_ALGORITHM: str = "HS256"

    # allow reading from .env
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def _parse_cors(cls, v):
        # If env provides a string, accept either JSON array or comma-separated list
        if v is None:
            return v
        if isinstance(v, str):
            s = v.strip()
            if not s:
                return []
            if s.startswith("[") and s.endswith("]"):
                try:
                    return json.loads(s)
                except Exception:
                    pass
            return [item.strip() for item in s.split(",") if item.strip()]
        return v

settings = Settings()
