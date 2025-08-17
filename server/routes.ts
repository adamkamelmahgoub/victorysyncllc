
// server/routes.ts
import type express from "express";

/**
 * Robustly try to import a route module with .ts or .js.
 * Works both when running via tsx (TS files) and when compiled.
 */
async function tryImport(base: string) {
  const candidates = [`${base}.ts`, `${base}.js`];
  for (const spec of candidates) {
    try {
      // @ts-ignore - dynamic import string
      return await import(spec);
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      const isNotFound =
        msg.includes("Cannot find module") ||
        msg.includes("ERR_MODULE_NOT_FOUND") ||
        msg.includes("Module not found");
      if (!isNotFound) {
        // If it's a real runtime error inside the module, surface it.
        console.error(`[routes] Failed to import ${spec}:`, err);
      }
      // otherwise continue to next candidate
    }
  }
  return null;
}

/**
 * Safely mounts a route module if present.
 * Accepts EITHER a default export (router) or a named export "router".
 */
async function mountIfExists(app: express.Express, basePath: string) {
  const mod = await tryImport(basePath);
  if (!mod) return;
  const router = (mod as any).default ?? (mod as any).router ?? (mod as any);
  if (typeof router === "function") {
    app.use(router);
    console.log(`[routes] Mounted ${basePath}`);
  } else {
    console.warn(`[routes] ${basePath} found but did not export a router function`);
  }
}

/**
 * Default export: register all known route modules.
 * This won't throw if a route file is missing — it just skips it.
 */
export default async function registerRoutes(app: express.Express) {
  // Auth
  await mountIfExists(app, "./routes/auth.mfa");
  await mountIfExists(app, "./routes/auth");
  await mountIfExists(app, "./routes/access-codes");
  await mountIfExists(app, "./routes/invites");

  // Admin
  await mountIfExists(app, "./routes/admin");
  await mountIfExists(app, "./routes/admin.users");
  await mountIfExists(app, "./routes/admin.organizations");
  await mountIfExists(app, "./routes/admin.coupons");
  await mountIfExists(app, "./routes/admin.api-keys");
  await mountIfExists(app, "./routes/admin.webhooks");

  // Customer / core
  await mountIfExists(app, "./routes/organizations");
  await mountIfExists(app, "./routes/orders");
  await mountIfExists(app, "./routes/billing");
  await mountIfExists(app, "./routes/integrations");
  await mountIfExists(app, "./routes/kpi");
  await mountIfExists(app, "./routes/contacts");

  // Utilities
  await mountIfExists(app, "./routes/health");
}
