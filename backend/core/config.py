"""
Core configuration module for the CleverStudy application.

This module centralizes all configuration management, environment variable
loading, and validation. It provides a single source of truth for all
application settings.
"""

import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field, validator
from functools import lru_cache


ROOT_DIR = Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Uses Pydantic for automatic validation and type conversion.
    Settings are cached after first load for performance.
    """
    
    # Application
    APP_NAME: str = "Smart Study Platform API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False, env="DEBUG")
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    
    # Server
    HOST: str = Field(default="0.0.0.0", env="HOST")
    PORT: int = Field(default=8000, env="PORT")
    
    # CORS
    ALLOWED_ORIGINS: str = Field(
        default="http://localhost:3000",
        env="ALLOWED_ORIGINS",
        description="Comma-separated list of allowed origins"
    )
    
    # Security
    JWT_SECRET: str = Field(
        default="dev-secret-change-in-production-12345678901234567890",
        env="JWT_SECRET",
        description="Secret key for JWT tokens. MUST be changed in production!"
    )
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_DAYS: int = Field(default=7, env="ACCESS_TOKEN_EXPIRE_DAYS")
    ADMIN_SECRET: str = Field(default="", env="ADMIN_SECRET")
    
    # Database
    DATA_DIR: Path = Field(
        default_factory=lambda: ROOT_DIR / "data",
        env="DATA_DIR"
    )
    DB_NAME: str = Field(default="smart_study_platform.db", env="DB_NAME")
    
    # File Upload
    UPLOADS_DIR: Path = Field(
        default_factory=lambda: ROOT_DIR / "uploads",
        env="UPLOADS_DIR"
    )
    MAX_UPLOAD_SIZE_MB: int = Field(default=50, env="MAX_UPLOAD_SIZE_MB")
    ALLOWED_EXTENSIONS: List[str] = Field(default=[".pdf"])
    
    # AI Service (Gemini)
    GEMINI_API_KEY: str = Field(
        default="",
        env="GEMINI_API_KEY",
        description="Google Gemini API key. Required for AI features to work."
    )
    GEMINI_MODELS: List[str] = Field(
        default=["gemini-2.5-flash", "gemini-1.5-flash"],
        description="List of AI models to try in order"
    )
    AI_MAX_CONTEXT_LENGTH: int = Field(
        default=20000,
        env="AI_MAX_CONTEXT_LENGTH",
        description="Maximum context length for AI processing"
    )
    AI_CHAT_CONTEXT_LENGTH: int = Field(
        default=15000,
        env="AI_CHAT_CONTEXT_LENGTH",
        description="Maximum context length for chat"
    )
    
    # PDF Processing
    PDF_MAX_PAGES: int = Field(
        default=100,
        env="PDF_MAX_PAGES",
        description="Maximum number of pages to process from a PDF"
    )
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    LOG_FORMAT: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        env="LOG_FORMAT"
    )
    LOG_DIR: Path = Field(
        default_factory=lambda: ROOT_DIR / "logs",
        env="LOG_DIR"
    )
    
    @validator("DATA_DIR", "UPLOADS_DIR", "LOG_DIR", pre=True)
    def ensure_path(cls, v):
        """Convert string paths to Path objects and create directories."""
        if isinstance(v, str):
            v = Path(v)
        if isinstance(v, Path):
            v.mkdir(parents=True, exist_ok=True)
        return v
    
    @validator("ALLOWED_ORIGINS")
    def split_origins(cls, v):
        """Split comma-separated origins into list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    @property
    def database_path(self) -> Path:
        """Get the full path to the database file."""
        return self.DATA_DIR / self.DB_NAME
    
    @property
    def max_upload_size_bytes(self) -> int:
        """Get max upload size in bytes."""
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    
    @property
    def cors_origins(self) -> List[str]:
        """Get CORS origins as a list."""
        if isinstance(self.ALLOWED_ORIGINS, list):
            return self.ALLOWED_ORIGINS
        return [self.ALLOWED_ORIGINS]
    
    @property
    def port(self) -> int:
        """Get server port."""
        return self.PORT
    
    @property
    def debug(self) -> bool:
        """Get debug mode."""
        return self.DEBUG
    
    @property
    def environment(self) -> str:
        """Get environment name."""
        return self.ENVIRONMENT
    
    @property
    def data_dir(self) -> Path:
        """Get data directory path."""
        return self.DATA_DIR
    
    @property
    def uploads_dir(self) -> Path:
        """Get uploads directory path."""
        return self.UPLOADS_DIR
    
    @property
    def log_dir(self) -> Path:
        """Get logs directory path."""
        return self.LOG_DIR
    
    @property
    def admin_secret(self) -> str:
        """Get admin secret."""
        return self.ADMIN_SECRET
    
    class Config:
        # Support root-level env files regardless of whether backend starts from
        # project root or backend directory.
        env_file = (
            str(ROOT_DIR / ".env.local"),
            str(ROOT_DIR / ".env"),
            ".env.local",
            ".env"
        )
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached application settings.
    
    This function is cached to avoid reloading settings on every call.
    The cache is cleared if the settings object needs to be reloaded.
    
    Returns:
        Settings: Application configuration object
    """
    return Settings()


# Convenience exports
settings = get_settings()
