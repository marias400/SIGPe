from sqlalchemy.orm import Session, joinedload
from auth.utils.auth_utils import get_password_hash
from user.models.user import User
from doctor.models.doctor import Doctor
from user.schemas.user import UserCreate


def get_users(db: Session):
    return db.query(User).filter(User.is_deleted == False).all()


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def user_is_doctor(db: Session, user_id: int):
    user = (
        db.query(Doctor)
        .join(User)
        .filter(Doctor.user_id == user_id, Doctor.is_verified == True)
        .first()
    )
    return user is not None


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email, User.is_deleted == False).first()


def create_user(db: Session, user: UserCreate):
    db_user = User(
        email=str(user.email),
        name=user.name,
        lastname=user.lastname,
        password=get_password_hash(user.password),
        user_type="cliente_particular",
    )
    if get_user_by_email(db, user.email):
        return None
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_update):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None

    if user_update.email is not None:
        db_user.email = user_update.email
    if user_update.name is not None:
        db_user.name = user_update.name
    if user_update.lastname is not None:
        db_user.lastname = user_update.lastname
    # if user_update.user_type is not None:
    #     db_user.user_type = user_update.user_type
    if user_update.password is not None:
        db_user.password = get_password_hash(user_update.password)

    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.is_active = False
        db_user.is_deleted = True
        db.commit()
    return
