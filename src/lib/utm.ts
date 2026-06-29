const UTM_STORAGE_KEY = "techneyo_utm_source";
const LEAD_CONTEXT_KEY = "techneyo_lead_context";

export type SourceData = {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  initial_referrer?: string | null;
  landing_page_url?: string | null;
  current_page_url?: string | null;
  referrer?: string | null;
  device_type?: string;
};

const getDeviceType = () => {
  if (typeof window === "undefined") return "server";
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

const safeParse = (value: string | null): SourceData => {
  if (!value) return {};
  try {
    return JSON.parse(value) as SourceData;
  } catch {
    return {};
  }
};

export const captureUtmData = () => {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const existing = safeParse(sessionStorage.getItem(UTM_STORAGE_KEY));
  const next: SourceData = {
    ...existing,
    current_page_url: window.location.href,
    referrer: document.referrer || existing.referrer || null,
    device_type: getDeviceType(),
  };

  if (!existing.landing_page_url) {
    next.landing_page_url = window.location.href;
  }

  if (!existing.initial_referrer) {
    next.initial_referrer = document.referrer || null;
  }

  (["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const).forEach((key) => {
    const value = params.get(key);
    if (value && !existing[key]) {
      next[key] = value;
    }
  });

  sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(next));
};

export const getSourceData = (): SourceData => {
  if (typeof window === "undefined") return { device_type: "server" };

  return {
    ...safeParse(sessionStorage.getItem(UTM_STORAGE_KEY)),
    current_page_url: window.location.href,
    referrer: document.referrer || safeParse(sessionStorage.getItem(UTM_STORAGE_KEY)).referrer || null,
    device_type: getDeviceType(),
  };
};

export const setLeadContext = (context: Record<string, string | undefined | null>) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    LEAD_CONTEXT_KEY,
    JSON.stringify({
      ...context,
      source_page_url: window.location.href,
      stored_at: new Date().toISOString(),
    }),
  );
};

export const getLeadContext = () => {
  if (typeof window === "undefined") return {};
  return safeParse(sessionStorage.getItem(LEAD_CONTEXT_KEY));
};
