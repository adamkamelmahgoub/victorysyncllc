
// server/vite.ts
import { createServer, type ViteDevServer, type ServerOptions } from 'vite';
import react from '@vitejs/plugin-react';
import type { Express } from 'express';

const isReplit =
  Boolean(process.env.REPL_ID || process.env.REPL_SLUG || process.env.REPLIT_DB_URL);

const serverOptions: ServerOptions = {
  middlewareMode: true,
  allowedHosts: true,            // allow *.replit.dev
  hmr: isReplit ? { protocol: 'wss', clientPort: 443 } : undefined,
};

export async function setupVite(app: Express): Promise<ViteDevServer> {
  const vite = await createServer({
    appType: 'custom',
    root: 'client',
    plugins: [react()],
    server: serverOptions,
    preview: { allowedHosts: true },
    build: { outDir: 'dist', emptyOutDir: true },
  });
  app.use(vite.middlewares);
  return vite;
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  const express = require('express');
  const path = require('path');
  const fs = require('fs');
  
  const distPath = path.resolve(import.meta.dirname, "../client/dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // SPA catch-all: serve index.html for all non-API routes
  app.use("*", (_req: any, res: any) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
