
// server/routes.ts
import type express from "express";

async function tryImport(base: string) {
  const candidates = [`${base}.ts`, `${base}.js`];
  for (const spec of candidates) {
    try {
      // @ts-ignore
      return await import(spec);
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      const notFound =
        msg.includes("Cannot find module") ||
        msg.includes("ERR_MODULE_NOT_FOUND") ||
        msg.includes("Module not found");
      if (!notFound) console.error(`[routes] Failed to import ${spec}:`, err);
    }
  }
  return null;
}

function mountAt(app: express.Express, basePath: string, prefix = "/api") {
  return async () => {
    const mod = await tryImport(basePath);
    if (!mod) return;
    const router = (mod as any).default ?? (mod as any).router ?? (mod as any);
    if (typeof router === "function") {
      app.use(prefix, router);
      console.log(`[routes] Mounted ${prefix} -> ${basePath}`);
    } else {
      console.warn(`[routes] ${basePath} found but did not export a router`);
    }
  };
}

export default async function registerRoutes(app: express.Express) {
  const mount = (p: string) => mountAt(app, p)();

  // Auth
  await mount("./routes/auth.mfa");
  await mount("./routes/auth");
  await mount("./routes/access-codes");
  await mount("./routes/invites");

  // Admin
  await mount("./routes/admin");
  await mount("./routes/admin.users");
  await mount("./routes/admin.organizations");
  await mount("./routes/admin.coupons");
  await mount("./routes/admin.api-keys");
  await mount("./routes/admin.webhooks");

  // Customer/core
  await mount("./routes/organizations");
  await mount("./routes/orders");
  await mount("./routes/billing");
  await mount("./routes/integrations");
  await mount("./routes/kpi");
  await mount("./routes/contacts");

  // Utilities
  await mount("./routes/health"); // exposes /api/health
}
