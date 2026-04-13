"""
File service.

This module handles file operations, PDF processing, and AI analysis orchestration.
"""
import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path

from repository.file_repository import FileRepository
from repository.user_repository import UserRepository
from domain.file import FileModel, FileCreate, FileStatus, ProcessingResult
from core.config import get_settings
from core.exceptions import (
    ResourceNotFoundError,
    AuthorizationError,
    FileProcessingError,
    ValidationError
)
from core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()


class FileService:
    """
    Service for file operations.
    
    Handles file upload, processing, AI analysis orchestration, and management.
    """
    
    def __init__(
        self,
        file_repository: FileRepository,
        user_repository: UserRepository
    ):
        """
        Initialize file service.
        
        Args:
            file_repository: File data access layer
            user_repository: User data access layer
        """
        self.file_repo = file_repository
        self.user_repo = user_repository
    
    def create_file_record(
        self,
        user_id: str,
        original_filename: str,
        saved_filename: str
    ) -> FileModel:
        """
        Create a file record in the database.
        
        Args:
            user_id: User who uploaded the file
            original_filename: Original filename
            saved_filename: Filename saved on disk
            
        Returns:
            Created file model
            
        Raises:
            ResourceNotFoundError: If user doesn't exist
            ValidationError: If filename is invalid
        """
        # Validate user exists
        user = self.user_repo.find_by_id(user_id)
        if not user:
            raise ResourceNotFoundError("User", user_id)
        
        # Validate filename
        if not original_filename or not saved_filename:
            raise ValidationError("Filename cannot be empty")
        
        # Create file model
        file_id = str(uuid.uuid4())
        file_model = FileModel(
            id=file_id,
            filename=saved_filename,
            original_name=original_filename,
            user_id=user_id,
            status=FileStatus.PENDING,
            created_at=datetime.utcnow()
        )
        
        # Save to database
        created_file = self.file_repo.create(file_model)
        
        logger.info(f"File record created: {file_id} for user {user_id}")
        
        return created_file
    
    def get_file(self, file_id: str, user_id: str) -> FileModel:
        """
        Get a file by ID.
        
        Verifies user owns the file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            File model
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
        """
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        return file
    
    def list_user_files(
        self,
        user_id: str,
        status: Optional[FileStatus] = None
    ) -> List[FileModel]:
        """
        Get all files for a user.
        
        Args:
            user_id: User identifier
            status: Optional status filter
            
        Returns:
            List of files, ordered by most recent
        """
        if status:
            files = self.file_repo.find_by(user_id=user_id, status=status.value)
        else:
            files = self.file_repo.find_by_user(user_id)
        
        return sorted(files, key=lambda f: f.created_at, reverse=True)
    
    def update_analysis(
        self,
        file_id: str,
        topics: List[str],
        questions: List[Dict[str, Any]],
        user_id: Optional[str] = None
    ) -> FileModel:
        """
        Update file with AI analysis results.
        
        Args:
            file_id: File identifier
            topics: Extracted topics
            questions: Generated questions
            user_id: Optional user ID for verification
            
        Returns:
            Updated file model
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
        """
        # Get file and verify ownership if user_id provided
        if user_id:
            file = self.get_file(file_id, user_id)
        else:
            file = self.file_repo.find_by_id(file_id)
            if not file:
                raise ResourceNotFoundError("File", file_id)
        
        # Update analysis
        updated_file = self.file_repo.update_analysis(
            file_id=file_id,
            topics=topics,
            questions=questions
        )
        
        logger.info(
            f"File analysis updated: {file_id} "
            f"({len(topics)} topics, {len(questions)} questions)"
        )
        
        return updated_file
    
    def delete_file(self, file_id: str, user_id: str) -> bool:
        """
        Delete a file and its physical file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            True if deleted
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
        """
        # Verify file exists and user owns it
        file = self.get_file(file_id, user_id)
        
        # Delete physical file
        try:
            file_path = settings.uploads_dir / file.filename
            if file_path.exists():
                file_path.unlink()
                logger.info(f"Physical file deleted: {file_path}")
        except Exception as e:
            logger.warning(f"Could not delete physical file: {e}")
        
        # Delete from database
        self.file_repo.delete(file_id)
        
        logger.info(f"File deleted: {file_id}")
        
        return True
    
    def set_file_status(
        self,
        file_id: str,
        status: FileStatus,
        user_id: Optional[str] = None
    ) -> FileModel:
        """
        Update file processing status.
        
        Args:
            file_id: File identifier
            status: New status
            user_id: Optional user ID for verification
            
        Returns:
            Updated file model
        """
        # Get file and verify ownership if user_id provided
        if user_id:
            file = self.get_file(file_id, user_id)
        else:
            file = self.file_repo.find_by_id(file_id)
            if not file:
                raise ResourceNotFoundError("File", file_id)
        
        # Update status
        updated_file = self.file_repo.update(file_id, status=status.value)
        
        logger.info(f"File status updated: {file_id} -> {status.value}")
        
        return updated_file
    
    def get_or_cache_text(self, file_id: str, user_id: str) -> Optional[str]:
        """
        Get cached PDF text or return None if not cached.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            Cached text or None
        """
        # Verify access
        self.get_file(file_id, user_id)
        
        return self.file_repo.get_cached_text(file_id)
    
    def cache_extracted_text(
        self,
        file_id: str,
        text: str,
        user_id: Optional[str] = None
    ) -> bool:
        """
        Cache extracted PDF text.
        
        Args:
            file_id: File identifier
            text: Extracted text
            user_id: Optional user ID for verification
            
        Returns:
            True if cached
        """
        # Verify access if user_id provided
        if user_id:
            self.get_file(file_id, user_id)
        
        self.file_repo.set_cached_text(file_id, text)
        
        logger.info(f"Text cached for file: {file_id} ({len(text)} chars)")
        
        return True
    
    def get_file_physical_path(
        self,
        file_id: str,
        user_id: str
    ) -> Path:
        """
        Get the physical file path on disk.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            Path to file
            
        Raises:
            FileProcessingError: If file doesn't exist on disk
        """
        file = self.get_file(file_id, user_id)
        file_path = settings.uploads_dir / file.filename
        
        if not file_path.exists():
            raise FileProcessingError(
                f"Physical file not found: {file.filename}"
            )
        
        return file_path
    
    def validate_file_upload(
        self,
        filename: str,
        file_size: int
    ) -> None:
        """
        Validate file upload requirements.
        
        Args:
            filename: Uploaded filename
            file_size: File size in bytes
            
        Raises:
            ValidationError: If file is invalid
        """
        # Check file extension
        allowed_extensions = {'.pdf'}
        file_ext = Path(filename).suffix.lower()
        
        if file_ext not in allowed_extensions:
            raise ValidationError(
                f"Invalid file type. Only PDF files are allowed. Got: {file_ext}"
            )
        
        # Check file size
        max_size = settings.max_upload_size_bytes
        if file_size > max_size:
            size_mb = file_size / (1024 * 1024)
            max_mb = max_size / (1024 * 1024)
            raise ValidationError(
                f"File too large. Maximum size is {max_mb}MB. "
                f"Your file is {size_mb:.2f}MB"
            )
        
        logger.debug(f"File validation passed: {filename} ({file_size} bytes)")
