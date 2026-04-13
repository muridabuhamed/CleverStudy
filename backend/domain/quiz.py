"""
Quiz domain model.

Represents quiz attempts and related data.
"""

from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import List, Dict


class QuizAnswer(BaseModel):
    """Model for a single quiz answer."""
    questionId: str
    selectedAnswer: int = Field(..., ge=0)


class QuizAnswerResult(BaseModel):
    """Result of checking a quiz answer."""
    questionId: str
    selectedAnswer: int
    isCorrect: bool


class QuizAttemptCreate(BaseModel):
    """Model for creating a quiz attempt."""
    file_id: str
    score: int = Field(..., ge=0)
    total: int = Field(..., gt=0)
    
    @validator('score')
    def validate_score(cls, v, values):
        """Ensure score doesn't exceed total."""
        if 'total' in values and v > values['total']:
            raise ValueError('Score cannot exceed total questions')
        return v


class QuizAttemptModel(BaseModel):
    """
    Complete quiz attempt model.
    
    Attributes:
        id: Unique attempt identifier
        user_id: ID of user who took the quiz
        file_id: ID of file the quiz is about
        score: Number of correct answers
        total: Total number of questions
        completed_at: Quiz completion timestamp
    """
    id: str
    user_id: str
    file_id: str
    score: int
    total: int
    completed_at: datetime
    
    @property
    def percentage(self) -> float:
        """Calculate percentage score."""
        if self.total == 0:
            return 0.0
        return (self.score / self.total) * 100
    
    class Config:
        from_attributes = True


class QuizAttemptResponse(BaseModel):
    """Quiz attempt for API responses."""
    id: str
    file_id: str
    filename: str = ""  # Populated from file record
    score: int
    total: int
    percentage: float
    completed_at: datetime
    
    class Config:
        from_attributes = True


class QuizResultResponse(BaseModel):
    """Complete quiz result with answers."""
    score: int
    total: int
    percentage: float
    answers: List[QuizAnswerResult]


class StudySessionCreate(BaseModel):
    """Model for creating a study session."""
    file_id: str
    duration_seconds: int = Field(..., gt=0, description="Session duration in seconds")
    started_at: str = Field(..., description="ISO format timestamp when session started")


class StudySessionModel(BaseModel):
    """Complete study session model."""
    id: str
    user_id: str
    file_id: str
    duration_seconds: int
    started_at: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class StudyTimeResponse(BaseModel):
    """Study time statistics."""
    totalSeconds: int
    
    @property
    def hours(self) -> int:
        """Get total hours."""
        return self.totalSeconds // 3600
    
    @property
    def minutes(self) -> int:
        """Get remaining minutes."""
        return (self.totalSeconds % 3600) // 60
    
    @property
    def formatted(self) -> str:
        """Get formatted time string."""
        if self.hours > 0:
            return f"{self.hours}h {self.minutes}m"
        return f"{self.minutes}m"
