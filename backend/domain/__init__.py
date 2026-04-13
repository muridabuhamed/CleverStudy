"""Domain models package initialization."""

from domain.user import (
    UserModel,
    UserCreate,
    UserLogin,
    UserResponse,
    UserStats
)
from domain.file import (
    FileModel,
    FileCreate,
    FileResponse,
    FileStatus,
    QuestionModel,
    ProcessingResult
)
from domain.quiz import (
    QuizAttemptModel,
    QuizAttemptCreate,
    QuizAttemptResponse,
    QuizAnswer,
    QuizAnswerResult,
    StudySessionCreate,
    StudyTimeResponse
)
from domain.flashcard import (
    FlashcardModel,
    FlashcardCreate,
    FlashcardResponse,
    FlashcardReviewModel,
    FlashcardReviewCreate,
    FlashcardReviewResponse,
    FlashcardDifficulty,
    FlashcardStats,
    FlashcardDeck
)
from domain.annotation import (
    HighlightModel,
    HighlightCreate,
    HighlightResponse,
    HighlightColor,
    AnnotationModel,
    AnnotationCreate,
    AnnotationUpdate,
    AnnotationResponse,
    BookmarkModel,
    BookmarkCreate,
    BookmarkResponse
)

__all__ = [
    # User models
    'UserModel',
    'UserCreate',
    'UserLogin',
    'UserResponse',
    'UserStats',
    # File models
    'FileModel',
    'FileCreate',
    'FileResponse',
    'FileStatus',
    'QuestionModel',
    'ProcessingResult',
    # Quiz models
    'QuizAttemptModel',
    'QuizAttemptCreate',
    'QuizAttemptResponse',
    'QuizAnswer',
    'QuizAnswerResult',
    'StudySessionCreate',
    'StudyTimeResponse',
    # Flashcard models
    'FlashcardModel',
    'FlashcardCreate',
    'FlashcardResponse',
    'FlashcardReviewModel',
    'FlashcardReviewCreate',
    'FlashcardReviewResponse',
    'FlashcardDifficulty',
    'FlashcardStats',
    'FlashcardDeck',
    # Annotation models
    'HighlightModel',
    'HighlightCreate',
    'HighlightResponse',
    'HighlightColor',
    'AnnotationModel',
    'AnnotationCreate',
    'AnnotationUpdate',
    'AnnotationResponse',
    'BookmarkModel',
    'BookmarkCreate',
    'BookmarkResponse'
]
