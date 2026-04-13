"""Test file serialization"""
import sys
import json
sys.path.insert(0, '.')

from repository.file_repository import FileRepository
from repository.user_repository import UserRepository
from services.file_service import FileService

# Initialize repositories
file_repo = FileRepository()
user_repo = UserRepository()
file_service = FileService(file_repo, user_repo)

# Get user ID
user = user_repo.find_by_email('mored321@hotmail.com')
if not user:
    print("❌ User not found")
    sys.exit(1)

print(f"✅ Found user: {user.email} (ID: {user.id})")

# Get files
files = file_service.list_user_files(user.id)
print(f"✅ Files retrieved: {len(files)} files found\n")

# Try to serialize each file
for f in files:
    print(f"File: {f.original_name}")
    print(f"  ID: {f.id}")
    print(f"  Status: {f.status}")
    print(f"  Created: {f.created_at.isoformat()}")
    print(f"  Topics: {f.topics}")
    print(f"  Questions count: {len(f.questions)}")
    
    # Try to create response dict
    try:
        response_dict = {
            "id": f.id,
            "name": f.original_name,
            "filename": f.filename,
            "status": f.status,
            "uploaded_at": f.created_at.isoformat(),
            "topics": f.topics,
            "questions": [q.dict() if hasattr(q, 'dict') else q for q in f.questions]
        }
        # Try to JSON serialize it
        json_str = json.dumps(response_dict, indent=2)
        print(f"  ✅ Serialization successful")
    except Exception as e:
        print(f"  ❌ Serialization failed: {e}")
        print(f"     Questions type: {type(f.questions)}")
        if f.questions:
            print(f"     First question type: {type(f.questions[0])}")
    print()
