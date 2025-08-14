
// Ping health endpoint so Replit keeps the preview warm
const KEEPALIVE_MS = 25_000;
setInterval(() => {
  fetch('/health').catch(() => void 0);
}, KEEPALIVE_MS);
