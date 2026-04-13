/**
 * Auth API - REFACTORED VERSION
 * 
 * Uses centralized HttpClient instead of duplicating code.
 * This is how ALL feature APIs should be structured.
 */

import { httpClient } from '../../../shared/utils/httpClient';

/**
 * Auth API Response Types
 */
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

/**
 * Auth API Service
 * 
 * Clean, simple, no code duplication.
 * All HTTP logic handled by httpClient.
 */
export const authApi = {
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
  },

  /**
   * Register new user
   */
  async signup(email: string, password: string, name: string): Promise<SignupResponse> {
    return httpClient.post<SignupResponse>('/auth/signup', {
      email,
      password,
      name,
    });
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(token?: string): Promise<UserResponse> {
    // If token provided, use custom header
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
    return httpClient.get<UserResponse>('/auth/me', headers);
  },

  /**
   * Logout (client-side only)
   */
  logout(): void {
    localStorage.removeItem('auth_token');
  },
};

// ✅ Compare this to the old version:
// - No handleResponse duplication
// - No ApiError duplication
// - No getAuthHeaders duplication
// - Much cleaner and easier to maintain
// - Only 50 lines vs 95 lines
