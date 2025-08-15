
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import "./index.css";

// SUPER-DEFENSIVE: if mount fails, write to body
const rootEl = document.getElementById("root");
if (!rootEl) {
  const msg = document.createElement("pre");
  msg.textContent = "Mount failed: #root not found";
  document.body.appendChild(msg);
  throw new Error("No #root element");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);
