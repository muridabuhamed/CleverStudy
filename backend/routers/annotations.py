import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import (
    get_file_by_id,
    add_highlight, get_highlights_by_file, delete_highlight,
    add_annotation, get_annotations_by_file, update_annotation, delete_annotation,
    add_bookmark, get_bookmarks_by_file, delete_bookmark,
    search_annotations
)
from auth import get_current_user

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
@router.post("/api/annotations/{file_id}/highlight")
async def create_highlight(file_id: str, request: CreateHighlightRequest, user_id: str = Depends(get_current_user)):
    try:
        # Verify file access
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        highlight_id = str(uuid.uuid4())
        add_highlight(
            highlight_id, file_id, user_id, request.page_number,
            request.text_content, request.color, request.position_data
        )
        
        return {
            "success": True,
            "highlight": {
                "id": highlight_id,
                "file_id": file_id,
                "page_number": request.page_number,
                "text_content": request.text_content,
                "color": request.color,
                "position_data": request.position_data
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Create highlight error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create highlight")


@router.get("/api/annotations/{file_id}/highlights")
async def get_highlights(file_id: str, user_id: str = Depends(get_current_user)):
    try:
        # Verify file access
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        highlights = get_highlights_by_file(file_id, user_id)
        return {"highlights": highlights}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get highlights error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get highlights")


@router.delete("/api/annotations/highlight/{highlight_id}")
async def remove_highlight(highlight_id: str, user_id: str = Depends(get_current_user)):
    try:
        delete_highlight(highlight_id, user_id)
        return {"success": True}
    except Exception as e:
        print(f"Delete highlight error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete highlight")


# Annotation (notes) endpoints
@router.post("/api/annotations/{file_id}/note")
async def create_annotation_note(file_id: str, request: CreateAnnotationRequest, user_id: str = Depends(get_current_user)):
    try:
        # Verify file access
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        annotation_id = str(uuid.uuid4())
        add_annotation(
            annotation_id, file_id, user_id, request.page_number,
            request.note_text, request.position_data
        )
        
        return {
            "success": True,
            "annotation": {
                "id": annotation_id,
                "file_id": file_id,
                "page_number": request.page_number,
                "note_text": request.note_text,
                "position_data": request.position_data
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Create annotation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create annotation")


@router.get("/api/annotations/{file_id}/notes")
async def get_annotation_notes(file_id: str, user_id: str = Depends(get_current_user)):
    try:
        # Verify file access
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        annotations = get_annotations_by_file(file_id, user_id)
        return {"annotations": annotations}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get annotations error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get annotations")


@router.put("/api/annotations/note/{annotation_id}")
async def update_annotation_note(annotation_id: str, request: UpdateAnnotationRequest, user_id: str = Depends(get_current_user)):
    try:
        update_annotation(annotation_id, user_id, request.note_text)
        return {"success": True}
    except Exception as e:
        print(f"Update annotation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update annotation")


@router.delete("/api/annotations/note/{annotation_id}")
async def remove_annotation_note(annotation_id: str, user_id: str = Depends(get_current_user)):
    try:
        delete_annotation(annotation_id, user_id)
        return {"success": True}
    except Exception as e:
        print(f"Delete annotation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete annotation")


# Bookmark endpoints
@router.post("/api/annotations/{file_id}/bookmark")
async def create_bookmark_endpoint(file_id: str, request: CreateBookmarkRequest, user_id: str = Depends(get_current_user)):
    try:
        # Verify file access
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        bookmark_id = str(uuid.uuid4())
        add_bookmark(bookmark_id, file_id, user_id, request.page_number, request.title)
        
        return {
            "success": True,
            "bookmark": {
                "id": bookmark_id,
                "file_id": file_id,
                "page_number": request.page_number,
                "title": request.title
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Create bookmark error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create bookmark")


@router.get("/api/annotations/{file_id}/bookmarks")
async def get_bookmarks_endpoint(file_id: str, user_id: str = Depends(get_current_user)):
    try:
        # Verify file access
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        bookmarks = get_bookmarks_by_file(file_id, user_id)
        return {"bookmarks": bookmarks}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get bookmarks error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get bookmarks")


@router.delete("/api/annotations/bookmark/{bookmark_id}")
async def remove_bookmark_endpoint(bookmark_id: str, user_id: str = Depends(get_current_user)):
    try:
        delete_bookmark(bookmark_id, user_id)
        return {"success": True}
    except Exception as e:
        print(f"Delete bookmark error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete bookmark")


# Search endpoint
@router.get("/api/annotations/search")
async def search_annotations_endpoint(query: str, file_id: Optional[str] = None, user_id: str = Depends(get_current_user)):
    try:
        if not query or len(query.strip()) < 2:
            return {"results": []}
        
        results = search_annotations(user_id, query, file_id)
        return {"results": results, "count": len(results)}
    except Exception as e:
        print(f"Search annotations error: {e}")
        raise HTTPException(status_code=500, detail="Failed to search annotations")


# Get all annotations for a file (combined)
@router.get("/api/annotations/{file_id}/all")
async def get_all_annotations(file_id: str, user_id: str = Depends(get_current_user)):
    try:
        # Verify file access
        file_record = get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        if file_record['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        highlights = get_highlights_by_file(file_id, user_id)
        annotations = get_annotations_by_file(file_id, user_id)
        bookmarks = get_bookmarks_by_file(file_id, user_id)
        
        return {
            "highlights": highlights,
            "annotations": annotations,
            "bookmarks": bookmarks
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get all annotations error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get annotations")
