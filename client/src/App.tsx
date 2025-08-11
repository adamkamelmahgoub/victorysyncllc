import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
// If you use React Router, import and render your Routes here.
// Keep a visible shell so a thrown error doesn't look like a blank page.

export default function App() {
  return (
    <ErrorBoundary>
      <div style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
      }}>
        <div>
          <h1 style={{ margin: 0 }}>VictorySync app loaded</h1>
          <p style={{ marginTop: 8, color: "#667085" }}>
            If you don't see your real UI yet, the app shell is mounted. Now wire your routes/components.
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
}