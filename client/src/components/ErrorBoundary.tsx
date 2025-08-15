
import React from "react";

type State = { hasError: boolean; message?: string };
export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: Error) { return { hasError: true, message: err?.message || "App error" }; }
  componentDidCatch(err: any, info: any) { console.error("ErrorBoundary", err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="text-sm text-gray-600 mt-2">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
