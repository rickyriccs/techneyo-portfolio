import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Building2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { toast } from "sonner";
import PageMeta from "@/components/PageMeta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";
import { loadRazorpayScript } from "@/lib/razorpay";
import { supabase } from "@/lib/supabase";
import { notifySlackNewBooking } from "@/lib/slack";
import { getSourceData } from "@/lib/utm";
import { useCurrency } from "@/context/CurrencyContext";

export default function CustomPay() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currency: globalCurrency } = useCurrency();

  // Read params
  const title = searchParams.get("title") || "Techneyo Custom Digital Solution";
  const rawAmount = parseFloat(searchParams.get("amount") || "0");
  const paramCurrency = searchParams.get("currency");
  const defaultCurrency = (paramCurrency ? paramCurrency.toUpperCase() : globalCurrency) as "INR" | "USD";
  const refCode = searchParams.get("ref") || `INV-${Date.now().toString().slice(-6)}`;
  const prefillName = searchParams.get("name") || searchParams.get("customer_name") || "";
  const prefillEmail = searchParams.get("email") || searchParams.get("customer_email") || "";
  const prefillPhone = searchParams.get("phone") || searchParams.get("customer_phone") || "";
  const notes = searchParams.get("notes") || "";

  const isFixedAmount = !isNaN(rawAmount) && rawAmount > 0;
  const [currency, setCurrency] = useState<string>(defaultCurrency);
  const [editableAmount, setEditableAmount] = useState<string>(
    isFixedAmount ? rawAmount.toString() : defaultCurrency === "USD" ? "250" : "5000"
  );

  const [customer, setCustomer] = useState({
    name: prefillName,
    email: prefillEmail,
    phone: prefillPhone,
    businessName: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const amount = isFixedAmount ? rawAmount : (parseFloat(editableAmount) || 0);
  const isUsd = currency === "USD";
  const formattedAmount = isUsd ? `$${amount.toLocaleString("en-US")}` : `₹${amount.toLocaleString("en-IN")}`;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customer.name || !customer.phone) {
      setErrorMessage("Please provide your Name and Phone/WhatsApp number.");
      return;
    }

    if (amount <= 0) {
      setErrorMessage("Invalid payment amount. Please contact support.");
      return;
    }

    setIsProcessing(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Could not load secure payment gateway. Please check your internet connection.");
      }

      // Fetch Razorpay credentials
      let keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
      if (supabase) {
        try {
          const { data } = await supabase
            .from("app_settings")
            .select("razorpay_mode, razorpay_test_key_id, razorpay_live_key_id")
            .limit(1)
            .maybeSingle();

          if (data) {
            const isLive = data.razorpay_mode === "live";
            keyId = (isLive ? data.razorpay_live_key_id : data.razorpay_test_key_id) || keyId;
          }
        } catch (e) {
          console.warn("Could not fetch app_settings for razorpay key:", e);
        }
      }

      if (!keyId) {
        throw new Error("Payment gateway is temporarily unconfigured. Please contact support on WhatsApp.");
      }

      // Razorpay options
      const options = {
        key: keyId,
        amount: Math.round(amount * 100), // in lowest currency unit (paise or cents)
        currency: currency,
        name: businessInfo.name,
        description: `${title} (Ref: ${refCode})`,
        image: "https://techneyo.com/icon.png",
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        notes: {
          invoice_ref: refCode,
          purpose: title,
          business_name: customer.businessName || "Not provided",
        },
        theme: {
          color: "#06b6d4", // Cyan
        },
        handler: async function (response: any) {
          const payId = response.razorpay_payment_id;
          setPaymentId(payId);
          setPaymentSuccess(true);
          setIsProcessing(false);

          // Save record in offer_bookings table
          const bookingId = crypto.randomUUID();
          if (supabase) {
            try {
              const source = getSourceData();
              await supabase.from("offer_bookings").insert({
                id: bookingId,
                customer_name: customer.name,
                customer_email: customer.email || "not-provided@client.com",
                customer_phone: customer.phone,
                business_name: customer.businessName || null,
                total_plan_price: amount,
                advance_amount_paid: amount,
                currency: currency,
                razorpay_payment_id: payId,
                payment_status: "paid",
                onboarding_status: "pending",
                source_page_url: window.location.href,
                ...source,
              });
            } catch (err) {
              console.warn("Failed to store custom payment record:", err);
            }
          }

          // Trigger Slack alert
          notifySlackNewBooking({
            customerName: customer.name,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            businessName: customer.businessName,
            offerTitle: `Custom Invoice: ${title} (${refCode})`,
            advancePaid: amount,
            totalPlanPrice: amount,
            currency: currency,
            paymentId: payId,
            bookingId: bookingId,
          }).catch((err) => console.warn("Slack notification failed:", err));

          toast.success("Payment successful! Your project booking is confirmed.");
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || "Failed to initiate payment");
    }
  };

  return (
    <>
      <PageMeta
        title={`Complete Secure Payment | ${title} | Techneyo Solutions`}
        description="Complete your secure online payment for custom website development, software, or digital marketing solutions with Techneyo Solutions."
        canonicalPath="/pay"
        schema={organizationSchema}
      />

      <div className="relative min-h-screen bg-[#030711] pt-28 pb-20 text-white selection:bg-cyan-500/30 selection:text-cyan-200">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-600/10 blur-[130px]" />

        <div className="section-container relative z-10 max-w-xl mx-auto px-4">
          {paymentSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-black/40 to-black/80 p-8 text-center backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 border border-emerald-500/20 mb-2">
                  Payment Confirmed
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Thank You, {customer.name}!</h1>
                <p className="text-sm text-gray-300 mt-2">
                  Your payment of <span className="font-bold text-white">{formattedAmount}</span> has been processed securely.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/60 p-4 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Invoice / Service:</span>
                  <span className="font-semibold text-white">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reference Code:</span>
                  <span className="font-mono text-cyan-300">{refCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Razorpay Payment ID:</span>
                  <span className="font-mono text-emerald-300">{paymentId}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/"
                  className="flex-1 premium-btn premium-btn-ghost text-xs py-3 text-center"
                >
                  Return to Home
                </Link>
                <a
                  href={`https://wa.me/919988773122?text=${encodeURIComponent(`Hi Techneyo team! I just completed my payment (${refCode} - ${paymentId}) for ${title}. Let's discuss next steps.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 premium-btn premium-btn-primary text-xs py-3 text-center"
                >
                  Notify Team on WhatsApp
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-black/40 to-black/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
            >
              {/* Header */}
              <div className="text-center pb-6 border-b border-white/10">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-3">
                  <Lock className="h-3.5 w-3.5" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {title}
                </h1>
                <p className="text-xs text-gray-400 mt-1">Invoice Reference: <span className="font-mono text-cyan-300">{refCode}</span></p>

                {notes && (
                  <p className="mt-2 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-lg p-2 max-w-md mx-auto">
                    {notes}
                  </p>
                )}
              </div>

              {/* Price Section */}
              <div className="my-6 rounded-2xl border border-white/10 bg-black/60 p-5 text-center">
                {isFixedAmount ? (
                  <>
                    <span className="text-xs uppercase tracking-wider text-gray-400">Total Invoice Amount Due</span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                      {formattedAmount} <span className="text-sm font-semibold text-cyan-300">{currency}</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                      Enter Custom Invoice / Advance Amount
                    </span>
                    <div className="flex items-center justify-center">
                      <div className="relative w-full max-w-xs">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">
                          {currency === "USD" ? "$" : "₹"}
                        </span>
                        <input
                          type="number"
                          min="1"
                          step="any"
                          value={editableAmount}
                          onChange={(e) => setEditableAmount(e.target.value)}
                          placeholder="Amount"
                          className="w-full rounded-xl border border-cyan-500/30 bg-black/80 pl-10 pr-14 py-2.5 text-center text-3xl font-extrabold text-white focus:border-cyan-400 focus:outline-none"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-300 uppercase">
                          {currency}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Details Form */}
              <form onSubmit={handlePayment} className="space-y-4">
                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">WhatsApp / Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Email Address (Optional for Receipt)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="email"
                      placeholder="vikram@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Business Name (Optional)</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g. Apex Hospital / Brand"
                      value={customer.businessName}
                      onChange={(e) => setCustomer({ ...customer, businessName: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing || amount <= 0}
                    className="w-full premium-btn premium-btn-primary flex items-center justify-center gap-2 py-3.5 text-sm font-bold shadow-xl shadow-cyan-500/25 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      "Opening Secure Checkout..."
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Pay {formattedAmount} via Razorpay
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-4 flex items-center justify-center gap-6 text-[11px] text-gray-400 border-t border-white/10">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    PCI-DSS Level 1
                  </span>
                  <span>UPI, Cards, NetBanking</span>
                  <span>Direct Invoice</span>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
