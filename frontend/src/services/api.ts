import { Question, Highlight, Annotation, Bookmark, AnnotationSearchResult } from '../types';
import { APP_CONFIG, ERROR_MESSAGES } from '../config/constants';

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Add auth header to requests
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error [${response.status}]:`, errorText);
    let error: any = { error: 'Unknown error' };
    try {
      error = JSON.parse(errorText || '{"error": "Unknown error"}');
    } catch {
      error = { detail: errorText || ERROR_MESSAGES.NETWORK_ERROR };
    }
    throw new ApiError(response.status, error.detail || error.error || ERROR_MESSAGES.NETWORK_ERROR);
  }

  // Some successful endpoints (e.g. DELETE 204) have no response body.
  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}

export interface UploadResponse {
  success: boolean;
  fileId: string;
  filename?: string;
  message: string;
}

export interface ProcessResponse {
  success: boolean;
  topics: string[];
  questions: Question[];
}

export interface FileRecord {
  id: string;
  filename: string;
  original_name: string;
  created_at: string;
  topics: string[];
  questions: Question[];
  status: 'pending' | 'completed';
}

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async signup(email: string, password: string, name: string): Promise<{ token: string; user: any }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return handleResponse(response);
  },

  async getCurrentUser(token: string): Promise<any> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(Math.round(percentComplete));
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new ApiError(xhr.status, error.detail || error.error || ERROR_MESSAGES.UPLOAD_FAILED));
          } catch {
            reject(new ApiError(xhr.status, ERROR_MESSAGES.UPLOAD_FAILED));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new ApiError(0, ERROR_MESSAGES.NETWORK_ERROR));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      xhr.open('POST', `${APP_CONFIG.API_BASE_URL}/upload`);
      
      // Add auth header
      const token = getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  },

  async processDocument(fileId: string): Promise<ProcessResponse> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/process/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    return handleResponse<ProcessResponse>(response);
  },

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/health`);
    return handleResponse(response);
  },

  async getFiles(): Promise<FileRecord[]> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/files`, {
      headers: getAuthHeaders()
    });
    return handleResponse<FileRecord[]>(response);
  },

  async deleteFile(fileId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(response);
  },

  async chatWithDocument(fileId: string, message: string, history: any[]): Promise<string> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/chat/${fileId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ message, history }),
    });
    const data = await handleResponse<{ response: string }>(response);
    return data.response;
  },

  async submitQuizAttempt(fileId: string, score: number, total: number): Promise<{ success: boolean; attemptId: string }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ fileId, score, total }),
    });
    return handleResponse(response);
  },

  async getUserStats(): Promise<any> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/user/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Flashcard APIs
  async generateFlashcards(fileId: string, count: number = 15): Promise<any> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/flashcards/generate/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ count }),
    });
    return handleResponse(response);
  },

  async getFlashcards(fileId: string): Promise<any> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/flashcards/${fileId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async reviewFlashcard(flashcardId: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<any> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/flashcards/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ flashcardId, difficulty }),
    });
    return handleResponse(response);
  },

  // Annotation APIs
  // Highlights
  async createHighlight(fileId: string, pageNumber: number, textContent: string, color: string, positionData: any): Promise<{ success: boolean; highlight: Highlight }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/${fileId}/highlight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        page_number: pageNumber,
        text_content: textContent,
        color,
        position_data: JSON.stringify(positionData)
      }),
    });
    return handleResponse(response);
  },

  async getHighlights(fileId: string): Promise<{ highlights: Highlight[] }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/${fileId}/highlights`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async deleteHighlight(highlightId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/highlight/${highlightId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Annotations (notes)
  async createAnnotation(fileId: string, pageNumber: number, noteText: string, positionData: any): Promise<{ success: boolean; annotation: Annotation }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/${fileId}/note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        page_number: pageNumber,
        note_text: noteText,
        position_data: JSON.stringify(positionData)
      }),
    });
    return handleResponse(response);
  },

  async getAnnotations(fileId: string): Promise<{ annotations: Annotation[] }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/${fileId}/notes`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async updateAnnotation(annotationId: string, noteText: string): Promise<{ success: boolean }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/note/${annotationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ note_text: noteText }),
    });
    return handleResponse(response);
  },

  async deleteAnnotation(annotationId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/note/${annotationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Bookmarks
  async createBookmark(fileId: string, pageNumber: number, title: string): Promise<{ success: boolean; bookmark: Bookmark }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/${fileId}/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        page_number: pageNumber,
        title
      }),
    });
    return handleResponse(response);
  },

  async getBookmarks(fileId: string): Promise<{ bookmarks: Bookmark[] }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/${fileId}/bookmarks`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async deleteBookmark(bookmarkId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/bookmark/${bookmarkId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get all annotations for a file
  async getAllAnnotations(fileId: string): Promise<{ highlights: Highlight[]; annotations: Annotation[]; bookmarks: Bookmark[] }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/${fileId}/all`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Search annotations
  async searchAnnotations(query: string, fileId?: string): Promise<{ results: AnnotationSearchResult[]; count: number }> {
    const params = new URLSearchParams({ query });
    if (fileId) params.append('file_id', fileId);
    
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/annotations/search?${params}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Study Session APIs
  async saveStudySession(fileId: string, durationSeconds: number, startedAt: string): Promise<{ success: boolean; sessionId: string }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/study/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        fileId,
        durationSeconds,
        startedAt
      }),
    });
    return handleResponse(response);
  },

  async getStudyTime(fileId: string): Promise<{ totalSeconds: number }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/study/time/${fileId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getTotalStudyTime(): Promise<{ totalSeconds: number }> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/study/time`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
};

export { ApiError };
