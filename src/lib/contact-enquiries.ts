import { getSourceData } from "./utm";

export type ContactEnquiryInput = {
  name: string;
  phone: string;
  email?: string;
  businessName?: string;
  city?: string;
  state?: string;
  serviceRequired?: string;
  budgetRange?: string;
  message: string;
  sourcePage?: string;
  serviceInterested?: string;
  website_url?: string; // Honeypot field
  business_fax?: string; // Secondary honeypot field
  fill_time_ms?: number; // Form completion time in ms
};

/**
 * Checks for email dot-trick spam (e.g. ip.o.zu.yu.cun6.1.0@gmail.com)
 */
export const isDotTrickEmail = (email?: string): boolean => {
  if (!email || typeof email !== "string") return false;
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return true;

  const [localPart] = parts;
  const dotCount = (localPart.match(/\./g) || []).length;
  if (dotCount >= 3) return true;

  const segments = localPart.split(".");
  if (segments.length >= 3 && segments.some((s) => s.length === 1)) {
    return true;
  }

  return false;
};

export const createContactEnquiry = async (input: ContactEnquiryInput) => {
  // 1. Client-Side Honeypot Silent Trap
  if (input.website_url || input.business_fax) {
    console.warn("[Bot Defense] Honeypot field was filled. Dropping enquiry silently.");
    return { stored: true, trackingColumnsAvailable: true };
  }

  // 2. Client-Side Fill Velocity Silent Trap (<2.5s)
  if (typeof input.fill_time_ms === "number" && input.fill_time_ms > 0 && input.fill_time_ms < 2500) {
    console.warn("[Bot Defense] Form submitted unnaturally fast (<2.5s). Dropping enquiry silently.");
    return { stored: true, trackingColumnsAvailable: true };
  }

  // 3. Client-Side Dot-Trick Spam Email Trap
  if (input.email && isDotTrickEmail(input.email)) {
    console.warn("[Bot Defense] Dot-trick spam email detected. Dropping enquiry silently.");
    return { stored: true, trackingColumnsAvailable: true };
  }

  const source = getSourceData();
  const payload = {
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    business_name: input.businessName || null,
    city: input.city || null,
    state: input.state || null,
    service_required: input.serviceRequired || input.serviceInterested || null,
    budget_range: input.budgetRange || null,
    message: input.message,
    source_page: input.sourcePage || (typeof window === "undefined" ? null : window.location.pathname),
    source_page_url: source.current_page_url || null,
    landing_page_url: source.landing_page_url || null,
    initial_referrer: source.initial_referrer || null,
    referrer: source.referrer || null,
    utm_source: source.utm_source || null,
    utm_medium: source.utm_medium || null,
    utm_campaign: source.utm_campaign || null,
    utm_term: source.utm_term || null,
    utm_content: source.utm_content || null,
    device_type: source.device_type || null,
    user_agent: typeof navigator === "undefined" ? null : navigator.userAgent,
    website_url: input.website_url || undefined,
    fill_time_ms: input.fill_time_ms || undefined,
  };

  const res = await fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to submit enquiry");
  }

  const data = await res.json();
  return { stored: true, trackingColumnsAvailable: true, id: data.id };
};
