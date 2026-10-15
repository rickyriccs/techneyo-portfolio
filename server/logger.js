import crypto from "crypto";
import { query } from "./db.js";

/**
 * Inserts an activity log entry into the MySQL `activity_logs` table.
 */
export async function logActivity({
  adminId = null,
  actionType,
  moduleName,
  recordId = null,
  oldValue = null,
  newValue = null,
  req = null,
}) {
  try {
    const id = crypto.randomUUID();
    let ipAddress = null;
    let userAgent = null;

    if (req) {
      ipAddress = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || null;
      userAgent = req.headers["user-agent"] || null;
    }

    const sql = `
      INSERT INTO activity_logs (
        id, admin_id, action_type, module_name, record_id,
        old_value, new_value, ip_address, user_agent, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    await query(sql, [
      id,
      adminId,
      actionType,
      moduleName,
      recordId,
      oldValue ? JSON.stringify(oldValue) : null,
      newValue ? JSON.stringify(newValue) : null,
      ipAddress,
      userAgent,
    ]);
  } catch (err) {
    console.warn("Failed to write activity log:", err.message);
  }
}
