import os
import uuid
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from config import UPLOADS_DIR
from database import (
    get_file_by_id, add_flashcards, get_flashcards_by_file,
    add_flashcard_review, get_flashcard_stats
)
from services.pdf_service import extract_text_from_pdf
from services.gemini_service import generate_flashcards
from auth import get_current_user

router = APIRouter()


class FlashcardGenerateRequest(BaseModel):
    count: int = 15


class FlashcardReviewRequest(BaseModel):
    flashcardId: str
    difficulty: str  # 'easy', 'medium', 'hard'


@router.post("/api/flashcards/generate/{file_id}")
async def generate_flashcards_endpoint(file_id: str, request: FlashcardGenerateRequest, user_id: str = Depends(get_current_user)):
    try:
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        file_path = os.path.join(UPLOADS_DIR, file_id + '.pdf')
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found on disk")

        text = extract_text_from_pdf(file_path)
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        flashcards_data = await generate_flashcards(text, request.count)

        flashcards_with_ids = [
            {
                "id": str(uuid.uuid4()),
                "file_id": file_id,
                "question": fc["question"],
                "answer": fc["answer"]
            }
            for fc in flashcards_data
        ]

        add_flashcards(flashcards_with_ids)

        return {"success": True, "flashcards": flashcards_with_ids, "count": len(flashcards_with_ids)}
    except HTTPException:
        raise
    except Exception as e:
        msg = str(e)
        if '429' in msg or 'quota' in msg.lower():
            raise HTTPException(status_code=429, detail="AI quota exceeded. Please wait a minute and try again.")
        print(f"Generate flashcards error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate flashcards")


@router.get("/api/flashcards/{file_id}")
async def get_flashcards(file_id: str, user_id: str = Depends(get_current_user)):
    try:
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        flashcards = get_flashcards_by_file(file_id)
        stats = get_flashcard_stats(user_id, file_id)

        return {"flashcards": flashcards, "stats": stats}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get flashcards error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get flashcards")


@router.post("/api/flashcards/review")
async def review_flashcard(request: FlashcardReviewRequest, user_id: str = Depends(get_current_user)):
    try:
        review_id = str(uuid.uuid4())
        add_flashcard_review(review_id, user_id, request.flashcardId, request.difficulty)
        return {"success": True, "reviewId": review_id}
    except Exception as e:
        print(f"Review flashcard error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save review")
