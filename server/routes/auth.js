import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { query } from "../db.js";
import { generateToken, requireAdmin } from "../middleware/auth.js";
import { logActivity } from "../logger.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    let rows = await query(
      "SELECT id, email, password_hash, full_name, role, must_change_password, is_active FROM admin_users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    // If user record doesn't exist, check if this is the configured admin email
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || "admin@techneyo.com").toLowerCase();
    if (rows.length === 0 && (cleanEmail === configuredAdminEmail || cleanEmail === "admin@techneyo.com" || cleanEmail === "rs.nitesh01@gmail.com")) {
      const id = crypto.randomUUID();
      const defaultHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || password, 10);
      await query(
        "INSERT INTO admin_users (id, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, 'owner', 1)",
        [id, cleanEmail, defaultHash, "Techneyo Admin"]
      );
      rows = await query(
        "SELECT id, email, password_hash, full_name, role, must_change_password, is_active FROM admin_users WHERE email = ? LIMIT 1",
        [cleanEmail]
      );
    }

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    if (!user.is_active) {
      return res.status(403).json({ error: "Account is inactive. Please contact the administrator." });
    }

    // Check bcrypt hash
    let isValid = await bcrypt.compare(password, user.password_hash);

    // Also match configured env password, or standard passwords: Ns@ram01, Admin@Techneyo2026!, Techneyo@964635
    const envAdminPassword = process.env.ADMIN_PASSWORD;
    const knownAllowedPasswords = [envAdminPassword, "Ns@ram01", "Admin@Techneyo2026!", "Techneyo@964635"].filter(Boolean);

    if (!isValid && knownAllowedPasswords.includes(password)) {
      isValid = true;
      // Synchronize the new bcrypt hash into MySQL
      const updatedHash = await bcrypt.hash(password, 10);
      await query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [updatedHash, user.id]);
    }

    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    });

    logActivity({
      adminId: user.id,
      actionType: "login",
      moduleName: "auth",
      recordId: user.id,
      newValue: { email: user.email, role: user.role },
      req,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        must_change_password: Boolean(user.must_change_password),
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during authentication: " + err.message });
  }
});

// GET /api/auth/me
router.get("/me", requireAdmin, async (req, res) => {
  try {
    const rows = await query(
      "SELECT id, email, full_name, role, must_change_password, is_active FROM admin_users WHERE id = ? LIMIT 1",
      [req.admin.id]
    );

    if (rows.length === 0 || !rows[0].is_active) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    const user = rows[0];
    return res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      must_change_password: Boolean(user.must_change_password),
    });
  } catch (err) {
    console.error("Auth check error:", err);
    return res.status(500).json({ error: "Failed to retrieve profile: " + err.message });
  }
});

// POST /api/auth/change-password
router.post("/change-password", requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    const rows = await query("SELECT password_hash FROM admin_users WHERE id = ? LIMIT 1", [req.admin.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
      const isEnvMatch = process.env.ADMIN_PASSWORD && currentPassword === process.env.ADMIN_PASSWORD;
      if (!isMatch && !isEnvMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await query("UPDATE admin_users SET password_hash = ?, must_change_password = 0 WHERE id = ?", [
      newHash,
      req.admin.id,
    ]);

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    return res.status(500).json({ error: "Failed to update password: " + err.message });
  }
});

export default router;
