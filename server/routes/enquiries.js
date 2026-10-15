import { Router } from "express";
import crypto from "crypto";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { enquiryRateLimiter, botDetectionFilter } from "../middleware/botProtection.js";
import { logActivity } from "../logger.js";

const router = Router();

// Non-blocking Slack dispatch helper
async function dispatchSlackNotification(payload) {
  try {
    const settingsRows = await query("SELECT slack_enabled, slack_webhook_url, slack_channel, slack_notify_enquiries FROM app_settings LIMIT 1");
    if (!settingsRows || settingsRows.length === 0) return;

    const settings = settingsRows[0];
    if (!settings.slack_enabled || !settings.slack_webhook_url || !settings.slack_notify_enquiries) {
      return;
    }

    const message = {
      channel: settings.slack_channel || "#leads",
      text: `🚀 *New Lead Received: ${payload.name}*`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "🔥 New Customer Enquiry", emoji: true },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Name:*\n${payload.name}` },
            { type: "mrkdwn", text: `*Phone:*\n<tel:${payload.phone}|${payload.phone}>` },
            { type: "mrkdwn", text: `*Email:*\n${payload.email || "Not provided"}` },
            { type: "mrkdwn", text: `*Service:*\n${payload.service_required || "General"}` },
            { type: "mrkdwn", text: `*Budget:*\n${payload.budget_range || "Flexible"}` },
            { type: "mrkdwn", text: `*Source Page:*\n${payload.source_page || "Direct"}` },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Message / Requirements:*\n>>> ${payload.message || "No notes provided"}`,
          },
        },
      ],
    };

    await fetch(settings.slack_webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  } catch (err) {
    console.warn("Failed to dispatch Slack alert for enquiry:", err.message);
  }
}

// POST /api/enquiries - Public lead submission with bot protection
router.post("/", enquiryRateLimiter, botDetectionFilter, async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      business_name,
      businessName,
      city,
      state,
      service_required,
      serviceRequired,
      serviceInterested,
      budget_range,
      budgetRange,
      message,
      source_page,
      sourcePage,
      source_page_url,
      landing_page_url,
      initial_referrer,
      referrer,
      selected_offer_id,
      selected_package_id,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      device_type,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone number are required" });
    }

    const id = crypto.randomUUID();
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || null;
    const userAgent = req.headers["user-agent"] || null;

    const payload = {
      id,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      business_name: business_name || businessName || null,
      city: city || null,
      state: state || null,
      service_required: service_required || serviceRequired || serviceInterested || null,
      budget_range: budget_range || budgetRange || null,
      message: message || "",
      source_page: source_page || sourcePage || null,
      source_page_url: source_page_url || null,
      landing_page_url: landing_page_url || null,
      initial_referrer: initial_referrer || null,
      referrer: referrer || null,
      selected_offer_id: selected_offer_id || null,
      selected_package_id: selected_package_id || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_term: utm_term || null,
      utm_content: utm_content || null,
      device_type: device_type || null,
      ip_address: clientIp,
      user_agent: userAgent,
      lead_status: "new",
    };

    const sql = `
      INSERT INTO contact_enquiries (
        id, name, phone, email, business_name, city, state,
        service_required, budget_range, message, source_page,
        source_page_url, landing_page_url, initial_referrer, referrer,
        selected_offer_id, selected_package_id, utm_source, utm_medium,
        utm_campaign, utm_term, utm_content, device_type, ip_address,
        user_agent, lead_status
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?
      )
    `;

    await query(sql, [
      payload.id,
      payload.name,
      payload.phone,
      payload.email,
      payload.business_name,
      payload.city,
      payload.state,
      payload.service_required,
      payload.budget_range,
      payload.message,
      payload.source_page,
      payload.source_page_url,
      payload.landing_page_url,
      payload.initial_referrer,
      payload.referrer,
      payload.selected_offer_id,
      payload.selected_package_id,
      payload.utm_source,
      payload.utm_medium,
      payload.utm_campaign,
      payload.utm_term,
      payload.utm_content,
      payload.device_type,
      payload.ip_address,
      payload.user_agent,
      payload.lead_status,
    ]);

    // Dispatch Slack alert asynchronously
    dispatchSlackNotification(payload);

    logActivity({
      actionType: "created",
      moduleName: "contact_enquiries",
      recordId: id,
      newValue: { name: payload.name, phone: payload.phone, service: payload.service_required },
      req,
    });

    return res.status(201).json({
      success: true,
      id,
      message: "Enquiry submitted successfully",
    });
  } catch (err) {
    console.error("Enquiry submission error:", err);
    return res.status(500).json({ error: "Failed to process enquiry: " + err.message });
  }
});

// GET /api/enquiries - Admin list enquiries
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;

    let sql = "SELECT * FROM contact_enquiries WHERE 1=1";
    const params = [];

    if (status && status !== "all") {
      sql += " AND lead_status = ?";
      params.push(status);
    }

    if (search) {
      sql += " AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR business_name LIKE ? OR service_required LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const rows = await query(sql, params);

    // Get total count
    let countSql = "SELECT COUNT(*) as total FROM contact_enquiries WHERE 1=1";
    const countParams = [];
    if (status && status !== "all") {
      countSql += " AND lead_status = ?";
      countParams.push(status);
    }
    if (search) {
      countSql += " AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR business_name LIKE ? OR service_required LIKE ?)";
      const term = `%${search}%`;
      countParams.push(term, term, term, term, term);
    }
    const countResult = await query(countSql, countParams);

    return res.json({
      enquiries: rows,
      total: countResult[0]?.total || 0,
    });
  } catch (err) {
    console.error("Fetch enquiries error:", err);
    return res.status(500).json({ error: "Failed to fetch enquiries: " + err.message });
  }
});

// PATCH /api/enquiries/:id - Update status or notes
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { lead_status, admin_notes } = req.body;

    const updates = [];
    const params = [];

    if (lead_status !== undefined) {
      updates.push("lead_status = ?");
      params.push(lead_status);
    }

    if (admin_notes !== undefined) {
      updates.push("admin_notes = ?");
      params.push(admin_notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    params.push(id);
    await query(`UPDATE contact_enquiries SET ${updates.join(", ")} WHERE id = ?`, params);

    logActivity({
      adminId: req.admin?.id,
      actionType: "updated",
      moduleName: "contact_enquiries",
      recordId: id,
      newValue: { lead_status, admin_notes },
      req,
    });

    return res.json({ success: true, message: "Enquiry updated" });
  } catch (err) {
    console.error("Update enquiry error:", err);
    return res.status(500).json({ error: "Failed to update enquiry: " + err.message });
  }
});

// DELETE /api/enquiries/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM contact_enquiries WHERE id = ?", [id]);

    logActivity({
      adminId: req.admin?.id,
      actionType: "deleted",
      moduleName: "contact_enquiries",
      recordId: id,
      req,
    });

    return res.json({ success: true, message: "Enquiry deleted" });
  } catch (err) {
    console.error("Delete enquiry error:", err);
    return res.status(500).json({ error: "Failed to delete enquiry: " + err.message });
  }
});

export default router;
