"""
Flashcard repository for database operations.

This module provides data access methods for flashcards and reviews.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from repository.base import BaseRepository
from domain.flashcard import (
    FlashcardModel,
    FlashcardReviewModel,
    FlashcardDifficulty,
    FlashcardStats
)
from core.logging import get_logger

logger = get_logger(__name__)


class FlashcardRepository(BaseRepository[FlashcardModel]):
    """Repository for flashcard operations."""
    
    def __init__(self):
        super().__init__(FlashcardModel, "flashcards")
    
    def find_by_file(self, file_id: str) -> List[FlashcardModel]:
        """
        Get all flashcards for a file.
        
        Args:
            file_id: File identifier
            
        Returns:
            List of flashcards
        """
        return self.find_by(file_id=file_id)
    
    def count_by_file(self, file_id: str) -> int:
        """
        Count flashcards for a file.
        
        Args:
            file_id: File identifier
            
        Returns:
            Number of flashcards
        """
        sql = f"SELECT COUNT(*) FROM {self.table_name} WHERE file_id = ?"
        rows = self.execute_query(sql, (file_id,))
        return rows[0][0] if rows else 0
    
    def get_random_cards(
        self,
        file_id: str,
        limit: int = 10
    ) -> List[FlashcardModel]:
        """
        Get random flashcards from a file.
        
        Useful for quiz modes.
        
        Args:
            file_id: File identifier
            limit: Number of cards to return
            
        Returns:
            Random flashcards
        """
        sql = f"""
            SELECT * FROM {self.table_name}
            WHERE file_id = ?
            ORDER BY RANDOM()
            LIMIT ?
        """
        
        rows = self.execute_query(sql, (file_id, limit))
        return [self._row_to_model(row) for row in rows]
    
    def search_content(
        self,
        file_id: str,
        query: str
    ) -> List[FlashcardModel]:
        """
        Search flashcard questions and answers.
        
        Args:
            file_id: File to search in
            query: Search query
            
        Returns:
            Matching flashcards
        """
        sql = f"""
            SELECT * FROM {self.table_name}
            WHERE file_id = ? 
            AND (question LIKE ? OR answer LIKE ?)
            ORDER BY created_at DESC
        """
        
        search_term = f"%{query}%"
        rows = self.execute_query(sql, (file_id, search_term, search_term))
        return [self._row_to_model(row) for row in rows]

    def update_srs(
        self,
        flashcard_id: str,
        interval: int,
        ease_factor: float,
        repetitions: int,
        next_review_at: datetime
    ) -> bool:
        """
        Update SRS metadata for a flashcard.
        
        Args:
            flashcard_id: Flashcard identifier
            interval: New interval in days
            ease_factor: New SM-2 ease factor
            repetitions: New successful repetition count
            next_review_at: New scheduled review time
            
        Returns:
            True if updated
        """
        sql = f"""
            UPDATE {self.table_name}
            SET interval = ?,
                ease_factor = ?,
                repetitions = ?,
                next_review_at = ?
            WHERE id = ?
        """
        
        return self.execute_non_query(
            sql,
            (interval, ease_factor, repetitions, next_review_at.isoformat(), flashcard_id)
        )


class FlashcardReviewRepository(BaseRepository[FlashcardReviewModel]):
    """Repository for flashcard review operations."""
    
    def __init__(self):
        super().__init__(FlashcardReviewModel, "flashcard_reviews")
    
    def find_by_user(
        self,
        user_id: str,
        limit: Optional[int] = None
    ) -> List[FlashcardReviewModel]:
        """
        Get all reviews for a user.
        
        Args:
            user_id: User identifier
            limit: Maximum number to return
            
        Returns:
            List of reviews, most recent first
        """
        sql = f"""
            SELECT * FROM {self.table_name}
            WHERE user_id = ?
            ORDER BY reviewed_at DESC
        """
        
        if limit:
            sql += f" LIMIT {limit}"
        
        rows = self.execute_query(sql, (user_id,))
        return [self._row_to_model(row) for row in rows]
    
    def find_by_flashcard(
        self,
        flashcard_id: str,
        user_id: Optional[str] = None
    ) -> List[FlashcardReviewModel]:
        """
        Get all reviews for a specific flashcard.
        
        Args:
            flashcard_id: Flashcard identifier
            user_id: Optional user filter
            
        Returns:
            List of reviews
        """
        if user_id:
            return self.find_by(flashcard_id=flashcard_id, user_id=user_id)
        return self.find_by(flashcard_id=flashcard_id)
    
    def get_last_review(
        self,
        flashcard_id: str,
        user_id: str
    ) -> Optional[FlashcardReviewModel]:
        """
        Get the most recent review for a flashcard by a user.
        
        Args:
            flashcard_id: Flashcard identifier
            user_id: User identifier
            
        Returns:
            Last review or None
        """
        sql = f"""
            SELECT * FROM {self.table_name}
            WHERE flashcard_id = ? AND user_id = ?
            ORDER BY reviewed_at DESC
            LIMIT 1
        """
        
        rows = self.execute_query(sql, (flashcard_id, user_id))
        return self._row_to_model(rows[0]) if rows else None
    
    def get_user_stats(
        self,
        user_id: str,
        file_id: Optional[str] = None
    ) -> FlashcardStats:
        """
        Get comprehensive flashcard statistics for a user.
        
        Args:
            user_id: User identifier
            file_id: Optional file filter
            
        Returns:
            Flashcard statistics
        """
        # Get total cards count
        if file_id:
            total_sql = """
                SELECT COUNT(*) FROM flashcards WHERE file_id = ?
            """
            total_rows = self.execute_query(total_sql, (file_id,))
        else:
            total_sql = """
                SELECT COUNT(DISTINCT f.id)
                FROM flashcards f
                INNER JOIN files fi ON f.file_id = fi.id
                WHERE fi.user_id = ?
            """
            total_rows = self.execute_query(total_sql, (user_id,))
        
        total_cards = total_rows[0][0] if total_rows else 0
        
        # Get review statistics
        if file_id:
            stats_sql = """
                SELECT 
                    COUNT(DISTINCT fr.flashcard_id) as reviewed_count,
                    SUM(CASE WHEN fr.difficulty = 'easy' THEN 1 ELSE 0 END) as easy_count,
                    SUM(CASE WHEN fr.difficulty = 'good' THEN 1 ELSE 0 END) as good_count,
                    SUM(CASE WHEN fr.difficulty = 'hard' THEN 1 ELSE 0 END) as hard_count,
                    SUM(CASE WHEN fr.difficulty = 'again' THEN 1 ELSE 0 END) as again_count,
                    MAX(fr.reviewed_at) as last_review
                FROM flashcard_reviews fr
                INNER JOIN flashcards f ON fr.flashcard_id = f.id
                WHERE fr.user_id = ? AND f.file_id = ?
            """
            stats_rows = self.execute_query(stats_sql, (user_id, file_id))
        else:
            stats_sql = """
                SELECT 
                    COUNT(DISTINCT flashcard_id) as reviewed_count,
                    SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) as easy_count,
                    SUM(CASE WHEN difficulty = 'good' THEN 1 ELSE 0 END) as good_count,
                    SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) as hard_count,
                    SUM(CASE WHEN difficulty = 'again' THEN 1 ELSE 0 END) as again_count,
                    MAX(reviewed_at) as last_review
                FROM flashcard_reviews
                WHERE user_id = ?
            """
            stats_rows = self.execute_query(stats_sql, (user_id,))
        
        if not stats_rows or not stats_rows[0]:
            return FlashcardStats(total_cards=total_cards)
        
        row = stats_rows[0]
        last_review = None
        if row[5]:
            try:
                last_review = datetime.fromisoformat(row[5])
            except (ValueError, TypeError):
                pass
        
        return FlashcardStats(
            total_cards=total_cards,
            reviewed_count=row[0] or 0,
            easy_count=row[1] or 0,
            good_count=row[2] or 0,
            hard_count=row[3] or 0,
            again_count=row[4] or 0,
            last_review=last_review
        )
    
    def get_cards_due_for_review(
        self,
        user_id: str,
        file_id: Optional[str] = None
    ) -> List[str]:
        """
        Get flashcard IDs that are due for review based on SM-2 schedule.
        
        Args:
            user_id: User identifier
            file_id: Optional file identifier to filter
            
        Returns:
            List of flashcard IDs due for review
        """
        now = datetime.now()
        
        sql = """
            SELECT f.id
            FROM flashcards f
            INNER JOIN files fi ON f.file_id = fi.id
            WHERE fi.user_id = ?
        """
        
        params = [user_id]
        
        if file_id:
            sql += " AND f.file_id = ?"
            params.append(file_id)
            
        sql += " AND f.next_review_at <= ? ORDER BY f.next_review_at ASC"
        params.append(now.isoformat())
        
        rows = self.execute_query(sql, tuple(params))
        return [row[0] for row in rows]
    
    def count_reviews_by_difficulty(
        self,
        user_id: str,
        days: int = 30
    ) -> Dict[str, int]:
        """
        Count reviews by difficulty level.
        
        Args:
            user_id: User identifier
            days: Number of days to look back
            
        Returns:
            Dictionary mapping difficulty to count
        """
        cutoff_date = datetime.now() - timedelta(days=days)
        
        sql = """
            SELECT difficulty, COUNT(*) as count
            FROM flashcard_reviews
            WHERE user_id = ? AND reviewed_at >= ?
            GROUP BY difficulty
        """
        
        rows = self.execute_query(sql, (user_id, cutoff_date.isoformat()))
        
        result = {
            'easy': 0,
            'good': 0,
            'hard': 0,
            'again': 0
        }
        
        for row in rows:
            difficulty = row[0]
            count = row[1]
            if difficulty in result:
                result[difficulty] = count
        
        return result
