"""Repository package initialization."""

from repository.base import BaseRepository
from repository.user_repository import UserRepository
from repository.file_repository import FileRepository
from repository.quiz_repository import QuizRepository, StudySessionRepository
from repository.flashcard_repository import FlashcardRepository, FlashcardReviewRepository
from repository.annotation_repository import (
    HighlightRepository,
    AnnotationRepository,
    BookmarkRepository
)

__all__ = [
    'BaseRepository',
    'UserRepository',
    'FileRepository',
    'QuizRepository',
    'StudySessionRepository',
    'FlashcardRepository',
    'FlashcardReviewRepository',
    'HighlightRepository',
    'AnnotationRepository',
    'BookmarkRepository'
]
