"""PDF annotation routes using clean architecture."""
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Query, status
from pydantic import BaseModel

from api.dependencies import (
    CurrentUser, HighlightServ, AnnotationServ, BookmarkServ, FileServ,
    handle_service_exception
)
from domain.annotation import HighlightCreate, AnnotationCreate, BookmarkCreate

router = APIRouter()


# Request models
class CreateHighlightRequest(BaseModel):
    page_number: int
    text_content: str
    color: str = '#FFFF00'
    position_data: str


class CreateAnnotationRequest(BaseModel):
    page_number: int
    note_text: str
    position_data: str


class UpdateAnnotationRequest(BaseModel):
    note_text: str


class CreateBookmarkRequest(BaseModel):
    page_number: int
    title: str


# Highlight endpoints
@router.post("/api/annotations/{file_id}/highlight", status_code=status.HTTP_201_CREATED)
async def create_highlight(
    file_id: str,
    request: CreateHighlightRequest,
    user_id: CurrentUser,
    file_service: FileServ,
    highlight_service: HighlightServ
) -> Dict[str, Any]:
    """
    Create a highlight annotation on a PDF page.
    
    - Highlights text selection
    - Supports custom colors
    - Stores position data for rendering
    """
    try:
        # Verify file ownership
        file_service.get_file(file_id, user_id)
        
        # Create highlight
        highlight = highlight_service.create_highlight(
            file_id=file_id,
            user_id=user_id,
            page_number=request.page_number,
            text_content=request.text_content,
            color=request.color,
            position_data=request.position_data
        )
        
        return {
            "success": True,
            "highlight": {
                "id": highlight.id,
                "file_id": highlight.file_id,
                "page_number": highlight.page_number,
                "text_content": highlight.text_content,
                "color": highlight.color.value,
                "position_data": highlight.position_data
            }
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.get("/api/annotations/{file_id}/highlights")
async def get_highlights(
    file_id: str,
    user_id: CurrentUser,
    file_service: FileServ,
    highlight_service: HighlightServ,
    page: Optional[int] = Query(None, description="Filter by page number")
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get all highlights for a PDF file.
    
    - Optionally filter by page number
    - Returns highlights with position data
    """
    try:
        # Verify file ownership
        file_service.get_file(file_id, user_id)
        
        # Get highlights
        highlights = highlight_service.get_file_highlights(file_id, page_number=page)
        
        return {
            "highlights": [
                {
                    "id": h.id,
                    "file_id": h.file_id,
                    "page_number": h.page_number,
                    "text_content": h.text_content,
                    "color": h.color.value,
                    "position_data": h.position_data,
                    "created_at": h.created_at.isoformat()
                }
                for h in highlights
            ]
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.delete("/api/annotations/highlight/{highlight_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_highlight(
    highlight_id: str,
    user_id: CurrentUser,
    highlight_service: HighlightServ
):
    """Delete a highlight annotation."""
    try:
        highlight_service.delete_highlight(highlight_id, user_id)
    except Exception as e:
        raise handle_service_exception(e)


# Annotation (notes) endpoints
@router.post("/api/annotations/{file_id}/note", status_code=status.HTTP_201_CREATED)
async def create_annotation_note(
    file_id: str,
    request: CreateAnnotationRequest,
    user_id: CurrentUser,
    file_service: FileServ,
    annotation_service: AnnotationServ
) -> Dict[str, Any]:
    """
    Create a text annotation (note) on a PDF page.
    
    - Adds a note at specific position
    - Can be edited later
    - Supports rich text content
    """
    try:
        # Verify file ownership
        file_service.get_file(file_id, user_id)
        
        # Create annotation
        annotation = annotation_service.create_annotation(
            file_id=file_id,
            user_id=user_id,
            page_number=request.page_number,
            note_text=request.note_text,
            position_data=request.position_data
        )
        
        return {
            "success": True,
            "annotation": {
                "id": annotation.id,
                "file_id": annotation.file_id,
                "page_number": annotation.page_number,
                "note_text": annotation.note_text,
                "position_data": annotation.position_data,
                "created_at": annotation.created_at.isoformat()
            }
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.get("/api/annotations/{file_id}/notes")
async def get_annotation_notes(
    file_id: str,
    user_id: CurrentUser,
    file_service: FileServ,
    annotation_service: AnnotationServ,
    page: Optional[int] = Query(None, description="Filter by page number"),
    search: Optional[str] = Query(None, description="Search in note text")
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get all annotations (notes) for a PDF file.
    
    - Optionally filter by page number
    - Optionally search in note text
    """
    try:
        # Verify file ownership
        file_service.get_file(file_id, user_id)
        
        # Get annotations
        if search:
            annotations = annotation_service.search_annotations(user_id, search)
            # Filter by file_id
            annotations = [a for a in annotations if a.file_id == file_id]
        else:
            annotations = annotation_service.get_file_annotations(file_id, page_number=page)
        
        return {
            "annotations": [
                {
                    "id": a.id,
                    "file_id": a.file_id,
                    "page_number": a.page_number,
                    "note_text": a.note_text,
                    "position_data": a.position_data,
                    "created_at": a.created_at.isoformat(),
                    "updated_at": a.updated_at.isoformat()
                }
                for a in annotations
            ]
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.put("/api/annotations/note/{annotation_id}")
async def update_annotation_note(
    annotation_id: str,
    request: UpdateAnnotationRequest,
    user_id: CurrentUser,
    annotation_service: AnnotationServ
) -> Dict[str, bool]:
    """Update an annotation's note text."""
    try:
        annotation_service.update_annotation(annotation_id, user_id, request.note_text)
        return {"success": True}
    except Exception as e:
        raise handle_service_exception(e)


@router.delete("/api/annotations/note/{annotation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_annotation_note(
    annotation_id: str,
    user_id: CurrentUser,
    annotation_service: AnnotationServ
):
    """Delete an annotation."""
    try:
        annotation_service.delete_annotation(annotation_id, user_id)
    except Exception as e:
        raise handle_service_exception(e)


# Bookmark endpoints
@router.post("/api/annotations/{file_id}/bookmark", status_code=status.HTTP_201_CREATED)
async def create_bookmark_endpoint(
    file_id: str,
    request: CreateBookmarkRequest,
    user_id: CurrentUser,
    file_service: FileServ,
    bookmark_service: BookmarkServ
) -> Dict[str, Any]:
    """
    Create a bookmark for quick navigation.
    
    - Bookmarks important pages
    - Custom titles for easy reference
    - One bookmark per page
    """
    try:
        # Verify file ownership
        file_service.get_file(file_id, user_id)
        
        # Create bookmark
        bookmark = bookmark_service.create_bookmark(
            file_id=file_id,
            user_id=user_id,
            page_number=request.page_number,
            title=request.title
        )
        
        return {
            "success": True,
            "bookmark": {
                "id": bookmark.id,
                "file_id": bookmark.file_id,
                "page_number": bookmark.page_number,
                "title": bookmark.title,
                "created_at": bookmark.created_at.isoformat()
            }
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.get("/api/annotations/{file_id}/bookmarks")
async def get_bookmarks(
    file_id: str,
    user_id: CurrentUser,
    file_service: FileServ,
    bookmark_service: BookmarkServ
) -> Dict[str, List[Dict[str, Any]]]:
    """Get all bookmarks for a PDF file."""
    try:
        # Verify file ownership
        file_service.get_file(file_id, user_id)
        
        # Get bookmarks
        bookmarks = bookmark_service.get_file_bookmarks(file_id)
        
        return {
            "bookmarks": [
                {
                    "id": b.id,
                    "file_id": b.file_id,
                    "page_number": b.page_number,
                    "title": b.title,
                    "created_at": b.created_at.isoformat()
                }
                for b in bookmarks
            ]
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.delete("/api/annotations/bookmark/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_bookmark(
    bookmark_id: str,
    user_id: CurrentUser,
    bookmark_service: BookmarkServ
):
    """Delete a bookmark."""
    try:
        bookmark_service.delete_bookmark(bookmark_id, user_id)
    except Exception as e:
        raise handle_service_exception(e)
