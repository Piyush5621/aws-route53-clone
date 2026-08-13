import os


SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "route53-clone-development-secret-change-this"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60