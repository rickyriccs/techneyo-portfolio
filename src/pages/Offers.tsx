import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Gift, MessageCircle, CreditCard, ExternalLink, Sparkles, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import PageMeta from "@/components/PageMeta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema, offersSchema, graphSchema } from "@/lib/schema";
import type { Offer } from "@/types/offer";
import { BookingModal } from "@/components/BookingModal";
import { useAppSettings } from "@/hooks/use-app-settings";
import { isInstagramLead } from "@/lib/utm";
import { isIndiaUser } from "@/lib/geo";

import { usePersonalization } from "@/context/PersonalizationContext";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" as const },
  }),
};

const formatPrice = (price: number | null) => {
  if (!price) return "Custom";
  return `Rs. ${Number(price).toLocaleString("en-IN")}`;
};

export const Offers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOfferForBooking, setSelectedOfferForBooking] = useState<Offer | null>(null);
  const [isIndia, setIsIndia] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { openProposalModal } = usePersonalization();

  useEffect(() => {
    const checkGeo = async () => {
      const isInd = await isIndiaUser();
      setIsIndia(isInd);
    };
    checkGeo();

    const loadOffers = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("status", "Active")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Failed to load offers", error);
        return;
      }

      if (data) {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const todayStr = `${year}-${month}-${day}`;

        const activeOffers = (data as Offer[]).filter((offer) => {
          if (offer.valid_from && offer.valid_from > todayStr) return false;
          if (offer.valid_till && offer.valid_till < todayStr) return false;
          return true;
        });

        setOffers(activeOffers);
      }
    };

    loadOffers();
  }, []);

  const pageSchema = graphSchema(organizationSchema, offersSchema(offers));

  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta
        title="Website Offers & Packages Worldwide | Techneyo Solutions"
        description="Affordable Techneyo Solutions website subscription offers, ₹299/month basic business plans, landing page offers, and online booking worldwide."
        keywords="website offers, affordable website packages, ₹299 website plan, business website subscription, landing page offers, global digital presence packages"
        canonicalPath="/offers"
        schema={pageSchema}
      />

      <section className="premium-hero relative overflow-hidden pb-20 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl">
            <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">Digital Growth & Website Offers</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              Affordable business website offers built to help you launch faster.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              Explore subscription plans, starter website packages, and custom tools. Book your slot online with an advance deposit or generate a customized AI proposal.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => openProposalModal()}
                className="premium-btn premium-btn-primary flex items-center gap-2"
              >
                <Sparkles size={16} /> Get Custom AI Proposal & Special Discount
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section pt-4">
        <div className="section-container">
          {isIndia === false ? (
            <div className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#08152b]/95 via-[#0b1c38]/90 to-[#040a14]/95 p-8 sm:p-12 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto">
              <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-[90px]" />

              <div className="relative z-10 text-center max-w-2xl mx-auto space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  <Globe className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  Global Enterprise Solutions
                </div>

                <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
                  Custom Digital Solutions for International Businesses
                </h2>

                <p className="text-sm sm:text-base leading-relaxed text-slate-300/80">
                  Promotional subscription packages are currently active for select domestic markets. For international clients, Techneyo Solutions delivers custom web applications, dedicated software systems, and AI growth funnels tailored specifically to your market and timezone.
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => openProposalModal()}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:scale-[1.02] transition-all"
                  >
                    <Sparkles className="h-4 w-4" /> Get Custom Global Proposal <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-all"
                  >
                    Contact Senior Team
                  </Link>
                </div>
              </div>
            </div>
          ) : offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-xl border border-white/5 bg-white/[0.01] max-w-xl mx-auto">
              <p className="text-white/60 text-lg leading-7">No active promotional offers at the moment. Please contact us for custom plans built specifically for your business goals.</p>
              <Link to="/contact" className="premium-btn premium-btn-primary mt-6">
                Get a Free Consultation
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {offers.map((offer, index) => {
                const advanceAmount = offer.booking_amount || offer.setup_fee || offer.discount_price || 999;
                const slugUrl = `/offers/${offer.slug || offer.id}`;

                return (
                  <motion.div
                    key={offer.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={fadeUp}
                    custom={index}
                    className="premium-card premium-card-hover flex h-full flex-col p-6 border border-white/10 bg-white/[0.02] rounded-2xl backdrop-blur-md"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-300/10 text-orange-200">
                        <Gift size={23} />
                      </div>
                      {offer.is_featured && <span className="premium-badge">Featured</span>}
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">{offer.offer_type}</p>
                    
                    <h2 className="mt-2 font-display text-2xl font-bold text-white hover:text-cyan-300 transition-colors">
                      <Link to={slugUrl}>{offer.title}</Link>
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-white/65 line-clamp-3">{offer.short_description}</p>

                    {/* Pricing */}
                    <div className="mt-5 flex items-end gap-2">
                      <span className="font-display text-3xl font-bold text-orange-300">
                        {formatPrice(offer.discount_price || offer.starting_price)}
                      </span>
                      {offer.billing_period === "monthly" && <span className="text-white/50 text-xs pb-1">/ month</span>}
                      {offer.discount_price && offer.starting_price && (
                        <span className="pb-1 text-xs text-white/35 line-through ml-1">{formatPrice(offer.starting_price)}</span>
                      )}
                    </div>

                    {offer.setup_fee && (
                      <span className="mt-1 text-xs text-cyan-300/80 font-medium">
                        + Rs. {offer.setup_fee.toLocaleString("en-IN")} one-time setup fee
                      </span>
                    )}

                    {/* Features snippet */}
                    <div className="mt-5 space-y-2 flex-grow">
                      {(offer.whats_included?.slice(0, 3) || [offer.detailed_description || "Professional layout"]).map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-300" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
                      <button
                        onClick={() => setSelectedOfferForBooking(offer)}
                        className={`w-full h-11 rounded-xl font-semibold text-xs text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                          settings.payment_required
                            ? "bg-orange-500 hover:bg-orange-400 shadow-orange-500/10"
                            : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10"
                        }`}
                      >
                        {settings.payment_required ? (
                          <>
                            <CreditCard size={15} /> Book with Rs. {advanceAmount.toLocaleString("en-IN")} Advance
                          </>
                        ) : (
                          <>
                            <Sparkles size={15} /> Book Now — Free
                          </>
                        )}
                      </button>

                      <Link
                        to={slugUrl}
                        className="w-full h-10 rounded-xl border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 font-semibold text-xs text-white/80 hover:text-white transition-all flex items-center justify-center gap-1.5"
                      >
                        View Full Details & Terms <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="premium-section pt-0">
        <div className="section-container">
          <div className="premium-final-cta">
            <div>
              <p className="premium-eyebrow">Not sure which plan fits?</p>
              <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">Tell us your business goal. We’ll suggest the right setup.</h2>
            </div>
            <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="premium-btn premium-btn-ghost">
              <MessageCircle size={18} /> WhatsApp Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedOfferForBooking && (
        <BookingModal
          offer={selectedOfferForBooking}
          isOpen={!!selectedOfferForBooking}
          onClose={() => setSelectedOfferForBooking(null)}
          paymentRequired={settings.payment_required}
          onSuccess={(bookingId) => {
            if (isInstagramLead()) {
              navigate("/thank-you");
            } else {
              navigate(`/onboarding?booking_id=${bookingId}`);
            }
          }}
        />
      )}
    </div>
  );
};

export default Offers;
