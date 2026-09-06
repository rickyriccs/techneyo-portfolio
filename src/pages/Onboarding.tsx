import { useState, useEffect, FormEvent } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Send, ArrowRight, Sparkles, Building, Phone, Mail } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { supabase } from "@/lib/supabase";
import { isInstagramLead } from "@/lib/utm";
import { notifySlackOnboarding } from "@/lib/slack";

export const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    email: "",
    servicesOffered: "",
    address: "",
    domainPreference: "",
    designNotes: "",
  });

  // Load existing booking prefill info
  useEffect(() => {
    const loadBookingPrefill = async () => {
      // If user session is from Instagram, skip onboarding and go straight to thank you page
      if (isInstagramLead()) {
        navigate("/thank-you");
        return;
      }

      if (!supabase || !bookingId) return;
      setIsLoadingBooking(true);

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookingId);
      
      let query = supabase.from("offer_bookings").select("*");
      if (isUuid) {
        query = query.eq("id", bookingId);
      } else {
        query = query.eq("razorpay_payment_id", bookingId);
      }

      const { data } = await query.maybeSingle();

      if (data) {
        if (isInstagramLead(data.utm_source)) {
          navigate("/thank-you");
          return;
        }

        setForm((prev) => ({
          ...prev,
          businessName: data.business_name || prev.businessName,
          contactPerson: data.customer_name || prev.contactPerson,
          phone: data.customer_phone || prev.phone,
          email: data.customer_email || prev.email,
        }));
      }
      setIsLoadingBooking(false);
    };

    loadBookingPrefill();
  }, [bookingId, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (supabase && bookingId) {
      const detailsPayload = {
        businessName: form.businessName.trim(),
        contactPerson: form.contactPerson.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        servicesOffered: form.servicesOffered.trim(),
        address: form.address.trim(),
        domainPreference: form.domainPreference.trim(),
        designNotes: form.designNotes.trim(),
        submittedAt: new Date().toISOString(),
      };

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookingId);

      let query = supabase.from("offer_bookings").update({
        onboarding_status: "completed",
        onboarding_details: detailsPayload,
        business_name: form.businessName.trim() || undefined,
      });

      if (isUuid) {
        query = query.eq("id", bookingId);
      } else {
        query = query.eq("razorpay_payment_id", bookingId);
      }

      const { error } = await query;
      if (error) {
        console.error("Onboarding update error:", error);
      }
    }

    // Trigger Slack notification for onboarding submission non-blockingly
    notifySlackOnboarding({
      businessName: form.businessName.trim(),
      contactPerson: form.contactPerson.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      servicesOffered: form.servicesOffered.trim() || undefined,
      domainPreference: form.domainPreference.trim() || undefined,
      designNotes: form.designNotes.trim() || undefined,
    }).catch((e) => console.warn("Slack onboarding dispatch error:", e));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="public-premium min-h-screen text-white pt-28 pb-20">
      <PageMeta
        title="Client Onboarding | Techneyo Solutions"
        description="Submit your website details and brand assets after booking your Techneyo website offer."
        canonicalPath="/onboarding"
      />

      <div className="section-container max-w-3xl">
        {isSubmitted ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 sm:p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle size={36} />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">Onboarding Details Received!</h1>
            <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed">
              Thank you! Our technical team has received your project details and booking record. We will contact you on WhatsApp / Phone within 2-4 business hours to kickstart your website build.
            </p>
            {bookingId && (
              <div className="inline-block rounded-lg bg-black/40 px-4 py-2 text-xs text-white/50 font-mono">
                Booking Reference ID: {bookingId}
              </div>
            )}
            <div className="pt-4">
              <Link to="/" className="premium-btn premium-btn-primary">
                Return to Home <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-10 backdrop-blur-xl">
            <div className="mb-8">
              <span className="premium-eyebrow">Step 2 of 2 • Project Setup</span>
              <h1 className="font-display text-3xl font-bold text-white mt-2">Welcome! Let’s set up your business website</h1>
              <p className="text-white/65 text-sm mt-2">
                Your advance booking deposit is confirmed. Please fill in your basic business info so we can start designing your layout immediately.
              </p>
              {bookingId && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <Sparkles size={14} /> Booking Confirmed ({bookingId.slice(0, 8)})
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">Business / Shop Name *</label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400"
                    placeholder="e.g. Apex Legal Services"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400"
                    placeholder="e.g. Amit Kumar"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400"
                    placeholder="+91 99887 73122"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">Preferred Domain (.com / .in)</label>
                  <input
                    type="text"
                    value={form.domainPreference}
                    onChange={(e) => setForm({ ...form, domainPreference: e.target.value })}
                    className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400"
                    placeholder="e.g. mybusinessname.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1.5">Main Services or Products You Offer *</label>
                <textarea
                  required
                  rows={3}
                  value={form.servicesOffered}
                  onChange={(e) => setForm({ ...form, servicesOffered: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3.5 text-sm text-white outline-none focus:border-cyan-400"
                  placeholder="e.g. Tax filing, GST registration, Accounting advice..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1.5">Business Address & Location</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none focus:border-cyan-400"
                  placeholder="City, State / Full address for Google Map integration"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1.5">Design Preferences or Reference Websites</label>
                <textarea
                  rows={3}
                  value={form.designNotes}
                  onChange={(e) => setForm({ ...form, designNotes: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3.5 text-sm text-white outline-none focus:border-cyan-400"
                  placeholder="Color preferences, logo links, or reference website links..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-cyan-500 font-semibold text-neutral-950 hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : <>Submit Onboarding Details <Send size={16} /></>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
