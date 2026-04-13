# Implementation Guide - Using the Refactored Code

This guide shows how to work with the refactored CleverStudy codebase with practical examples.

---

## 🎯 Backend Development Examples

### 1. Creating a New Repository

```python
# repository/annotation_repository.py
from typing import List, Optional, Dict, Any
import json
from repository.base import BaseRepository
from domain.annotation import AnnotationModel
from core.logging import get_logger

logger = get_logger(__name__)


class AnnotationRepository(BaseRepository[AnnotationModel]):
    """Repository for annotation operations."""
    
    def __init__(self):
        super().__init__(AnnotationModel, "annotations")
    
    def find_by_file(self, file_id: str, user_id: str) -> List[AnnotationModel]:
        """
        Get all annotations for a file belonging to a user.
        
        Args:
            file_id: File identifier
            user_id: User identifier
            
        Returns:
            List of annotations
        """
        return self.find_by(file_id=file_id, user_id=user_id)
    
    def search_content(self, user_id: str, query: str) -> List[AnnotationModel]:
        """
        Search annotation content for keywords.
        
        Args:
            user_id: User identifier
            query: Search query
            
        Returns:
            Matching annotations
        """
        sql = """
            SELECT * FROM annotations 
            WHERE user_id = ? AND note_text LIKE ?
        """
        rows = self.execute_query(sql, (user_id, f"%{query}%"))
        return [self._row_to_model(row) for row in rows]
```

### 2. Creating a New Service

```python
# services/annotation_service.py
from typing import List
from repository.annotation_repository import AnnotationRepository
from repository.file_repository import FileRepository
from domain.annotation import AnnotationModel, AnnotationCreate
from core.exceptions import ResourceNotFoundError, AuthorizationError
from core.logging import get_logger
import uuid

logger = get_logger(__name__)


class AnnotationService:
    """Business logic for annotations."""
    
    def __init__(
        self,
        annotation_repo: AnnotationRepository,
        file_repo: FileRepository
    ):
        self.annotation_repo = annotation_repo
        self.file_repo = file_repo
    
    def create_annotation(
        self,
        file_id: str,
        user_id: str,
        annotation_data: AnnotationCreate
    ) -> AnnotationModel:
        """
        Create a new annotation.
        
        Validates that:
        1. File exists
        2. User owns the file
        3. Annotation data is valid
        
        Args:
            file_id: File to annotate
            user_id: Current user
            annotation_data: Annotation details
            
        Returns:
            Created annotation
            
        Raises:
            ResourceNotFoundError: If file doesn't exist
            AuthorizationError: If user doesn't own file
        """
        # Validate file exists and user owns it
        file = self.file_repo.find_by_id(file_id)
        if not file:
            raise ResourceNotFoundError("File", file_id)
        
        if file.user_id != user_id:
            raise AuthorizationError(f"You don't own file {file_id}")
        
        # Create annotation
        annotation_id = str(uuid.uuid4())
        annotation = AnnotationModel(
            id=annotation_id,
            file_id=file_id,
            user_id=user_id,
            **annotation_data.model_dump()
        )
        
        created = self.annotation_repo.create(annotation)
        logger.info(f"Created annotation {annotation_id} for file {file_id}")
        
        return created
    
    def list_file_annotations(
        self,
        file_id: str,
        user_id: str
    ) -> List[AnnotationModel]:
        """Get all annotations for a file."""
        # Verify access
        if not self.file_repo.belongs_to_user(file_id, user_id):
            raise AuthorizationError(f"Access denied to file {file_id}")
        
        annotations = self.annotation_repo.find_by_file(file_id, user_id)
        return sorted(annotations, key=lambda a: a.created_at, reverse=True)
```

### 3. Creating an API Endpoint

