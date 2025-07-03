// Node.js loader to polyfill __dirname for vite.config.ts compatibility
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Set global __dirname for the entire application
// This sets __dirname to the project root directory for vite.config.ts compatibility
const currentDir = dirname(fileURLToPath(import.meta.url));
globalThis.__dirname = currentDir;

// Override path.resolve for vite.config.ts to handle correct path resolution
const originalResolve = path.resolve;
path.resolve = function(...args) {
  // Since we moved client/src to src, the default resolution should work
  return originalResolve.apply(this, args);
};

export async function initialize() {
  // Set up __dirname globally before any modules load
  globalThis.__dirname = currentDir;
}

export async function resolve(specifier, context, nextResolve) {
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  return nextLoad(url, context);
}