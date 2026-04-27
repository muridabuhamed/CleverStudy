"""
Flashcard domain models.

This module contains Pydantic models for flashcards and spaced repetition.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum


class FlashcardDifficulty(str, Enum):
    """Spaced repetition difficulty levels mapped to SM-2 quality scores."""
    EASY = "easy"    # Quality 5
    GOOD = "good"    # Quality 4
    HARD = "hard"    # Quality 3
    AGAIN = "again"  # Quality 0-2


class FlashcardModel(BaseModel):
    """
    Flashcard entity from the database.
    
    Represents a question-answer pair with spaced repetition (SRS) metadata.
    """
    id: str = Field(..., description="Unique flashcard identifier")
    file_id: str = Field(..., description="Associated file ID")
    question: str = Field(..., min_length=1, description="Flashcard question")
    answer: str = Field(..., min_length=1, description="Flashcard answer")
    created_at: datetime = Field(default_factory=datetime.now, description="Creation timestamp")
    
    # SRS Metadata
    next_review_at: datetime = Field(default_factory=datetime.now, description="Next scheduled review")
    interval: int = Field(default=0, description="Current interval in days")
    ease_factor: float = Field(default=2.5, description="SM-2 ease factor")
    repetitions: int = Field(default=0, description="Successful review streak")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "fc-123",
                "file_id": "file-456",
                "question": "What is photosynthesis?",
                "answer": "The process by which plants convert light energy into chemical energy",
                "created_at": "2024-01-15T10:30:00",
                "next_review_at": "2024-01-16T10:30:00",
                "interval": 1,
                "ease_factor": 2.5,
                "repetitions": 1
            }
        }


class FlashcardCreate(BaseModel):
    """Data required to create a flashcard."""
    file_id: str = Field(..., description="File to associate with")
    question: str = Field(..., min_length=1, max_length=1000, description="Question text")
    answer: str = Field(..., min_length=1, max_length=2000, description="Answer text")
    
    @field_validator('question', 'answer')
    @classmethod
    def validate_not_empty(cls, v: str) -> str:
        """Ensure question and answer are not just whitespace."""
        if not v.strip():
            raise ValueError("Field cannot be empty or whitespace only")
        return v.strip()


class FlashcardResponse(BaseModel):
    """Flashcard data returned to client."""
    id: str
    file_id: str
    question: str
    answer: str
    created_at: datetime


class FlashcardReviewModel(BaseModel):
    """
    Flashcard review entity from the database.
    
    Tracks user's spaced repetition performance.
    """
    id: str = Field(..., description="Unique review identifier")
    user_id: str = Field(..., description="User who reviewed")
    flashcard_id: str = Field(..., description="Flashcard that was reviewed")
    difficulty: FlashcardDifficulty = Field(..., description="User's difficulty rating")
    reviewed_at: datetime = Field(default_factory=datetime.now, description="Review timestamp")
    
    class Config:
        from_attributes = True
        use_enum_values = True


class FlashcardReviewCreate(BaseModel):
    """Data required to record a flashcard review."""
    flashcard_id: str = Field(..., description="Flashcard being reviewed")
    difficulty: FlashcardDifficulty = Field(..., description="How difficult was it?")
    
    class Config:
        use_enum_values = True


class FlashcardReviewResponse(BaseModel):
    """Review data returned to client."""
    id: str
    flashcard_id: str
    difficulty: FlashcardDifficulty
    reviewed_at: datetime


class FlashcardStats(BaseModel):
    """
    Statistics for a user's flashcard performance.
    
    Useful for spaced repetition algorithms.
    """
    total_cards: int = Field(default=0, description="Total flashcards available")
    reviewed_count: int = Field(default=0, description="Cards reviewed at least once")
    easy_count: int = Field(default=0, description="Cards marked easy")
    good_count: int = Field(default=0, description="Cards marked good")
    hard_count: int = Field(default=0, description="Cards marked hard")
    again_count: int = Field(default=0, description="Cards marked again")
    last_review: Optional[datetime] = Field(default=None, description="Last review timestamp")
    
    @property
    def review_percentage(self) -> float:
        """Calculate percentage of cards reviewed."""
        if self.total_cards == 0:
            return 0.0
        return (self.reviewed_count / self.total_cards) * 100
    
    @property
    def mastery_score(self) -> float:
        """
        Calculate mastery score (0-100).
        
        Higher weight for easy cards, lower for hard/again.
        """
        if self.reviewed_count == 0:
            return 0.0
        
        score = (
            (self.easy_count * 100) +
            (self.good_count * 75) +
            (self.hard_count * 40) +
            (self.again_count * 0)
        )
        return min(100.0, score / self.reviewed_count)


class FlashcardDeck(BaseModel):
    """
    A collection of flashcards with metadata.
    
    Useful for organizing cards by file or topic.
    """
    file_id: str
    file_name: str
    flashcards: list[FlashcardModel]
    total_count: int
    
    @property
    def card_count(self) -> int:
        """Number of flashcards in this deck."""
        return len(self.flashcards)
