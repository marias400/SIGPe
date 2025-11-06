from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    name: Optional[str] = None
    lastname: Optional[str] = None
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    name: Optional[str] = None
    lastname: Optional[str] = None
    password: Optional[str] = None
    email: EmailStr


class UserSchema(UserBase):
    id: int

    class Config:
        from_attributes = True
