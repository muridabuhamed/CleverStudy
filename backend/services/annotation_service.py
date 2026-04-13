"""
Annotation service.

This module handles PDF annotations, highlights, and bookmarks.
"""
import uuid
from typing import List, Optional
from datetime import datetime

from repository.annotation_repository import (
    HighlightRepository,
    AnnotationRepository,
    BookmarkRepository
)
from repository.file_repository import FileRepository
from domain.annotation import (
    HighlightModel,
    HighlightCreate,
    AnnotationModel,
    AnnotationCreate,
    AnnotationUpdate,
    BookmarkModel,
    BookmarkCreate
)
from core.exceptions import (
    ResourceNotFoundError,
    AuthorizationError,
    ValidationError
)
from core.logging import get_logger

logger = get_logger(__name__)


class HighlightService:
    """
    Service for highlight operations.
    
    Handles text highlighting in PDF documents.
    """
    
    def __init__(
        self,
        highlight_repository: HighlightRepository,
        file_repository: FileRepository
    ):
        """
        Initialize highlight service.
        
        Args:
            highlight_repository: Highlight data access layer
            file_repository: File data access layer
        """
        self.highlight_repo = highlight_repository
        self.file_repo = file_repository
    
    def create_highlight(
        self,
        highlight_data: HighlightCreate,
        user_id: str
    ) -> HighlightModel:
        """
        Create a new highlight.
        
        Args:
            highlight_data: Highlight data
            user_id: User creating the highlight
            
        Returns:
            Created highlight
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
        """
        # Verify file exists and user owns it
        file = self.file_repo.find_by_id(highlight_data.file_id)
        if not file:
            raise ResourceNotFoundError("File", highlight_data.file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(
                f"Access denied to file {highlight_data.file_id}"
            )
        
        # Create highlight
        highlight_id = str(uuid.uuid4())
        highlight = HighlightModel(
            id=highlight_id,
            file_id=highlight_data.file_id,
            user_id=user_id,
            page_number=highlight_data.page_number,
            text_content=highlight_data.text_content,
            color=highlight_data.color,
            position_data=highlight_data.position_data,
            created_at=datetime.now()
        )
        
        created_highlight = self.highlight_repo.create(highlight)
        
        logger.info(
            f"Highlight created: {highlight_id} on page {highlight_data.page_number}"
        )
        
        return created_highlight
    
    def get_file_highlights(
        self,
        file_id: str,
        user_id: str,
        page_number: Optional[int] = None
    ) -> List[HighlightModel]:
        """
        Get highlights for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            page_number: Optional page filter
            
        Returns:
            List of highlights
        """
        # Verify access
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        if page_number:
            return self.highlight_repo.find_by_page(file_id, user_id, page_number)
        
        return self.highlight_repo.find_by_file(file_id, user_id)
    
    def delete_highlight(
        self,
        highlight_id: str,
        user_id: str
    ) -> bool:
        """
        Delete a highlight.
        
        Args:
            highlight_id: Highlight identifier
            user_id: User identifier
            
        Returns:
            True if deleted
            
        Raises:
            AuthorizationError: If user doesn't own highlight
        """
        if not self.highlight_repo.belongs_to_user(highlight_id, user_id):
            raise AuthorizationError("Access denied to this highlight")
        
        self.highlight_repo.delete(highlight_id)
        
        logger.info(f"Highlight deleted: {highlight_id}")
        
        return True
    
    def search_highlights(
        self,
        user_id: str,
        query: str,
        file_id: Optional[str] = None
    ) -> List[HighlightModel]:
        """
        Search highlights by text content.
        
        Args:
            user_id: User identifier
            query: Search query
            file_id: Optional file filter
            
        Returns:
            Matching highlights
        """
        return self.highlight_repo.search_content(user_id, query, file_id)


class AnnotationService:
    """
    Service for annotation (note) operations.
    
    Handles user notes on PDF documents.
    """
    
    def __init__(
        self,
        annotation_repository: AnnotationRepository,
        file_repository: FileRepository
    ):
        """
        Initialize annotation service.
        
        Args:
            annotation_repository: Annotation data access layer
            file_repository: File data access layer
        """
        self.annotation_repo = annotation_repository
        self.file_repo = file_repository
    
    def create_annotation(
        self,
        annotation_data: AnnotationCreate,
        user_id: str
    ) -> AnnotationModel:
        """
        Create a new annotation.
        
        Args:
            annotation_data: Annotation data
            user_id: User creating the annotation
            
        Returns:
            Created annotation
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
        """
        # Verify file exists and user owns it
        file = self.file_repo.find_by_id(annotation_data.file_id)
        if not file:
            raise ResourceNotFoundError("File", annotation_data.file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(
                f"Access denied to file {annotation_data.file_id}"
            )
        
        # Create annotation
        annotation_id = str(uuid.uuid4())
        annotation = AnnotationModel(
            id=annotation_id,
            file_id=annotation_data.file_id,
            user_id=user_id,
            page_number=annotation_data.page_number,
            note_text=annotation_data.note_text,
            position_data=annotation_data.position_data,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        created_annotation = self.annotation_repo.create(annotation)
        
        logger.info(
            f"Annotation created: {annotation_id} on page {annotation_data.page_number}"
        )
        
        return created_annotation
    
    def get_file_annotations(
        self,
        file_id: str,
        user_id: str,
        page_number: Optional[int] = None
    ) -> List[AnnotationModel]:
        """
        Get annotations for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            page_number: Optional page filter
            
        Returns:
            List of annotations
        """
        # Verify access
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        if page_number:
            return self.annotation_repo.find_by_page(file_id, user_id, page_number)
        
        return self.annotation_repo.find_by_file(file_id, user_id)
    
    def update_annotation(
        self,
        annotation_id: str,
        update_data: AnnotationUpdate,
        user_id: str
    ) -> AnnotationModel:
        """
        Update an annotation's note text.
        
        Args:
            annotation_id: Annotation identifier
            update_data: Update data
            user_id: User identifier
            
        Returns:
            Updated annotation
            
        Raises:
            AuthorizationError: If user doesn't own annotation
        """
        if not self.annotation_repo.belongs_to_user(annotation_id, user_id):
            raise AuthorizationError("Access denied to this annotation")
        
        updated_annotation = self.annotation_repo.update_note(
            annotation_id,
            update_data.note_text
        )
        
        if not updated_annotation:
            raise ResourceNotFoundError("Annotation", annotation_id)
        
        logger.info(f"Annotation updated: {annotation_id}")
        
        return updated_annotation
    
    def delete_annotation(
        self,
        annotation_id: str,
        user_id: str
    ) -> bool:
        """
        Delete an annotation.
        
        Args:
            annotation_id: Annotation identifier
            user_id: User identifier
            
        Returns:
            True if deleted
            
        Raises:
            AuthorizationError: If user doesn't own annotation
        """
        if not self.annotation_repo.belongs_to_user(annotation_id, user_id):
            raise AuthorizationError("Access denied to this annotation")
        
        self.annotation_repo.delete(annotation_id)
        
        logger.info(f"Annotation deleted: {annotation_id}")
        
        return True
    
    def search_annotations(
        self,
        user_id: str,
        query: str,
        file_id: Optional[str] = None
    ) -> List[AnnotationModel]:
        """
        Search annotations by note text.
        
        Args:
            user_id: User identifier
            query: Search query
            file_id: Optional file filter
            
        Returns:
            Matching annotations
        """
        return self.annotation_repo.search_content(user_id, query, file_id)


class BookmarkService:
    """
    Service for bookmark operations.
    
    Handles page bookmarks in PDF documents.
    """
    
    def __init__(
        self,
        bookmark_repository: BookmarkRepository,
        file_repository: FileRepository
    ):
        """
        Initialize bookmark service.
        
        Args:
            bookmark_repository: Bookmark data access layer
            file_repository: File data access layer
        """
        self.bookmark_repo = bookmark_repository
        self.file_repo = file_repository
    
    def create_bookmark(
        self,
        bookmark_data: BookmarkCreate,
        user_id: str
    ) -> BookmarkModel:
        """
        Create a new bookmark.
        
        Args:
            bookmark_data: Bookmark data
            user_id: User creating the bookmark
            
        Returns:
            Created bookmark
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
            ValidationError: If bookmark already exists for page
        """
        # Verify file exists and user owns it
        file = self.file_repo.find_by_id(bookmark_data.file_id)
        if not file:
            raise ResourceNotFoundError("File", bookmark_data.file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(
                f"Access denied to file {bookmark_data.file_id}"
            )
        
        # Check if bookmark already exists for this page
        if self.bookmark_repo.exists_for_page(
            bookmark_data.file_id,
            user_id,
            bookmark_data.page_number
        ):
            raise ValidationError(
                f"Bookmark already exists for page {bookmark_data.page_number}"
            )
        
        # Create bookmark
        bookmark_id = str(uuid.uuid4())
        bookmark = BookmarkModel(
            id=bookmark_id,
            file_id=bookmark_data.file_id,
            user_id=user_id,
            page_number=bookmark_data.page_number,
            title=bookmark_data.title,
            created_at=datetime.now()
        )
        
        created_bookmark = self.bookmark_repo.create(bookmark)
        
        logger.info(
            f"Bookmark created: {bookmark_id} on page {bookmark_data.page_number}"
        )
        
        return created_bookmark
    
    def get_file_bookmarks(
        self,
        file_id: str,
        user_id: str
    ) -> List[BookmarkModel]:
        """
        Get all bookmarks for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            List of bookmarks ordered by page number
        """
        # Verify access
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        return self.bookmark_repo.find_by_file(file_id, user_id)
    
    def delete_bookmark(
        self,
        bookmark_id: str,
        user_id: str
    ) -> bool:
        """
        Delete a bookmark.
        
        Args:
            bookmark_id: Bookmark identifier
            user_id: User identifier
            
        Returns:
            True if deleted
            
        Raises:
            AuthorizationError: If user doesn't own bookmark
        """
        if not self.bookmark_repo.belongs_to_user(bookmark_id, user_id):
            raise AuthorizationError("Access denied to this bookmark")
        
        self.bookmark_repo.delete(bookmark_id)
        
        logger.info(f"Bookmark deleted: {bookmark_id}")
        
        return True
