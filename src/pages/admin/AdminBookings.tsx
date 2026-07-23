import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, Clock, RefreshCw, Mail, Phone, Building, Eye, X, Globe, FileText, MapPin, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { OfferBooking } from "@/types/offer";

export const AdminBookings = () => {
  const [bookings, setBookings] = useState<OfferBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<OfferBooking | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Razorpay Online Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All customer details captured before, during (Razorpay), and after payment (Onboarding form).
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm font-semibold hover:bg-muted"
        >
          <RefreshCw size={16} /> Refresh
        </button>
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
                <th className="px-4 py-3 font-semibold">Advance Paid</th>
                <th className="px-4 py-3 font-semibold">Razorpay Payment ID</th>
                <th className="px-4 py-3 font-semibold">Onboarding</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                    Loading customer bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                    No online bookings recorded yet.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-foreground space-y-6">
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
                <CreditCard size={15} /> Payment & Contact Info (Captured During Checkout)
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

            {/* Section 2: Post-Payment Onboarding Answers */}
            <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Sparkles size={15} /> Project Onboarding Answers (Captured Post-Payment)
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
                  ⏳ Customer has not filled out the post-payment onboarding form yet. (Sent to `/onboarding?booking_id=${selectedBooking.id}`)
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
