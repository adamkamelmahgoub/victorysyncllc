# Legacy Express admin bootstrap

The Express server creates an initial administrator only when both `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` are set. Use a unique password of at least 16 characters. Existing users are not changed by the bootstrap process. Production also requires `JWT_SECRET` and `DATABASE_URL`.

The Vercel marketing site and `/cms` are static and do not use this Express administrator. The CMS authorizes GitHub commits with a fine grained repository token entered for the current editor tab.
