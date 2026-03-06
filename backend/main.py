import os
import uuid
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
from pydantic import BaseModel

from database import init_db, add_file_record, update_file_analysis, get_all_files, delete_file_record
from services.pdf_service import extract_text_from_pdf
from services.gemini_service import analyze_document, chat_with_document

app = FastAPI(title="Smart Study Platform API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Static files for PDF serving
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Init DB
init_db()

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": "now"}

@app.get("/api/files")
def list_files():
    try:
        return get_all_files()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOADS_DIR, file_id)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        add_file_record(file_id, file.filename, file.filename)
        
        return {
            "success": True, 
            "fileId": file_id, 
            "message": "File uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process/{file_id}")
async def process_document(file_id: str):
    file_path = os.path.join(UPLOADS_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
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
    except Exception as e:
        print(f"Processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat/{file_id}")
async def chat(file_id: str, request: ChatRequest):
    file_path = os.path.join(UPLOADS_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        text = extract_text_from_pdf(file_path)
        if not text:
            return {"response": "I'm sorry, I couldn't read the text from this PDF. It might be scanned or empty."}
            
        response = await chat_with_document(text, request.message, request.history)
        return {"response": response}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/files/{file_id}")
def delete_file(file_id: str):
    try:
        file_path = os.path.join(UPLOADS_DIR, file_id)
        if os.path.exists(file_path):
            os.remove(file_path)
        delete_file_record(file_id)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
