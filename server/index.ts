import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Health check
app.get('/health', (_req, res) => res.status(200).send('ok'));

// Serve static files from the built client
const clientDist = path.resolve(__dirname, '../server/public');
app.use(express.static(clientDist));

// Catch all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VictorySync running on port ${PORT}`);
});