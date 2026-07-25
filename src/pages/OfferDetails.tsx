import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import PageMeta from "@/components/PageMeta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema, singleOfferSchema, graphSchema } from "@/lib/schema";
import type { Offer } from "@/types/offer";
import { BookingModal } from "@/components/BookingModal";
import { useAppSettings } from "@/hooks/use-app-settings";
import { isInstagramLead } from "@/lib/utm";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" as const },
  }),
};

export const OfferDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { settings } = useAppSettings();

  useEffect(() => {
    const fetchOffer = async () => {
      if (!supabase || !slug) return;
      setIsLoading(true);

      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        console.error("Failed to load offer details:", error);
      } else {
        setOffer(data as Offer);
      }
      setIsLoading(false);
    };

    fetchOffer();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="public-premium min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse text-lg text-cyan-300">Loading offer details...</div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="public-premium min-h-screen text-white pt-32 pb-20">
        <div className="section-container text-center max-w-xl mx-auto py-16">
          <h1 className="text-3xl font-bold">Offer Not Found</h1>
          <p className="mt-3 text-white/60 text-sm">The promotional offer you are looking for is no longer active or has been moved.</p>
          <div className="mt-6">
            <Link to="/offers" className="premium-btn premium-btn-primary">
              <ArrowLeft size={16} /> Back to All Offers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const advanceAmount = offer.booking_amount || offer.setup_fee || offer.discount_price || 999;
  const pageSchema = graphSchema(organizationSchema, singleOfferSchema(offer));

  return (
    <div className="public-premium min-h-screen text-white overflow-hidden">
      <PageMeta
        title={offer.seo_title || `${offer.title} | Techneyo Solutions`}
        description={offer.seo_description || offer.short_description}
        canonicalPath={`/offers/${offer.slug}`}
        schema={pageSchema}
      />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <Link to="/offers" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 hover:text-white transition-colors mb-6">
            <ArrowLeft size={14} /> Back to Offers Overview
          </Link>

          <motion.div initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div variants={fadeUp} custom={0} className="flex flex-wrap items-center gap-3">
              <span className="premium-badge">{offer.offer_type}</span>
              {offer.billing_period === "monthly" && (
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                  Monthly Subscription Plan
                </span>
              )}
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-6xl font-bold leading-tight text-white mt-4">
              {offer.title}
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mt-4 text-lg text-white/70 max-w-2xl leading-relaxed">
              {offer.short_description}
            </motion.p>

            {/* Price Box */}
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap items-end gap-4 p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md w-fit">
              <div>
                <span className="text-xs uppercase tracking-wider text-white/50 block">Subscription Fee</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display text-4xl font-bold text-orange-300">
                    Rs. {(offer.discount_price || offer.starting_price || 299).toLocaleString("en-IN")}
                  </span>
                  {offer.billing_period === "monthly" && <span className="text-white/60 text-sm">/ Month</span>}
                  {offer.discount_price && offer.starting_price && (
                    <span className="text-sm text-white/40 line-through ml-2">
                      Rs. {offer.starting_price.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              {offer.setup_fee && (
                <div className="border-l border-white/10 pl-4 py-1">
                  <span className="text-xs uppercase tracking-wider text-white/50 block">One-time Setup Fee</span>
                  <span className="font-display text-xl font-bold text-white mt-0.5 block">
                    Rs. {offer.setup_fee.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <button
                onClick={() => setIsBookingOpen(true)}
                className={`premium-btn ml-auto ${
                  settings.payment_required ? "premium-btn-primary" : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {settings.payment_required ? (
                  <>
                    <CreditCard size={18} /> Book with Rs. {advanceAmount.toLocaleString("en-IN")} Advance
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Book Now — Free
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Target Audience Section */}
      {offer.target_audience && offer.target_audience.length > 0 && (
        <section className="py-10 border-t border-b border-white/5 bg-white/[0.01]">
          <div className="section-container">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300 mb-3">Perfect For</p>
            <div className="flex flex-wrap gap-2.5">
              {offer.target_audience.map((item, idx) => (
                <span key={idx} className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white/85">
                  ✨ {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Comparison: What's Included vs What's NOT Included */}
      <section className="premium-section">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="premium-eyebrow">Scope & Deliverables</span>
            <h2 className="font-display text-3xl font-bold text-white mt-2">Clear Scope Boundaries Before You Buy</h2>
            <p className="text-white/60 text-sm mt-2">We believe in 100% transparency so you get maximum value with zero surprises.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* What's Included Card */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-emerald-500/20 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">What's Included</h3>
                  <p className="text-xs text-emerald-300/80">Covered in your plan setup & subscription</p>
                </div>
              </div>

              <ul className="space-y-3">
                {(offer.whats_included?.length ? offer.whats_included : [offer.detailed_description || "Professional responsive layout"]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-white/85">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's NOT Included Card */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-red-500/20 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                  <XCircle size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">What's NOT Included</h3>
                  <p className="text-xs text-red-300/80">Excluded or available as add-on paid support</p>
                </div>
              </div>

              <ul className="space-y-3">
                {(offer.whats_not_included?.length ? offer.whats_not_included : ["Custom backend programming", "Free unlimited revisions"]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
                    <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="premium-section pt-0">
        <div className="section-container space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="premium-eyebrow">Important Service Policies</span>
            <h2 className="font-display text-3xl font-bold text-white mt-2">Update & Ownership Terms</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Update Policy */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-lg">
                <AlertTriangle size={22} />
                <h3>Update Policy</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/75">
                {offer.update_policy || "Important: The monthly plan includes website hosting and availability only. Any content updates, image changes, text modifications, or feature additions are billed separately according to support charges."}
              </p>
            </div>

            {/* Ownership Policy */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-cyan-300 font-semibold text-lg">
                <ShieldCheck size={22} />
                <h3>Ownership & Code Policy</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/75">
                {offer.ownership_policy || "Website remains hosted and managed by Techneyo Solutions. Subscription covers hosting and availability. Source code and hosting credentials are not included unless acquired separately via buyout."}
              </p>
            </div>
          </div>

          {/* Suggested Terms List */}
          {offer.terms && offer.terms.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-xs text-white/60">
              <span className="font-semibold text-white uppercase tracking-wider block mb-3">Suggested Contract Terms</span>
              <div className="flex flex-wrap gap-2">
                {offer.terms.map((t, idx) => (
                  <span key={idx} className="rounded-md bg-white/5 border border-white/10 px-3 py-1 font-medium text-white/80">
                    📌 {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sticky Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/15 bg-neutral-950/90 backdrop-blur-md py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-white/50 block">Selected Offer</span>
            <span className="font-display font-bold text-white text-sm sm:text-base line-clamp-1">{offer.title}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="premium-btn premium-btn-ghost text-xs px-3.5 py-2">
              <MessageCircle size={16} /> WhatsApp Inquiry
            </a>
            <button
              onClick={() => setIsBookingOpen(true)}
              className={`premium-btn text-xs px-4 py-2 ${
                settings.payment_required ? "premium-btn-primary" : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {settings.payment_required ? (
                <>
                  <CreditCard size={16} /> Book with Rs. {advanceAmount.toLocaleString("en-IN")} Advance
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Book Now — Free
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        offer={offer}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        paymentRequired={settings.payment_required}
        onSuccess={(bookingId) => {
          if (isInstagramLead()) {
            navigate("/thank-you");
          } else {
            navigate(`/onboarding?booking_id=${bookingId}`);
          }
        }}
      />
    </div>
  );
};

export default OfferDetails;
