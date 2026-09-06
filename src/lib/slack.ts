import { supabase } from "./supabase";

export interface SlackField {
  title: string;
  value: string;
  short?: boolean;
}

export interface SlackNotificationOptions {
  title: string;
  text: string;
  color?: string; // e.g. '#10b981' (green), '#06b6d4' (cyan), '#8b5cf6' (purple), '#f59e0b' (amber)
  fields?: SlackField[];
  ctaUrl?: string;
  ctaText?: string;
  webhookUrlOverride?: string;
}

interface CachedSlackSettings {
  slack_enabled: boolean;
  slack_webhook_url: string;
  slack_channel: string;
  slack_notify_enquiries: boolean;
  slack_notify_bookings: boolean;
  slack_notify_proposals: boolean;
  slack_notify_onboarding: boolean;
  fetchedAt: number;
}

const SLACK_STORAGE_KEY = "techneyo_slack_settings";

export const getLocalSlackSettings = (): Partial<CachedSlackSettings> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SLACK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveLocalSlackSettings = (settings: Partial<CachedSlackSettings>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SLACK_STORAGE_KEY, JSON.stringify(settings));
    if (cachedSettings) {
      cachedSettings = {
        ...cachedSettings,
        ...settings,
        fetchedAt: Date.now(),
      };
    }
  } catch (e) {
    console.warn("Failed to save Slack settings locally", e);
  }
};

let cachedSettings: CachedSlackSettings | null = null;

export const getSlackSettings = async (): Promise<CachedSlackSettings> => {
  const now = Date.now();
  if (cachedSettings && now - cachedSettings.fetchedAt < 60000) {
    return cachedSettings;
  }

  const local = getLocalSlackSettings();

  const defaultSettings: CachedSlackSettings = {
    slack_enabled: local?.slack_enabled ?? false,
    slack_webhook_url: local?.slack_webhook_url || import.meta.env.VITE_SLACK_WEBHOOK_URL || "",
    slack_channel: local?.slack_channel || "#leads",
    slack_notify_enquiries: local?.slack_notify_enquiries ?? true,
    slack_notify_bookings: local?.slack_notify_bookings ?? true,
    slack_notify_proposals: local?.slack_notify_proposals ?? true,
    slack_notify_onboarding: local?.slack_notify_onboarding ?? true,
    fetchedAt: now,
  };

  if (!supabase) {
    return defaultSettings;
  }

  try {
    const { data, error } = await supabase
      .from("app_settings")
      .select(
        "slack_enabled,slack_webhook_url,slack_channel,slack_notify_enquiries,slack_notify_bookings,slack_notify_proposals,slack_notify_onboarding"
      )
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      cachedSettings = {
        slack_enabled: data.slack_enabled ?? defaultSettings.slack_enabled,
        slack_webhook_url: data.slack_webhook_url || defaultSettings.slack_webhook_url,
        slack_channel: data.slack_channel || defaultSettings.slack_channel,
        slack_notify_enquiries: data.slack_notify_enquiries ?? defaultSettings.slack_notify_enquiries,
        slack_notify_bookings: data.slack_notify_bookings ?? defaultSettings.slack_notify_bookings,
        slack_notify_proposals: data.slack_notify_proposals ?? defaultSettings.slack_notify_proposals,
        slack_notify_onboarding: data.slack_notify_onboarding ?? defaultSettings.slack_notify_onboarding,
        fetchedAt: now,
      };
      return cachedSettings;
    }
  } catch {
    // Fall back to default/local
  }

  return defaultSettings;
};


