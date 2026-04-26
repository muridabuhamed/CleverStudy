import { httpClient } from '@/shared/utils/httpClient';

export interface UserStatsResponse {
  stats: any;
  recentAttempts: any[];
}

export const profileApi = {
  async getUserStats(): Promise<UserStatsResponse> {
    return httpClient.get('/user/stats');
  },
};
