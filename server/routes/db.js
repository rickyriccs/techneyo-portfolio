import { Router } from "express";
import crypto from "crypto";
import { query } from "../db.js";

const router = Router();

const ALLOWED_TABLES = new Set([
  "admin_users",
  "admin_profiles", // mapped to admin_users
  "app_settings",
  "offers",
  "services",
  "service_packages",
  "digital_tools",
  "blogs",
  "portfolio_clients",
  "contact_enquiries",
  "offer_bookings",
  "analytics_events",
  "activity_logs",
]);

function resolveTable(tableName) {
  if (tableName === "admin_profiles") return "admin_users";
  return tableName;
}

// POST /api/db/select
router.post("/select", async (req, res) => {
  try {
    let { table, columns = "*", filters = [], order = null, limit = null, offset = null, single = false } = req.body;

    if (!ALLOWED_TABLES.has(table)) {
      return res.status(400).json({ error: `Table '${table}' is not supported.` });
    }

    const actualTable = resolveTable(table);
    let selectColumns = "*";

    if (columns && columns !== "*") {
      // Clean and sanitize column names
      const cols = columns
        .split(",")
        .map((c) => c.trim())
        .filter((c) => /^[a-zA-Z0-9_]+$/.test(c));

      // Never leak password_hash
      const filteredCols = cols.filter((c) => c !== "password_hash");
      if (filteredCols.length > 0) {
        selectColumns = filteredCols.map((c) => `\`${c}\``).join(", ");
      }
    } else if (actualTable === "admin_users") {
      selectColumns = "`id`, `email`, `full_name`, `role`, `must_change_password`, `is_active`, `created_at`, `updated_at`";
    }

    let sql = `SELECT ${selectColumns} FROM \`${actualTable}\``;
    const params = [];

    // Filters: array of { column, operator, value }
    if (Array.isArray(filters) && filters.length > 0) {
      const whereClauses = [];
      for (const f of filters) {
        if (!/^[a-zA-Z0-9_]+$/.test(f.column)) continue;
        const col = `\`${f.column}\``;
        const op = f.operator || "=";

        if (op === "=" || op === "eq") {
          whereClauses.push(`${col} = ?`);
          params.push(f.value);
        } else if (op === "!=" || op === "neq") {
          whereClauses.push(`${col} != ?`);
          params.push(f.value);
        } else if (op === "like" || op === "ilike") {
          whereClauses.push(`${col} LIKE ?`);
          params.push(f.value);
        } else if (op === "in") {
          if (Array.isArray(f.value) && f.value.length > 0) {
            const inPlaceholders = f.value.map(() => "?").join(", ");
            whereClauses.push(`${col} IN (${inPlaceholders})`);
            params.push(...f.value);
          }
        } else if (op === "is" && f.value === null) {
          whereClauses.push(`${col} IS NULL`);
        }
      }

      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(" AND ")}`;
      }
    }

    // Order
    if (order && order.column && /^[a-zA-Z0-9_]+$/.test(order.column)) {
      const dir = order.ascending === false ? "DESC" : "ASC";
      sql += ` ORDER BY \`${order.column}\` ${dir}`;
    }

    // Limit & Offset
    if (typeof limit === "number" && limit > 0) {
      sql += ` LIMIT ?`;
      params.push(limit);
      if (typeof offset === "number" && offset >= 0) {
        sql += ` OFFSET ?`;
        params.push(offset);
      }
    }

    const rows = await query(sql, params);

    // Parse JSON columns if any returned
    const parsedRows = rows.map((row) => {
      const cleanRow = { ...row };
      for (const [key, val] of Object.entries(cleanRow)) {
        if (typeof val === "string" && (val.startsWith("[") || val.startsWith("{"))) {
          try {
            cleanRow[key] = JSON.parse(val);
          } catch {
            // keep as string
          }
        }
      }
      return cleanRow;
    });

    if (single) {
      return res.json({ data: parsedRows[0] || null, error: null });
    }

    return res.json({ data: parsedRows, error: null });
  } catch (err) {
    console.error("DB select error:", err);
    return res.status(500).json({ data: null, error: { message: err.message } });
  }
});

