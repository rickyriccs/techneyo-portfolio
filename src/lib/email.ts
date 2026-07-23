import { supabase } from "./supabase";
import { businessInfo } from "./business-info";

export interface BookingEmailPayload {
  customer_name: string;
  customer_email: string;
  offer_title: string;
  advance_amount: number;
  payment_id: string;
  booking_id?: string;
}

export const sendTestEmail = async ({
  targetEmail,
  apiKey,
  senderEmail,
}: {
  targetEmail: string;
  apiKey: string;
  senderEmail?: string;
}): Promise<{ success: boolean; message: string }> => {
  if (!targetEmail?.trim()) {
    return { success: false, message: "Please enter a recipient email address for testing." };
  }

  const subject = `Test Email from ${businessInfo.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0284c7; margin-top: 0;">🎉 Resend Email Integration Works!</h2>
      <p>This is a test notification email sent from your <strong>${businessInfo.name}</strong> Admin Dashboard.</p>
      <p style="font-size: 13px; color: #64748b;">Sender: <code>${senderEmail || "onboarding@resend.dev"}</code></p>
      <p style="font-size: 13px; color: #64748b;">Recipient: <code>${targetEmail}</code></p>
    </div>
  `;

  // First attempt via Supabase RPC (bypasses CORS completely)
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("send_resend_email", {
        p_to: targetEmail.trim(),
        p_subject: subject,
        p_html: html,
      });

      if (!error && data) {
        const res = data as { success: boolean; message: string };
        if (res.success) {
          return { success: true, message: res.message };
        } else {
          return { success: false, message: res.message };
        }
      }
    } catch (e) {
      console.warn("RPC send_resend_email failed, trying direct fetch...", e);
    }
  }

  // Fallback direct fetch (if RPC is not installed yet)
  if (!apiKey?.trim()) {
    return { success: false, message: "Resend API Key is missing. Please save settings and run the SQL patch in Supabase." };
  }

  const fromAddress = senderEmail?.trim() || "onboarding@resend.dev";
  const fromFormatted = fromAddress.includes("<") ? fromAddress : `${businessInfo.name} <${fromAddress}>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromFormatted,
        to: [targetEmail.trim()],
        subject: subject,
        html: html,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: resData.message || `HTTP ${response.status}: Failed to send test email via client. Please run resend_email_function_patch.sql in Supabase to enable CORS-free backend sending.`,
      };
    }

    return {
      success: true,
      message: `Test email sent successfully to ${targetEmail}!`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: "Browser blocked direct CORS fetch. Please run resend_email_function_patch.sql in Supabase SQL Editor to enable CORS-free backend sending.",
    };
  }
};

export const sendBookingConfirmationEmail = async ({
  customer_name,
  customer_email,
  offer_title,
  advance_amount,
  payment_id,
  booking_id,
}: BookingEmailPayload) => {
  if (!customer_email) return;

  const onboardingUrl = `${window.location.origin}/onboarding?booking_id=${booking_id || payment_id}`;
  const subject = `Booking Confirmed: Payment Receipt for ${offer_title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
        <h2 style="color: #0284c7; margin: 0; font-size: 22px;">${businessInfo.name}</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Advance Payment & Booking Confirmation</p>
      </div>

      <div style="padding: 20px 0;">
        <p style="font-size: 15px;">Dear <strong>${customer_name}</strong>,</p>
        <p style="font-size: 14px; color: #334155;">Thank you for choosing ${businessInfo.name}! Your advance booking payment has been successfully processed.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <h3 style="margin-top: 0; font-size: 15px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Payment & Booking Summary</h3>
          <p style="margin: 6px 0; font-size: 13px;"><strong>Offer / Plan:</strong> ${offer_title}</p>
          <p style="margin: 6px 0; font-size: 13px;"><strong>Advance Amount Paid:</strong> <span style="color: #16a34a; font-weight: bold;">Rs. ${advance_amount.toLocaleString("en-IN")}</span></p>
          <p style="margin: 6px 0; font-size: 13px;"><strong>Razorpay Payment ID:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${payment_id}</code></p>
          ${booking_id ? `<p style="margin: 6px 0; font-size: 13px;"><strong>Booking Reference:</strong> ${booking_id}</p>` : ""}
        </div>

        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; color: #1e40af;"><strong>What's Next?</strong> Please fill in your business logo, preferred domain name, and website requirements so our design team can start immediately.</p>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${onboardingUrl}" style="background-color: #0284c7; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(2, 132, 199, 0.2);">
            Complete Project Onboarding Form &rarr;
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #f1f5f9; pt: 20px; font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px;">
        <p style="margin: 4px 0;">${businessInfo.name} • All India Digital Presence Solutions</p>
        <p style="margin: 4px 0;">WhatsApp/Phone: ${businessInfo.phoneDisplay} • Email: ${businessInfo.email}</p>
      </div>
    </div>
  `;

  // Send via Supabase RPC (bypasses CORS)
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("send_resend_email", {
        p_to: customer_email,
        p_subject: subject,
        p_html: html,
      });

      if (!error && data) {
        console.log("Booking email successfully sent via Supabase RPC to:", customer_email);
        return;
      }
    } catch (err) {
      console.warn("RPC send_resend_email error:", err);
    }
  }
};
