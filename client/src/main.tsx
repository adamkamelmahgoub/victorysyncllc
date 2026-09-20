import { createRoot } from "react-dom/client";
import App from "./App";
import { loadMarketingAnalytics } from "./lib/analytics";
import "./index.css";

document.documentElement.classList.add("dark");
if (window.location.pathname !== "/cms" && !new URLSearchParams(window.location.search).has("cmsEdit")) {
  loadMarketingAnalytics();
}

createRoot(document.getElementById("root")!).render(<App />);
