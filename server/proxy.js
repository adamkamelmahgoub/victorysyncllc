
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

// Config
const PORT = process.env.PORT || 5000;
const TARGET = process.env.TARGET || 'https://victorysync.com';

// Basic hardening + gzip + logs
app.disable('x-powered-by');
app.use(compression());
app.use(morgan('tiny'));

// Healthcheck
app.get('/__health', (_req, res) => res.status(200).send('ok'));

// Reverse proxy ALL routes -> live site
app.use(
  '/',
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    secure: true,
    ws: true,
    followRedirects: true,
    // Keep cookies/host sane
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Host', new URL(TARGET).host);
      proxyReq.setHeader('Origin', TARGET);
    },
    // Strip or adjust headers that can block rendering through a proxy
    onProxyRes: (proxyRes, req, res) => {
      const drop = [
        'content-security-policy',
        'x-frame-options',
        'x-content-type-options',
        'cross-origin-embedder-policy',
        'cross-origin-opener-policy',
        'cross-origin-resource-policy',
        'referrer-policy'
      ];
      drop.forEach((h) => {
        if (proxyRes.headers[h]) delete proxyRes.headers[h];
        if (proxyRes.headers[h.toUpperCase()]) delete proxyRes.headers[h.toUpperCase()];
      });

      // Keep user on the proxy when the origin issues absolute redirects
      const loc = proxyRes.headers['location'] || proxyRes.headers['Location'];
      if (loc && loc.startsWith(TARGET)) {
        const newLoc = loc.replace(TARGET, '/');
        proxyRes.headers['location'] = newLoc;
        proxyRes.headers['Location'] = newLoc;
      }
    },
    // Preserve original path/query
    pathRewrite: (path) => path,
    // Timeouts to avoid hanging
    proxyTimeout: 30_000,
    timeout: 30_000,
  })
);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[proxy] Forwarding http://localhost:${PORT} -> ${TARGET}`);
});
