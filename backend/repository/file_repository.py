"""
File repository for database operations.

Handles all file-related database queries.
"""

import json
from typing import List, Optional, Dict, Any
from repository.base import BaseRepository
from domain.file import FileModel, FileStatus, QuestionModel
from core.logging import get_logger

logger = get_logger(__name__)


class FileRepository(BaseRepository[FileModel]):
    """Repository for file entity operations."""
    
    def __init__(self):
        super().__init__(FileModel, "files")
    
    def _deserialize_json_fields(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Deserialize JSON fields from database."""
        # Parse topics JSON string or handle NULL
        if 'topics' in data:
            if data['topics'] is None:
                data['topics'] = []
            elif isinstance(data['topics'], str):
                try:
                    data['topics'] = json.loads(data['topics']) if data['topics'] else []
                except json.JSONDecodeError:
                    logger.warning(f"Failed to parse topics JSON for file {data.get('id')}")
                    data['topics'] = []
        
        # Parse questions JSON string or handle NULL
        if 'questions' in data:
            if data['questions'] is None:
                data['questions'] = []
            elif isinstance(data['questions'], str):
                try:
                    data['questions'] = json.loads(data['questions']) if data['questions'] else []
                except json.JSONDecodeError:
                    logger.warning(f"Failed to parse questions JSON for file {data.get('id')}")
                    data['questions'] = []
        
        return data
    
    def _serialize_for_db(self, model) -> Dict[str, Any]:
        """Serialize model for database insertion."""
        data = model.model_dump()
        
        # Convert lists to JSON strings for database storage
        if 'topics' in data:
            data['topics'] = json.dumps(data['topics'])
        if 'questions' in data:
            # Serialize question objects if present
            if data['questions'] and isinstance(data['questions'][0], dict):
                data['questions'] = json.dumps(data['questions'])
            elif data['questions'] and hasattr(data['questions'][0], 'model_dump'):
                data['questions'] = json.dumps([q.model_dump() for q in data['questions']])
            else:
                data['questions'] = json.dumps(data['questions'])
        
        return data
    
    def find_by_user(self, user_id: str) -> List[FileModel]:
        """
        Find all files belonging to a user.
        
        Args:
            user_id: User identifier
            
        Returns:
            List of FileModel instances owned by the user
        """
        return self.find_by(user_id=user_id)
    
    def get_cached_text(self, file_id: str) -> Optional[str]:
        """
        Get cached PDF text if available.
        
        Args:
            file_id: File identifier
            
        Returns:
            Cached text or None if not cached
        """
        query = "SELECT cached_text FROM files WHERE id = ?"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (file_id,))
            row = cursor.fetchone()
            return row['cached_text'] if row and row['cached_text'] else None
    
    def set_cached_text(self, file_id: str, text: str) -> bool:
        """
        Cache extracted PDF text for faster subsequent access.
        
        Args:
            file_id: File identifier
            text: Extracted text to cache
            
        Returns:
            True if successful, False otherwise
        """
        result = self.update(file_id, cached_text=text)
        return result is not None
    
    def update_status(self, file_id: str, status: FileStatus) -> Optional[FileModel]:
        """
        Update file processing status.
        
        Args:
            file_id: File identifier
            status: New status
            
        Returns:
            Updated FileModel or None if not found
        """
        return self.update(file_id, status=status.value)
    
    def update_analysis(
        self,
        file_id: str,
        topics: List[str],
        questions: List[QuestionModel]
    ) -> Optional[FileModel]:
        """
        Update file with AI analysis results.
        
        Args:
            file_id: File identifier
            topics: List of extracted topics
            questions: List of generated questions
            
        Returns:
            Updated FileModel or None if not found
        """
        # Serialize questions to dicts for JSON storage.
        questions_data = []
        for q in questions:
            if isinstance(q, dict):
                questions_data.append(q)
            elif hasattr(q, "model_dump"):
                questions_data.append(q.model_dump())
            elif hasattr(q, "dict"):
                questions_data.append(q.dict())
            else:
                questions_data.append(q)
        
        return self.update(
            file_id,
            topics=json.dumps(topics),
            questions=json.dumps(questions_data),
            status=FileStatus.COMPLETED.value
        )
    
    def belongs_to_user(self, file_id: str, user_id: str) -> bool:
        """
        Check if file belongs to specific user.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            True if file belongs to user, False otherwise
        """
        file = self.find_by_id(file_id)
        return file is not None and file.user_id == user_id
