
// Keep preview warm so WS/HMR doesn't flake in Replit iframe
setInterval(() => { fetch('/health').catch(() => {}); }, 25000);
