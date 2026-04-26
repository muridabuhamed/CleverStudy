export const APP_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['.pdf'],
  DEBUG: import.meta.env ? import.meta.env.DEV : true,
  // @ts-ignore
  API_BASE_URL: (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_URL : process.env.VITE_API_URL) || 'http://localhost:8000/api',
} as const;

export const QUIZ_CONFIG = {
  QUESTIONS_PER_QUIZ: 10,
  MIN_TOPICS: 4,
  MAX_TOPICS: 8,
} as const;

export const ANIMATION_DURATIONS = {
  PAGE_TRANSITION: 0.3,
  UPLOAD_STEP: 200,
  PROCESSING_STEP: 2000,
} as const;

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File is too large. Maximum size is 10MB',
  INVALID_FORMAT: 'Only PDF files are supported',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  PROCESSING_FAILED: 'Failed to process document. Please try again.',
  NO_TEXT_FOUND: 'Could not extract text from PDF. Please ensure the PDF contains readable text.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;
