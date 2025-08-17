
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({ error: "orders_fetch_failed" });
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json({ id: null, status: "pending", total: 0 });
  } catch (err) {
    res.status(500).json({ error: "order_create_failed" });
  }
});

export default router;
