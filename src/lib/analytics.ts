import { getSourceData } from "./utm";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

const cleanParams = (params: AnalyticsParams) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));

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

export const trackEvent = (eventName: string, params: AnalyticsParams = {}) => {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("event", eventName, getCommonAnalyticsParams(params));
  } catch {
    // Analytics must never break UX.
  }
};

export const trackPageView = () => {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", getCommonAnalyticsParams({ page_location: window.location.href }));
  } catch {
    // Analytics must never break UX.
  }
};
