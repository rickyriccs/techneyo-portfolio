import { useState, FormEvent } from "react";
import { X, ShieldCheck, CreditCard, Lock, CheckCircle2, MessageCircle, Calendar, ArrowRight, Sparkles } from "lucide-react";
import type { Offer } from "@/types/offer";
import { initiateOfferBookingPayment, BookingCustomerDetails } from "@/lib/razorpay";
import { supabase } from "@/lib/supabase";
import { getSourceData } from "@/lib/utm";
import { notifySlackNewBooking } from "@/lib/slack";
import { useCurrency } from "@/context/CurrencyContext";
import { businessInfo } from "@/lib/business-info";

interface BookingModalProps {
  offer: Offer;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
  paymentRequired?: boolean; // false = skip Razorpay, save lead directly
}

export const BookingModal = ({
  offer,
  isOpen,
  onClose,
  onSuccess,
  paymentRequired = true,
}: BookingModalProps) => {
  const { currency, formatPrice, getRawPrice } = useCurrency();
  const isUsd = currency === "USD";

  const [customer, setCustomer] = useState<BookingCustomerDetails>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    business_name: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [usdSubmittedId, setUsdSubmittedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const inrAdvance = offer.booking_amount || offer.setup_fee || offer.discount_price || 999;
  const advancePriceObj = getRawPrice(
    inrAdvance,
    offer.booking_amount_usd || offer.setup_fee_usd || offer.discount_price_usd
  );

  const mainPriceObj = getRawPrice(
    offer.discount_price || offer.starting_price,
    offer.discount_price_usd || offer.starting_price_usd
  );

  // Save a lead to offer_bookings table (with currency tracking)
  const saveLeadRecord = async (bookingCurrency: string, advancePaid: number = 0) => {
    if (!supabase) return crypto.randomUUID();
    const source = getSourceData();
    const { data, error } = await supabase
      .from("offer_bookings")
      .insert({
        offer_id: offer.id,
        customer_name: customer.customer_name,
        customer_email: customer.customer_email,
        customer_phone: customer.customer_phone,
        business_name: customer.business_name || null,
        total_plan_price: mainPriceObj.amount || null,
        advance_amount_paid: advancePaid,
        currency: bookingCurrency,
        razorpay_payment_id: null,
        payment_status: "pending",
        onboarding_status: "pending",
        utm_source: source.utm_source || null,
        utm_medium: source.utm_medium || null,
        utm_campaign: source.utm_campaign || null,
        utm_term: source.utm_term || null,
        utm_content: source.utm_content || null,
        source_page_url: source.current_page_url || window.location.href,
        landing_page_url: source.landing_page_url || null,
        initial_referrer: source.initial_referrer || null,
        referrer: source.referrer || null,
        device_type: source.device_type || null,
      })
      .select("id")
      .single();

    // Trigger Slack notification non-blockingly
    notifySlackNewBooking({
      offerTitle: `${offer.title} (${bookingCurrency})`,
      customerName: customer.customer_name,
      customerPhone: customer.customer_phone,
      customerEmail: customer.customer_email,
      businessName: customer.business_name,
      advanceAmountPaid: advancePaid,
      totalPlanPrice: mainPriceObj.amount || null,
      paymentStatus: "pending",
      utmSource: source.utm_source,
    }).catch((e) => console.warn("Slack booking dispatch error:", e));

    if (error) {
      console.error("Error saving booking:", error);
      throw new Error(error.message);
    }
    const bookingRecord = Array.isArray(data) ? data[0] : data;
    return bookingRecord?.id || data?.id || crypto.randomUUID();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsProcessing(true);

    // 1. If USD is active: Smart Modal flow (Save lead, provide instant WhatsApp/Discovery Call)
    if (isUsd) {
      try {
        const bookingId = await saveLeadRecord("USD", 0);
        setIsProcessing(false);
        setUsdSubmittedId(bookingId);
      } catch (err: any) {
        setIsProcessing(false);
        setErrorMsg(err?.message || "Failed to submit booking. Please try again.");
      }
      return;
    }

    // 2. Free booking flow in INR
    if (!paymentRequired) {
      try {
        const bookingId = await saveLeadRecord("INR", 0);
        setIsProcessing(false);
        onClose();
        onSuccess(bookingId);
      } catch (err: any) {
        setIsProcessing(false);
        setErrorMsg(err?.message || "Failed to save booking. Please try again.");
      }
      return;
    }

    // 3. Normal INR Razorpay payment flow
    initiateOfferBookingPayment({
      offer,
      customer,
      onSuccess: (bookingId) => {
        setIsProcessing(false);
        onClose();
        onSuccess(bookingId);
      },
      onError: (err) => {
        setIsProcessing(false);
        setErrorMsg(err);
      },
    });
  };

  // USD Confirmation Screen
  if (isUsd && usdSubmittedId) {
    const whatsappUrl = `https://wa.me/919988773122?text=${encodeURIComponent(
      `Hello Techneyo Solutions, I have reserved the "${offer.title}" package ($${mainPriceObj.amount}${
        offer.billing_period === "monthly" ? "/mo" : ""
      }). My name is ${customer.customer_name} from ${customer.business_name || "my business"}. I would like to finalize the project scope and receive an invoice.`
    )}`;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-[#070d1e] p-6 sm:p-8 shadow-2xl text-white">
          <button
            onClick={() => {
              onClose();
              onSuccess(usdSubmittedId);
            }}
            className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Project Slot Reserved!</h2>
            <p className="text-sm text-slate-300">
              Thank you, <strong className="text-white">{customer.customer_name}</strong>. We have logged your reservation for{" "}
              <strong className="text-cyan-300">{offer.title}</strong> (${mainPriceObj.amount}
              {offer.billing_period === "monthly" ? "/month" : ""}).
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <ShieldCheck size={16} className="text-cyan-400" />
              <span>International Payment & Scope Options</span>
            </div>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              We invoice globally via <strong>Stripe (Credit/Debit Cards)</strong>, <strong>Wise Business</strong>, or <strong>SWIFT Wire Transfer</strong>. We execute a mutual NDA prior to code handoff with 100% IP ownership.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-xl font-bold text-xs text-white bg-[#25D366] hover:bg-[#20ba59] shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> Connect on WhatsApp with USD Quote
            </a>

            <a
              href={`/contact?offer=${encodeURIComponent(offer.slug)}&name=${encodeURIComponent(
                customer.customer_name
              )}&email=${encodeURIComponent(customer.customer_email)}`}
              className="w-full h-12 rounded-xl border border-cyan-400/30 hover:border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 font-bold text-xs text-cyan-200 transition-all flex items-center justify-center gap-2"
            >
              <Calendar size={18} /> Schedule 15-Min Strategy Discovery Call <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-neutral-900 p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          {isUsd ? (
            <>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles size={12} /> International Priority Reservation
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold text-white">{offer.title}</h2>
              <p className="mt-1 text-sm text-white/65">
                Package Value:{" "}
                <span className="font-semibold text-emerald-300">
                  ${mainPriceObj.amount}
                  {offer.billing_period === "monthly" ? "/month" : ""}
                </span>
                . Reserve your slot below with zero upfront charge.
              </p>
            </>
          ) : paymentRequired ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Razorpay Secure Online Booking
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-white">{offer.title}</h2>
              <p className="mt-1 text-sm text-white/65">
                Book now with an advance payment of{" "}
                <span className="font-semibold text-orange-300">
                  Rs. {advancePriceObj.amount.toLocaleString("en-IN")}
                </span>
                .
              </p>
            </>
          ) : (
            <>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Free Booking — No Advance Payment
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-white">{offer.title}</h2>
              <p className="mt-1 text-sm text-white/65">
                Fill in your details and we'll contact you to get started. No payment required.
              </p>
            </>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              value={customer.customer_name}
              onChange={(e) => setCustomer({ ...customer, customer_name: e.target.value })}
              className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              placeholder="e.g. John Smith"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Phone / WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={customer.customer_phone}
                onChange={(e) => setCustomer({ ...customer, customer_phone: e.target.value })}
                className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                placeholder={isUsd ? "+1 (555) 000-0000" : "+91 99887 73122"}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={customer.customer_email}
                onChange={(e) => setCustomer({ ...customer, customer_email: e.target.value })}
                className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">Business / Company Name (Optional)</label>
            <input
              type="text"
              value={customer.business_name || ""}
              onChange={(e) => setCustomer({ ...customer, business_name: e.target.value })}
              className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              placeholder="e.g. Acme Corp"
            />
          </div>

          {isUsd ? (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-xs text-white/80 space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold text-white">
                <span>International Plan Value</span>
                <span className="text-emerald-300 font-display text-lg">
                  ${mainPriceObj.amount}
                  {offer.billing_period === "monthly" ? "/mo" : ""}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Zero upfront payment required right now. Reserve your slot and our team will share a detailed milestone proposal with Stripe/Wise invoice options.
              </p>
            </div>
          ) : paymentRequired ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/70 space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold text-white">
                <span>Advance Payable Now</span>
                <span className="text-orange-300 font-display text-lg">
                  Rs. {advancePriceObj.amount.toLocaleString("en-IN")}
                </span>
              </div>
              {offer.setup_fee && offer.discount_price && (
                <p className="text-[11px] text-white/50">
                  Setup fee: Rs. {offer.setup_fee} • Subscription: Rs. {offer.discount_price}/month
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-white/70 space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <CheckCircle2 size={16} />
                <span>No Advance Payment Required</span>
              </div>
              <p className="text-[11px] text-white/50 pl-6">
                Our team will reach out to discuss requirements and next steps.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full h-12 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
              isUsd
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500"
                : paymentRequired
                ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
            }`}
          >
            {isProcessing ? (
              isUsd ? "Reserving Slot..." : paymentRequired ? "Opening Razorpay Gateway..." : "Saving your booking..."
            ) : isUsd ? (
              <>
                <Sparkles size={18} /> Reserve Project Slot & Request USD Proposal
              </>
            ) : paymentRequired ? (
              <>
                <CreditCard size={18} /> Pay Rs. {advancePriceObj.amount.toLocaleString("en-IN")} & Confirm Booking
              </>
            ) : (
              <>
                <MessageCircle size={18} /> Book Now — We'll Contact You
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-white/40 pt-1">
            {isUsd ? (
              <>
                <ShieldCheck size={12} /> 100% IP Ownership • Mutual NDA Executed • Stripe & Wise Invoicing
              </>
            ) : paymentRequired ? (
              <>
                <Lock size={12} /> Encrypted & Secure via Razorpay • UPI, Cards, NetBanking, Wallet Supported
              </>
            ) : (
              <>
                <ShieldCheck size={12} /> Your details are safe and will only be used to process your booking.
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
