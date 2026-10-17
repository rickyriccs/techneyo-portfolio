import { getSourceData } from "./utm";
import { supabase } from "./supabase";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

const cleanParams = (params: AnalyticsParams) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

export const getCommonAnalyticsParams = (extra: AnalyticsParams = {}) => {
  if (typeof window === "undefined") return cleanParams(extra);
  const source = getSourceData();

  return cleanParams({
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    source_page_url: window.location.href,
    utm_source: source.utm_source,
    utm_medium: source.utm_medium,
    utm_campaign: source.utm_campaign,
    utm_term: source.utm_term,
    utm_content: source.utm_content,
    referrer: source.referrer || source.initial_referrer,
    device_type: source.device_type,
    timestamp: new Date().toISOString(),
    ...extra,
  });
};

const logToSupabase = async (eventName: string, params: AnalyticsParams) => {
  if (!supabase) return;
  try {
    const source = getSourceData();
    const pagePath =
      typeof params.page_path === "string"
        ? params.page_path
        : window.location.pathname + window.location.search;
    const pageTitle =
      typeof params.page_title === "string" ? params.page_title : document.title;

    await supabase.from("analytics_events").insert([
      {
        event_name: eventName,
        page_path: pagePath,
        page_title: pageTitle,
        utm_source: source.utm_source || null,
        utm_medium: source.utm_medium || null,
        utm_campaign: source.utm_campaign || null,
        utm_term: source.utm_term || null,
        utm_content: source.utm_content || null,
        referrer: source.referrer || source.initial_referrer || null,
        device_type: source.device_type || "desktop",
        event_properties: params,
      },
    ]);
  } catch {
    // Silent fail so user browsing is never interrupted
  }
};

export const trackEvent = (eventName: string, params: AnalyticsParams = {}) => {
  try {
    const fullParams = getCommonAnalyticsParams(params);

    // 1. Dispatch to Google Analytics 4 (gtag)
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, fullParams);
    }

    // 2. Dispatch to Meta (Facebook) Pixel
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      if (
        eventName === "whatsapp_click" ||
        eventName === "contact_form_submit" ||
        eventName === "proposal_form_submit" ||
        eventName === "lead_submitted"
      ) {
        window.fbq("track", "Lead", {
          content_name: (fullParams.item_name as string) || (fullParams.offer_title as string) || "General Enquiry",
          content_category: (fullParams.cta_location as string) || "Lead Generation",
          currency: "INR",
        });
      } else if (eventName === "offer_view") {
        window.fbq("track", "ViewContent", {
          content_name: (fullParams.offer_title as string) || (fullParams.offer_slug as string),
          content_type: "product",
        });
      } else if (eventName === "booking_initiated" || eventName === "proposal_modal_open") {
        window.fbq("track", "InitiateCheckout", {
          content_name: (fullParams.offer_title as string) || "Service Package",
          currency: "INR",
        });
      } else if (eventName === "booking_success" || eventName === "payment_success") {
        window.fbq("track", "Purchase", {
          value: Number(fullParams.booking_amount) || 999,
          currency: "INR",
          content_name: (fullParams.offer_title as string) || "Booking Deposit",
        });
      } else {
        window.fbq("trackCustom", eventName, fullParams);
      }
    }

    // 3. Log to in-database real-time analytics table
    logToSupabase(eventName, fullParams);
  } catch {
    // Analytics must never break UX
  }
};

export const trackPageView = () => {
  try {
    const fullParams = getCommonAnalyticsParams({ page_location: window.location.href });

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", fullParams);
    }

    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }

    logToSupabase("page_view", fullParams);
  } catch {
    // Analytics must never break UX
  }
};

export const trackWhatsAppClick = (locationName: string, offerOrService?: string) => {
  trackEvent("whatsapp_click", {
    cta_location: locationName,
    item_name: offerOrService || "General Inquiry",
  });
};

export const trackOfferView = (offerSlug: string, title: string) => {
  trackEvent("offer_view", {
    offer_slug: offerSlug,
    offer_title: title,
  });
};

export const trackProposalOpen = (triggerSource?: string) => {
  trackEvent("proposal_modal_open", {
    trigger_source: triggerSource || "button",
  });
};

export const trackBlogRead = (blogSlug: string, category: string) => {
  trackEvent("blog_read", {
    blog_slug: blogSlug,
    category: category,
  });
};

