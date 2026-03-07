import os
import uuid
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
from pydantic import BaseModel

from database import (
    init_db, add_file_record, update_file_analysis, get_files_by_user, 
    delete_file_record, get_file_by_id, create_user, get_user_by_email, 
    get_user_by_id, add_quiz_attempt, get_user_stats, get_recent_attempts,
    add_flashcards, get_flashcards_by_file, add_flashcard_review, get_flashcard_stats
)
from services.pdf_service import extract_text_from_pdf
from services.gemini_service import analyze_document, chat_with_document, generate_flashcards
from auth import get_password_hash, verify_password, create_access_token, get_current_user

app = FastAPI(title="Smart Study Platform API")

# Enable CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories — use Render's persistent disk if available, else local
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
UPLOADS_DIR = os.getenv("UPLOADS_DIR", os.path.join(BASE_DIR, 'uploads'))
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Static files for PDF serving
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Init DB
init_db()

# Pydantic models
class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class QuizSubmitRequest(BaseModel):
    fileId: str
    score: int
    total: int

class FlashcardGenerateRequest(BaseModel):
    count: int = 15

class FlashcardReviewRequest(BaseModel):
    flashcardId: str
    difficulty: str  # 'easy', 'medium', 'hard'

@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": "now"}

# ============ Authentication Endpoints ============

@app.post("/api/auth/signup")
async def signup(request: SignupRequest):
    """Create a new user account"""
    try:
        # Check if user already exists
        existing_user = get_user_by_email(request.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        password_hash = get_password_hash(request.password)
        user_id = str(uuid.uuid4())
        
        # Create user
        create_user(user_id, request.email, password_hash, request.name)
        
        # Generate token
        token = create_access_token({"userId": user_id})
        
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user_id,
                "email": request.email,
                "name": request.name
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create account")

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """Login with email and password"""
    try:
        # Find user
        user = get_user_by_email(request.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        if not verify_password(request.password, user['password']):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Generate token
        token = create_access_token({"userId": user['id']})
        
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user['id'],
                "email": user['email'],
                "name": user['name']
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Failed to login")

@app.get("/api/auth/me")
async def get_me(user_id: str = Depends(get_current_user)):
    """Get current user info"""
    try:
        user = get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user['id'],
            "email": user['email'],
            "name": user['name']
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get user error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user")

# ============ File Management Endpoints ============

@app.get("/api/files")
async def list_files(user_id: str = Depends(get_current_user)):
    """Get all files for the current user"""
    try:
        return get_files_by_user(user_id)
    except Exception as e:
        print(f"List files error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    """Upload a PDF file"""
    try:
        # Check file type
        if file.content_type != 'application/pdf':
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOADS_DIR, file_id + '.pdf')
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Add to database with user_id
        add_file_record(file_id, file.filename, file.filename, user_id)
        
        return {
            "success": True, 
            "fileId": file_id, 
            "message": "File uploaded successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process/{file_id}")
async def process_document_endpoint(file_id: str, user_id: str = Depends(get_current_user)):
    """Process a PDF document with AI"""
    try:
        # Verify file ownership
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
            
        analysis = await analyze_document(text)
        update_file_analysis(file_id, analysis['topics'], analysis['questions'])
        
        return {
            "success": True,
            "topics": analysis['topics'],
            "questions": analysis['questions']
        }
    except HTTPException:
        raise
    except Exception as e:
        msg = str(e)
        if '429' in msg or 'quota' in msg.lower():
            raise HTTPException(status_code=429, detail="AI quota exceeded. Please wait a minute and try again.")
        print(f"Processing error: {e}")
        raise HTTPException(status_code=500, detail=msg)

@app.post("/api/chat/{file_id}")
async def chat(file_id: str, request: ChatRequest, user_id: str = Depends(get_current_user)):
    """Chat with a document"""
    try:
        # Verify file ownership
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
            return {"response": "I'm sorry, I couldn't read the text from this PDF. It might be scanned or empty."}
            
        response = await chat_with_document(text, request.message, request.history)
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        msg = str(e)
        if '429' in msg or 'quota' in msg.lower():
            raise HTTPException(status_code=429, detail="AI quota exceeded. Please wait a minute and try again.")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=msg)

@app.delete("/api/files/{file_id}")
async def delete_file(file_id: str, user_id: str = Depends(get_current_user)):
    """Delete a file"""
    try:
        # Verify file ownership
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        file_path = os.path.join(UPLOADS_DIR, file_id + '.pdf')
        if os.path.exists(file_path):
            os.remove(file_path)
        delete_file_record(file_id)
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============ Quiz Endpoints ============

@app.post("/api/quiz/submit")
async def submit_quiz(request: QuizSubmitRequest, user_id: str = Depends(get_current_user)):
    """Submit a quiz attempt"""
    try:
        attempt_id = str(uuid.uuid4())
        add_quiz_attempt(attempt_id, user_id, request.fileId, request.score, request.total)
        return {"success": True, "attemptId": attempt_id}
    except Exception as e:
        print(f"Submit quiz error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save quiz attempt")

@app.get("/api/user/stats")
async def get_stats(user_id: str = Depends(get_current_user)):
    """Get user statistics"""
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

# ============ Flashcard Endpoints ============

@app.post("/api/flashcards/generate/{file_id}")
async def generate_flashcards_endpoint(file_id: str, request: FlashcardGenerateRequest, user_id: str = Depends(get_current_user)):
    """Generate flashcards from a document"""
    try:
        # Verify file ownership
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        file_path = os.path.join(UPLOADS_DIR, file_id + '.pdf')
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found on disk")
        
        # Extract text
        text = extract_text_from_pdf(file_path)
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Generate flashcards using AI
        flashcards_data = await generate_flashcards(text, request.count)
        
        # Add IDs and file_id
        flashcards_with_ids = [
            {
                "id": str(uuid.uuid4()),
                "file_id": file_id,
                "question": fc["question"],
                "answer": fc["answer"]
            }
            for fc in flashcards_data
        ]
        
        # Save to database
        add_flashcards(flashcards_with_ids)
        
        return {
            "success": True,
            "flashcards": flashcards_with_ids,
            "count": len(flashcards_with_ids)
        }
    except HTTPException:
        raise
    except Exception as e:
        msg = str(e)
        if '429' in msg or 'quota' in msg.lower():
            raise HTTPException(status_code=429, detail="AI quota exceeded. Please wait a minute and try again.")
        print(f"Generate flashcards error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate flashcards")

@app.get("/api/flashcards/{file_id}")
async def get_flashcards(file_id: str, user_id: str = Depends(get_current_user)):
    """Get flashcards for a file"""
    try:
        # Verify file ownership
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        flashcards = get_flashcards_by_file(file_id)
        stats = get_flashcard_stats(user_id, file_id)
        
        return {
            "flashcards": flashcards,
            "stats": stats
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get flashcards error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get flashcards")

@app.post("/api/flashcards/review")
async def review_flashcard(request: FlashcardReviewRequest, user_id: str = Depends(get_current_user)):
    """Record a flashcard review"""
    try:
        review_id = str(uuid.uuid4())
        add_flashcard_review(review_id, user_id, request.flashcardId, request.difficulty)
        return {"success": True, "reviewId": review_id}
    except Exception as e:
        print(f"Review flashcard error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save review")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
