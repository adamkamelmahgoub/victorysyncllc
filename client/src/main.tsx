
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';
import App from './App';
import './index.css';

// In Replit preview, server fallbacks can be flaky. Use HashRouter in DEV to avoid blank screens.
// In production we use BrowserRouter.
const Router: React.ComponentType<{ children: React.ReactNode }> =
  import.meta.env.DEV ? (HashRouter as any) : (BrowserRouter as any);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
