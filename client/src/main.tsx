
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

function bootstrap() {
  // Boot breadcrumbs to detect where it stalls
  // eslint-disable-next-line no-console
  console.log("[VictorySync] BOOT:start", { env: import.meta.env.MODE });
  const el = document.getElementById("root");
  if (!el) {
    console.error("[VictorySync] #root not found");
    return;
  }
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("[VictorySync] BOOT:mounted");
}

try {
  bootstrap();
} catch (e) {
  console.error("[VictorySync] BOOT:error", e);
}
