
// server/lib/env.ts
export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 5000),
  REDIS_URL: process.env.REDIS_URL ?? "",
  SEED_ON_BOOT: (process.env.SEED_ON_BOOT ?? "true") === "true",
};
