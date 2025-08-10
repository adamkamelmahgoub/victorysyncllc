
import React from 'react'

type State = { hasError: boolean; error?: any }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false }
  
  static getDerivedStateFromError(error: any) { 
    return { hasError: true, error } 
  }
  
  componentDidCatch(error: any, info: any) { 
    console.error('React error boundary:', error, info) 
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:24,fontFamily:'system-ui'}}>
          <h2>Something went wrong.</h2>
          <p>Please refresh. The error was logged to console.</p>
          <button onClick={() => window.location.reload()} style={{marginTop:16,padding:'8px 16px'}}>
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
