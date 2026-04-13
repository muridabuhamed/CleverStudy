"""Core package initialization."""

from core.config import settings, get_settings
from core.logging import get_logger, setup_logging
from core.exceptions import (
    CleverStudyException,
    AuthenticationError,
    AuthorizationError,
    ResourceNotFoundError,
    ValidationError,
    FileProcessingError,
    AIServiceError,
    AIQuotaExceededError,
    DatabaseError
)

__all__ = [
    'settings',
    'get_settings',
    'get_logger',
    'setup_logging',
    'CleverStudyException',
    'AuthenticationError',
    'AuthorizationError',
    'ResourceNotFoundError',
    'ValidationError',
    'FileProcessingError',
    'AIServiceError',
    'AIQuotaExceededError',
    'DatabaseError'
]
