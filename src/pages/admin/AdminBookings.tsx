import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, Clock, RefreshCw, Mail, Phone, Building, Eye, X, Globe, FileText, MapPin, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { OfferBooking } from "@/types/offer";

export const AdminBookings = () => {
  const [bookings, setBookings] = useState<OfferBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<OfferBooking | null>(null);
  const [channelFilter, setChannelFilter] = useState<string>("all");

  const fetchBookings = async () => {
    if (!supabase) return;
    setIsLoading(true);
    setError("");

    const { data, error: fetchErr } = await supabase
      .from("offer_bookings")
      .select("*, offer:offers(title, slug)")
      .order("created_at", { ascending: false });

    if (fetchErr) {
      setError(fetchErr.message);
    } else {
      setBookings((data || []) as OfferBooking[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, newStatus: "pending" | "in_progress" | "completed") => {
    if (!supabase) return;
    const { error: err } = await supabase
      .from("offer_bookings")
      .update({ onboarding_status: newStatus })
      .eq("id", id);

    if (!err) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, onboarding_status: newStatus } : b))
      );
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, onboarding_status: newStatus } : null));
      }
    }
  };

  const getSourceBadge = (booking: OfferBooking) => {
    const src = (booking.utm_source || "").toLowerCase();
    const medium = (booking.utm_medium || "").toLowerCase();
    const ref = (booking.initial_referrer || booking.referrer || "").toLowerCase();

    if (src === "facebook" || ref.includes("facebook.com") || ref.includes("fb.com")) {
      return {
        label: medium === "cpc" ? "Meta Ads (FB)" : "Facebook",
        bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      };
    }
    if (src === "instagram" || ref.includes("instagram.com")) {
      return {
        label: medium === "cpc" ? "Meta Ads (IG)" : "Instagram",
        bg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      };
    }
    if (src === "google" || ref.includes("google.com")) {
      return {
        label: medium === "cpc" ? "Google Ads" : "Google Search",
        bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      };
    }
    if (src) {
      return {
        label: `${src.toUpperCase()} ${medium ? `(${medium})` : ""}`,
        bg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      };
    }
    return {
      label: ref ? "Referral" : "Direct / Organic",
      bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    };
  };

  const filteredBookings = bookings.filter((b) => {
    if (channelFilter === "all") return true;
    const src = (b.utm_source || "").toLowerCase();
    const ref = (b.initial_referrer || b.referrer || "").toLowerCase();

    if (channelFilter === "facebook") return src === "facebook" || ref.includes("facebook.com") || ref.includes("fb.com");
    if (channelFilter === "instagram") return src === "instagram" || ref.includes("instagram.com");
    if (channelFilter === "google") return src === "google" || ref.includes("google.com");
    if (channelFilter === "direct") return !src && !ref;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All customer details and lead source analytics captured before, during, and after payment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="h-9 rounded-md border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">🎯 All Lead Sources</option>
            <option value="facebook">📘 Facebook Ads / Meta</option>
            <option value="instagram">📸 Instagram Ads</option>
            <option value="google">🔍 Google Ads / Search</option>
            <option value="direct">🌐 Direct / Organic</option>
          </select>

          <button
            onClick={fetchBookings}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm font-semibold hover:bg-muted"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer Contact</th>
                <th className="px-4 py-3 font-semibold">Offer Plan</th>
                <th className="px-4 py-3 font-semibold">Lead Source</th>
                <th className="px-4 py-3 font-semibold">Advance Paid</th>
                <th className="px-4 py-3 font-semibold">Razorpay Payment ID</th>
                <th className="px-4 py-3 font-semibold">Onboarding</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                    Loading customer bookings...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                    No online bookings recorded matching this filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const badge = getSourceBadge(booking);
                  return (
                    <tr key={booking.id} className="align-top hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{booking.customer_name}</p>
                        <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <Phone size={12} /> {booking.customer_phone}
                          </p>
                          <p className="flex items-center gap-1">
                            <Mail size={12} /> {booking.customer_email}
                          </p>
                          {booking.business_name && (
                            <p className="flex items-center gap-1 font-medium text-foreground">
                              <Building size={12} /> {booking.business_name}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">
                          {booking.offer?.title || "Custom Website Offer"}
                        </p>
                        {booking.total_plan_price && (
                          <p className="text-xs text-muted-foreground">
                            Plan: Rs. {booking.total_plan_price.toLocaleString("en-IN")}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
                          <Globe size={11} /> {badge.label}
                        </span>
                        {booking.utm_campaign && (
                          <p className="text-[11px] text-muted-foreground mt-1 truncate max-w-[140px]">
                            Campaign: {booking.utm_campaign}
                          </p>
                        )}
                        {booking.device_type && (
                          <p className="text-[11px] text-muted-foreground capitalize">
                            Device: {booking.device_type}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`font-display font-bold ${booking.advance_amount_paid > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                          Rs. {booking.advance_amount_paid.toLocaleString("en-IN")}
                        </span>
                        <span className={`block text-[11px] uppercase font-semibold ${booking.advance_amount_paid > 0 ? "text-emerald-500/80" : "text-amber-500/80"}`}>
                          {booking.advance_amount_paid === 0 ? "Free Booking" : booking.payment_status}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        <p className="font-semibold text-foreground">
                          {booking.razorpay_payment_id || "N/A"}
                        </p>
                        <p className="text-[11px]">
                          {new Date(booking.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={booking.onboarding_status}
                          onChange={(e) =>
                            updateStatus(booking.id, e.target.value as any)
                          }
                          className="h-8 rounded border border-border bg-background px-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="pending">⏳ Pending Onboarding</option>
                          <option value="in_progress">⚙️ Work In Progress</option>
                          <option value="completed">✅ Completed</option>
                        </select>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                        >
                          <Eye size={14} /> Full Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-foreground space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>

            <div className="border-b border-border pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Booking Reference: {selectedBooking.id}</span>
              <h2 className="font-display text-2xl font-bold text-foreground mt-1">{selectedBooking.customer_name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Paid on {new Date(selectedBooking.created_at).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Section 1: Pre-Payment & Razorpay Details */}
            <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <CreditCard size={15} /> Payment & Contact Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Customer Name:</span>
                  <span className="font-semibold text-foreground">{selectedBooking.customer_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Phone / WhatsApp:</span>
                  <a href={`https://wa.me/${selectedBooking.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="font-semibold text-emerald-400 hover:underline">
                    {selectedBooking.customer_phone} (WhatsApp Chat)
                  </a>
                </div>
                <div>
                  <span className="text-muted-foreground block">Email Address:</span>
                  <span className="font-semibold text-foreground">{selectedBooking.customer_email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Business Name:</span>
                  <span className="font-semibold text-foreground">{selectedBooking.business_name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Offer Purchased:</span>
                  <span className="font-semibold text-foreground">{selectedBooking.offer?.title || "Custom Offer"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Advance Paid Online:</span>
                  <span className="font-bold text-emerald-400">Rs. {selectedBooking.advance_amount_paid.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Razorpay Payment ID:</span>
                  <span className="font-mono text-foreground font-semibold">{selectedBooking.razorpay_payment_id || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Razorpay Order ID:</span>
                  <span className="font-mono text-muted-foreground">{selectedBooking.razorpay_order_id || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Lead Traffic Source Analytics */}
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Globe size={15} /> Lead Source & Traffic Analytics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Primary Source:</span>
                  <span className="font-semibold text-foreground uppercase">{selectedBooking.utm_source || "Direct / Unspecified"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Medium / Channel:</span>
                  <span className="font-semibold text-foreground">{selectedBooking.utm_medium || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Ad Campaign Name:</span>
                  <span className="font-semibold text-foreground">{selectedBooking.utm_campaign || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Device & Screen:</span>
                  <span className="font-semibold text-foreground capitalize">{selectedBooking.device_type || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">UTM Term / Content:</span>
                  <span className="font-mono text-foreground">{[selectedBooking.utm_term, selectedBooking.utm_content].filter(Boolean).join(" / ") || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Initial Referrer Domain:</span>
                  <span className="font-mono text-foreground truncate block">{selectedBooking.initial_referrer || selectedBooking.referrer || "Direct Visit"}</span>
                </div>
              </div>
              {selectedBooking.landing_page_url && (
                <div className="text-xs pt-1 border-t border-cyan-500/10">
                  <span className="text-muted-foreground block">Landing Page URL:</span>
                  <a href={selectedBooking.landing_page_url} target="_blank" rel="noreferrer" className="font-mono text-[11px] text-cyan-400 hover:underline break-all">
                    {selectedBooking.landing_page_url}
                  </a>
                </div>
              )}
            </div>

            {/* Section 3: Post-Payment Onboarding Answers */}
            <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Sparkles size={15} /> Project Onboarding Answers
              </h3>

              {selectedBooking.onboarding_details ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground block">Contact Person:</span>
                      <span className="font-semibold text-foreground">{selectedBooking.onboarding_details.contactPerson || selectedBooking.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Preferred Domain (.com / .in):</span>
                      <span className="font-semibold text-cyan-400">{selectedBooking.onboarding_details.domainPreference || "Not specified"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">Main Services / Products Offered:</span>
                    <p className="font-medium text-foreground mt-0.5 bg-background p-2 rounded border border-border">
                      {selectedBooking.onboarding_details.servicesOffered || "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">Business Address & Location:</span>
                    <p className="font-medium text-foreground mt-0.5 bg-background p-2 rounded border border-border">
                      {selectedBooking.onboarding_details.address || "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">Design Notes & Reference Websites:</span>
                    <p className="font-medium text-foreground mt-0.5 bg-background p-2 rounded border border-border">
                      {selectedBooking.onboarding_details.designNotes || "No custom notes provided"}
                    </p>
                  </div>

                  {selectedBooking.onboarding_details.submittedAt && (
                    <p className="text-[11px] text-muted-foreground pt-1">
                      Submitted on: {new Date(selectedBooking.onboarding_details.submittedAt).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded">
                  ⏳ Customer has not filled out the post-payment onboarding form yet.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-md border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
