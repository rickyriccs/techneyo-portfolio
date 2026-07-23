import { useState, FormEvent } from "react";
import { X, ShieldCheck, CreditCard, Lock } from "lucide-react";
import type { Offer } from "@/types/offer";
import { initiateOfferBookingPayment, BookingCustomerDetails } from "@/lib/razorpay";

interface BookingModalProps {
  offer: Offer;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

export const BookingModal = ({ offer, isOpen, onClose, onSuccess }: BookingModalProps) => {
  const [customer, setCustomer] = useState<BookingCustomerDetails>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    business_name: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const advanceAmount = offer.booking_amount || offer.setup_fee || offer.discount_price || 999;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsProcessing(true);

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
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Razorpay Secure Online Booking</span>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">{offer.title}</h2>
          <p className="mt-1 text-sm text-white/65">
            Book now with an advance payment of <span className="font-semibold text-orange-300">Rs. {advanceAmount.toLocaleString("en-IN")}</span>.
          </p>
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
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Phone / WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={customer.customer_phone}
                onChange={(e) => setCustomer({ ...customer, customer_phone: e.target.value })}
                className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                placeholder="+91 98765 43210"
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
                placeholder="rahul@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">Business / Brand Name (Optional)</label>
            <input
              type="text"
              value={customer.business_name || ""}
              onChange={(e) => setCustomer({ ...customer, business_name: e.target.value })}
              className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              placeholder="e.g. Sharma Traders"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/70 space-y-1.5">
            <div className="flex justify-between items-center text-sm font-semibold text-white">
              <span>Advance Payable Now</span>
              <span className="text-orange-300 font-display text-lg">Rs. {advanceAmount.toLocaleString("en-IN")}</span>
            </div>
            {offer.setup_fee && offer.discount_price && (
              <p className="text-[11px] text-white/50">
                Setup fee: Rs. {offer.setup_fee} • Subscription: Rs. {offer.discount_price}/month
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isProcessing ? (
              "Opening Razorpay Gateway..."
            ) : (
              <>
                <CreditCard size={18} /> Pay Rs. {advanceAmount.toLocaleString("en-IN")} & Confirm Booking
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-white/40 pt-1">
            <Lock size={12} /> Encrypted & Secure via Razorpay • UPI, Cards, NetBanking, Wallet Supported
          </div>
        </form>
      </div>
    </div>
  );
};
