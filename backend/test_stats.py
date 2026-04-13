"""Test user stats endpoint"""
import sys
sys.path.insert(0, '.')

from repository.quiz_repository import QuizRepository
from repository.file_repository import FileRepository
from repository.user_repository import UserRepository
from services.quiz_service import QuizService

# Initialize repositories
quiz_repo = QuizRepository()
file_repo = FileRepository()
user_repo = UserRepository()

# Get user ID
user = user_repo.find_by_email('mored321@hotmail.com')
if not user:
    print("❌ User not found")
    sys.exit(1)

print(f"✅ Found user: {user.email} (ID: {user.id})")

# Initialize service
quiz_service = QuizService(quiz_repo, file_repo)

# Try to get stats
try:
    stats = quiz_service.get_user_stats(user.id)
    print(f"\n✅ Stats retrieved successfully:")
    print(f"  stats: {stats}")
except Exception as e:
    print(f"\n❌ Failed to get stats: {e}")
    import traceback
    traceback.print_exc()

# Try to get recent attempts
try:
    recent = quiz_service.get_recent_attempts(user.id, limit=5)
    print(f"\n✅ Recent attempts: {len(recent)} found")
    for attempt in recent:
        print(f"  - {attempt.id}: {attempt.score}/{attempt.total}")
except Exception as e:
    print(f"\n❌ Failed to get recent attempts: {e}")
    import traceback
    traceback.print_exc()