```python
# api/v1/annotations.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from domain.annotation import AnnotationModel, AnnotationCreate, AnnotationResponse
from services.annotation_service import AnnotationService
from api.dependencies import get_current_user, get_annotation_service
from core.exceptions import CleverStudyException
from core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api/annotations", tags=["annotations"])


@router.post("/{file_id}", response_model=AnnotationResponse, status_code=status.HTTP_201_CREATED)
async def create_annotation(
    file_id: str,
    annotation_data: AnnotationCreate,
    user_id: str = Depends(get_current_user),
    annotation_service: AnnotationService = Depends(get_annotation_service)
):
    """
    Create a new annotation on a PDF file.
    
    Requires authentication.
    User must own the file.
    """
    try:
        annotation = annotation_service.create_annotation(
            file_id=file_id,
            user_id=user_id,
            annotation_data=annotation_data
        )
        return AnnotationResponse.model_validate(annotation)
    except CleverStudyException as e:
        logger.error(f"Failed to create annotation: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error creating annotation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create annotation"
        )


@router.get("/{file_id}", response_model=List[AnnotationResponse])
async def list_annotations(
    file_id: str,
    user_id: str = Depends(get_current_user),
    annotation_service: AnnotationService = Depends(get_annotation_service)
):
    """Get all annotations for a file."""
    try:
        annotations = annotation_service.list_file_annotations(file_id, user_id)
        return [AnnotationResponse.model_validate(a) for a in annotations]
    except CleverStudyException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Error listing annotations: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to list annotations")
```

### 4. Dependency Injection Setup

```python
# api/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated
from core.config import settings
from core.logging import get_logger
from repository.user_repository import UserRepository
from repository.file_repository import FileRepository
from repository.annotation_repository import AnnotationRepository
from services.auth_service import AuthService
from services.file_service import FileService
from services.annotation_service import AnnotationService
import jwt as pyjwt

logger = get_logger(__name__)
security = HTTPBearer()


# Auth dependency
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Extract and verify JWT token, return user ID.
    
    Raises:
        HTTPException: If token is invalid or expired
    """
    token = credentials.credentials
    try:
        payload = pyjwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id = payload.get("userId")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        return user_id
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except pyjwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


# Repository dependencies
def get_user_repository() -> UserRepository:
    """Get user repository instance."""
    return UserRepository()


def get_file_repository() -> FileRepository:
    """Get file repository instance."""
    return FileRepository()


def get_annotation_repository() -> AnnotationRepository:
    """Get annotation repository instance."""
    return AnnotationRepository()


# Service dependencies
def get_auth_service(
    user_repo: UserRepository = Depends(get_user_repository)
) -> AuthService:
    """Get auth service with dependencies."""
    return AuthService(user_repo)


def get_file_service(
    file_repo: FileRepository = Depends(get_file_repository)
) -> FileService:
    """Get file service with dependencies."""
    return FileService(file_repo)


def get_annotation_service(
    annotation_repo: AnnotationRepository = Depends(get_annotation_repository),
    file_repo: FileRepository = Depends(get_file_repository)
) -> AnnotationService:
    """Get annotation service with dependencies."""
    return AnnotationService(annotation_repo, file_repo)


# Type aliases for cleaner code
CurrentUser = Annotated[str, Depends(get_current_user)]
UserRepo = Annotated[UserRepository, Depends(get_user_repository)]
FileRepo = Annotated[FileRepository, Depends(get_file_repository)]
AnnotationServ = Annotated[AnnotationService, Depends(get_annotation_service)]
```

---

## 🎨 Frontend Development Examples

### 1. Creating a New API Endpoint

```typescript
// api/endpoints/annotations.ts
import { Annotation, AnnotationCreate } from '../types/responses';

export class AnnotationsAPI {
  constructor(private client: ApiClient) {}
  
  async create(
    fileId: string,
    annotationData: AnnotationCreate
  ): Promise<Annotation> {
    return this.client.post<Annotation>(
      `/annotations/${fileId}`,
      annotationData
    );
  }
  
  async list(fileId: string): Promise<Annotation[]> {
    return this.client.get<Annotation[]>(`/annotations/${fileId}`);
  }
  
  async update(
    annotationId: string,
    updates: Partial<AnnotationCreate>
  ): Promise<Annotation> {
    return this.client.patch<Annotation>(
      `/annotations/${annotationId}`,
      updates
    );
  }
  
  async delete(annotationId: string): Promise<void> {
    return this.client.delete(`/annotations/${annotationId}`);
  }
}
```

### 2. Creating a Custom Hook

