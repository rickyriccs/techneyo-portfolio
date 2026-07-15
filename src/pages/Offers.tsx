import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Gift, MessageCircle, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import PageMeta from "@/components/PageMeta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema, offersSchema, graphSchema } from "@/lib/schema";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" as const },
  }),
};

type Offer = {
  id: string;
  title: string;
  short_description: string;
  detailed_description: string | null;
  offer_type: string;
  starting_price: number | null;
  discount_price: number | null;
  button_text: string;
  button_action: string;
  button_url: string | null;
  is_featured: boolean;
  valid_from?: string | null;
  valid_till?: string | null;
};


const formatPrice = (price: number | null) => {
  if (!price) return "Custom";
  return `Rs. ${Number(price).toLocaleString("en-IN")}`;
};

const CountdownTimer = ({ validTill }: { validTill: string }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const targetDate = new Date(`${validTill}T23:59:59`);

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(" "));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [validTill]);

  if (!timeLeft || timeLeft === "Expired") return null;

  return (
    <div className="mt-4 rounded-md border border-orange-500/20 bg-orange-500/5 px-3 py-2 text-center text-xs font-semibold text-orange-300 flex items-center justify-center gap-1.5 animate-pulse">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
      Ends in: {timeLeft}
    </div>
  );
};

const actionHref = (offer: Offer) => {
  if (offer.button_action === "WhatsApp") return businessInfo.whatsappUrl;
  if (offer.button_action === "Call") return "tel:+919988773122";
  if (offer.button_action === "Custom Link" && offer.button_url) return offer.button_url;
  return "/contact";
};

const Offers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const loadOffers = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("offers")
        .select("id,title,short_description,detailed_description,offer_type,starting_price,discount_price,button_text,button_action,button_url,is_featured,valid_from,valid_till")
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
      <PageMeta title="Website Offers | Techneyo Solutions" description="Affordable Techneyo Solutions website, landing page, WhatsApp enquiry, CRM, and custom business tool offers for businesses across India." canonicalPath="/offers" schema={pageSchema} />
      <section className="premium-hero relative overflow-hidden pb-20 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl">
            <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">Website offers</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              Affordable digital presence offers built to help businesses launch faster.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              Choose a starter offer, campaign page, WhatsApp enquiry flow, or custom business tool consultation. Every offer is controlled from the admin dashboard.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-container">
          {offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-xl border border-white/5 bg-white/[0.01] max-w-xl mx-auto">
              <p className="text-white/60 text-lg leading-7">No active promotional offers at the moment. Please contact us for custom plans built specifically for your business goals.</p>
              <Link to="/contact" className="premium-btn premium-btn-primary mt-6">
                Get a Free Consultation
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {offers.map((offer, index) => {
                const href = actionHref(offer);
                const isExternal = href.startsWith("http") || href.startsWith("tel:");

                return (
                  <motion.div
                    key={offer.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={fadeUp}
                    custom={index}
                    className="premium-card premium-card-hover flex h-full flex-col p-6"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-300/10 text-orange-200">
                        <Gift size={23} />
                      </div>
                      {offer.is_featured && <span className="premium-badge">Featured</span>}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">{offer.offer_type}</p>
                    <h2 className="mt-3 font-display text-2xl font-bold text-white">{offer.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-white/62">{offer.short_description}</p>
                    <div className="mt-5 flex items-end gap-3">
                      <span className="font-display text-3xl font-bold text-orange-200">{formatPrice(offer.discount_price || offer.starting_price)}</span>
                      {offer.discount_price && offer.starting_price && (
                        <span className="pb-1 text-sm text-white/35 line-through">{formatPrice(offer.starting_price)}</span>
                      )}
                    </div>
                    {offer.detailed_description && (
                      <div className="mt-5 flex items-start gap-2 text-sm leading-6 text-white/58 flex-grow">
                        <CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-200" />
                        {offer.detailed_description}
                      </div>
                    )}
                    {offer.valid_till && <CountdownTimer validTill={offer.valid_till} />}
                    {isExternal ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="premium-btn premium-btn-primary mt-6" data-offer-name={offer.title} data-cta-location="offers_grid">
                        {offer.button_text || "Enquire Now"} <ArrowRight size={16} />
                      </a>
                    ) : (
                      <Link to={href} className="premium-btn premium-btn-primary mt-6" data-offer-name={offer.title} data-cta-location="offers_grid">
                        {offer.button_text || "Enquire Now"} <ArrowRight size={16} />
                      </Link>
                    )}
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
              <p className="premium-eyebrow">Not sure which offer fits?</p>
              <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">Tell us your business goal. We’ll suggest the right setup.</h2>
            </div>
            <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="premium-btn premium-btn-ghost" data-cta-location="offers_final_cta">
              <MessageCircle size={18} /> WhatsApp Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Offers;
