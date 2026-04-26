/**
 * Centralized HTTP Client
 * 
 * Eliminates code duplication across feature APIs.
 * Provides consistent error handling, logging, and request configuration.
 */

import { APP_CONFIG, ERROR_MESSAGES } from '../config/constants';

/**
 * Custom API Error class with status code
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }

  /**
   * Check if error is validation related
   */
  isValidationError(): boolean {
    return this.statusCode === 400 || this.statusCode === 422;
  }

  /**
   * Check if error is server related
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

/**
 * HTTP Client configuration
 */
interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: HeadersInit;
  onRequest?: (config: RequestInit) => void;
  onResponse?: (response: Response) => void;
  onError?: (error: ApiError) => void;
}

/**
 * Centralized HTTP Client
 * 
 * Use this instead of duplicating fetch logic across features.
 * 
 * @example
 * const client = new HttpClient();
 * const data = await client.get<User>('/auth/me');
 */
export class HttpClient {
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || APP_CONFIG.API_BASE_URL,
      timeout: config.timeout || 30000,
      headers: config.headers || {},
      onRequest: config.onRequest,
      onResponse: config.onResponse,
      onError: config.onError,
    };
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get default headers including auth token
   */
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle HTTP response and extract data
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Call response interceptor if configured
    if (this.config.onResponse) {
      this.config.onResponse(response);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error [${response.status}]:`, errorText);
      
      let errorMessage: string = ERROR_MESSAGES.NETWORK_ERROR;
      let errorDetails: any = null;

      try {
        const error = JSON.parse(errorText || '{"error": "Unknown error"}');
        errorMessage = error.detail || error.error || error.message || errorMessage;
        errorDetails = error;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      const apiError = new ApiError(response.status, errorMessage, errorDetails);
      
      // Call error interceptor if configured
      if (this.config.onError) {
        this.config.onError(apiError);
      }

      throw apiError;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    const headers = this.getHeaders(customHeaders);

    const requestConfig: RequestInit = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) }),
    };

    // Call request interceptor if configured
    if (this.config.onRequest) {
      this.config.onRequest(requestConfig);
    }

    try {
      const response = await fetch(url, requestConfig);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, headers);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<T> {
    return this.request<T>('POST', endpoint, data, headers);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<T> {
    return this.request<T>('PUT', endpoint, data, headers);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, headers);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, headers);
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<any> {
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
            reject(new ApiError(xhr.status, 'Invalid response format'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new ApiError(
              xhr.status,
              error.detail || error.error || ERROR_MESSAGES.UPLOAD_FAILED
            ));
          } catch {
            reject(new ApiError(xhr.status, ERROR_MESSAGES.UPLOAD_FAILED));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new ApiError(0, ERROR_MESSAGES.NETWORK_ERROR));
      });

      xhr.addEventListener('abort', () => {
        reject(new ApiError(0, 'Upload cancelled'));
      });

      const url = `${this.config.baseURL}${endpoint}`;
      xhr.open('POST', url);

      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }
}

/**
 * Default HTTP client instance
 * 
 * @example
 * import { httpClient } from '@/shared/utils/httpClient';
 * const user = await httpClient.get<User>('/auth/me');
 */
export const httpClient = new HttpClient({
  onRequest: (config) => {
    // Log all requests in development
    if (APP_CONFIG.DEBUG) {
      console.log('📤 Request:', config.method, config);
    }
  },
  onResponse: (response) => {
    // Log all responses in development
    if (APP_CONFIG.DEBUG) {
      console.log('📥 Response:', response.status, response.statusText);
    }
  },
  onError: (error) => {
    // Log all errors
    console.error('❌ API Error:', error);
    
    // Auto-logout on 401, but ONLY if there was an active session.
    // A failed login attempt also returns 401 — we must not redirect in that case,
    // as no session/token was ever created.
    if (error.statusCode === 401) {
      const hadSession = !!localStorage.getItem('auth_token');
      localStorage.removeItem('auth_token');
      if (hadSession) {
        window.location.href = '/';
      }
    }
  },
});

/**
 * Helper to check if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Helper to extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