// POST /api/db/count
router.post("/count", async (req, res) => {
  try {
    const { table, filters = [] } = req.body;
    if (!ALLOWED_TABLES.has(table)) {
      return res.status(400).json({ error: `Table '${table}' is not supported.` });
    }
    const actualTable = resolveTable(table);

    let sql = `SELECT COUNT(*) as count FROM \`${actualTable}\``;
    const params = [];

    if (Array.isArray(filters) && filters.length > 0) {
      const whereClauses = [];
      for (const f of filters) {
        if (!/^[a-zA-Z0-9_]+$/.test(f.column)) continue;
        whereClauses.push(`\`${f.column}\` = ?`);
        params.push(f.value);
      }
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(" AND ")}`;
      }
    }

    const rows = await query(sql, params);
    return res.json({ count: rows[0]?.count || 0, error: null });
  } catch (err) {
    return res.status(500).json({ count: 0, error: { message: err.message } });
  }
});

function normalizeDbValue(val) {
  if (val === undefined || val === null) return null;
  if (typeof val === "object") return JSON.stringify(val);
  if (typeof val === "boolean") return val ? 1 : 0;
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/.test(val)) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 19).replace("T", " ");
    }
  }
  return val;
}

// POST /api/db/insert
router.post("/insert", async (req, res) => {
  try {
    const { table, rows } = req.body;
    if (!ALLOWED_TABLES.has(table)) {
      return res.status(400).json({ error: `Table '${table}' is not supported.` });
    }
    const actualTable = resolveTable(table);

    const items = Array.isArray(rows) ? rows : [rows];
    if (items.length === 0) return res.json({ data: [], error: null });

    const insertedResults = [];

    for (const item of items) {
      const data = { ...item };
      if (!data.id) {
        data.id = crypto.randomUUID();
      }

      const keys = Object.keys(data).filter((k) => /^[a-zA-Z0-9_]+$/.test(k));
      const cols = keys.map((k) => `\`${k}\``).join(", ");
      const placeholders = keys.map(() => "?").join(", ");
      const vals = keys.map((k) => normalizeDbValue(data[k]));

      const sql = `INSERT INTO \`${actualTable}\` (${cols}) VALUES (${placeholders})`;
      await query(sql, vals);
      insertedResults.push(data);
    }

    return res.json({ data: insertedResults, error: null });
  } catch (err) {
    console.error("DB insert error:", err);
    return res.status(500).json({ data: null, error: { message: err.message } });
  }
});

// POST /api/db/update
router.post("/update", async (req, res) => {
  try {
    const { table, values, filters = [] } = req.body;
    if (!ALLOWED_TABLES.has(table)) {
      return res.status(400).json({ error: `Table '${table}' is not supported.` });
    }
    const actualTable = resolveTable(table);

    const updateClauses = [];
    const params = [];

    for (const [key, val] of Object.entries(values || {})) {
      if (key === "id" || key === "created_at" || !/^[a-zA-Z0-9_]+$/.test(key)) continue;
      updateClauses.push(`\`${key}\` = ?`);
      params.push(normalizeDbValue(val));
    }

    if (updateClauses.length === 0) {
      return res.json({ data: [], error: null });
    }

    let sql = `UPDATE \`${actualTable}\` SET ${updateClauses.join(", ")}`;

    if (Array.isArray(filters) && filters.length > 0) {
      const whereClauses = [];
      for (const f of filters) {
        if (!/^[a-zA-Z0-9_]+$/.test(f.column)) continue;
        whereClauses.push(`\`${f.column}\` = ?`);
        params.push(normalizeDbValue(f.value));
      }
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(" AND ")}`;
      }
    }

    await query(sql, params);
    return res.json({ data: [values], error: null });
  } catch (err) {
    console.error("DB update error:", err);
    return res.status(500).json({ data: null, error: { message: err.message } });
  }
});

// POST /api/db/delete
router.post("/delete", async (req, res) => {
  try {
    const { table, filters = [] } = req.body;
    if (!ALLOWED_TABLES.has(table)) {
      return res.status(400).json({ error: `Table '${table}' is not supported.` });
    }
    const actualTable = resolveTable(table);

    let sql = `DELETE FROM \`${actualTable}\``;
    const params = [];

    if (Array.isArray(filters) && filters.length > 0) {
      const whereClauses = [];
      for (const f of filters) {
        if (!/^[a-zA-Z0-9_]+$/.test(f.column)) continue;
        whereClauses.push(`\`${f.column}\` = ?`);
        params.push(f.value);
      }
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(" AND ")}`;
      }
    }

    await query(sql, params);
    return res.json({ error: null });
  } catch (err) {
    console.error("DB delete error:", err);
    return res.status(500).json({ error: { message: err.message } });
  }
});

export default router;
