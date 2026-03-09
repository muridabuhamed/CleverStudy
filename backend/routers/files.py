import os
import uuid
import shutil
import traceback
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from config import UPLOADS_DIR
from database import (
    add_file_record, get_files_by_user, delete_file_record,
    get_file_by_id, update_file_analysis
)
from services.pdf_service import extract_text_from_pdf
from services.gemini_service import analyze_document, chat_with_document
from auth import get_current_user

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []


@router.get("/api/files")
async def list_files(user_id: str = Depends(get_current_user)):
    try:
        return get_files_by_user(user_id)
    except Exception as e:
        print(f"List files error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/upload")
async def upload_file(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    try:
        if file.content_type != 'application/pdf':
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOADS_DIR, file_id + '.pdf')

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        add_file_record(file_id, file.filename, file.filename, user_id)

        return {"success": True, "fileId": file_id, "message": "File uploaded successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/process/{file_id}")
async def process_document_endpoint(file_id: str, user_id: str = Depends(get_current_user)):
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

        analysis = await analyze_document(text)
        update_file_analysis(file_id, analysis['topics'], analysis['questions'])

        return {"success": True, "topics": analysis['topics'], "questions": analysis['questions']}
    except HTTPException:
        raise
    except Exception as e:
        msg = str(e)
        if '429' in msg or 'quota' in msg.lower():
            raise HTTPException(status_code=429, detail="AI quota exceeded. Please wait a minute and try again.")
        print(f"Processing error: {e}")
        raise HTTPException(status_code=500, detail=msg)


@router.post("/api/chat/{file_id}")
async def chat(file_id: str, request: ChatRequest, user_id: str = Depends(get_current_user)):
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
            return {"response": "I'm sorry, I couldn't read the text from this PDF. It might be scanned or empty."}

        response = await chat_with_document(text, request.message, request.history)
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        msg = str(e)
        if '429' in msg or 'quota' in msg.lower():
            raise HTTPException(status_code=429, detail="AI quota exceeded. Please wait a minute and try again.")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=msg)


@router.delete("/api/files/{file_id}")
async def delete_file(file_id: str, user_id: str = Depends(get_current_user)):
    try:
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
