
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({ error: "admin_payment_rules_fetch_failed" });
  }
});

export default router;