```typescript
// hooks/useAnnotations.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { Annotation, AnnotationCreate } from '../api/types/responses';
import { useToast } from '../contexts/ToastContext';

export function useAnnotations(fileId: string) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  
  // Load annotations
  const loadAnnotations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.annotations.list(fileId);
      setAnnotations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load annotations';
      setError(errorMessage);
      toast.error('Load Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fileId, toast]);
  
  // Create annotation
  const createAnnotation = useCallback(async (data: AnnotationCreate) => {
    try {
      const newAnnotation = await api.annotations.create(fileId, data);
      setAnnotations(prev => [newAnnotation, ...prev]);
      toast.success('Annotation Created', 'Your note has been saved');
      return newAnnotation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create annotation';
      toast.error('Create Failed', errorMessage);
      throw err;
    }
  }, [fileId, toast]);
  
  // Delete annotation
  const deleteAnnotation = useCallback(async (annotationId: string) => {
    try {
      await api.annotations.delete(annotationId);
      setAnnotations(prev => prev.filter(a => a.id !== annotationId));
      toast.success('Deleted', 'Annotation removed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete annotation';
      toast.error('Delete Failed', errorMessage);
      throw err;
    }
  }, [toast]);
  
  // Load on mount
  useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);
  
  return {
    annotations,
    isLoading,
    error,
    createAnnotation,
    deleteAnnotation,
    refresh: loadAnnotations
  };
}
```

### 3. Creating a Feature Component

```typescript
// features/annotations/components/AnnotationList.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Trash2, Clock } from 'lucide-react';
import { useAnnotations } from '../../../hooks/useAnnotations';
import { formatDistanceToNow } from 'date-fns';

interface AnnotationListProps {
  fileId: string;
  onAnnotationClick?: (annotationId: string) => void;
}

export const AnnotationList: React.FC<AnnotationListProps> = ({
  fileId,
  onAnnotationClick
}) => {
  const { annotations, isLoading, deleteAnnotation } = useAnnotations(fileId);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }
  
  if (annotations.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500 dark:text-slate-400">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No annotations yet</p>
        <p className="text-sm mt-1">Start highlighting text to create notes</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {annotations.map((annotation) => (
          <motion.div
            key={annotation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors cursor-pointer"
            onClick={() => onAnnotationClick?.(annotation.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                  "{annotation.highlighted_text}"
                </p>
                {annotation.note_text && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                    {annotation.note_text}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>
                    Page {annotation.page_number} •{' '}
                    {formatDistanceToNow(new Date(annotation.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAnnotation(annotation.id);
                }}
                className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete annotation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
```

### 4. Using Strong Types

```typescript
// types/enums.ts
export enum AppView {
  Home = 'HOME',
  Upload = 'UPLOAD',
  Processing = 'PROCESSING',
  Topics = 'TOPICS',
  Quiz = 'QUIZ',
  Results = 'RESULTS',
  Library = 'LIBRARY',
  Profile = 'PROFILE',
  Login = 'LOGIN',
  Signup = 'SIGNUP'
}

export enum FileProcessingStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Error = 'error'
}

export enum AnnotationColor {
  Yellow = '#FFFF00',
  Green = '#00FF00',
  Blue = '#00FFFF',
  Pink = '#FF00FF',
  Orange = '#FFA500'
}

// Usage in components:
import { AppView, FileProcessingStatus } from '../types/enums';

const [currentView, setCurrentView] = useState<AppView>(AppView.Home);

// TypeScript will catch errors
setCurrentView(AppView.Upload); // ✅ Valid
setCurrentView('UPLOAD'); // ❌ Type error
setCurrentView('UPLOAAD'); // ❌ Type error (typo caught)
```

---

## 🧪 Testing Examples

### Backend Unit Test

```python
# tests/test_annotation_service.py
import pytest
from unittest.mock import Mock
from services.annotation_service import AnnotationService
from domain.annotation import AnnotationCreate
from core.exceptions import ResourceNotFoundError, AuthorizationError


@pytest.fixture
def mock_annotation_repo():
    return Mock()


@pytest.fixture
def mock_file_repo():
    repo = Mock()
    repo.find_by_id.return_value = Mock(user_id="user-123")
    repo.belongs_to_user.return_value = True
    return repo


@pytest.fixture
def annotation_service(mock_annotation_repo, mock_file_repo):
    return AnnotationService(mock_annotation_repo, mock_file_repo)


def test_create_annotation_success(annotation_service, mock_annotation_repo):
    """Test successful annotation creation."""
    annotation_data = AnnotationCreate(
        page_number=1,
        highlighted_text="Important text",
        note_text="My note"
    )
    
    annotation = annotation_service.create_annotation(
        file_id="file-123",
        user_id="user-123",
        annotation_data=annotation_data
    )
    
    # Verify annotation was created
    assert mock_annotation_repo.create.called
    assert annotation is not None


def test_create_annotation_file_not_found(annotation_service, mock_file_repo):
    """Test annotation creation fails if file doesn't exist."""
    mock_file_repo.find_by_id.return_value = None
    
    with pytest.raises(ResourceNotFoundError):
        annotation_service.create_annotation(
            file_id="nonexistent",
            user_id="user-123",
            annotation_data=Mock()
        )


def test_create_annotation_access_denied(annotation_service, mock_file_repo):
    """Test annotation creation fails if user doesn't own file."""
    # File exists but belongs to different user
    mock_file_repo.find_by_id.return_value = Mock(user_id="other-user")
    
    with pytest.raises(AuthorizationError):
        annotation_service.create_annotation(
            file_id="file-123",
            user_id="user-123",
            annotation_data=Mock()
        )
```

