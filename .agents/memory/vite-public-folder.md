---
name: Vite public folder location
description: Where to put static assets (robots.txt, sitemap.xml, favicons) so they are served correctly in dev and prod.
---

The Vite config sets `root: path.resolve(import.meta.dirname, "client")`, so Vite's public directory is `client/public/`, not the repo root `public/`.

**Why:** Files placed in root `public/` are NOT served by Vite in dev mode. They only end up in the build if explicitly copied. Placing them in `client/public/` ensures they are served at `/` in both dev and production.

**How to apply:** Any file that needs to be served at the root URL (robots.txt, sitemap.xml, favicons, etc.) must be placed in `client/public/`. The root `public/` folder is unused by Vite.
