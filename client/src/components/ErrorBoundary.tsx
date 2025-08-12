
import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, info: any) { console.error('UI crash:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <main className="p-6">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <pre className="mt-2 bg-gray-100 p-3 rounded">{String(this.state.error)}</pre>
        </main>
      );
    }
    return this.props.children;
  }
}
