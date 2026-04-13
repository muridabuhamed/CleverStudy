"""
User domain model.

Represents a user entity with all its properties and business rules.
"""

from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
import re


class UserBase(BaseModel):
    """Base user model with common fields."""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)


class UserCreate(UserBase):
    """Model for creating a new user."""
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('password')
    def validate_password_strength(cls, v):
        """
        Validate password meets security requirements.
        
        Requirements:
        - At least 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        """
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    """Model for user login."""
    email: EmailStr
    password: str


class UserModel(UserBase):
    """
    Complete user model returned from database.
    
    Attributes:
        id: Unique user identifier
        email: User's email address
        name: User's display name
        password_hash: Hashed password (never exposed in API)
        created_at: Account creation timestamp
    """
    id: str
    password_hash: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserResponse(UserBase):
    """
    User model for API responses (excludes sensitive data).
    
    This model is safe to return in API responses as it excludes
    the password hash.
    """
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserStats(BaseModel):
    """User statistics for profile display."""
    files_studied: int = 0
    quizzes_taken: int = 0
    avg_score: float = 0.0
    total_correct: int = 0
    total_questions: int = 0
    study_streak_days: int = 0
    best_score: int = 0
    total_study_time_seconds: int = 0
