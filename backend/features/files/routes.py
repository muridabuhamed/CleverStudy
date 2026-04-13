"""File management routes using clean architecture."""
import shutil
import uuid
from pathlib import Path
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, UploadFile, File, status
from pydantic import BaseModel

from api.dependencies import (
    CurrentUser, FileServ, handle_service_exception,
    get_gemini_client, get_pdf_processor
)
from core.config import get_settings
from services.ai.gemini_client import GeminiClient
from services.ai.pdf_processor import PdfProcessor
from domain.file import FileStatus

router = APIRouter()
settings = get_settings()


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []


@router.get("/api/files")
async def list_files(
    user_id: CurrentUser,
    file_service: FileServ
) -> List[Dict[str, Any]]:
    """Get all files for the authenticated user."""
    try:
        files = file_service.list_user_files(user_id)
        return [
            {
                "id": f.id,
                "original_name": f.original_name,
                "filename": f.filename,
                "status": f.status,
                "created_at": f.created_at.isoformat(),
                "topics": f.topics,
                "questions": [q.dict() if hasattr(q, 'dict') else q for q in f.questions]
            }
            for f in files
        ]
    except Exception as e:
        raise handle_service_exception(e)


@router.post("/api/upload", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    user_id: CurrentUser = None,
    file_service: FileServ = None
) -> Dict[str, Any]:
    """
    Upload a PDF file for processing.
    
    - Only PDF files allowed
    - File size must be within limits (configured in settings)
    - Returns file ID for subsequent operations
    """
    try:
        if not file.filename:
            from core.exceptions import ValidationError
            raise ValidationError("File name is required")

        # UploadFile.size can be missing depending on server/runtime; compute size safely.
        file_size = getattr(file, "size", None)
        if not isinstance(file_size, int) or file_size < 0:
            current_pos = file.file.tell()
            file.file.seek(0, 2)
            file_size = file.file.tell()
            file.file.seek(current_pos)

        # Validate file
        file_service.validate_file_upload(file.filename, file_size)

        # Persist with a generated disk filename while keeping original name for UI.
        suffix = Path(file.filename).suffix.lower() or ".pdf"
        saved_filename = f"{uuid.uuid4()}{suffix}"
        
        # Create file record
        file_model = file_service.create_file_record(
            user_id=user_id,
            original_filename=file.filename,
            saved_filename=saved_filename
        )

        # Save physical file to uploads directory
        file_path = settings.uploads_dir / saved_filename
        file_path.parent.mkdir(parents=True, exist_ok=True)

        with open(file_path, "wb") as buffer:
            file.file.seek(0)
            shutil.copyfileobj(file.file, buffer)

        return {
            "success": True,
            "fileId": file_model.id,
            "filename": file_model.filename,
            "message": "File uploaded successfully"
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.post("/api/process/{file_id}")
async def process_document(
    file_id: str,
    user_id: CurrentUser,
    file_service: FileServ,
    pdf_processor: PdfProcessor = Depends(get_pdf_processor),
    gemini_client: GeminiClient = Depends(get_gemini_client)
) -> Dict[str, Any]:
    """
    Process PDF document with AI analysis.

    - Extracts text from PDF
    - Analyzes content to generate topics and quiz questions
    - Caches extracted text for faster subsequent operations
    """
    try:
        # Get file and verify ownership
        file_service.get_file(file_id, user_id)
        file_path = file_service.get_file_physical_path(file_id, user_id)

        # Get or extract text
        text = file_service.get_or_cache_text(file_id, user_id)
        if not text:
            text = pdf_processor.extract_text(file_path)
            if text:
                file_service.cache_extracted_text(file_id, text, user_id=user_id)

        if not text:
            from core.exceptions import FileProcessingError
            raise FileProcessingError("Could not extract text from PDF")

        # Update status to processing
        file_service.set_file_status(file_id, FileStatus.PROCESSING, user_id=user_id)

        # Analyze document with AI
        analysis = gemini_client.analyze_document(text)

        # Update file with analysis results and mark complete
        file_service.update_analysis(
            file_id=file_id,
            topics=analysis['topics'],
            questions=analysis['questions'],
            user_id=user_id
        )
        file_service.set_file_status(file_id, FileStatus.COMPLETED, user_id=user_id)
        
        return {
            "success": True,
            "topics": analysis['topics'],
            "questions": analysis['questions']
        }
    except Exception as e:
        # Mark file as error state if processing fails
        try:
            file_service.set_file_status(file_id, FileStatus.ERROR, user_id=user_id)
        except Exception:
            pass
        raise handle_service_exception(e)


@router.post("/api/chat/{file_id}")
async def chat(
    file_id: str,
    request: ChatRequest,
    user_id: CurrentUser,
    file_service: FileServ,
    pdf_processor: PdfProcessor = Depends(get_pdf_processor),
    gemini_client: GeminiClient = Depends(get_gemini_client)
) -> Dict[str, str]:
    """
    Chat with AI about the PDF document.
    
    - Requires document to be uploaded
    - Uses cached text for better performance
    - Maintains conversation history
    """
    try:
        # Verify file ownership
        file_service.get_file(file_id, user_id)

        # Get or extract text
        text = file_service.get_or_cache_text(file_id, user_id)
        if not text:
            file_path = file_service.get_file_physical_path(file_id, user_id)
            text = pdf_processor.extract_text(file_path)
            if text:
                file_service.cache_extracted_text(file_id, text, user_id=user_id)

        if not text:
            return {
                "response": "I'm sorry, I couldn't read the text from this PDF. "
                           "It might be scanned or empty."
            }
        
        # Chat with AI
        response = gemini_client.chat_with_document(
            document_text=text,
            user_message=request.message,
            history=request.history or []
        )
        
        return {"response": response}
    except Exception as e:
        raise handle_service_exception(e)


@router.delete("/api/files/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(
    file_id: str,
    user_id: CurrentUser,
    file_service: FileServ
):
    """
    Delete a PDF file and all associated data.
    
    - Removes physical file from disk
    - Removes database record
    - Removes cached text
    """
    try:
        file_service.delete_file(file_id, user_id)
    except Exception as e:
        raise handle_service_exception(e)
