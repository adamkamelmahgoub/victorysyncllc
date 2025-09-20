import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { fakeAuth } from "./middleware/auth";
import { router } from "./routes";
import { startReportJobs } from "./jobs/reports";

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
export const io = new Server(httpServer, { path: "/ws" });

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => console.log(`VictorySync running on ${PORT}`));

// Jobs
startReportJobs();