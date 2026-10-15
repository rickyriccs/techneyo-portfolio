import { Router } from "express";
import crypto from "crypto";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/bookings - Public / Razorpay booking creation
router.post("/", async (req, res) => {
  try {
    const {
      offer_id,
      customer_name,
      customer_email,
      customer_phone,
      business_name,
      total_plan_price,
      advance_amount_paid,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_status = "paid",
      onboarding_status = "pending",
      onboarding_details,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      source_page_url,
      landing_page_url,
      initial_referrer,
      referrer,
      device_type,
    } = req.body;

    if (!customer_name || !customer_email || !customer_phone) {
      return res.status(400).json({ error: "Customer name, email, and phone are required" });
    }

    const id = crypto.randomUUID();

    const sql = `
      INSERT INTO offer_bookings (
        id, offer_id, customer_name, customer_email, customer_phone, business_name,
        total_plan_price, advance_amount_paid, razorpay_order_id, razorpay_payment_id,
        razorpay_signature, payment_status, onboarding_status, onboarding_details,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        source_page_url, landing_page_url, initial_referrer, referrer, device_type
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
    `;

    await query(sql, [
      id,
      offer_id || null,
      customer_name,
      customer_email,
      customer_phone,
      business_name || null,
      total_plan_price || null,
      advance_amount_paid || 0,
      razorpay_order_id || null,
      razorpay_payment_id || null,
      razorpay_signature || null,
      payment_status,
      onboarding_status,
      onboarding_details ? JSON.stringify(onboarding_details) : null,
      utm_source || null,
      utm_medium || null,
      utm_campaign || null,
      utm_term || null,
      utm_content || null,
      source_page_url || null,
      landing_page_url || null,
      initial_referrer || null,
      referrer || null,
      device_type || null,
    ]);

    return res.status(201).json({ success: true, id, message: "Booking recorded" });
  } catch (err) {
    console.error("Create booking error:", err);
    return res.status(500).json({ error: "Failed to create booking: " + err.message });
  }
});

// GET /api/bookings/:id - Get single booking (used by Onboarding flow)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query("SELECT * FROM offer_bookings WHERE id = ? OR razorpay_payment_id = ? LIMIT 1", [id, id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("Get booking error:", err);
    return res.status(500).json({ error: "Failed to fetch booking: " + err.message });
  }
});

// PATCH /api/bookings/:id/onboarding - Public update onboarding details
router.patch("/:id/onboarding", async (req, res) => {
  try {
    const { id } = req.params;
    const { onboarding_details, onboarding_status } = req.body;

    const updates = [];
    const params = [];

    if (onboarding_details !== undefined) {
      updates.push("onboarding_details = ?");
      params.push(JSON.stringify(onboarding_details));
    }

    if (onboarding_status !== undefined) {
      updates.push("onboarding_status = ?");
      params.push(onboarding_status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    params.push(id, id);
    await query(`UPDATE offer_bookings SET ${updates.join(", ")} WHERE id = ? OR razorpay_payment_id = ?`, params);

    return res.json({ success: true, message: "Onboarding details saved" });
  } catch (err) {
    console.error("Update onboarding error:", err);
    return res.status(500).json({ error: "Failed to update onboarding: " + err.message });
  }
});

// GET /api/bookings - Admin list bookings
router.get("/", requireAdmin, async (req, res) => {
  try {
    const rows = await query("SELECT * FROM offer_bookings ORDER BY created_at DESC");
    return res.json(rows);
  } catch (err) {
    console.error("List bookings error:", err);
    return res.status(500).json({ error: "Failed to fetch bookings: " + err.message });
  }
});

export default router;
