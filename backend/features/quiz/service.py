"""
Quiz service.

This module handles quiz attempts, scoring, and study session tracking.
"""
import uuid
from typing import List, Dict, Any
from datetime import datetime

from repository.quiz_repository import QuizRepository, StudySessionRepository
from repository.file_repository import FileRepository
from domain.quiz import (
    QuizAttemptModel,
    QuizAttemptCreate,
    QuizAnswer,
    QuizAnswerResult,
    StudySessionCreate
)
from domain.file import QuestionModel
from core.exceptions import (
    ResourceNotFoundError,
    AuthorizationError,
    ValidationError
)
from core.logging import get_logger

logger = get_logger(__name__)


class QuizService:
    """
    Service for quiz operations.
    
    Handles quiz attempts, answer validation, scoring, and statistics.
    """
    
    def __init__(
        self,
        quiz_repository: QuizRepository,
        file_repository: FileRepository
    ):
        """
        Initialize quiz service.
        
        Args:
            quiz_repository: Quiz data access layer
            file_repository: File data access layer
        """
        self.quiz_repo = quiz_repository
        self.file_repo = file_repository
    
    def get_quiz_questions(
        self,
        file_id: str,
        user_id: str
    ) -> List[QuestionModel]:
        """
        Get quiz questions for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            List of questions
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
            ValidationError: If file has no questions
        """
        # Verify file exists and user owns it
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        # Check if file has questions
        if not file.questions:
            raise ValidationError(
                f"File {file_id} has not been analyzed yet or has no questions"
            )
        
        return file.questions
    
    def submit_quiz_attempt(
        self,
        attempt_data: QuizAttemptCreate
    ) -> QuizAttemptModel:
        """
        Submit a quiz attempt.
        
        Args:
            attempt_data: Quiz attempt data
            
        Returns:
            Created quiz attempt
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
        """
        # Verify file exists and user owns it
        file = self.file_repo.find_by_id(attempt_data.file_id)
        if not file:
            raise ResourceNotFoundError("File", attempt_data.file_id)
        
        if file.user_id != attempt_data.user_id:
            raise AuthorizationError(
                f"Access denied to file {attempt_data.file_id}"
            )
        
        # Create attempt
        attempt_id = str(uuid.uuid4())
        attempt = QuizAttemptModel(
            id=attempt_id,
            user_id=attempt_data.user_id,
            file_id=attempt_data.file_id,
            score=attempt_data.score,
            total=attempt_data.total,
            completed_at=datetime.now()
        )
        
        created_attempt = self.quiz_repo.create(attempt)
        
        logger.info(
            f"Quiz attempt submitted: {attempt_id} "
            f"(score: {attempt_data.score}/{attempt_data.total})"
        )
        
        return created_attempt
    
    def grade_answers(
        self,
        file_id: str,
        user_id: str,
        answers: List[QuizAnswer]
    ) -> QuizAnswerResult:
        """
        Grade user's quiz answers.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            answers: User's answers
            
        Returns:
            Grading result with score and feedback
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
        """
        # Get questions
        questions = self.get_quiz_questions(file_id, user_id)
        
        # Validate answer count
        if len(answers) != len(questions):
            raise ValidationError(
                f"Expected {len(questions)} answers, got {len(answers)}"
            )
        
        # Grade each answer
        correct_count = 0
        results = []
        
        for i, (question, answer) in enumerate(zip(questions, answers)):
            is_correct = answer.selectedAnswer == question.correctAnswer
            
            if is_correct:
                correct_count += 1
            
            results.append({
                "question_index": i,
                "question": question.question,
                "user_answer": answer.selectedAnswer,
                "correct_answer": question.correctAnswer,
                "is_correct": is_correct,
                "explanation": question.options[question.correctAnswer] if is_correct else None
            })
        
        total = len(questions)
        percentage = (correct_count / total * 100) if total > 0 else 0
        
        logger.info(
            f"Quiz graded for file {file_id}: "
            f"{correct_count}/{total} ({percentage:.1f}%)"
        )
        
        return QuizAnswerResult(
            score=correct_count,
            total=total,
            percentage=round(percentage, 2),
            results=results
        )
    
    def get_user_attempts(
        self,
        user_id: str,
        limit: int = 10
    ) -> List[QuizAttemptModel]:
        """
        Get user's recent quiz attempts.
        
        Args:
            user_id: User identifier
            limit: Maximum attempts to return
            
        Returns:
            List of quiz attempts
        """
        return self.quiz_repo.find_by_user(user_id, limit=limit)
    
    def get_file_attempts(
        self,
        file_id: str,
        user_id: str
    ) -> List[QuizAttemptModel]:
        """
        Get all quiz attempts for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            List of quiz attempts
            
        Raises:
            AuthorizationError: If user doesn't own file
        """
        # Verify user owns file
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        return self.quiz_repo.find_by_file(file_id, user_id=user_id)
    
    def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Get comprehensive quiz statistics for a user.
        
        Args:
            user_id: User identifier
            
        Returns:
            Dictionary with quiz statistics
        """
        return self.quiz_repo.get_user_stats(user_id)
    
    def get_recent_attempts(self, user_id: str, limit: int = 5) -> List[QuizAttemptModel]:
        """
        Get recent quiz attempts for a user.
        
        Args:
            user_id: User identifier
            limit: Maximum number of attempts to return
            
        Returns:
            List of recent quiz attempts
        """
        return self.quiz_repo.find_by_user(user_id, limit=limit)
    
    def get_file_stats(self, file_id: str, user_id: str) -> Dict[str, Any]:
        """
        Get quiz statistics for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            Dictionary with file quiz statistics
        """
        # Verify access
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        return self.quiz_repo.get_file_stats(file_id)


class StudySessionService:
    """
    Service for study session tracking.
    
    Handles study time recording and statistics.
    """
    
    def __init__(
        self,
        session_repository: StudySessionRepository,
        file_repository: FileRepository
    ):
        """
        Initialize study session service.
        
        Args:
            session_repository: Study session data access layer
            file_repository: File data access layer
        """
        self.session_repo = session_repository
        self.file_repo = file_repository
    
    def record_study_session(
        self,
        session_data: StudySessionCreate
    ) -> str:
        """
        Record a study session.
        
        Args:
            session_data: Session data
            
        Returns:
            Created session ID
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
        """
        # Verify file exists and user owns it
        file = self.file_repo.find_by_id(session_data.file_id)
        if not file:
            raise ResourceNotFoundError("File", session_data.file_id)
        
        if file.user_id != session_data.user_id:
            raise AuthorizationError(
                f"Access denied to file {session_data.file_id}"
            )
        
        # Create session
        session_id = self.session_repo.create_session(session_data)
        
        logger.info(
            f"Study session recorded: {session_id} "
            f"({session_data.duration_seconds}s)"
        )
        
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
            days: Days to look back
            
        Returns:
            Study time statistics
        """
        return self.session_repo.get_user_study_time(user_id, days=days)
    
    def get_user_total_study_time(self, user_id: str) -> int:
        """
        Get total study time for a user (all time).
        
        Args:
            user_id: User identifier
            
        Returns:
            Total seconds spent studying
        """
        stats = self.session_repo.get_user_study_time(user_id, days=36500)  # ~100 years
        return stats.get('total_seconds', 0)
    
    def get_file_study_time(
        self,
        file_id: str,
        user_id: str
    ) -> int:
        """
        Get total study time for a file.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            Total seconds spent studying
        """
        # Verify access
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        return self.session_repo.get_file_study_time(file_id, user_id=user_id)
