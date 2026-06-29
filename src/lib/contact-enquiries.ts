import { supabase } from "./supabase";

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
};

const getUtmValue = (key: string) => {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get(key) ?? undefined;
};

export const createContactEnquiry = async (input: ContactEnquiryInput) => {
  if (!supabase) {
    throw new Error("Supabase is not configured for contact enquiries.");
  }

  const { error } = await supabase.from("contact_enquiries").insert({
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    business_name: input.businessName || null,
    city: input.city || null,
    state: input.state || null,
    service_required: input.serviceRequired || null,
    budget_range: input.budgetRange || null,
    message: input.message,
    source_page: input.sourcePage || (typeof window === "undefined" ? null : window.location.pathname),
    utm_source: getUtmValue("utm_source") || null,
    utm_medium: getUtmValue("utm_medium") || null,
    utm_campaign: getUtmValue("utm_campaign") || null,
    user_agent: typeof navigator === "undefined" ? null : navigator.userAgent,
  });

  if (error) {
    throw error;
  }

  return { stored: true };
};
