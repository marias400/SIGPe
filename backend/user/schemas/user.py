from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    lastname: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserSchema(UserBase):
    id: int

    class Config:
        from_attributes = True
