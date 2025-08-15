import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

try {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  root.innerHTML = '<div style="padding: 20px; color: red;">Application failed to load. Check console for details.</div>';
}