import { supabase } from "./supabase";
import { ClientNeedsAssessment, UrgencyLevel } from "@/types/client-needs";
import { notifySlackClientNeedsAssessment } from "./slack";
import { businessInfo } from "./business-info";
import { sendDiagnosticReportEmail } from "./email";

export interface SubmitAssessmentPayload {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  business_name?: string;
  industry: string;
  industry_name: string;
  bottleneck: string;
  bottleneck_title: string;
  digital_status: string;
  timeline: string;
  urgency_score: number;
  urgency_level: UrgencyLevel;
  recommended_offer_id?: string | null;
  recommended_offer_title?: string | null;
  answers: Record<string, any>;
  notes?: string;
}

export async function submitClientNeedsAssessment(payload: SubmitAssessmentPayload): Promise<{
  id: string;
  success: boolean;
  error?: string;
}> {
  const assessmentId = crypto.randomUUID();

  try {
    const record = {
      id: assessmentId,
      customer_name: payload.customer_name?.trim() || null,
      customer_email: payload.customer_email?.trim() || null,
      customer_phone: payload.customer_phone?.trim() || null,
      business_name: payload.business_name?.trim() || null,
      industry: payload.industry,
      industry_name: payload.industry_name,
      bottleneck: payload.bottleneck,
      bottleneck_title: payload.bottleneck_title,
      digital_status: payload.digital_status,
      timeline: payload.timeline,
      urgency_score: payload.urgency_score,
      urgency_level: payload.urgency_level,
      recommended_offer_id: payload.recommended_offer_id || null,
      status: "New",
      answers: payload.answers,
      notes: payload.notes || null,
    };

    if (supabase) {
      // 1. Insert into specialized client_needs_assessments table
      const { error: assessmentError } = await supabase.from("client_needs_assessments").insert(record);
      if (assessmentError) {
        console.warn("Could not insert to client_needs_assessments:", assessmentError);
      }

      // 2. Also insert into contact_enquiries so the lead immediately surfaces on main AdminDashboard and AdminEnquiries
      const enquiryPayload = {
        id: crypto.randomUUID(),
        name: payload.customer_name?.trim() || "Solution Finder Lead",
        phone: payload.customer_phone?.trim() || "Not provided",
        email: payload.customer_email?.trim() || null,
        business_name: payload.business_name?.trim() || null,
        service_required: `${payload.industry_name}: ${payload.bottleneck_title}`,
        message: `[Needs Quiz Assessment]
• Industry: ${payload.industry_name}
• Bottleneck: ${payload.bottleneck_title}
• Digital Status: ${payload.digital_status}
• Target Timeline: ${payload.timeline}
• Urgency Level: ${payload.urgency_level} (${payload.urgency_score}/100)
• Recommended Solution: ${payload.recommended_offer_title || "Standard Consultation"}`,
        source_page: "/solution-finder",
        lead_status: "New",
      };

      const { error: enquiryError } = await supabase.from("contact_enquiries").insert(enquiryPayload);
      if (enquiryError) {
        console.warn("Could not insert lead to contact_enquiries:", enquiryError);
      }

      if (assessmentError && enquiryError) {
        return {
          id: assessmentId,
          success: false,
          error: assessmentError?.message || enquiryError?.message || "Database insert failed",
        };
      }
    }

    // Fire Slack Alert asynchronously
    notifySlackClientNeedsAssessment({
      customerName: payload.customer_name,
      customerPhone: payload.customer_phone,
      customerEmail: payload.customer_email,
      businessName: payload.business_name,
      industry: payload.industry_name || payload.industry,
      bottleneck: payload.bottleneck_title || payload.bottleneck,
      urgencyLevel: payload.urgency_level,
      urgencyScore: payload.urgency_score,
      timeline: payload.timeline,
      recommendedOfferTitle: payload.recommended_offer_title || undefined,
    }).catch((err) => console.warn("Slack notification failed:", err));

    // Fire Automated Client Confirmation Email asynchronously
    if (payload.customer_email) {
      sendDiagnosticReportEmail({
        customer_name: payload.customer_name,
        customer_email: payload.customer_email,
        customer_phone: payload.customer_phone,
        business_name: payload.business_name,
        industry_name: payload.industry_name,
        bottleneck_title: payload.bottleneck_title,
        digital_status: payload.digital_status,
        timeline: payload.timeline,
        urgency_level: payload.urgency_level,
        urgency_score: payload.urgency_score,
        recommended_offer_title: payload.recommended_offer_title || undefined,
      }).catch((err) => console.warn("Diagnostic email dispatch failed:", err));
    }

    return { id: assessmentId, success: true };
  } catch (err: any) {
    console.error("Error submitting client needs assessment:", err);
    return { id: assessmentId, success: false, error: err?.message || "Failed to submit" };
  }
}

export async function fetchClientNeedsAssessments(): Promise<ClientNeedsAssessment[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("client_needs_assessments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching client needs assessments:", error);
      return [];
    }
    return (data as ClientNeedsAssessment[]) || [];
  } catch (err) {
    console.error("Failed to load assessments:", err);
    return [];
  }
}

export async function updateClientNeedsStatus(
  id: string,
  status: ClientNeedsAssessment["status"],
  notes?: string
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const updateData: Record<string, any> = { status };
    if (notes !== undefined) updateData.notes = notes;

    const { error } = await supabase
      .from("client_needs_assessments")
      .update(updateData)
      .eq("id", id);

    return !error;
  } catch (err) {
    console.error("Failed to update status:", err);
    return false;
  }
}

/**
 * Generate a pre-filled WhatsApp link for the client to contact Techneyo
 */
export function buildClientWhatsAppUrl(data: {
  industry: string;
  bottleneck: string;
  urgencyLevel: string;
  businessName?: string;
}): string {
  const text = `Hi Techneyo team! I just completed your Needs Quiz for my business (${data.businessName || data.industry}).

*My Need Assessment:*
• Industry: ${data.industry}
• Priority: ${data.bottleneck}
• Urgency Level: ${data.urgencyLevel}

I'd like to discuss the recommended solution package and next steps with your team!`;

  return `${businessInfo.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a pre-filled WhatsApp reply link for the Admin to contact the lead
 */
export function buildAdminReplyWhatsAppUrl(item: ClientNeedsAssessment): string {
  const phone = item.customer_phone?.replace(/[^0-9]/g, "") || "";
  const name = item.customer_name || "there";
  const business = item.business_name || item.industry_name || "your business";

  const message = `Hello ${name}! 👋

Thank you for completing our Needs Assessment on Techneyo for *${business}*.

We reviewed your requirements regarding:
• *Industry:* ${item.industry_name || item.industry}
• *Current Challenge:* ${item.bottleneck_title || item.bottleneck}
• *Urgency Level:* ${item.urgency_level} (${item.urgency_score}/100)

We have mapped the ideal solution package for your timeline (${item.timeline}). Would you like to schedule a 10-minute strategy call today or review the solution package?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
