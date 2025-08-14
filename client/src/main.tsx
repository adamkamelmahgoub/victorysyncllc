
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'wouter';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import './hmr-keepalive';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <Router>
      <ErrorBoundary>
        <ScrollToTop />
        <App />
      </ErrorBoundary>
    </Router>
  </React.StrictMode>
);
