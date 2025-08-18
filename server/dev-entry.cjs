
// CJS bootstrap that imports the ESM server with Vite middleware.
// This avoids __dirname/ESM loader weirdness in the Replit runner.

(async () => {
  try {
    // Cleanly abort any previous listeners held by watch restarts
    process.on('SIGTERM', () => process.exit(0))
    process.on('SIGINT', () => process.exit(0))

    await import('./index.ts')
  } catch (err) {
    console.error('[dev-entry] Failed to start server:', err)
    process.exit(1)
  }
})()
