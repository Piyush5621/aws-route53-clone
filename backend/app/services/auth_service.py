# Auth Service
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.models.user import User


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


class AuthService:

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(
        plain_password: str,
        hashed_password: str
    ) -> bool:

        return pwd_context.verify(
            plain_password,
            hashed_password
        )

    @staticmethod
    def get_user_by_email(
        db: Session,
        email: str
    ):

        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def register_user(
        db: Session,
        name: str,
        email: str,
        password: str
    ):

        existing_user = AuthService.get_user_by_email(
            db,
            email
        )

        if existing_user:
            raise ValueError(
                "User with this email already exists"
            )

        user = User(
            name=name,
            email=email,
            password_hash=AuthService.hash_password(password)
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def authenticate_user(
        db: Session,
        email: str,
        password: str
    ):

        user = AuthService.get_user_by_email(
            db,
            email
        )

        if not user:
            return None

        if not AuthService.verify_password(
            password,
            user.password_hash
        ):
            return None

        return user