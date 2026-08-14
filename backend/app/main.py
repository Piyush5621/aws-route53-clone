# Main FastAPI Application Entrypoint — Clean & Readable Setup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, SessionLocal
from app import models
from app.seed import seed_demo_data

# Import modular API routers
from app.routers.hosted_zones import router as hosted_zone_router
from app.routers.auth import router as auth_router
from app.routers.records import router as records_router

# 1. Automatically create database tables if they don't exist & seed demo data
Base.metadata.create_all(bind=engine)
with SessionLocal() as db_session:
    seed_demo_data(db_session)

# 2. Create FastAPI application instance
app = FastAPI(
    title="AWS Route53 Clone API",
    description="Simple, clean backend API for AWS Route 53 Clone",
    version="1.0.0"
)

# 3. Include API endpoints
app.include_router(auth_router)
app.include_router(hosted_zone_router)
app.include_router(records_router)

# 4. Configure CORS middleware so Vercel & localhost frontend can communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://aws-route53-clone-murex.vercel.app",
        "https://aws-route53-clone.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Health Check & Root Endpoints
@app.get("/")
def root():
    return {"message": "AWS Route53 Clone API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}