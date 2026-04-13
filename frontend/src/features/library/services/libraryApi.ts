import { httpClient } from '@/shared/utils/httpClient';

export interface FileRecord {
  id: string;
  filename: string;
  original_name: string;
  created_at: string;
  topics: string[];
  questions: any[];
  status: 'pending' | 'completed';
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
  questions: any[];
}

export const libraryApi = {
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.uploadFile('/upload', formData, onProgress);
  },

  async processDocument(fileId: string): Promise<ProcessResponse> {
    return httpClient.post(`/process/${fileId}`);
  },

  async getFiles(): Promise<FileRecord[]> {
    return httpClient.get('/files');
  },

  async deleteFile(fileId: string): Promise<{ success: boolean }> {
    return httpClient.delete(`/files/${fileId}`);
  },

  async chatWithDocument(fileId: string, message: string, history: any[]): Promise<string> {
    const data = await httpClient.post<{ response: string }>(`/chat/${fileId}`, { message, history });
    return data.response;
  },
};
