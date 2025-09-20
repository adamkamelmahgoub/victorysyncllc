
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { fakeAuth } from "./middleware/auth";
import { router } from "./routes";
import { startReportJobs } from "./jobs/reports";

// Socket.IO is now optional - only loads when SOCKETS_ENABLED=true
const SOCKETS_ENABLED = process.env.SOCKETS_ENABLED === 'true';

const app = express();
app.use(cors());
app.use(express.json({ verify: (req, _res, buf) => { (req as any).rawBody = buf; } }));
app.use(fakeAuth);

// Web routes
app.use("/api", router);

// Static client (served after build)
app.use(express.static("server/public"));
app.get("*", (_req, res) => res.sendFile(process.cwd() + "/server/public/index.html"));

const httpServer = createServer(app);

// Socket.IO setup - only when enabled via environment variable
(async () => {
  if (!SOCKETS_ENABLED) {
    console.log('🔌 Socket.IO disabled (SOCKETS_ENABLED not set)');
    return;
  }

  try {
    // Dynamic import prevents Node from resolving 'socket.io' unless enabled
    const { Server } = await import('socket.io');
    const io = new Server(httpServer, { path: "/ws" });
    
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      // Add any socket event handlers here if needed
    });
    
    console.log('🔌 Socket.IO enabled and running');
  } catch (error) {
    console.warn('⚠️  Socket.IO failed to load:', error.message);
  }
})();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`VictorySync running on :${PORT} (sockets: ${SOCKETS_ENABLED ? 'on' : 'off'})`);
});

// Jobs
startReportJobs();
