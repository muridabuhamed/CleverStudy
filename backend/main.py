import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from core.config import get_settings
from core.logging import setup_logging, get_logger
from database import init_db
from features.auth import router as auth_router
from features.files import router as files_router
from features.quiz import router as quiz_router
from features.flashcards import router as flashcards_router
from features.annotations import router as annotations_router
from routers import admin  # Keep admin in routers for now

# Initialize settings and logging
settings = get_settings()
setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting CleverStudy API...")
    
    # Ensure directories exist
    settings.data_dir.mkdir(exist_ok=True)
    settings.uploads_dir.mkdir(exist_ok=True)
    settings.log_dir.mkdir(exist_ok=True)
    
    # Initialize database
    init_db()
    logger.info("Database initialized")
    
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down CleverStudy API...")


app = FastAPI(
    title="CleverStudy API",
    description="AI-powered study platform with PDF analysis, quizzes, and flashcards",
    version="2.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/uploads", StaticFiles(directory=str(settings.uploads_dir)), name="uploads")

# Routers
app.include_router(auth_router, tags=["Authentication"])
app.include_router(files_router, tags=["Files"])
app.include_router(quiz_router, tags=["Quiz"])
app.include_router(flashcards_router, tags=["Flashcards"])
app.include_router(admin.router, tags=["Admin"])
app.include_router(annotations_router, tags=["Annotations"])


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "environment": settings.environment,
        "version": "2.0.0"
    }


@app.get("/")
def root():
    """Root endpoint with API information."""
    return {
        "name": "CleverStudy API",
        "version": "2.0.0",
        "description": "AI-powered study platform",
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )
