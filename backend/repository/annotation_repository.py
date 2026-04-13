"""
Annotation repository for database operations.

This module provides data access methods for highlights, annotations, and bookmarks.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from repository.base import BaseRepository
from domain.annotation import (
    HighlightModel,
    AnnotationModel,
    BookmarkModel
)
from core.logging import get_logger

logger = get_logger(__name__)


class HighlightRepository(BaseRepository[HighlightModel]):
    """Repository for highlight operations."""
    
    def __init__(self):
        super().__init__(HighlightModel, "highlights")
    
    def find_by_file(
        self,
        file_id: str,
        user_id: str
    ) -> List[HighlightModel]:
        """
        Get all highlights for a file by a specific user.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            List of highlights ordered by page then creation time
        """
        sql = f"""
            SELECT * FROM {self.table_name}
            WHERE file_id = ? AND user_id = ?
            ORDER BY page_number ASC, created_at ASC
        """
        
        rows = self.execute_query(sql, (file_id, user_id))
        return [self._row_to_model(row) for row in rows]
    
    def find_by_page(
        self,
        file_id: str,
        user_id: str,
        page_number: int
    ) -> List[HighlightModel]:
        """
        Get all highlights on a specific page.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            page_number: Page number (1-indexed)
            
        Returns:
            List of highlights on the page
        """
        return self.find_by(
            file_id=file_id,
            user_id=user_id,
            page_number=page_number
        )
    
    def count_by_file(self, file_id: str, user_id: str) -> int:
        """
        Count highlights for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            Number of highlights
        """
        sql = f"""
            SELECT COUNT(*) FROM {self.table_name}
            WHERE file_id = ? AND user_id = ?
        """
        rows = self.execute_query(sql, (file_id, user_id))
        return rows[0][0] if rows else 0
    
    def search_content(
        self,
        user_id: str,
        query: str,
        file_id: Optional[str] = None
    ) -> List[HighlightModel]:
        """
        Search highlighted text content.
        
        Args:
            user_id: User identifier
            query: Search query
            file_id: Optional file filter
            
        Returns:
            Matching highlights
        """
        if file_id:
            sql = f"""
                SELECT * FROM {self.table_name}
                WHERE user_id = ? AND file_id = ? AND text_content LIKE ?
                ORDER BY created_at DESC
            """
            search_term = f"%{query}%"
            rows = self.execute_query(sql, (user_id, file_id, search_term))
        else:
            sql = f"""
                SELECT * FROM {self.table_name}
                WHERE user_id = ? AND text_content LIKE ?
                ORDER BY created_at DESC
            """
            search_term = f"%{query}%"
            rows = self.execute_query(sql, (user_id, search_term))
        
        return [self._row_to_model(row) for row in rows]
    
    def belongs_to_user(self, highlight_id: str, user_id: str) -> bool:
        """
        Check if a highlight belongs to a user.
        
        Args:
            highlight_id: Highlight identifier
            user_id: User identifier
            
        Returns:
            True if user owns the highlight
        """
        highlight = self.find_by_id(highlight_id)
        return highlight is not None and highlight.user_id == user_id


class AnnotationRepository(BaseRepository[AnnotationModel]):
    """Repository for annotation (note) operations."""
    
    def __init__(self):
        super().__init__(AnnotationModel, "annotations")
    
    def find_by_file(
        self,
        file_id: str,
        user_id: str
    ) -> List[AnnotationModel]:
        """
        Get all annotations for a file by a specific user.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            List of annotations ordered by page then creation time
        """
        sql = f"""
            SELECT * FROM {self.table_name}
            WHERE file_id = ? AND user_id = ?
            ORDER BY page_number ASC, created_at ASC
        """
        
        rows = self.execute_query(sql, (file_id, user_id))
        return [self._row_to_model(row) for row in rows]
    
    def find_by_page(
        self,
        file_id: str,
        user_id: str,
        page_number: int
    ) -> List[AnnotationModel]:
        """
        Get all annotations on a specific page.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            page_number: Page number (1-indexed)
            
        Returns:
            List of annotations on the page
        """
        return self.find_by(
            file_id=file_id,
            user_id=user_id,
            page_number=page_number
        )
    
    def update_note(
        self,
        annotation_id: str,
        note_text: str
    ) -> Optional[AnnotationModel]:
        """
        Update annotation note text.
        
        Args:
            annotation_id: Annotation identifier
            note_text: New note text
            
        Returns:
            Updated annotation or None if not found
        """
        sql = f"""
            UPDATE {self.table_name}
            SET note_text = ?, updated_at = ?
            WHERE id = ?
        """
        
        updated_at = datetime.now().isoformat()
        self.execute_query(sql, (note_text, updated_at, annotation_id))
        
        return self.find_by_id(annotation_id)
    
    def count_by_file(self, file_id: str, user_id: str) -> int:
        """
        Count annotations for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            Number of annotations
        """
        sql = f"""
            SELECT COUNT(*) FROM {self.table_name}
            WHERE file_id = ? AND user_id = ?
        """
        rows = self.execute_query(sql, (file_id, user_id))
        return rows[0][0] if rows else 0
    
    def search_content(
        self,
        user_id: str,
        query: str,
        file_id: Optional[str] = None
    ) -> List[AnnotationModel]:
        """
        Search annotation note text.
        
        Args:
            user_id: User identifier
            query: Search query
            file_id: Optional file filter
            
        Returns:
            Matching annotations
        """
        if file_id:
            sql = f"""
                SELECT * FROM {self.table_name}
                WHERE user_id = ? AND file_id = ? AND note_text LIKE ?
                ORDER BY updated_at DESC
            """
            search_term = f"%{query}%"
            rows = self.execute_query(sql, (user_id, file_id, search_term))
        else:
            sql = f"""
                SELECT * FROM {self.table_name}
                WHERE user_id = ? AND note_text LIKE ?
                ORDER BY updated_at DESC
            """
            search_term = f"%{query}%"
            rows = self.execute_query(sql, (user_id, search_term))
        
        return [self._row_to_model(row) for row in rows]
    
    def belongs_to_user(self, annotation_id: str, user_id: str) -> bool:
        """
        Check if an annotation belongs to a user.
        
        Args:
            annotation_id: Annotation identifier
            user_id: User identifier
            
        Returns:
            True if user owns the annotation
        """
        annotation = self.find_by_id(annotation_id)
        return annotation is not None and annotation.user_id == user_id


class BookmarkRepository(BaseRepository[BookmarkModel]):
    """Repository for bookmark operations."""
    
    def __init__(self):
        super().__init__(BookmarkModel, "bookmarks")
    
    def find_by_file(
        self,
        file_id: str,
        user_id: str
    ) -> List[BookmarkModel]:
        """
        Get all bookmarks for a file by a specific user.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            List of bookmarks ordered by page number
        """
        sql = f"""
            SELECT * FROM {self.table_name}
            WHERE file_id = ? AND user_id = ?
            ORDER BY page_number ASC
        """
        
        rows = self.execute_query(sql, (file_id, user_id))
        return [self._row_to_model(row) for row in rows]
    
    def find_by_page(
        self,
        file_id: str,
        user_id: str,
        page_number: int
    ) -> Optional[BookmarkModel]:
        """
        Get bookmark on a specific page.
        
        Typically only one bookmark per page.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            page_number: Page number (1-indexed)
            
        Returns:
            Bookmark or None
        """
        bookmarks = self.find_by(
            file_id=file_id,
            user_id=user_id,
            page_number=page_number
        )
        return bookmarks[0] if bookmarks else None
    
    def exists_for_page(
        self,
        file_id: str,
        user_id: str,
        page_number: int
    ) -> bool:
        """
        Check if a bookmark exists for a page.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            page_number: Page number
            
        Returns:
            True if bookmark exists
        """
        sql = f"""
            SELECT COUNT(*) FROM {self.table_name}
            WHERE file_id = ? AND user_id = ? AND page_number = ?
        """
        rows = self.execute_query(sql, (file_id, user_id, page_number))
        return rows[0][0] > 0 if rows else False
    
    def count_by_file(self, file_id: str, user_id: str) -> int:
        """
        Count bookmarks for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            Number of bookmarks
        """
        sql = f"""
            SELECT COUNT(*) FROM {self.table_name}
            WHERE file_id = ? AND user_id = ?
        """
        rows = self.execute_query(sql, (file_id, user_id))
        return rows[0][0] if rows else 0
    
    def belongs_to_user(self, bookmark_id: str, user_id: str) -> bool:
        """
        Check if a bookmark belongs to a user.
        
        Args:
            bookmark_id: Bookmark identifier
            user_id: User identifier
            
        Returns:
            True if user owns the bookmark
        """
        bookmark = self.find_by_id(bookmark_id)
        return bookmark is not None and bookmark.user_id == user_id
