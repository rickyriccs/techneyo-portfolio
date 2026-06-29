import { supabase } from "./supabase";
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
};

export const createContactEnquiry = async (input: ContactEnquiryInput) => {
  if (!supabase) {
    throw new Error("Supabase is not configured for contact enquiries.");
  }

  const source = getSourceData();
  const basePayload = {
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
    utm_source: source.utm_source || null,
    utm_medium: source.utm_medium || null,
    utm_campaign: source.utm_campaign || null,
    user_agent: typeof navigator === "undefined" ? null : navigator.userAgent,
  };

  const leadTrackingPayload = {
    ...basePayload,
    source_page_url: source.current_page_url || null,
    landing_page_url: source.landing_page_url || null,
    initial_referrer: source.initial_referrer || null,
    referrer: source.referrer || null,
    utm_term: source.utm_term || null,
    utm_content: source.utm_content || null,
    device_type: source.device_type || null,
    lead_status: "new",
  };

  const { error } = await supabase.from("contact_enquiries").insert(leadTrackingPayload);

  if (error) {
    const isMissingLeadTrackingColumn =
      error.code === "PGRST204" &&
      /source_page_url|landing_page_url|initial_referrer|referrer|utm_term|utm_content|device_type|lead_status/i.test(error.message);

    if (!isMissingLeadTrackingColumn) {
      throw error;
    }

    const { error: fallbackError } = await supabase.from("contact_enquiries").insert(basePayload);
    if (fallbackError) {
      throw fallbackError;
    }

    return { stored: true, trackingColumnsAvailable: false };
  }

  return { stored: true, trackingColumnsAvailable: true };
};
