import { httpClient } from '@/shared/utils/httpClient';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface SignupResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return httpClient.post('/auth/login', { email, password });
  },

  async signup(email: string, password: string, name: string): Promise<SignupResponse> {
    return httpClient.post('/auth/signup', { email, password, name });
  },

  async getCurrentUser(token: string): Promise<UserResponse> {
    return httpClient.get('/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
};
