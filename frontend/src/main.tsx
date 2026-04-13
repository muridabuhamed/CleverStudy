import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './shared/components/ErrorBoundary.tsx';
import { AuthProvider } from './shared/contexts/AuthContext.tsx';
import { ThemeProvider } from './shared/contexts/ThemeContext.tsx';
import { ToastProvider } from './shared/contexts/ToastContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
