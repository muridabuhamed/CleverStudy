/**
 * Type Guards and Validators
 * 
 * Runtime type checking and validation utilities.
 */

import { ApiError } from './httpClient';

/**
 * Type Guards
 */

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

/**
 * Validators
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one digit');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      const baseType = type.split('/')[0];
      return file.type.startsWith(baseType + '/');
    }
    return file.type === type;
  });
}

export function isValidFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Assertion Helpers
 */

export function assertDefined<T>(
  value: T | undefined | null,
  message: string = 'Value is not defined'
): asserts value is T {
  if (!isDefined(value)) {
    throw new Error(message);
  }
}

export function assertString(
  value: unknown,
  message: string = 'Value is not a string'
): asserts value is string {
  if (!isString(value)) {
    throw new Error(message);
  }
}

export function assertNumber(
  value: unknown,
  message: string = 'Value is not a number'
): asserts value is number {
  if (!isNumber(value)) {
    throw new Error(message);
  }
}

/**
 * Validation Result Type
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Form Validators
 */

export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: string[] = [];

  if (!email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSignupForm(
  email: string,
  password: string,
  confirmPassword: string,
  name: string
): ValidationResult {
  const errors: string[] = [];

  if (!name.trim()) {
    errors.push('Name is required');
  }

  if (!email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.valid) {
    errors.push(...passwordValidation.errors);
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
