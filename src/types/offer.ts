export type OfferType = "Website Presence" | "Business Tool" | "Automation" | "Digital Growth" | "Custom";
export type ButtonAction = "Contact Form" | "WhatsApp" | "Call" | "Custom Link";
export type OfferStatus = "Active" | "Inactive" | "Draft" | "Expired";
export type BillingPeriod = "monthly" | "one-time" | "yearly" | "quarterly";
export type BookingAmountType = "fixed" | "full" | "percentage";

export interface Offer {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string | null;
  offer_type: OfferType;
  starting_price: number | null;
  discount_price: number | null;
  billing_period: BillingPeriod;
  setup_fee: number | null;
  booking_amount_type: BookingAmountType;
  booking_amount: number | null;
  target_audience: string[];
  whats_included: string[];
  whats_not_included: string[];
  update_policy: string | null;
  ownership_policy: string | null;
  terms: string[];
  target_keywords: string[];
  valid_from: string | null;
  valid_till: string | null;
  status: OfferStatus;
  is_featured: boolean;
  button_text: string;
  button_action: ButtonAction;
  button_url: string | null;
  display_order: number;
  banner_image_url?: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OfferBooking {
  id: string;
  offer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  business_name?: string | null;
  total_plan_price?: number | null;
  advance_amount_paid: number;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  onboarding_status: "pending" | "in_progress" | "completed";
  onboarding_details?: {
    businessName?: string;
    contactPerson?: string;
    phone?: string;
    servicesOffered?: string;
    address?: string;
    domainPreference?: string;
    designNotes?: string;
    submittedAt?: string;
  } | null;
  created_at: string;
  offer?: Offer;
}
