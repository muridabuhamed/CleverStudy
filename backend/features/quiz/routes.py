"""Quiz and study session routes using clean architecture."""
from typing import Dict, Any
from fastapi import APIRouter, status
from pydantic import BaseModel

from api.dependencies import (
    CurrentUser, QuizServ, StudySessionServ, FileServ, handle_service_exception
)
from domain.quiz import QuizAttemptCreate, StudySessionCreate

router = APIRouter()


class QuizSubmitRequest(BaseModel):
    fileId: str
    score: int
    total: int


class StudySessionRequest(BaseModel):
    fileId: str
    durationSeconds: int
    startedAt: str


@router.post("/api/quiz/submit", status_code=status.HTTP_201_CREATED)
async def submit_quiz(
    request: QuizSubmitRequest,
    user_id: CurrentUser,
    quiz_service: QuizServ
) -> Dict[str, Any]:
    """
    Submit quiz attempt and save score.
    
    - Records attempt with score
    - Updates user statistics
    - Returns attempt ID for tracking
    """
    try:
        attempt = quiz_service.submit_quiz_attempt(
            user_id=user_id,
            file_id=request.fileId,
            score=request.score,
            total_questions=request.total
        )
        
        return {
            "success": True,
            "attemptId": attempt.id
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.get("/api/user/stats")
async def get_stats(
    user_id: CurrentUser,
    quiz_service: QuizServ,
    file_service: FileServ
) -> Dict[str, Any]:
    """
    Get user's quiz statistics and recent attempts.
    
    - Total quizzes taken
    - Average score
    - Files studied
    - Recent attempts
    """
    try:
        stats = quiz_service.get_user_stats(user_id)
        recent_attempts = quiz_service.get_recent_attempts(user_id, limit=5)
        
        # Fetch file names for recent attempts
        attempts_with_files = []
        for attempt in recent_attempts:
            try:
                file = file_service.get_file(attempt.file_id, user_id)
                file_name = file.original_name if file else "Unknown"
            except:
                file_name = "Unknown"
            
            attempts_with_files.append({
                "id": attempt.id,
                "file_id": attempt.file_id,
                "file_name": file_name,
                "score": attempt.score,
                "total": attempt.total,
                "percentage": attempt.percentage,
                "completed_at": attempt.completed_at.isoformat()
            })
        
        return {
            "stats": {
                "files_studied": stats.get("files_studied", 0),
                "quizzes_taken": stats.get("total_attempts", 0),
                "avg_score": stats.get("average_score", 0),
                "total_correct": stats.get("total_correct", 0),
                "total_questions": stats.get("total_questions", 0)
            },
            "recentAttempts": attempts_with_files
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.post("/api/study/session", status_code=status.HTTP_201_CREATED)
async def save_study_session(
    request: StudySessionRequest,
    user_id: CurrentUser,
    study_service: StudySessionServ
) -> Dict[str, Any]:
    """
    Record a study session with time tracking.
    
    - Tracks study duration
    - Associates with file and user
    - Used for analytics and progress tracking
    """
    try:
        session = study_service.record_study_session(
            user_id=user_id,
            file_id=request.fileId,
            duration_seconds=request.durationSeconds,
            started_at=request.startedAt
        )
        
        return {
            "success": True,
            "sessionId": session.id
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.get("/api/study/time/{file_id}")
async def get_study_time(
    file_id: str,
    user_id: CurrentUser,
    study_service: StudySessionServ
) -> Dict[str, int]:
    """Get total study time for a specific file."""
    try:
        total_seconds = study_service.get_file_study_time(user_id, file_id)
        return {"totalSeconds": total_seconds}
    except Exception as e:
        raise handle_service_exception(e)


@router.get("/api/study/time")
async def get_total_time(
    user_id: CurrentUser,
    study_service: StudySessionServ
) -> Dict[str, int]:
    """Get total study time across all files."""
    try:
        total_seconds = study_service.get_user_total_study_time(user_id)
        return {"totalSeconds": total_seconds}
    except Exception as e:
        raise handle_service_exception(e)
        total_seconds = get_user_total_study_time(user_id)
        return {"totalSeconds": total_seconds}
    except Exception as e:
        print(f"Get total study time error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get total study time")
