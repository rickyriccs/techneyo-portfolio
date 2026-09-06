import { getSourceData } from "./utm";
import { supabase } from "./supabase";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
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

    // 2. Log to in-database real-time analytics table
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

