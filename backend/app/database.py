# Database Configuration — Simple & Persistent SQLite Setup
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Database URL pointing to local SQLite file
DATABASE_URL = "sqlite:///./database.db"

# 2. Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# 3. Create database session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 4. Base class for database models
Base = declarative_base()

# 5. Dependency generator to get database session for API requests
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()