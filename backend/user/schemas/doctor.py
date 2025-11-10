from typing import Optional
from user.schemas.user import UserSchema


class DoctorBase(UserSchema):
    user_id: int
    license_number: Optional[str] = None
    institution_name: Optional[str] = None
    speciality: Optional[str] = None
    is_verified: Optional[bool] = False


class DoctorCreate(DoctorBase):
    pass


class DoctorSchema(DoctorBase):
    pass
