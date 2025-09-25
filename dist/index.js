// server/index.ts
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
app.get("/health", (_req, res) => res.status(200).send("ok"));
var clientDist = path.resolve(__dirname, "../server/public");
app.use(express.static(clientDist));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});
var PORT = Number(process.env.PORT || 5e3);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`VictorySync running on port ${PORT}`);
});
