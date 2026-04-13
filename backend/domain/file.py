"""
File domain model.

Represents an uploaded PDF file with all its analysis data.
"""

from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import List, Optional
from enum import Enum


class FileStatus(str, Enum):
    """
    File processing status.
    
    PENDING: File uploaded but not yet processed
    PROCESSING: AI analysis in progress
    COMPLETED: Processing completed successfully
    ERROR: Processing failed
    """
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"


class QuestionModel(BaseModel):
    """Model for a quiz question."""
    id: str
    text: str = Field(..., min_length=1)
    options: List[str] = Field(..., min_items=2, max_items=6)
    correctAnswer: int = Field(..., ge=0)
    explanation: str = Field(default="")
    
    @validator('correctAnswer')
    def validate_correct_answer(cls, v, values):
        """Ensure correct answer index is within options range."""
        if 'options' in values and v >= len(values['options']):
            raise ValueError('correctAnswer must be a valid index in options')
        return v


class FileBase(BaseModel):
    """Base file model with common fields."""
    filename: str = Field(..., min_length=1, max_length=255)
    original_name: str = Field(..., min_length=1, max_length=255)


class FileCreate(FileBase):
    """Model for creating a new file record."""
    user_id: str


class FileModel(FileBase):
    """
    Complete file model from database.
    
    Attributes:
        id: Unique file identifier
        filename: Stored filename on disk
        original_name: Original upload filename
        user_id: ID of user who uploaded the file
        created_at: Upload timestamp
        topics: Extracted topics from AI analysis
        questions: Generated quiz questions
        status: Processing status
        cached_text: Cached extracted text (for performance)
    """
    id: str
    user_id: str
    created_at: datetime
    topics: List[str] = Field(default_factory=list)
    questions: List[QuestionModel] = Field(default_factory=list)
    status: FileStatus = FileStatus.PENDING
    cached_text: Optional[str] = None
    
    class Config:
        from_attributes = True
        use_enum_values = True


class FileResponse(FileBase):
    """File model for API responses."""
    id: str
    created_at: datetime
    topics: List[str]
    questions: List[QuestionModel]
    status: FileStatus
    
    class Config:
        from_attributes = True
        use_enum_values = True


class FileListResponse(BaseModel):
    """Model for listing multiple files."""
    files: List[FileResponse]
    total: int


class ProcessingResult(BaseModel):
    """Result of document processing."""
    topics: List[str]
    questions: List[QuestionModel]


class FileUpdateAnalysis(BaseModel):
    """Model for updating file analysis data."""
    topics: List[str]
    questions: List[QuestionModel]
    status: FileStatus = FileStatus.COMPLETED
