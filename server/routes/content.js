import { Router } from "express";
import crypto from "crypto";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// ==========================================
// OFFERS
// ==========================================
router.get("/offers", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM offers ORDER BY display_order ASC, created_at DESC");
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/offers", requireAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || crypto.randomUUID();
    const cols = [
      "id", "title", "slug", "short_description", "detailed_description",
      "offer_type", "starting_price", "discount_price", "billing_period",
      "setup_fee", "booking_amount_type", "booking_amount", "target_audience",
      "whats_included", "whats_not_included", "update_policy", "ownership_policy",
      "terms", "target_keywords", "valid_from", "valid_till", "status",
      "is_featured", "button_text", "button_action", "button_url", "display_order",
      "banner_image_url", "seo_title", "seo_description"
    ];

    const vals = cols.map((c) => {
      if (c === "id") return id;
      const val = data[c];
      if (val === undefined) return null;
      if (Array.isArray(val) || (typeof val === "object" && val !== null)) return JSON.stringify(val);
      if (typeof val === "boolean") return val ? 1 : 0;
      return val;
    });

    const placeholders = cols.map(() => "?").join(", ");
    await query(`INSERT INTO offers (${cols.join(", ")}) VALUES (${placeholders})`, vals);

    return res.status(201).json({ success: true, id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/offers/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updateCols = [];
    const vals = [];

    for (const [key, val] of Object.entries(data)) {
      if (key === "id" || key === "created_at" || key === "updated_at") continue;
      updateCols.push(`\`${key}\` = ?`);
      if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
        vals.push(JSON.stringify(val));
      } else if (typeof val === "boolean") {
        vals.push(val ? 1 : 0);
      } else {
        vals.push(val);
      }
    }

    if (updateCols.length === 0) return res.json({ success: true });
    vals.push(id);
    await query(`UPDATE offers SET ${updateCols.join(", ")} WHERE id = ?`, vals);

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/offers/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM offers WHERE id = ?", [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// BLOGS
// ==========================================
router.get("/blogs", async (req, res) => {
  try {
    const { status } = req.query;
    let sql = "SELECT * FROM blogs";
    const params = [];
    if (status) {
      sql += " WHERE status = ?";
      params.push(status);
    }
    sql += " ORDER BY created_at DESC";
    const rows = await query(sql, params);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/blogs/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const rows = await query("SELECT * FROM blogs WHERE slug = ? OR id = ? LIMIT 1", [slug, slug]);
    if (rows.length === 0) return res.status(404).json({ error: "Blog post not found" });

    // increment view count
    query("UPDATE blogs SET view_count = view_count + 1 WHERE id = ?", [rows[0].id]).catch(() => {});
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/blogs", requireAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || crypto.randomUUID();
    const cols = [
      "id", "title", "slug", "excerpt", "content", "category", "tags",
      "cover_image", "author_name", "author_role", "reading_time",
      "status", "is_featured", "seo_title", "seo_description"
    ];

    const vals = cols.map((c) => {
      if (c === "id") return id;
      const val = data[c];
      if (val === undefined) return null;
      if (Array.isArray(val) || (typeof val === "object" && val !== null)) return JSON.stringify(val);
      if (typeof val === "boolean") return val ? 1 : 0;
      return val;
    });

    const placeholders = cols.map(() => "?").join(", ");
    await query(`INSERT INTO blogs (${cols.join(", ")}) VALUES (${placeholders})`, vals);

    return res.status(201).json({ success: true, id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/blogs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updateCols = [];
    const vals = [];

    for (const [key, val] of Object.entries(data)) {
      if (key === "id" || key === "created_at" || key === "updated_at") continue;
      updateCols.push(`\`${key}\` = ?`);
      if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
        vals.push(JSON.stringify(val));
      } else if (typeof val === "boolean") {
        vals.push(val ? 1 : 0);
      } else {
        vals.push(val);
      }
    }

    if (updateCols.length === 0) return res.json({ success: true });
    vals.push(id);
    await query(`UPDATE blogs SET ${updateCols.join(", ")} WHERE id = ?`, vals);

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/blogs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM blogs WHERE id = ?", [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// SERVICES
// ==========================================
router.get("/services", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM services ORDER BY display_order ASC, created_at DESC");
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/services", requireAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || crypto.randomUUID();
    const cols = ["id", "title", "description", "icon_name", "features", "status", "display_order"];
    const vals = cols.map((c) => {
      if (c === "id") return id;
      const val = data[c];
      if (val === undefined) return null;
      if (Array.isArray(val) || (typeof val === "object" && val !== null)) return JSON.stringify(val);
      return val;
    });
    await query(`INSERT INTO services (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`, vals);
    return res.status(201).json({ success: true, id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/services/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updateCols = [];
    const vals = [];
    for (const [key, val] of Object.entries(data)) {
      if (key === "id" || key === "created_at" || key === "updated_at") continue;
      updateCols.push(`\`${key}\` = ?`);
      if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
        vals.push(JSON.stringify(val));
      } else {
        vals.push(val);
      }
    }
    vals.push(id);
    await query(`UPDATE services SET ${updateCols.join(", ")} WHERE id = ?`, vals);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/services/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM services WHERE id = ?", [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PORTFOLIO CLIENTS
// ==========================================
router.get("/portfolio", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM portfolio_clients ORDER BY display_order ASC, created_at DESC");
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/portfolio", requireAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || crypto.randomUUID();
    const cols = ["id", "company_name", "company_logo_url", "company_description", "company_website_url", "projects", "display_order"];
    const vals = cols.map((c) => {
      if (c === "id") return id;
      const val = data[c];
      if (val === undefined) return null;
      if (Array.isArray(val) || (typeof val === "object" && val !== null)) return JSON.stringify(val);
      return val;
    });
    await query(`INSERT INTO portfolio_clients (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`, vals);
    return res.status(201).json({ success: true, id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/portfolio/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updateCols = [];
    const vals = [];
    for (const [key, val] of Object.entries(data)) {
      if (key === "id" || key === "created_at" || key === "updated_at") continue;
      updateCols.push(`\`${key}\` = ?`);
      if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
        vals.push(JSON.stringify(val));
      } else {
        vals.push(val);
      }
    }
    vals.push(id);
    await query(`UPDATE portfolio_clients SET ${updateCols.join(", ")} WHERE id = ?`, vals);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/portfolio/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM portfolio_clients WHERE id = ?", [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// APP SETTINGS
// ==========================================
router.get("/settings", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM app_settings LIMIT 1");
    if (rows.length === 0) return res.json({});
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/settings", requireAdmin, async (req, res) => {
  try {
    const data = req.body;
    const existing = await query("SELECT id FROM app_settings LIMIT 1");
    const updateCols = [];
    const vals = [];

    for (const [key, val] of Object.entries(data)) {
      if (key === "id" || key === "created_at" || key === "updated_at") continue;
      updateCols.push(`\`${key}\` = ?`);
      if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
        vals.push(JSON.stringify(val));
      } else if (typeof val === "boolean") {
        vals.push(val ? 1 : 0);
      } else {
        vals.push(val);
      }
    }

    if (existing.length > 0) {
      vals.push(existing[0].id);
      await query(`UPDATE app_settings SET ${updateCols.join(", ")} WHERE id = ?`, vals);
    } else {
      const id = crypto.randomUUID();
      const cols = ["id", ...Object.keys(data).filter(k => k !== "id")];
      const insertVals = [id, ...Object.values(data).map(v => typeof v === "object" ? JSON.stringify(v) : v)];
      await query(`INSERT INTO app_settings (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`, insertVals);
    }

    return res.json({ success: true, message: "Settings saved" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ANALYTICS EVENTS
// ==========================================
router.post("/analytics", async (req, res) => {
  try {
    const { event_name, page_path, page_title, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, device_type, session_id, event_properties } = req.body;
    if (!event_name || !page_path) {
      return res.status(400).json({ error: "Missing required analytics event fields" });
    }

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO analytics_events (
        id, event_name, page_path, page_title, utm_source, utm_medium,
        utm_campaign, utm_term, utm_content, referrer, device_type, session_id, event_properties
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, event_name, page_path, page_title || null,
        utm_source || null, utm_medium || null, utm_campaign || null,
        utm_term || null, utm_content || null, referrer || null,
        device_type || null, session_id || null,
        event_properties ? JSON.stringify(event_properties) : null
      ]
    );

    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
