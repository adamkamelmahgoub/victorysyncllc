
import { Router } from "express";

const router = Router();

router.get("/csv/:type", async (req, res) => {
  try {
    const { type } = req.params;
    res.status(200).json({ downloadUrl: null, status: "pending" });
  } catch (err) {
    res.status(500).json({ error: "export_failed" });
  }
});

export default router;
