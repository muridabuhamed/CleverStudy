// Shared components barrel export
export { AnimatedDemo } from './components/AnimatedDemo';
export { AnnotationSidebar } from './components/AnnotationSidebar';
export { Chat } from './components/Chat';
export { ErrorBoundary } from './components/ErrorBoundary';
export { FileUpload } from './components/FileUpload';
export { Modal } from './components/Modal';
export { ModalDemo } from './components/ModalDemo';
export { Navbar } from './components/Navbar';
export { PdfViewer } from './components/PdfViewer';
export { PdfViewerWithAnnotations } from './components/PdfViewerWithAnnotations';
export { ProgressTracker } from './components/ProgressTracker';
export { StudyTimer } from './components/StudyTimer';
export { ThemeToggle } from './components/ThemeToggle';
export { ToastContainer } from './components/Toast';

// Contexts
export { AuthProvider, useAuth } from './contexts/AuthContext';
export { ThemeProvider, useTheme } from './contexts/ThemeContext';
export { ToastProvider, useToast } from './contexts/ToastContext';

// Config
export { APP_CONFIG, ERROR_MESSAGES } from './config/constants';

// Utilities - NEW
export { 
  httpClient, 
  HttpClient, 
  ApiError, 
  isApiError, 
  getErrorMessage 
} from './utils/httpClient';

export * from './utils/validators';

// Hooks - NEW
export * from './hooks';

// Global types
export type * from './types/globalTypes';
