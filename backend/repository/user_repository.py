"""
User repository for database operations.

Handles all user-related database queries.
"""

from typing import Optional, Dict, Any
from repository.base import BaseRepository
from domain.user import UserModel, UserStats
from core.logging import get_logger

logger = get_logger(__name__)


class UserRepository(BaseRepository[UserModel]):
    """Repository for user entity operations."""
    
    def __init__(self):
        super().__init__(UserModel, "users")
    
    def find_by_email(self, email: str) -> Optional[UserModel]:
        """
        Find user by email address.
        
        Args:
            email: User's email address
            
        Returns:
            UserModel if found, None otherwise
        """
        query = f"SELECT * FROM {self.table_name} WHERE LOWER(email) = LOWER(?) LIMIT 1"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (email,))
            row = cursor.fetchone()
            return self._row_to_model(row)
    
    def email_exists(self, email: str) -> bool:
        """
        Check if email already exists in database.
        
        Args:
            email: Email to check
            
        Returns:
            True if email exists, False otherwise
        """
        return self.find_by_email(email) is not None
    
    def get_stats(self, user_id: str) -> UserStats:
        """
        Get user statistics for profile display.
        
        Args:
            user_id: User identifier
            
        Returns:
            UserStats object with aggregated statistics
        """
        query = """
            SELECT 
                COUNT(DISTINCT f.id) as files_studied,
                COUNT(qa.id) as quizzes_taken,
                COALESCE(AVG(CAST(qa.score AS FLOAT) / qa.total * 100), 0) as avg_score,
                COALESCE(SUM(qa.score), 0) as total_correct,
                COALESCE(SUM(qa.total), 0) as total_questions,
                COALESCE(MAX(CAST(qa.score AS FLOAT) / qa.total * 100), 0) as best_score
            FROM users u
            LEFT JOIN files f ON u.id = f.user_id
            LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
            WHERE u.id = ?
        """
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (user_id,))
            row = cursor.fetchone()
            
            if not row:
                return UserStats()
            
            # Get total study time
            cursor.execute("""
                SELECT COALESCE(SUM(duration_seconds), 0) as total_seconds
                FROM study_sessions
                WHERE user_id = ?
            """, (user_id,))
            study_time_row = cursor.fetchone()
            total_study_time = study_time_row[0] if study_time_row else 0
            
            return UserStats(
                files_studied=row['files_studied'] or 0,
                quizzes_taken=row['quizzes_taken'] or 0,
                avg_score=float(row['avg_score']) if row['avg_score'] else 0.0,
                total_correct=row['total_correct'] or 0,
                total_questions=row['total_questions'] or 0,
                best_score=int(row['best_score']) if row['best_score'] else 0,
                total_study_time_seconds=total_study_time,
                study_streak_days=0  # TODO: Calculate from study sessions
            )
