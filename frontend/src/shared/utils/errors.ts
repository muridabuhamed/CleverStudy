/**
 * Error handling utilities
 * Safely extract error messages from various error types
 */

import { ApiError } from './httpClient';

/**
 * Extract a safe error message from various error types
 * Handles: ApiError, Error, Error-like objects, strings, and unknown objects
 */
export function extractErrorMessage(error: any): string {
  if (!error) {
    return 'An unknown error occurred';
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle ApiError instances
  if (error instanceof ApiError) {
    return error.message || 'API request failed';
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message || error.toString();
  }

  // Handle error objects with common properties
  if (typeof error === 'object') {
    if (error.message && typeof error.message === 'string') {
      return error.message;
    }
    if (error.detail && typeof error.detail === 'string') {
      return error.detail;
    }
    if (error.error && typeof error.error === 'string') {
      return error.error;
    }
    if (error.msg && typeof error.msg === 'string') {
      return error.msg;
    }
  }

  // Last resort: convert to string
  try {
    return String(error);
  } catch {
    return 'An unknown error occurred';
  }
}
