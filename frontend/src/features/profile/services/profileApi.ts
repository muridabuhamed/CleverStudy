import { httpClient } from '@/shared/utils/httpClient';

export interface UserStats {
  totalStudyTime: number;
  filesUploaded: number;
  quizzesCompleted: number;
  flashcardsReviewed: number;
  averageScore: number;
}

export const profileApi = {
  async getUserStats(): Promise<UserStats> {
    return httpClient.get('/user/stats');
  },
};
