"""
Custom exception classes for the CleverStudy application.

Defines a hierarchy of exceptions that provide meaningful error messages
and proper HTTP status codes for API responses.
"""

from typing import Optional, Dict, Any


class CleverStudyException(Exception):
    """
    Base exception class for all application exceptions.
    
    Attributes:
        message: Human-readable error message
        status_code: HTTP status code to return
        details: Optional dictionary with additional error context
    """
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert exception to dictionary for JSON serialization."""
        return {
            "error": self.__class__.__name__,
            "message": self.message,
            "details": self.details
        }


# Authentication & Authorization Exceptions
class AuthenticationError(CleverStudyException):
    """Raised when authentication fails."""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, status_code=401)


class AuthorizationError(CleverStudyException):
    """Raised when user doesn't have permission for an action."""
    def __init__(self, message: str = "Access denied"):
        super().__init__(message, status_code=403)


class InvalidTokenError(AuthenticationError):
    """Raised when JWT token is invalid or expired."""
    def __init__(self, message: str = "Invalid or expired token"):
        super().__init__(message)


# Resource Exceptions
class ResourceNotFoundError(CleverStudyException):
    """Raised when a requested resource doesn't exist."""
    def __init__(self, resource: str, resource_id: str):
        message = f"{resource} with ID '{resource_id}' not found"
        super().__init__(message, status_code=404)


class ResourceAlreadyExistsError(CleverStudyException):
    """Raised when trying to create a resource that already exists."""
    def __init__(self, resource: str, identifier: str):
        message = f"{resource} with identifier '{identifier}' already exists"
        super().__init__(message, status_code=409)


# Validation Exceptions
class ValidationError(CleverStudyException):
    """Raised when input validation fails."""
    def __init__(self, message: str, field: Optional[str] = None):
        details = {"field": field} if field else {}
        super().__init__(message, status_code=400, details=details)


class FileValidationError(ValidationError):
    """Raised when file validation fails."""
    def __init__(self, message: str):
        super().__init__(message)


# File Processing Exceptions
class FileProcessingError(CleverStudyException):
    """Raised when file processing fails."""
    def __init__(self, message: str = "Failed to process file"):
        super().__init__(message, status_code=500)


class PDFExtractionError(FileProcessingError):
    """Raised when PDF text extraction fails."""
    def __init__(self, message: str = "Failed to extract text from PDF"):
        super().__init__(message)


# AI Service Exceptions
class AIServiceError(CleverStudyException):
    """Raised when AI service encounters an error."""
    def __init__(self, message: str = "AI service error"):
        super().__init__(message, status_code=500)


class AIQuotaExceededError(AIServiceError):
    """Raised when AI API quota is exceeded."""
    def __init__(self, message: str = "AI quota exceeded. Please try again later."):
        super().__init__(message, status_code=429)


class AIResponseParsingError(AIServiceError):
    """Raised when AI response cannot be parsed."""
    def __init__(self, message: str = "Failed to parse AI response"):
        super().__init__(message)


# Database Exceptions
class DatabaseError(CleverStudyException):
    """Raised when database operations fail."""
    def __init__(self, message: str = "Database operation failed"):
        super().__init__(message, status_code=500)


class DatabaseConnectionError(DatabaseError):
    """Raised when database connection fails."""
    def __init__(self, message: str = "Failed to connect to database"):
        super().__init__(message)


# Business Logic Exceptions
class BusinessLogicError(CleverStudyException):
    """Raised when business logic validation fails."""
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message, status_code=status_code)


class QuizNotCompletedError(BusinessLogicError):
    """Raised when quiz operation requires completion but quiz isn't done."""
    def __init__(self, message: str = "Quiz must be completed first"):
        super().__init__(message)


class InsufficientDataError(BusinessLogicError):
    """Raised when there isn't enough data to perform an operation."""
    def __init__(self, message: str = "Insufficient data for this operation"):
        super().__init__(message)
