"""
Annotation and highlight domain models.

This module contains Pydantic models for PDF annotations, highlights, and bookmarks.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum


class HighlightColor(str, Enum):
    """Available highlight colors."""
    YELLOW = "#FFFF00"
    GREEN = "#00FF00"
    BLUE = "#00FFFF"
    PINK = "#FF00FF"
    ORANGE = "#FFA500"


class HighlightModel(BaseModel):
    """
    Highlight entity from the database.
    
    Represents highlighted text in a PDF document.
    """
    id: str = Field(..., description="Unique highlight identifier")
    file_id: str = Field(..., description="Associated file ID")
    user_id: str = Field(..., description="User who created highlight")
    page_number: int = Field(..., ge=1, description="Page number (1-indexed)")
    text_content: str = Field(..., min_length=1, description="Highlighted text")
    color: str = Field(default=HighlightColor.YELLOW.value, description="Highlight color")
    position_data: Optional[str] = Field(default=None, description="JSON position data")
    created_at: datetime = Field(default_factory=datetime.now, description="Creation timestamp")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "hl-123",
                "file_id": "file-456",
                "user_id": "user-789",
                "page_number": 5,
                "text_content": "Important concept to remember",
                "color": "#FFFF00",
                "created_at": "2024-01-15T10:30:00"
            }
        }
    
    @field_validator('color')
    @classmethod
    def validate_color(cls, v: str) -> str:
        """Ensure color is a valid hex code."""
        if not v.startswith('#') or len(v) != 7:
            raise ValueError("Color must be a hex code like #FFFF00")
        return v.upper()


class HighlightCreate(BaseModel):
    """Data required to create a highlight."""
    file_id: str = Field(..., description="File to highlight in")
    page_number: int = Field(..., ge=1, description="Page number")
    text_content: str = Field(..., min_length=1, max_length=5000, description="Text to highlight")
    color: str = Field(default=HighlightColor.YELLOW.value, description="Highlight color")
    position_data: Optional[str] = Field(default=None, description="Position metadata (JSON)")


class HighlightResponse(BaseModel):
    """Highlight data returned to client."""
    id: str
    file_id: str
    page_number: int
    text_content: str
    color: str
    created_at: datetime


class AnnotationModel(BaseModel):
    """
    Annotation (note) entity from the database.
    
    Represents a user's written note on a PDF page.
    """
    id: str = Field(..., description="Unique annotation identifier")
    file_id: str = Field(..., description="Associated file ID")
    user_id: str = Field(..., description="User who created annotation")
    page_number: int = Field(..., ge=1, description="Page number (1-indexed)")
    note_text: str = Field(..., min_length=1, description="Note content")
    position_data: Optional[str] = Field(default=None, description="JSON position data")
    created_at: datetime = Field(default_factory=datetime.now, description="Creation timestamp")
    updated_at: datetime = Field(default_factory=datetime.now, description="Last update timestamp")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "ann-123",
                "file_id": "file-456",
                "user_id": "user-789",
                "page_number": 3,
                "note_text": "This relates to chapter 2",
                "created_at": "2024-01-15T10:30:00",
                "updated_at": "2024-01-15T10:30:00"
            }
        }


class AnnotationCreate(BaseModel):
    """Data required to create an annotation."""
    file_id: str = Field(..., description="File to annotate")
    page_number: int = Field(..., ge=1, description="Page number")
    note_text: str = Field(..., min_length=1, max_length=5000, description="Note content")
    position_data: Optional[str] = Field(default=None, description="Position metadata (JSON)")
    
    @field_validator('note_text')
    @classmethod
    def validate_not_empty(cls, v: str) -> str:
        """Ensure note is not just whitespace."""
        if not v.strip():
            raise ValueError("Note text cannot be empty")
        return v.strip()


class AnnotationUpdate(BaseModel):
    """Data for updating an annotation."""
    note_text: str = Field(..., min_length=1, max_length=5000, description="Updated note content")
    
    @field_validator('note_text')
    @classmethod
    def validate_not_empty(cls, v: str) -> str:
        """Ensure note is not just whitespace."""
        if not v.strip():
            raise ValueError("Note text cannot be empty")
        return v.strip()


class AnnotationResponse(BaseModel):
    """Annotation data returned to client."""
    id: str
    file_id: str
    page_number: int
    note_text: str
    created_at: datetime
    updated_at: datetime


class BookmarkModel(BaseModel):
    """
    Bookmark entity from the database.
    
    Represents a bookmarked page in a PDF document.
    """
    id: str = Field(..., description="Unique bookmark identifier")
    file_id: str = Field(..., description="Associated file ID")
    user_id: str = Field(..., description="User who created bookmark")
    page_number: int = Field(..., ge=1, description="Bookmarked page (1-indexed)")
    title: str = Field(..., min_length=1, description="Bookmark title/label")
    created_at: datetime = Field(default_factory=datetime.now, description="Creation timestamp")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "bm-123",
                "file_id": "file-456",
                "user_id": "user-789",
                "page_number": 42,
                "title": "Key diagram",
                "created_at": "2024-01-15T10:30:00"
            }
        }


class BookmarkCreate(BaseModel):
    """Data required to create a bookmark."""
    file_id: str = Field(..., description="File to bookmark")
    page_number: int = Field(..., ge=1, description="Page number")
    title: str = Field(..., min_length=1, max_length=200, description="Bookmark title")
    
    @field_validator('title')
    @classmethod
    def validate_not_empty(cls, v: str) -> str:
        """Ensure title is not just whitespace."""
        if not v.strip():
            raise ValueError("Bookmark title cannot be empty")
        return v.strip()


class BookmarkResponse(BaseModel):
    """Bookmark data returned to client."""
    id: str
    file_id: str
    page_number: int
    title: str
    created_at: datetime