### Frontend Component Test

```typescript
// features/annotations/__tests__/AnnotationList.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnnotationList } from '../components/AnnotationList';
import { useAnnotations } from '../../../hooks/useAnnotations';

// Mock the hook
jest.mock('../../../hooks/useAnnotations');
const mockUseAnnotations = useAnnotations as jest.MockedFunction<typeof useAnnotations>;

describe('AnnotationList', () => {
  it('shows loading state', () => {
    mockUseAnnotations.mockReturnValue({
      annotations: [],
      isLoading: true,
      error: null,
      createAnnotation: jest.fn(),
      deleteAnnotation: jest.fn(),
      refresh: jest.fn()
    });
    
    render(<AnnotationList fileId="test-file" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  it('shows empty state when no annotations', () => {
    mockUseAnnotations.mockReturnValue({
      annotations: [],
      isLoading: false,
      error: null,
      createAnnotation: jest.fn(),
      deleteAnnotation: jest.fn(),
      refresh: jest.fn()
    });
    
    render(<AnnotationList fileId="test-file" />);
    
    expect(screen.getByText(/no annotations yet/i)).toBeInTheDocument();
  });
  
  it('displays annotations', () => {
    const mockAnnotations = [{
      id: '1',
      highlighted_text: 'Important text',
      note_text: 'My note',
      page_number: 1,
      created_at: new Date().toISOString()
    }];
    
    mockUseAnnotations.mockReturnValue({
      annotations: mockAnnotations,
      isLoading: false,
      error: null,
      createAnnotation: jest.fn(),
      deleteAnnotation: jest.fn(),
      refresh: jest.fn()
    });
    
    render(<AnnotationList fileId="test-file" />);
    
    expect(screen.getByText('Important text')).toBeInTheDocument();
    expect(screen.getByText('My note')).toBeInTheDocument();
  });
  
  it('calls deleteAnnotation when delete button clicked', async () => {
    const deleteAnnotation = jest.fn();
    const mockAnnotations = [{
      id: '1',
      highlighted_text: 'Test',
      page_number: 1,
      created_at: new Date().toISOString()
    }];
    
    mockUseAnnotations.mockReturnValue({
      annotations: mockAnnotations,
      isLoading: false,
      error: null,
      createAnnotation: jest.fn(),
      deleteAnnotation,
      refresh: jest.fn()
    });
    
    render(<AnnotationList fileId="test-file" />);
    
    const deleteButton = screen.getByTitle('Delete annotation');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(deleteAnnotation).toHaveBeenCalledWith('1');
    });
  });
});
```

---

## 📋 Checklists

### Adding a New Feature

Backend:
- [ ] Create domain model in `domain/`
- [ ] Add validation rules (Pydantic validators)
- [ ] Create repository in `repository/`
- [ ] Write repository tests
- [ ] Create service in `services/`
- [ ] Write service tests
- [ ] Add API endpoint in `api/v1/`
- [ ] Add to dependency injection in `api/dependencies.py`
- [ ] Update OpenAPI docs
- [ ] Test API endpoint

Frontend:
- [ ] Define types in `api/types/responses.ts`
- [ ] Create API endpoint in `api/endpoints/`
- [ ] Create custom hook in `hooks/`
- [ ] Build components in `components/` or `features/`
- [ ] Write component tests
- [ ] Add to navigation if needed
- [ ] Test in browser

---

This guide demonstrates the patterns you should follow when extending the CleverStudy codebase. The refactored architecture makes it easy to add new features while maintaining code quality and test coverage.