export const sendSlackNotification = async (
  options: SlackNotificationOptions
): Promise<boolean> => {
  try {
    let webhookUrl = options.webhookUrlOverride;

    if (!webhookUrl) {
      const settings = await getSlackSettings();
      if (!settings.slack_enabled && !import.meta.env.VITE_SLACK_WEBHOOK_URL) {
        return false;
      }
      webhookUrl = settings.slack_webhook_url || import.meta.env.VITE_SLACK_WEBHOOK_URL;
    }

    if (!webhookUrl || !webhookUrl.startsWith("https://hooks.slack.com/")) {
      return false;
    }

    const payload = {
      text: `🚀 *${options.title}*\n${options.text}`,
      attachments: [
        {
          fallback: `${options.title}: ${options.text}`,
          color: options.color || "#06b6d4",
          title: options.title,
          text: options.text,
          fields: options.fields || [],
          footer: "Techneyo Notifications System",
          ts: Math.floor(Date.now() / 1000),
          actions: options.ctaUrl
            ? [
                {
                  type: "button",
                  text: options.ctaText || "View in Admin Panel",
                  url: options.ctaUrl,
                  style: "primary",
                },
              ]
            : undefined,
        },
      ],
    };

    // 1. Try Supabase Edge Function if deployed
    if (supabase?.functions) {
      try {
        const { data, error } = await supabase.functions.invoke("send-slack-alert", {
          body: { webhookUrl, payload },
        });
        if (!error && data?.success) {
          return true;
        }
      } catch {
        // Fall back to direct browser post
      }
    }

    // 2. Direct browser webhook POST using application/x-www-form-urlencoded
    // Slack incoming webhooks accept `payload=<url_encoded_json>`
    // application/x-www-form-urlencoded is a CORS-safelisted type that browsers can send without CORS preflight block
    const formParams = new URLSearchParams();
    formParams.append("payload", JSON.stringify(payload));

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formParams.toString(),
      mode: "no-cors",
    });

    return true;
  } catch (err) {
    console.warn("Slack notification dispatch failed (non-blocking):", err);
    return false;
  }
};


/**
 * 1. Alert for New Contact Form Enquiry
 */
export const notifySlackNewEnquiry = async (enquiry: {
  name: string;
  phone: string;
  email?: string | null;
  businessName?: string | null;
  city?: string | null;
  state?: string | null;
  serviceRequired?: string | null;
  budgetRange?: string | null;
  message?: string | null;
  utmSource?: string | null;
}) => {
  const settings = await getSlackSettings();
  if (!settings.slack_enabled && !import.meta.env.VITE_SLACK_WEBHOOK_URL) return;
  if (!settings.slack_notify_enquiries) return;

  const fields: SlackField[] = [
    { title: "👤 Customer Name", value: enquiry.name, short: true },
    { title: "📞 Phone Number", value: enquiry.phone, short: true },
  ];

  if (enquiry.email) {
    fields.push({ title: "✉️ Email", value: enquiry.email, short: true });
  }
  if (enquiry.businessName) {
    fields.push({ title: "🏢 Business Name", value: enquiry.businessName, short: true });
  }
  if (enquiry.serviceRequired) {
    fields.push({ title: "🛠️ Service Requested", value: enquiry.serviceRequired, short: true });
  }
  if (enquiry.budgetRange) {
    fields.push({ title: "💰 Budget Range", value: enquiry.budgetRange, short: true });
  }
  if (enquiry.city || enquiry.state) {
    fields.push({
      title: "📍 Location",
      value: [enquiry.city, enquiry.state].filter(Boolean).join(", "),
      short: true,
    });
  }
  if (enquiry.utmSource) {
    fields.push({ title: "🎯 Traffic Source", value: enquiry.utmSource, short: true });
  }

  await sendSlackNotification({
    title: "New Contact Enquiry Received",
    text: enquiry.message ? `*Message:* ${enquiry.message}` : "New inquiry submitted via website form.",
    color: "#06b6d4",
    fields,
    ctaUrl: "https://techneyo.com/admin/enquiries",
    ctaText: "Open Enquiries in Admin",
  });
};

/**
 * 2. Alert for New Offer Booking & Deposit
 */
export const notifySlackNewBooking = async (booking: {
  offerTitle: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  businessName?: string | null;
  advanceAmountPaid: number;
  totalPlanPrice?: number | null;
  paymentStatus: string;
  utmSource?: string | null;
}) => {
  const settings = await getSlackSettings();
  if (!settings.slack_enabled && !import.meta.env.VITE_SLACK_WEBHOOK_URL) return;
  if (!settings.slack_notify_bookings) return;

  const isPaid = booking.paymentStatus === "paid" || booking.advanceAmountPaid > 0;

  const fields: SlackField[] = [
    { title: "📦 Selected Offer", value: booking.offerTitle, short: false },
    { title: "👤 Customer Name", value: booking.customerName, short: true },
    { title: "📞 Phone", value: booking.customerPhone, short: true },
    {
      title: "💵 Advance Deposit",
      value: `Rs. ${booking.advanceAmountPaid.toLocaleString("en-IN")}`,
      short: true,
    },
    {
      title: "🏷️ Total Package Price",
      value: booking.totalPlanPrice ? `Rs. ${booking.totalPlanPrice.toLocaleString("en-IN")}` : "Subscription",
      short: true,
    },
    {
      title: "💳 Payment Status",
      value: isPaid ? "✅ PAID / CONFIRMED" : "⏳ FREE / PENDING ONBOARDING",
      short: true,
    },
  ];

  if (booking.businessName) {
    fields.push({ title: "🏢 Business", value: booking.businessName, short: true });
  }
  if (booking.customerEmail) {
    fields.push({ title: "✉️ Email", value: booking.customerEmail, short: true });
  }

  await sendSlackNotification({
    title: isPaid ? "🎉 New Paid Offer Booking Confirmed!" : "📋 New Offer Booking Lead",
    text: `Customer *${booking.customerName}* has booked *${booking.offerTitle}*.`,
    color: isPaid ? "#10b981" : "#f59e0b",
    fields,
    ctaUrl: "https://techneyo.com/admin/bookings",
    ctaText: "Manage Bookings in Admin",
  });
};

