import { httpClient } from '@/shared/utils/httpClient';

export interface StudySession {
  id: string;
  file_id: string;
  duration_seconds: number;
  started_at: string;
  created_at: string;
}

export const studyApi = {
  async saveStudySession(
    fileId: string,
    durationSeconds: number,
    startedAt: string
  ): Promise<{ success: boolean; sessionId: string }> {
    return httpClient.post('/study/session', {
      fileId,
      durationSeconds,
      startedAt,
    });
  },

  async getStudyTime(fileId: string): Promise<{ totalSeconds: number }> {
    return httpClient.get(`/study/time/${fileId}`);
  },

  async getTotalStudyTime(): Promise<{ totalSeconds: number }> {
    return httpClient.get('/study/time');
  },
};
