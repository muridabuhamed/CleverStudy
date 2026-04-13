# Migration Guide - From Old to New Architecture

This guide explains how to gradually migrate from the old monolithic code to the new clean architecture.

## 🎯 Migration Strategy

**Approach:** Gradual migration with coexistence

- Old and new code can run side-by-side
- Migrate route by route, not all at once
- Test each migration before proceeding
- Zero downtime deployment

---

## 📋 Migration Checklist

### Phase 1: Setup (✅ Complete)
- [x] Install new dependencies
- [x] Create core infrastructure (config, logging, exceptions)
- [x] Create domain models
- [x] Create repository layer
- [x] Create service layer
- [x] Create API dependencies
- [x] Create test infrastructure

### Phase 2: Migrate Routes (In Progress)
- [ ] Auth routes (`/api/auth/*`)
- [ ] File routes (`/api/files/*`)
- [ ] Quiz routes (`/api/quiz/*`)
- [ ] Flashcard routes (`/api/flashcards/*`)
- [ ] Annotation routes (new)
- [ ] Study session routes (new)

### Phase 3: Replace Old Files
- [ ] Replace `database.py` imports with repositories
- [ ] Replace `auth.py` with `services/auth_service.py`
- [ ] Remove old `gemini_service.py`
- [ ] Remove old `pdf_service.py`

### Phase 4: Testing
- [ ] Add repository tests
- [ ] Add service tests
- [ ] Add integration tests
- [ ] Achieve 80%+ code coverage

### Phase 5: Cleanup
- [ ] Delete old unused files
- [ ] Update documentation
- [ ] Performance testing
- [ ] Production deployment

---

## 🔄 Example Migration: Auth Route

### Old Code (routers/auth.py)

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import bcrypt
import jwt
import uuid
from database import create_user, get_user_by_email

router = APIRouter()

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

