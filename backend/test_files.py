"""Test the files endpoint to debug library loading issue."""
import sys
sys.path.insert(0, 'C:\\Users\\Mored\\CleverStudy\\backend')

from services.auth_service import AuthService
from repository.user_repository import UserRepository
from repository.file_repository import FileRepository
from services.file_service import FileService
from auth import create_access_token

# Get user
user_repo = UserRepository()
user = user_repo.find_by_email('mored321@hotmail.com')

if user:
    print(f"✅ User: {user.email}")
    
    # Create token
    token = create_access_token({"userId": user.id})
    print(f"✅ Token created: {token[:40]}...")
    
    # Test file repository
    file_repo = FileRepository()
    file_service = FileService(file_repo, user_repo)
    
    try:
        files = file_service.list_user_files(user.id)
        print(f"\n✅ Files retrieved: {len(files)} files found")
        for f in files:
            print(f"  - {f.original_name} (Status: {f.status})")
    except Exception as e:
        print(f"\n❌ Error getting files: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
else:
    print("❌ User not found")
