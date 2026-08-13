from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models

from app.routers.hosted_zones import router as hosted_zone_router
from app.routers.auth import router as auth_router
# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="AWS Route53 Clone API",
    description="Backend API for the AWS Route53 Clone assignment",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(hosted_zone_router)
# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AWS Route53 Clone API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok"
    }