"""
Quiz repository for database operations.

This module provides data access methods for quiz attempts and study sessions.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from repository.base import BaseRepository
from domain.quiz import QuizAttemptModel, StudySessionCreate
from core.logging import get_logger

logger = get_logger(__name__)


class QuizRepository(BaseRepository[QuizAttemptModel]):
    """Repository for quiz attempt operations."""
    
    def __init__(self):
        super().__init__(QuizAttemptModel, "quiz_attempts")
    
    def find_by_user(
        self,
        user_id: str,
        limit: Optional[int] = None
    ) -> List[QuizAttemptModel]:
        """
        Get all quiz attempts for a user.
        
        Args:
            user_id: User identifier
            limit: Maximum number of attempts to return
            
        Returns:
            List of quiz attempts, ordered by most recent
        """
        sql = f"""
            SELECT * FROM {self.table_name}
            WHERE user_id = ?
            ORDER BY completed_at DESC
        """
        
        if limit:
            sql += f" LIMIT {limit}"
        
        rows = self.execute_query(sql, (user_id,))
        return [self._row_to_model(row) for row in rows]
    
    def find_by_file(
        self,
        file_id: str,
        user_id: Optional[str] = None
    ) -> List[QuizAttemptModel]:
        """
        Get all quiz attempts for a file.
        
        Args:
            file_id: File identifier
            user_id: Optional user filter
            
        Returns:
            List of quiz attempts
        """
        if user_id:
            return self.find_by(file_id=file_id, user_id=user_id)
        return self.find_by(file_id=file_id)
    
    def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Get comprehensive quiz statistics for a user.
        
        Args:
            user_id: User identifier
            
        Returns:
            Dictionary with quiz stats:
            - total_attempts: Number of quizzes taken
            - total_questions: Total questions answered
            - total_correct: Total correct answers
            - average_score: Average percentage score
            - best_score: Highest percentage achieved
            - files_studied: Number of unique files studied
        """
        sql = """
            SELECT 
                COUNT(*) as total_attempts,
                SUM(total) as total_questions,
                SUM(score) as total_correct,
                AVG(CAST(score AS FLOAT) / CAST(total AS FLOAT) * 100) as average_score,
                MAX(CAST(score AS FLOAT) / CAST(total AS FLOAT) * 100) as best_score,
                COUNT(DISTINCT file_id) as files_studied
            FROM quiz_attempts
            WHERE user_id = ?
        """
        
        rows = self.execute_query(sql, (user_id,))
        if not rows or not rows[0]:
            return {
                'total_attempts': 0,
                'total_questions': 0,
                'total_correct': 0,
                'average_score': 0.0,
                'best_score': 0.0,
                'files_studied': 0
            }
        
        row = rows[0]
        
        return {
            'total_attempts': row['total_attempts'] or 0,
            'total_questions': row['total_questions'] or 0,
            'total_correct': row['total_correct'] or 0,
            'average_score': round(row['average_score'] or 0.0, 2),
            'best_score': round(row['best_score'] or 0.0, 2),
            'files_studied': row['files_studied'] or 0
        }
    
    def get_file_stats(self, file_id: str) -> Dict[str, Any]:
        """
        Get quiz statistics for a specific file.
        
        Args:
            file_id: File identifier
            
        Returns:
            Dictionary with file quiz stats
        """
        sql = """
            SELECT 
                COUNT(*) as attempt_count,
                AVG(CAST(score AS FLOAT) / CAST(total AS FLOAT) * 100) as average_score,
                MAX(CAST(score AS FLOAT) / CAST(total AS FLOAT) * 100) as best_score,
                COUNT(DISTINCT user_id) as unique_users
            FROM quiz_attempts
            WHERE file_id = ?
        """
        
        rows = self.execute_query(sql, (file_id,))
        if not rows or not rows[0]:
            return {
                'attempt_count': 0,
                'average_score': 0.0,
                'best_score': 0.0,
                'unique_users': 0
            }
        
        row = rows[0]
        return {
            'attempt_count': row[0] or 0,
            'average_score': round(row[1] or 0.0, 2),
            'best_score': round(row[2] or 0.0, 2),
            'unique_users': row[3] or 0
        }


class StudySessionRepository(BaseRepository):
    """
    Repository for study session operations.
    
    Note: Using BaseRepository without a typed model since
    study_sessions are simpler records.
    """
    
    def __init__(self):
        # No model type - using raw dict results
        super().__init__(None, "study_sessions")
    
    def create_session(self, session: StudySessionCreate) -> str:
        """
        Create a new study session.
        
        Args:
            session: Session data
            
        Returns:
            Created session ID
        """
        import uuid
        session_id = str(uuid.uuid4())
        
        sql = """
            INSERT INTO study_sessions 
            (id, user_id, file_id, duration_seconds, started_at)
            VALUES (?, ?, ?, ?, ?)
        """
        
        self.execute_query(
            sql,
            (
                session_id,
                session.user_id,
                session.file_id,
                session.duration_seconds,
                session.started_at.isoformat()
            )
        )
        
        logger.info(f"Created study session {session_id} for user {session.user_id}")
        return session_id
    
    def get_user_study_time(
        self,
        user_id: str,
        days: int = 30
    ) -> Dict[str, Any]:
        """
        Get total study time for a user.
        
        Args:
            user_id: User identifier
            days: Number of days to look back
            
        Returns:
            Study time statistics
        """
        cutoff_date = datetime.now() - timedelta(days=days)
        
        sql = """
            SELECT 
                COUNT(*) as session_count,
                SUM(duration_seconds) as total_seconds,
                AVG(duration_seconds) as avg_seconds,
                MAX(duration_seconds) as max_seconds
            FROM study_sessions
            WHERE user_id = ? AND started_at >= ?
        """
        
        rows = self.execute_query(sql, (user_id, cutoff_date.isoformat()))
        if not rows or not rows[0]:
            return {
                'session_count': 0,
                'total_seconds': 0,
                'total_minutes': 0,
                'total_hours': 0.0,
                'average_minutes': 0,
                'longest_session_minutes': 0
            }
        
        row = rows[0]
        total_seconds = row['total_seconds'] or 0
        avg_seconds = row['avg_seconds'] or 0
        max_seconds = row['max_seconds'] or 0
        
        return {
            'session_count': row['session_count'] or 0,
            'total_seconds': total_seconds,
            'total_minutes': total_seconds // 60,
            'total_hours': round(total_seconds / 3600, 2),
            'average_minutes': avg_seconds // 60,
            'longest_session_minutes': max_seconds // 60
        }
    
    def get_file_study_time(
        self,
        file_id: str,
        user_id: Optional[str] = None
    ) -> int:
        """
        Get total study time for a file.
        
        Args:
            file_id: File identifier
            user_id: Optional user filter
            
        Returns:
            Total seconds spent studying this file
        """
        if user_id:
            sql = """
                SELECT COALESCE(SUM(duration_seconds), 0)
                FROM study_sessions
                WHERE file_id = ? AND user_id = ?
            """
            rows = self.execute_query(sql, (file_id, user_id))
        else:
            sql = """
                SELECT COALESCE(SUM(duration_seconds), 0)
                FROM study_sessions
                WHERE file_id = ?
            """
            rows = self.execute_query(sql, (file_id,))
        
        return rows[0][0] if rows else 0
