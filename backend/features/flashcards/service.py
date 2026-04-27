"""
Flashcard service.

This module handles flashcard management and spaced repetition reviews.
"""
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime

from repository.flashcard_repository import FlashcardRepository, FlashcardReviewRepository
from repository.file_repository import FileRepository
from domain.flashcard import (
    FlashcardModel,
    FlashcardCreate,
    FlashcardReviewCreate,
    FlashcardReviewModel,
    FlashcardStats,
    FlashcardDeck,
    FlashcardDifficulty
)
from core.exceptions import (
    ResourceNotFoundError,
    AuthorizationError,
    ValidationError
)
from core.logging import get_logger

logger = get_logger(__name__)


class FlashcardService:
    """
    Service for flashcard operations.
    
    Handles flashcard creation, retrieval, and spaced repetition reviews.
    """
    
    def __init__(
        self,
        flashcard_repository: FlashcardRepository,
        review_repository: FlashcardReviewRepository,
        file_repository: FileRepository
    ):
        """
        Initialize flashcard service.
        
        Args:
            flashcard_repository: Flashcard data access layer
            review_repository: Review data access layer
            file_repository: File data access layer
        """
        self.flashcard_repo = flashcard_repository
        self.review_repo = review_repository
        self.file_repo = file_repository
    
    def create_flashcard(
        self,
        flashcard_data: FlashcardCreate,
        user_id: str
    ) -> FlashcardModel:
        """
        Create a new flashcard.
        
        Args:
            flashcard_data: Flashcard data
            user_id: User creating the flashcard
            
        Returns:
            Created flashcard
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
        """
        # Verify file exists and user owns it
        file = self.file_repo.find_by_id(flashcard_data.file_id)
        if not file:
            raise ResourceNotFoundError("File", flashcard_data.file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(
                f"Access denied to file {flashcard_data.file_id}"
            )
        
        # Create flashcard
        flashcard_id = str(uuid.uuid4())
        flashcard = FlashcardModel(
            id=flashcard_id,
            file_id=flashcard_data.file_id,
            question=flashcard_data.question,
            answer=flashcard_data.answer,
            created_at=datetime.now()
        )
        
        created_flashcard = self.flashcard_repo.create(flashcard)
        
        logger.info(f"Flashcard created: {flashcard_id}")
        
        return created_flashcard
    
    def get_file_flashcards(
        self,
        file_id: str,
        user_id: str
    ) -> List[FlashcardModel]:
        """
        Get all flashcards for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            List of flashcards
            
        Raises:
            AuthorizationError: If user doesn't own file
        """
        # Verify access
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        return self.flashcard_repo.find_by_file(file_id)
    
    def get_flashcard_deck(
        self,
        file_id: str,
        user_id: str
    ) -> FlashcardDeck:
        """
        Get a complete flashcard deck for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            Flashcard deck with metadata
        """
        # Get file info
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        # Get flashcards
        flashcards = self.flashcard_repo.find_by_file(file_id)
        
        return FlashcardDeck(
            file_id=file_id,
            file_name=file.original_name,
            flashcards=flashcards,
            total_count=len(flashcards)
        )
    
    def get_random_flashcards(
        self,
        file_id: str,
        user_id: str,
        count: int = 10
    ) -> List[FlashcardModel]:
        """
        Get random flashcards for study session.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            count: Number of cards to return
            
        Returns:
            Random flashcards
        """
        # Verify access
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        return self.flashcard_repo.get_random_cards(file_id, limit=count)
    
    def record_review(
        self,
        review_data: FlashcardReviewCreate,
        user_id: str
    ) -> FlashcardReviewModel:
        """
        Record a flashcard review and update its SRS schedule using SM-2.
        
        Args:
            review_data: Review data
            user_id: User who reviewed
            
        Returns:
            Created review
        """
        # Verify flashcard exists
        flashcard = self.flashcard_repo.find_by_id(review_data.flashcard_id)
        if not flashcard:
            raise ResourceNotFoundError("Flashcard", review_data.flashcard_id)
        
        # Map difficulty string to SM-2 quality (0-5)
        # Quality scale:
        # 5: easy (perfect)
        # 4: good (hesitation)
        # 3: hard (difficult)
        # 0-2: again (fail)
        quality_map = {
            FlashcardDifficulty.EASY: 5,
            FlashcardDifficulty.GOOD: 4,
            FlashcardDifficulty.HARD: 3,
            FlashcardDifficulty.AGAIN: 0
        }
        quality = quality_map.get(review_data.difficulty, 0)
        
        # Calculate new SRS values (SM-2 Algorithm)
        new_interval = flashcard.interval
        new_ease_factor = flashcard.ease_factor
        new_repetitions = flashcard.repetitions
        
        if quality >= 3:  # Correct response
            if new_repetitions == 0:
                new_interval = 1
            elif new_repetitions == 1:
                new_interval = 6
            else:
                new_interval = round(new_interval * new_ease_factor)
            
            new_repetitions += 1
            
            # Update ease factor: EF = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
            new_ease_factor = new_ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
            if new_ease_factor < 1.3:
                new_ease_factor = 1.3
        else:  # Incorrect response
            new_repetitions = 0
            new_interval = 1
        
        # Schedule next review
        from datetime import timedelta
        next_review_at = datetime.now() + timedelta(days=new_interval)
        
        # Update flashcard SRS data
        self.flashcard_repo.update_srs(
            flashcard_id=flashcard.id,
            interval=new_interval,
            ease_factor=new_ease_factor,
            repetitions=new_repetitions,
            next_review_at=next_review_at
        )
        
        # Create review record
        review_id = str(uuid.uuid4())
        review = FlashcardReviewModel(
            id=review_id,
            user_id=user_id,
            flashcard_id=review_data.flashcard_id,
            difficulty=review_data.difficulty,
            reviewed_at=datetime.now()
        )
        
        created_review = self.review_repo.create(review)
        
        logger.info(
            f"Flashcard review recorded: {review_id} "
            f"(quality: {quality}, next review: {next_review_at.date()})"
        )
        
        return created_review

    def get_flashcard_stats(
        self,
        user_id: str,
        file_id: Optional[str] = None
    ) -> FlashcardStats:
        """
        Get flashcard statistics.
        
        Args:
            user_id: User identifier
            file_id: Optional file filter
            
        Returns:
            Flashcard statistics
        """
        return self.review_repo.get_user_stats(user_id, file_id=file_id)

    def get_cards_due_for_review(
        self,
        user_id: str,
        file_id: Optional[str] = None
    ) -> List[FlashcardModel]:
        """
        Get flashcards that are due for review based on SM-2.
        
        Args:
            user_id: User identifier
            file_id: Optional file filter
            
        Returns:
            Flashcards due for review
        """
        # Get card IDs due for review
        card_ids = self.review_repo.get_cards_due_for_review(user_id, file_id)
        
        # Get full flashcard objects
        cards = []
        for card_id in card_ids:
            card = self.flashcard_repo.find_by_id(card_id)
            if card:
                cards.append(card)
        
        return cards
    
    def get_review_history(
        self,
        user_id: str,
        flashcard_id: str
    ) -> List[FlashcardReviewModel]:
        """
        Get review history for a flashcard.
        
        Args:
            user_id: User identifier
            flashcard_id: Flashcard identifier
            
        Returns:
            List of reviews
        """
        return self.review_repo.find_by_flashcard(flashcard_id, user_id=user_id)
    
    def delete_flashcard(
        self,
        flashcard_id: str,
        user_id: str
    ) -> bool:
        """
        Delete a flashcard.
        
        Args:
            flashcard_id: Flashcard identifier
            user_id: User identifier
            
        Returns:
            True if deleted
            
        Raises:
            AuthorizationError: If user doesn't own the file
        """
        # Get flashcard
        flashcard = self.flashcard_repo.find_by_id(flashcard_id)
        if not flashcard:
            raise ResourceNotFoundError("Flashcard", flashcard_id)
        
        # Verify user owns the file
        file = self.file_repo.find_by_id(flashcard.file_id)
        if not file or file.user_id != user_id:
            raise AuthorizationError("Access denied to this flashcard")
        
        # Delete flashcard
        self.flashcard_repo.delete(flashcard_id)
        
        logger.info(f"Flashcard deleted: {flashcard_id}")
        
        return True
    
    def search_flashcards(
        self,
        file_id: str,
        user_id: str,
        query: str
    ) -> List[FlashcardModel]:
        """
        Search flashcards by content.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            query: Search query
            
        Returns:
            Matching flashcards
        """
        # Verify access
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        return self.flashcard_repo.search_content(file_id, query)
