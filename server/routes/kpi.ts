
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      metrics: [],
      totals: { calls: 0, revenue: 0, satisfaction: 0 }
    });
  } catch (err) {
    res.status(500).json({ error: "kpi_fetch_failed" });
  }
});

export default router;
