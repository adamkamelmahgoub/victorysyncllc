
import { Router } from "express";

const router = Router();

/**
 * Billing Router (production-safe minimal)
 * - No placeholder/demo data returned
 * - Neutral, typed responses (null/0/[]) until services are wired
 * - All handlers wrapped with try/catch and 4xx/5xx semantics
 */

router.get("/billing/info", async (req, res) => {
  try {
    // If you have a real service module, you can swap this in later:
    // const svc = await import("../services/billing");
    // const data = await svc.getBillingInfo(req.user?.orgId);

    // Neutral response (no demo content)
    res.status(200).json({
      plan: null,
      seats: 0,
      invoices: [],
      currency: "USD",
    });
  } catch (err) {
    res.status(500).json({ error: "billing_info_failed" });
  }
});

router.post("/billing/seats", async (req, res) => {
  try {
    const { delta } = req.body ?? {};
    if (typeof delta !== "number") {
      return res.status(400).json({ error: "delta_required" });
    }

    // Swap to real logic later:
    // const svc = await import("../services/billing");
    // await svc.adjustSeats(req.user?.orgId, delta);

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "billing_seats_failed" });
  }
});

router.get("/billing/invoice/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Swap to real logic later:
    // const svc = await import("../services/billing");
    // const invoice = await svc.getInvoiceById(req.user?.orgId, id);

    // Neutral structure
    res.status(200).json({
      id,
      amount: 0,
      pdfUrl: null,
      issuedAt: null,
      status: null,
      lineItems: [],
    });
  } catch (err) {
    res.status(500).json({ error: "billing_invoice_failed" });
  }
});

router.post("/billing/coupons", async (req, res) => {
  try {
    const { code } = req.body ?? {};
    if (!code) return res.status(400).json({ error: "code_required" });

    // Swap to real logic later:
    // const svc = await import("../services/billing");
    // const preview = await svc.previewCoupon(req.user?.orgId, code);

    // Neutral response indicates "not applicable" until wired
    res.status(200).json({ valid: false, discount: 0, reason: "not_configured" });
  } catch (err) {
    res.status(500).json({ error: "billing_coupon_failed" });
  }
});

export default router;
