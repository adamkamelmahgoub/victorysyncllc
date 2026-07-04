import { createRoot } from "react-dom/client";
import App from "./App";
import { loadMarketingAnalytics } from "./lib/analytics";
import "./index.css";

document.documentElement.classList.add("dark");
loadMarketingAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
