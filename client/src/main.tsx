import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'

const rootEl = document.getElementById('root')
if (!rootEl) { 
  throw new Error('Root element #root not found') 
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <div data-smoke="true" style={{display:'none'}}>SMOKE TEST OK</div>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)