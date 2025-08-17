
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({ error: "webhooks_fetch_failed" });
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json({ id: null, url: null, events: [] });
  } catch (err) {
    res.status(500).json({ error: "webhook_create_failed" });
  }
});

export default router;
