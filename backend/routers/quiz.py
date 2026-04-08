import uuid
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import (
    add_quiz_attempt, get_user_stats, get_recent_attempts,
    add_study_session, get_total_study_time, get_user_total_study_time
)
from auth import get_current_user

router = APIRouter()


class QuizSubmitRequest(BaseModel):
    fileId: str
    score: int
    total: int


@router.post("/api/quiz/submit")
async def submit_quiz(request: QuizSubmitRequest, user_id: str = Depends(get_current_user)):
    try:
        attempt_id = str(uuid.uuid4())
        add_quiz_attempt(attempt_id, user_id, request.fileId, request.score, request.total)
        return {"success": True, "attemptId": attempt_id}
    except Exception as e:
        print(f"Submit quiz error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save quiz attempt")


@router.get("/api/user/stats")
async def get_stats(user_id: str = Depends(get_current_user)):
    try:
        stats = get_user_stats(user_id)
        recent_attempts = get_recent_attempts(user_id, 5)

        return {
            "stats": stats or {
                "files_studied": 0,
                "quizzes_taken": 0,
                "avg_score": 0,
                "total_correct": 0,
                "total_questions": 0
            },
            "recentAttempts": recent_attempts
        }
    except Exception as e:
        print(f"Get stats error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user stats")


class StudySessionRequest(BaseModel):
    fileId: str
    durationSeconds: int
    startedAt: str


@router.post("/api/study/session")
async def save_study_session(request: StudySessionRequest, user_id: str = Depends(get_current_user)):
    try:
        session_id = str(uuid.uuid4())
        add_study_session(session_id, user_id, request.fileId, request.durationSeconds, request.startedAt)
        return {"success": True, "sessionId": session_id}
    except Exception as e:
        print(f"Save study session error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save study session")


@router.get("/api/study/time/{file_id}")
async def get_study_time(file_id: str, user_id: str = Depends(get_current_user)):
    try:
        total_seconds = get_total_study_time(user_id, file_id)
        return {"totalSeconds": total_seconds}
    except Exception as e:
        print(f"Get study time error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get study time")


@router.get("/api/study/time")
async def get_total_time(user_id: str = Depends(get_current_user)):
    try:
        total_seconds = get_user_total_study_time(user_id)
        return {"totalSeconds": total_seconds}
    except Exception as e:
        print(f"Get total study time error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get total study time")
