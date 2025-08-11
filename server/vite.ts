import type { Express } from 'express';
import { createServer, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

export async function setupVite(app: Express): Promise<ViteDevServer> {
  const isReplit = Boolean(process.env.REPL_ID || process.env.REPL_SLUG || process.env.REPLIT_DB_URL);

  const vite = await createServer({
    appType: 'custom',
    root: 'client',
    plugins: [react()],
    server: {
      middlewareMode: true,
      host: true,
      // Replit preview uses *.replit.dev with HTTPS/WSS
      allowedHosts: true,
      hmr: isReplit ? { protocol: 'wss', clientPort: 443 } : undefined,
    },
    preview: { host: true, allowedHosts: true },
    build: { outDir: 'dist', emptyOutDir: true },
  });

  app.use(vite.middlewares);
  return vite;
}