import { supabase } from "./supabase";
import { businessInfo } from "./business-info";
import type { Offer } from "@/types/offer";


interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface BookingCustomerDetails {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  business_name?: string;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateOfferBookingPayment = async ({
  offer,
  customer,
  onSuccess,
  onError,
}: {
  offer: Offer;
  customer: BookingCustomerDetails;
  onSuccess: (bookingId: string) => void;
  onError: (errorMsg: string) => void;
}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onError("Failed to load payment gateway. Please check your internet connection and try again.");
    return;
  }

  // Fetch active Razorpay key ID from database settings or env
  let keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
  
  if (supabase) {
    try {
      const { data } = await supabase
        .from("app_settings")
        .select("razorpay_mode, razorpay_test_key_id, razorpay_live_key_id")
        .limit(1)
        .maybeSingle();

      if (data) {
        const mode = data.razorpay_mode || "test";
        const dbKey = mode === "live" ? data.razorpay_live_key_id : data.razorpay_test_key_id;
        if (dbKey?.trim()) {
          keyId = dbKey.trim();
        }
      }
    } catch (e) {
      console.warn("Failed to fetch Razorpay key from app_settings, using fallback.", e);
    }
  }

  if (!keyId) {
    onError("Razorpay API key is not configured in Admin Settings. Please add key in Admin Settings.");
    return;
  }
  
  // Calculate advance booking amount in INR
  const advanceAmount = offer.booking_amount || offer.setup_fee || offer.discount_price || offer.starting_price || 999;
  const amountInPaise = Math.round(advanceAmount * 100);

  const options = {
    key: keyId,
    amount: amountInPaise,
    currency: "INR",
    name: businessInfo.name,
    description: `Booking Deposit for ${offer.title}`,
    image: businessInfo.ogImage,
    prefill: {
      name: customer.customer_name,
      email: customer.customer_email,
      contact: customer.customer_phone,
    },
    notes: {
      offer_id: offer.id,
      offer_slug: offer.slug,
      business_name: customer.business_name || "",
    },
    theme: {
      color: "#0284c7",
    },
    handler: async (response: RazorpayResponse) => {
      try {
        // Record successful booking in Supabase
        if (supabase) {
          const { data, error } = await supabase.from("offer_bookings").insert({
            offer_id: offer.id,
            customer_name: customer.customer_name,
            customer_email: customer.customer_email,
            customer_phone: customer.customer_phone,
            business_name: customer.business_name || null,
            total_plan_price: offer.discount_price || offer.starting_price || null,
            advance_amount_paid: advanceAmount,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id || null,
            razorpay_signature: response.razorpay_signature || null,
            payment_status: "paid",
            onboarding_status: "pending",
          }).select("id").single();

          if (error) {
            console.error("Booking db record error:", error);
            // Even if DB save fails, we inform success with payment id
            onSuccess(response.razorpay_payment_id);
            return;
          }

          onSuccess(data?.id || response.razorpay_payment_id);
        } else {
          onSuccess(response.razorpay_payment_id);
        }
      } catch (err: any) {
        console.error("Error finalizing booking:", err);
        onSuccess(response.razorpay_payment_id);
      }
    },
    modal: {
      ondismiss: () => {
        onError("Payment window was closed.");
      },
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.on("payment.failed", (response: any) => {
    console.error("Payment failed:", response.error);
    onError(response.error?.description || "Payment failed. Please try again.");
  });

  rzp.open();
};
