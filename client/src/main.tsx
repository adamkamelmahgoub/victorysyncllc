import { createRoot } from "react-dom/client";
import App from "./App";
import TestApp from "./components/TestApp";
import "./index.css";

// Use TestApp temporarily to debug the issue
createRoot(document.getElementById("root")!).render(<TestApp />);
