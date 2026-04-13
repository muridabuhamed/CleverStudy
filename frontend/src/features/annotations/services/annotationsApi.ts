import { httpClient } from '@/shared/utils/httpClient';

export interface Highlight {
  id: string;
  file_id: string;
  page_number: number;
  text_content: string;
  color: string;
  position_data: any;
  created_at: string;
}

export interface Annotation {
  id: string;
  file_id: string;
  page_number: number;
  note_text: string;
  position_data: any;
  created_at: string;
}

export interface Bookmark {
  id: string;
  file_id: string;
  page_number: number;
  title: string;
  created_at: string;
}

export interface AnnotationSearchResult {
  id: string;
  type: 'highlight' | 'annotation' | 'bookmark';
  file_id: string;
  page_number: number;
  content: string;
  created_at: string;
}

export const annotationsApi = {
  // Highlights
  async createHighlight(
    fileId: string,
    pageNumber: number,
    textContent: string,
    color: string,
    positionData: any
  ): Promise<{ success: boolean; highlight: Highlight }> {
    return httpClient.post(`/annotations/${fileId}/highlight`, {
      page_number: pageNumber,
      text_content: textContent,
      color,
      position_data: JSON.stringify(positionData),
    });
  },

  async getHighlights(fileId: string): Promise<{ highlights: Highlight[] }> {
    return httpClient.get(`/annotations/${fileId}/highlights`);
  },

  async deleteHighlight(highlightId: string): Promise<{ success: boolean }> {
    return httpClient.delete(`/annotations/highlight/${highlightId}`);
  },

  // Annotations (notes)
  async createAnnotation(
    fileId: string,
    pageNumber: number,
    noteText: string,
    positionData: any
  ): Promise<{ success: boolean; annotation: Annotation }> {
    return httpClient.post(`/annotations/${fileId}/note`, {
      page_number: pageNumber,
      note_text: noteText,
      position_data: JSON.stringify(positionData),
    });
  },

  async getAnnotations(fileId: string): Promise<{ annotations: Annotation[] }> {
    return httpClient.get(`/annotations/${fileId}/notes`);
  },

  async updateAnnotation(annotationId: string, noteText: string): Promise<{ success: boolean }> {
    return httpClient.put(`/annotations/note/${annotationId}`, {
      note_text: noteText,
    });
  },

  async deleteAnnotation(annotationId: string): Promise<{ success: boolean }> {
    return httpClient.delete(`/annotations/note/${annotationId}`);
  },

  // Bookmarks
  async createBookmark(
    fileId: string,
    pageNumber: number,
    title: string
  ): Promise<{ success: boolean; bookmark: Bookmark }> {
    return httpClient.post(`/annotations/${fileId}/bookmark`, {
      page_number: pageNumber,
      title,
    });
  },

  async getBookmarks(fileId: string): Promise<{ bookmarks: Bookmark[] }> {
    return httpClient.get(`/annotations/${fileId}/bookmarks`);
  },

  async deleteBookmark(bookmarkId: string): Promise<{ success: boolean }> {
    return httpClient.delete(`/annotations/bookmark/${bookmarkId}`);
  },

  // Get all annotations for a file
  async getAllAnnotations(
    fileId: string
  ): Promise<{ highlights: Highlight[]; annotations: Annotation[]; bookmarks: Bookmark[] }> {
    return httpClient.get(`/annotations/${fileId}/all`);
  },

  // Search annotations
  async searchAnnotations(
    query: string,
    fileId?: string
  ): Promise<{ results: AnnotationSearchResult[]; count: number }> {
    const params = new URLSearchParams({ query });
    if (fileId) params.append('file_id', fileId);

    return httpClient.get(`/annotations/search?${params}`);
  },
};
