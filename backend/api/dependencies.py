"""
API dependencies.

This module provides dependency injection for FastAPI routes.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated

from core.config import get_settings
from core.logging import get_logger
from core.exceptions import CleverStudyException, AuthenticationError

# Repository imports
from repository.user_repository import UserRepository
from repository.file_repository import FileRepository
from repository.quiz_repository import QuizRepository, StudySessionRepository
from repository.flashcard_repository import FlashcardRepository, FlashcardReviewRepository
from repository.annotation_repository import (
    HighlightRepository,
    AnnotationRepository,
    BookmarkRepository
)

# Service imports
from services.auth_service import AuthService
from services.file_service import FileService
from services.quiz_service import QuizService, StudySessionService
from services.flashcard_service import FlashcardService
from services.annotation_service import (
    HighlightService,
    AnnotationService,
    BookmarkService
)
from services.ai.gemini_client import GeminiClient
from services.ai.pdf_processor import PdfProcessor

logger = get_logger(__name__)
settings = get_settings()
security = HTTPBearer()


# ==================================================
# Authentication Dependency
# ==================================================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: 'AuthService' = Depends(lambda: get_auth_service())
) -> str:
    """
    Extract and verify JWT token, return user ID.
    
    This dependency is used on protected routes.
    
    Args:
        credentials: Bearer token from Authorization header
        auth_service: Auth service instance
        
    Returns:
        User ID from verified token
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    token = credentials.credentials
    
    try:
        user_id = auth_service.verify_token(token)
        return user_id
        
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )


# ==================================================
# Repository Dependencies
# ==================================================

def get_user_repository() -> UserRepository:
    """Get user repository instance."""
    return UserRepository()


def get_file_repository() -> FileRepository:
    """Get file repository instance."""
    return FileRepository()


def get_quiz_repository() -> QuizRepository:
    """Get quiz repository instance."""
    return QuizRepository()


def get_study_session_repository() -> StudySessionRepository:
    """Get study session repository instance."""
    return StudySessionRepository()


def get_flashcard_repository() -> FlashcardRepository:
    """Get flashcard repository instance."""
    return FlashcardRepository()


def get_flashcard_review_repository() -> FlashcardReviewRepository:
    """Get flashcard review repository instance."""
    return FlashcardReviewRepository()


def get_highlight_repository() -> HighlightRepository:
    """Get highlight repository instance."""
    return HighlightRepository()


def get_annotation_repository() -> AnnotationRepository:
    """Get annotation repository instance."""
    return AnnotationRepository()


def get_bookmark_repository() -> BookmarkRepository:
    """Get bookmark repository instance."""
    return BookmarkRepository()


# ==================================================
# Service Dependencies
# ==================================================

def get_auth_service(
    user_repo: UserRepository = Depends(get_user_repository)
) -> AuthService:
    """Get auth service with dependencies."""
    return AuthService(user_repo)


def get_file_service(
    file_repo: FileRepository = Depends(get_file_repository),
    user_repo: UserRepository = Depends(get_user_repository)
) -> FileService:
    """Get file service with dependencies."""
    return FileService(file_repo, user_repo)


def get_quiz_service(
    quiz_repo: QuizRepository = Depends(get_quiz_repository),
    file_repo: FileRepository = Depends(get_file_repository)
) -> QuizService:
    """Get quiz service with dependencies."""
    return QuizService(quiz_repo, file_repo)


def get_study_session_service(
    session_repo: StudySessionRepository = Depends(get_study_session_repository),
    file_repo: FileRepository = Depends(get_file_repository)
) -> StudySessionService:
    """Get study session service with dependencies."""
    return StudySessionService(session_repo, file_repo)


def get_flashcard_service(
    flashcard_repo: FlashcardRepository = Depends(get_flashcard_repository),
    review_repo: FlashcardReviewRepository = Depends(get_flashcard_review_repository),
    file_repo: FileRepository = Depends(get_file_repository)
) -> FlashcardService:
    """Get flashcard service with dependencies."""
    return FlashcardService(flashcard_repo, review_repo, file_repo)


def get_highlight_service(
    highlight_repo: HighlightRepository = Depends(get_highlight_repository),
    file_repo: FileRepository = Depends(get_file_repository)
) -> HighlightService:
    """Get highlight service with dependencies."""
    return HighlightService(highlight_repo, file_repo)


def get_annotation_service(
    annotation_repo: AnnotationRepository = Depends(get_annotation_repository),
    file_repo: FileRepository = Depends(get_file_repository)
) -> AnnotationService:
    """Get annotation service with dependencies."""
    return AnnotationService(annotation_repo, file_repo)


def get_bookmark_service(
    bookmark_repo: BookmarkRepository = Depends(get_bookmark_repository),
    file_repo: FileRepository = Depends(get_file_repository)
) -> BookmarkService:
    """Get bookmark service with dependencies."""
    return BookmarkService(bookmark_repo, file_repo)


def get_gemini_client() -> GeminiClient:
    """Get Gemini AI client."""
    try:
        return GeminiClient()
    except CleverStudyException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initialize AI service"
        )


def get_pdf_processor() -> PdfProcessor:
    """Get PDF processor."""
    return PdfProcessor()


# ==================================================
# Type Aliases for Cleaner Route Signatures
# ==================================================

CurrentUser = Annotated[str, Depends(get_current_user)]
UserRepo = Annotated[UserRepository, Depends(get_user_repository)]
FileRepo = Annotated[FileRepository, Depends(get_file_repository)]
AuthServ = Annotated[AuthService, Depends(get_auth_service)]
FileServ = Annotated[FileService, Depends(get_file_service)]
QuizServ = Annotated[QuizService, Depends(get_quiz_service)]
StudySessionServ = Annotated[StudySessionService, Depends(get_study_session_service)]
FlashcardServ = Annotated[FlashcardService, Depends(get_flashcard_service)]
HighlightServ = Annotated[HighlightService, Depends(get_highlight_service)]
AnnotationServ = Annotated[AnnotationService, Depends(get_annotation_service)]
BookmarkServ = Annotated[BookmarkService, Depends(get_bookmark_service)]
GeminiClient_ = Annotated[GeminiClient, Depends(get_gemini_client)]
PdfProc = Annotated[PdfProcessor, Depends(get_pdf_processor)]


# ==================================================
# Exception Handler Helper
# ==================================================

def handle_service_exception(e: Exception) -> HTTPException:
    """
    Convert service exception to HTTP exception.
    
    Args:
        e: Exception from service layer
        
    Returns:
        HTTPException with appropriate status code
    """
    if isinstance(e, CleverStudyException):
        return HTTPException(
            status_code=e.status_code,
            detail=e.message
        )
    
    logger.error(f"Unexpected error: {e}", exc_info=True)
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="An unexpected error occurred"
    )