@router.post("/signup")
async def signup(req: SignupRequest):
    try:
        # Direct database access
        existing = get_user_by_email(req.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email exists")
        
        # Password hashing in route
        password_hash = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()
        
        # Direct database insert
        user_id = str(uuid.uuid4())
        create_user(user_id, req.email, password_hash, req.name)
        
        # JWT generation in route
        token = jwt.encode({"userId": user_id}, JWT_SECRET)
        
        return {"user": {"id": user_id, "email": req.email}, "token": token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### New Code (api/v1/auth.py)

```python
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any

from domain.user import UserCreate, UserLogin, UserResponse
from api.dependencies import AuthServ, handle_service_exception

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])

@router.post("/signup", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    auth_service: AuthServ
):
    """
    Register a new user.
    
    - Validates email format and password strength (handled by UserCreate model)
    - Checks for duplicate email
    - Hash password securely
    - Returns user data and JWT token
    """
    try:
        user, token = auth_service.register_user(user_data)
        
        return {
            "user": UserResponse.model_validate(user),
            "token": token
        }
    except Exception as e:
        raise handle_service_exception(e)
```

### Changes Made:

1. **Separation of Concerns:**
   - Route only handles HTTP concerns
   - All logic moved to `AuthService`
   - Database access through repository

2. **Type Safety:**
   - `UserCreate` model validates input
   - `UserResponse` model formats output
   - No raw dictionaries

3. **Error Handling:**
   - Custom exceptions from service layer
   - Consistent error responses
   - Proper HTTP status codes

4. **Dependency Injection:**
   - `AuthServ` injected automatically
   - Easy to mock for testing
   - Loose coupling

5. **Documentation:**
   - Clear docstring
   - OpenAPI spec generated automatically
   - Response models documented

---

## 🛠️ Step-by-Step Route Migration

### Step 1: Create New Route File

Create `backend/api/v1/auth.py`:

```python
from fastapi import APIRouter
from api.dependencies import AuthServ

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])
```

### Step 2: Migrate One Endpoint

Start with the simplest endpoint:

```python
@router.post("/login")
async def login(login_data: UserLogin, auth_service: AuthServ):
    try:
        user, token = auth_service.login_user(login_data)
        return {"user": UserResponse.model_validate(user), "token": token}
    except Exception as e:
        raise handle_service_exception(e)
```

### Step 3: Add to Main App

In `main.py`, add the new route alongside the old one:

```python
from api.v1 import auth as auth_v1
from routers import auth as auth_old

# Old routes (keep for now)
app.include_router(auth_old.router)

# New routes (v1)
app.include_router(auth_v1.router)
```

### Step 4: Test Both Versions

```bash
# Test old endpoint
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test new endpoint (v1)
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Step 5: Update Frontend (Gradually)

Update API calls one at a time:

```typescript
// Old way
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

// New way (update when ready)
const response = await api.auth.login(credentials);
```

### Step 6: Monitor and Validate

- Check logs for errors
- Monitor performance
- Validate data integrity
- Gather user feedback

### Step 7: Remove Old Route

Once confident the new version works:

```python
# In main.py
# app.include_router(auth_old.router)  # Remove old route
app.include_router(auth_v1.router)     # Keep new route
```

---

## 📊 Migration Tracking

### Routes Migration Status

| Route | Old Path | New Path | Status | Notes |
|-------|----------|----------|--------|-------|
| Signup | `/api/auth/signup` | `/api/v1/auth/signup` | ✅ Ready | Service implemented |
| Login | `/api/auth/login` | `/api/v1/auth/login` | ✅ Ready | Service implemented |
| Upload | `/api/files/upload` | `/api/v1/files/upload` | ✅ Ready | Service implemented |
| Analyze | `/api/files/{id}/analyze` | `/api/v1/files/{id}/analyze` | ✅ Ready | Service implemented |
| Quiz Submit | `/api/quiz/submit` | `/api/v1/quiz/submit` | ✅ Ready | Service implemented |
| Flashcards | `/api/flashcards` | `/api/v1/flashcards` | ✅ Ready | Service implemented |
| Chat | `/api/chat` | `/api/v1/chat` | 🔄 TODO | Needs migration |
| Study Time | `/api/study-time` | `/api/v1/study-sessions` | ✅ Ready | Service implemented |

### Database Access Migration

| Old Function | New Class | Status |
|--------------|-----------|--------|
| `create_user()` | `UserRepository.create()` | ✅ |
| `get_user_by_email()` | `UserRepository.find_by_email()` | ✅ |
| `add_file_record()` | `FileRepository.create()` | ✅ |
| `get_all_files()` | `FileRepository.find_all()` | ✅ |
| `update_file_analysis()` | `FileRepository.update_analysis()` | ✅ |

---

## 🧪 Testing During Migration

### Test Both Versions

Create comparison tests:

```python
def test_login_old_vs_new():
    """Ensure old and new endpoints return same data."""
    credentials = {"email": "test@example.com", "password": "password123"}
    
    # Test old endpoint
    old_response = client.post("/api/auth/login", json=credentials)
    
    # Test new endpoint
    new_response = client.post("/api/v1/auth/login", json=credentials)
    
    # Compare responses
    assert old_response.status_code == new_response.status_code
    assert old_response.json()["user"]["id"] == new_response.json()["user"]["id"]
```

### Database State Validation

```python
def test_database_integrity():
    """Ensure migrations don't corrupt data."""
    # Count records before
    count_before = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    
    # Perform operation
    auth_service.register_user(user_data)
    
    # Count records after
    count_after = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    
    assert count_after == count_before + 1
```

---

## 🚨 Common Migration Issues

### Issue 1: Import Errors

**Problem:** `ImportError: cannot import name 'UserRepository'`

**Solution:**
```python
# Make sure __init__.py files exist
backend/
  repository/
    __init__.py    # Must export UserRepository
```

### Issue 2: Database Connection

**Problem:** `sqlite3.OperationalError: unable to open database file`

**Solution:**
```python
# Ensure DATA_DIR exists
from core.config import get_settings
settings = get_settings()
settings.data_dir.mkdir(exist_ok=True)
```

### Issue 3: Circular Imports

**Problem:** `ImportError: cannot import name 'X' from partially initialized module`

**Solution:**
```python
# Use TYPE_CHECKING for type hints
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from services.auth_service import AuthService

def my_function(auth_service: 'AuthService'):  # String literal
    pass
```

### Issue 4: Missing Dependencies

**Problem:** `ModuleNotFoundError: No module named 'pydantic'`

**Solution:**
```bash
pip install -r backend/requirements.txt
```

---

## 📈 Performance Considerations

### Before Migration
```python
# Inefficient: Multiple database queries
user = get_user(user_id)
files = get_user_files(user_id)
stats = calculate_stats(user_id)
```

### After Migration
```python
# Efficient: Single query with joins
user_data = user_repo.get_user_with_stats(user_id)
```

### Caching Strategy

```python
# Add caching to expensive operations
@lru_cache(maxsize=100)
def get_file_cached_text(file_id: str) -> str:
    return file_repo.get_cached_text(file_id)
```

---

## ✅ Validation Checklist

Before marking a route as migrated:

- [ ] Route uses service layer (no direct DB access)
- [ ] Uses Pydantic models for input/output
- [ ] Proper error handling with custom exceptions
- [ ] Dependency injection for all dependencies
- [ ] Unit tests written for service
- [ ] Integration test for API endpoint
- [ ] Documentation updated
- [ ] Old route removed (or marked deprecated)
- [ ] Frontend updated to use new endpoint
- [ ] Performance tested (no regression)

---

## 🎓 Learning Resources

- [FastAPI Dependency Injection](https://fastapi.tiangolo.com/tutorial/dependencies/)
- [Clean Architecture in Python](https://www.cosmicpython.com/)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Pydantic Documentation](https://docs.pydantic.dev/)

---

## 📞 Getting Help

If you encounter issues during migration:

1. Check error logs in `backend/logs/`
2. Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for architecture
3. Look at [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for examples
4. Check existing tests for patterns

---

**Remember:** Migration is a gradual process. Take it one route at a time and validate thoroughly before proceeding.
