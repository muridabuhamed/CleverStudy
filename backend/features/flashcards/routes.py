"""Flashcard routes using clean architecture."""
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from api.dependencies import (
    CurrentUser, FlashcardServ, handle_service_exception,
    get_gemini_client, get_pdf_processor, FileServ
)
from services.ai.gemini_client import GeminiClient
from services.ai.pdf_processor import PdfProcessor
from domain.flashcard import FlashcardDifficulty

router = APIRouter()


class FlashcardGenerateRequest(BaseModel):
    count: int = 15


class FlashcardReviewRequest(BaseModel):
    flashcardId: str
    difficulty: str  # 'easy', 'medium', 'hard', 'again'


@router.post("/api/flashcards/generate/{file_id}", status_code=status.HTTP_201_CREATED)
async def generate_flashcards_endpoint(
    file_id: str,
    request: FlashcardGenerateRequest,
    user_id: CurrentUser,
    flashcard_service: FlashcardServ,
    file_service: FileServ,
    pdf_processor: PdfProcessor = Depends(get_pdf_processor),
    gemini_client: GeminiClient = Depends(get_gemini_client)
) -> Dict[str, Any]:
    """
    Generate flashcards from PDF document using AI.
    
    - Extracts text from PDF
    - Uses AI to generate question/answer pairs
    - Saves flashcards for future review
    - Returns generated flashcards
    """
    try:
        # Get file and verify ownership
        file_model = file_service.get_file(file_id, user_id)
        
        # Get or extract text
        text = file_service.get_or_cache_text(file_id, user_id)
        
        if not text:
            from core.exceptions import FileProcessingError
            raise FileProcessingError("Could not extract text from PDF")
        
        # Generate flashcards with AI
        flashcards_data = gemini_client.generate_flashcards(text, request.count)
        
        # Save flashcards
        from domain.flashcard import FlashcardCreate
        flashcards = []
        for fc in flashcards_data:
            flashcard_create = FlashcardCreate(
                file_id=file_id,
                question=fc["question"],
                answer=fc["answer"]
            )
            flashcard = flashcard_service.create_flashcard(flashcard_create, user_id)
            flashcards.append(flashcard)
        
        return {
            "success": True,
            "flashcards": [
                {
                    "id": fc.id,
                    "file_id": fc.file_id,
                    "question": fc.question,
                    "answer": fc.answer
                }
                for fc in flashcards
            ],
            "count": len(flashcards)
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.get("/api/flashcards/{file_id}")
async def get_flashcards(
    file_id: str,
    user_id: CurrentUser,
    flashcard_service: FlashcardServ
) -> Dict[str, Any]:
    """
    Get all flashcards for a file with statistics.
    
    - Returns flashcards for the file
    - Includes review statistics
    - Shows mastery progress
    """
    try:
        # Verify file ownership
        from api.dependencies import get_file_service
        file_service = get_file_service()
        file_service.get_file(file_id, user_id)
        
        # Get flashcards and stats
        flashcards = flashcard_service.get_file_flashcards(file_id)
        stats = flashcard_service.get_flashcard_stats(user_id, file_id)
        
        return {
            "flashcards": [
                {
                    "id": fc.id,
                    "file_id": fc.file_id,
                    "question": fc.question,
                    "answer": fc.answer,
                    "created_at": fc.created_at.isoformat()
                }
                for fc in flashcards
            ],
            "stats": stats
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.post("/api/flashcards/review", status_code=status.HTTP_201_CREATED)
async def review_flashcard(
    request: FlashcardReviewRequest,
    user_id: CurrentUser,
    flashcard_service: FlashcardServ
) -> Dict[str, Any]:
    """
    Record a flashcard review with difficulty rating.
    
    - Tracks spaced repetition progress
    - Adjusts review schedule based on difficulty
    - Updates mastery statistics
    """
    try:
        # Validate difficulty
        try:
            difficulty = FlashcardDifficulty(request.difficulty)
        except ValueError:
            from core.exceptions import ValidationError
            raise ValidationError(
                f"Invalid difficulty. Must be one of: {', '.join([d.value for d in FlashcardDifficulty])}"
            )
        
        # Record review
        review = flashcard_service.record_review(
            flashcard_id=request.flashcardId,
            user_id=user_id,
            difficulty=difficulty
        )
        
        return {
            "success": True,
            "reviewId": review.id,
            "difficulty": review.difficulty.value
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.get("/api/flashcards/review/due")
async def get_due_flashcards(
    user_id: CurrentUser,
    flashcard_service: FlashcardServ
) -> Dict[str, Any]:
    """
    Get flashcards due for review based on spaced repetition.
    
    - Returns cards not reviewed recently
    - Prioritizes cards marked as difficult
    - Implements spaced repetition algorithm
    """
    try:
        flashcards = flashcard_service.get_cards_due_for_review(user_id)
        
        return {
            "flashcards": [
                {
                    "id": fc.id,
                    "file_id": fc.file_id,
                    "question": fc.question,
                    "answer": fc.answer
                }
                for fc in flashcards
            ],
            "count": len(flashcards)
        }
    except Exception as e:
        raise handle_service_exception(e)