/**
 * 3. Alert for AI Smart Proposal Generation
 */
export const notifySlackNewProposal = async (proposal: {
  refCode: string;
  name: string;
  phone: string;
  email?: string | null;
  businessName?: string | null;
  service: string;
  totalPrice?: number | null;
  addons?: string[];
  notes?: string | null;
}) => {
  const settings = await getSlackSettings();
  if (!settings.slack_enabled && !import.meta.env.VITE_SLACK_WEBHOOK_URL) return;
  if (!settings.slack_notify_proposals) return;

  const fields: SlackField[] = [
    { title: "📋 Proposal Ref", value: proposal.refCode, short: true },
    { title: "🛠️ Core Service", value: proposal.service, short: true },
    { title: "👤 Name", value: proposal.name, short: true },
    { title: "📞 Phone", value: proposal.phone, short: true },
    {
      title: "💰 Calculated Estimate",
      value: proposal.totalPrice ? `Rs. ${proposal.totalPrice.toLocaleString("en-IN")}` : "Custom Quote",
      short: true,
    },
  ];

  if (proposal.addons && proposal.addons.length > 0) {
    fields.push({
      title: "➕ Selected Add-ons",
      value: proposal.addons.join(", "),
      short: false,
    });
  }

  await sendSlackNotification({
    title: "⚡ Custom AI Proposal Generated",
    text: `User generated custom roadmap for *${proposal.service}*.`,
    color: "#8b5cf6",
    fields,
    ctaUrl: "https://techneyo.com/admin/enquiries",
    ctaText: "View Proposal Lead",
  });
};

/**
 * 4. Alert for Client Onboarding Questionnaire Submitted
 */
export const notifySlackOnboarding = async (onboarding: {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  servicesOffered?: string;
  domainPreference?: string;
  designNotes?: string;
}) => {
  const settings = await getSlackSettings();
  if (!settings.slack_enabled && !import.meta.env.VITE_SLACK_WEBHOOK_URL) return;
  if (!settings.slack_notify_onboarding) return;

  const fields: SlackField[] = [
    { title: "🏢 Business Name", value: onboarding.businessName, short: true },
    { title: "👤 Contact Person", value: onboarding.contactPerson, short: true },
    { title: "📞 Phone", value: onboarding.phone, short: true },
    { title: "✉️ Email", value: onboarding.email, short: true },
  ];

  if (onboarding.domainPreference) {
    fields.push({ title: "🌐 Domain Preference", value: onboarding.domainPreference, short: true });
  }
  if (onboarding.servicesOffered) {
    fields.push({ title: "💼 Services Offered", value: onboarding.servicesOffered, short: false });
  }

  await sendSlackNotification({
    title: "📝 Client Onboarding Questionnaire Submitted!",
    text: `Onboarding requirements received for *${onboarding.businessName}*.`,
    color: "#10b981",
    fields,
    ctaUrl: "https://techneyo.com/admin/bookings",
    ctaText: "Review Client Onboarding Details",
  });
};

/**
 * 5. Test Webhook Verification
 */
export const testSlackWebhook = async (webhookUrl: string): Promise<boolean> => {
  return sendSlackNotification({
    title: "Slack Integration Test Successful! ✅",
    text: "Your Techneyo Slack notifications are connected and working properly. You will now receive instant alerts for leads, bookings, proposals, and onboarding submissions.",
    color: "#10b981",
    fields: [
      { title: "Status", value: "Active & Verified", short: true },
      { title: "Triggered By", value: "Admin Settings", short: true },
    ],
    webhookUrlOverride: webhookUrl,
  });
};
