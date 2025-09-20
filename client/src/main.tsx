import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// For demo: set a test orgId in localStorage once
if (!localStorage.getItem("orgId")) localStorage.setItem("orgId", "demo-org-1");

createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);