import rateLimit from "express-rate-limit";

// Rate limiter for form enquiry endpoints: max 10 submissions per 15 minutes per IP
export const enquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "Too many enquiries submitted from this network. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Checks for email dot-trick abuse (e.g. ip.o.zu.yu.cun6.1.0@gmail.com)
 * Bots generate dot-stuffed local parts to bypass basic duplicate checks.
 */
export const isDotTrickEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return true; // Malformed email

  const [localPart, domain] = parts;
  // If local part has 3 or more dots (typical of automated Gmail dot generator spam)
  const dotCount = (localPart.match(/\./g) || []).length;
  if (dotCount >= 3) {
    return true;
  }

  // Also check if local part consists of single characters separated by dots (e.g. a.b.c.d)
  const segments = localPart.split(".");
  if (segments.length >= 3 && segments.some((s) => s.length === 1)) {
    return true;
  }

  return false;
};

/**
 * Bot protection middleware:
 * 1. Checks honeypot fields (`website_url`, `business_fax`, `_hp`)
 * 2. Checks form completion velocity (`fill_time_ms`)
 * 3. Checks dot-trick email abuse
 * 4. Checks phone number validity
 * If flagged, silently drops the submission (returns HTTP 200 so bots think they succeeded).
 */
export const botDetectionFilter = (req, res, next) => {
  const { website_url, business_fax, _hp, fill_time_ms, email, phone } = req.body;

  // 1. Honeypot check - humans cannot see this field, bots fill it out
  if (website_url || business_fax || _hp) {
    console.warn("[BOT BLOCKED] Honeypot field triggered:", {
      ip: req.ip,
      website_url,
      business_fax,
      email,
    });
    // Silent drop: return HTTP 200 so bot scripts do not retry or mutate
    return res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully",
      reference: "REQ-" + Math.floor(100000 + Math.random() * 900000),
    });
  }

  // 2. Velocity check - human cannot fill full form in under 2.5 seconds (2500ms)
  if (typeof fill_time_ms === "number" && fill_time_ms > 0 && fill_time_ms < 2500) {
    console.warn("[BOT BLOCKED] Form fill time too fast (<2.5s):", {
      ip: req.ip,
      fill_time_ms,
      email,
    });
    return res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully",
      reference: "REQ-" + Math.floor(100000 + Math.random() * 900000),
    });
  }

  // 3. Dot-trick spam email check (e.g., ip.o.zu.yu.cun6.1.0@gmail.com)
  if (email && isDotTrickEmail(email)) {
    console.warn("[BOT BLOCKED] Dot-trick spam email detected:", {
      ip: req.ip,
      email,
    });
    return res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully",
      reference: "REQ-" + Math.floor(100000 + Math.random() * 900000),
    });
  }

  // 4. Basic phone number sanity check (must have at least 7 digits)
  if (phone) {
    const digitsOnly = String(phone).replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      console.warn("[BOT BLOCKED] Invalid phone format:", { ip: req.ip, phone });
      return res.status(200).json({
        success: true,
        message: "Enquiry submitted successfully",
        reference: "REQ-" + Math.floor(100000 + Math.random() * 900000),
      });
    }
  }

  next();
};
