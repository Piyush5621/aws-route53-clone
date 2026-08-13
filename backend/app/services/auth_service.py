# Auth Service
import bcrypt
from sqlalchemy.orm import Session
from app.models.user import User

class AuthService:

    @staticmethod
    def hash_password(password: str) -> str:
        pwd_bytes = password.encode('utf-8')[:72]
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

    @staticmethod
    def verify_password(
        plain_password: str,
        hashed_password: str
    ) -> bool:
        try:
            pwd_bytes = plain_password.encode('utf-8')[:72]
            hash_bytes = hashed_password.encode('utf-8')
            return bcrypt.checkpw(pwd_bytes, hash_bytes)
        except Exception:
            return plain_password == hashed_password

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