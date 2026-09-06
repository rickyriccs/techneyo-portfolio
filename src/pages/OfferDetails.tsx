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
  Share2,
  Copy,
  Check,
  Tag,
  Send,
  Linkedin,
  Twitter,
  ExternalLink,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import PageMeta from "@/components/PageMeta";
import { businessInfo } from "@/lib/business-info";
import {
  organizationSchema,
  localBusinessSchema,
  breadcrumbSchema,
  singleOfferSchema,
  offerFaqSchema,
  graphSchema,
} from "@/lib/schema";
import type { Offer } from "@/types/offer";
import { BookingModal } from "@/components/BookingModal";
import { useAppSettings } from "@/hooks/use-app-settings";
import { isInstagramLead } from "@/lib/utm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [hasCopied, setHasCopied] = useState(false);
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
          <p className="mt-3 text-white/60 text-sm">
            The promotional offer you are looking for is no longer active or has been moved.
          </p>
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
  const currentPrice = offer.discount_price || offer.starting_price || 999;
  const offerUrl = `${businessInfo.website}/offers/${offer.slug}`;

  // Structured Data Graph
  const pageSchema = graphSchema(
    organizationSchema,
    localBusinessSchema,
    breadcrumbSchema([
      { name: "Home", url: businessInfo.website },
      { name: "Offers", url: `${businessInfo.website}/offers` },
      { name: offer.title, url: offerUrl },
    ]),
    singleOfferSchema(offer),
    offerFaqSchema(offer)
  );

  const keywordsString = Array.isArray(offer.target_keywords)
    ? offer.target_keywords.join(", ")
    : typeof offer.target_keywords === "string"
    ? offer.target_keywords
    : `${offer.title}, website offer, techneyo package, web development india`;

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(offerUrl);
      setHasCopied(true);
      toast.success("Offer link copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareText = `Check out this promotional offer by Techneyo Solutions: ${offer.title} starting at Rs. ${currentPrice.toLocaleString("en-IN")}${
    offer.billing_period === "monthly" ? "/month" : ""
  }!`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n\n👉 Learn more & book your slot: ${offerUrl}`
  )}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(offerUrl)}`;

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    offerUrl
  )}`;

  // Generate FAQs for on-page accordion
  const pageFaqs = [
    {
      q: `What is included in the ${offer.title} package?`,
      a: offer.whats_included?.length
        ? offer.whats_included.join(". ")
        : offer.detailed_description || "Includes high-speed hosting, mobile responsive UI, and standard maintenance.",
    },
    {
      q: `What is NOT included or billed separately?`,
      a: offer.whats_not_included?.length
        ? offer.whats_not_included.join(". ")
        : "Custom API development and major continuous feature redesigns are billed separately.",
    },
    {
      q: `What is the update and maintenance policy?`,
      a:
        offer.update_policy ||
        "The plan covers continuous hosting uptime and server maintenance. Content revisions and feature additions are billed as per modular support rates.",
    },
    {
      q: `Who owns the website and code?`,
      a:
        offer.ownership_policy ||
        "The website is deployed and managed under Techneyo infrastructure. Full code buyout and export packages are available upon request.",
    },
    {
      q: `How do I book this offer and what happens next?`,
      a: `Click 'Book Now' to reserve your slot with an advance of Rs. ${advanceAmount.toLocaleString(
        "en-IN"
      )}. Our onboarding team will contact you within 24 hours to gather business requirements and begin layout setup.`,
    },
  ];

  return (
    <div className="public-premium min-h-screen text-white overflow-hidden">
      <PageMeta
        title={offer.seo_title || `${offer.title} | Techneyo Solutions`}
        description={offer.seo_description || offer.short_description}
        keywords={keywordsString}
        canonicalPath={`/offers/${offer.slug}`}
        ogImage={offer.banner_image_url || businessInfo.ogImage}
        schema={pageSchema}
      />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-14 overflow-hidden">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              to="/offers"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back to All Offers
            </Link>

            {/* Quick Share Bar */}
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
              <span className="text-xs text-white/50 flex items-center gap-1">
                <Share2 size={12} /> Share:
              </span>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="text-white/70 hover:text-emerald-400 transition-colors p-1"
                title="Share on WhatsApp"
              >
                <Send size={14} />
              </a>
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X / Twitter"
                className="text-white/70 hover:text-cyan-400 transition-colors p-1"
                title="Share on X"
              >
                <Twitter size={14} />
              </a>
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="text-white/70 hover:text-blue-400 transition-colors p-1"
                title="Share on LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <button
                onClick={copyShareLink}
                aria-label="Copy offer link"
                className="text-white/70 hover:text-amber-300 transition-colors p-1 flex items-center"
                title="Copy Link"
              >
                {hasCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <motion.div initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div variants={fadeUp} custom={0} className="flex flex-wrap items-center gap-3">
              <span className="premium-badge">{offer.offer_type}</span>
              {offer.billing_period === "monthly" && (
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                  Monthly Subscription Plan
                </span>
              )}
              {offer.is_featured && (
                <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                  ★ Popular Package
                </span>
              )}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mt-4"
            >
              {offer.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed"
            >
              {offer.short_description}
            </motion.p>

            {/* Price Box */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap items-end gap-5 p-6 sm:p-7 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-md w-full sm:w-fit"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-white/50 block">
                  {offer.billing_period === "monthly" ? "Subscription Fee" : "Package Price"}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display text-3xl sm:text-4xl font-bold text-orange-300">
                    Rs. {currentPrice.toLocaleString("en-IN")}
                  </span>
                  {offer.billing_period === "monthly" && (
                    <span className="text-white/60 text-sm">/ Month</span>
                  )}
                  {offer.discount_price && offer.starting_price && (
                    <span className="text-sm text-white/40 line-through ml-2">
                      Rs. {offer.starting_price.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              {offer.setup_fee && (
                <div className="border-l border-white/10 pl-4 py-1">
                  <span className="text-xs uppercase tracking-wider text-white/50 block">
                    One-time Setup Fee
                  </span>
                  <span className="font-display text-lg sm:text-xl font-bold text-white mt-0.5 block">
                    Rs. {offer.setup_fee.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <button
                onClick={() => setIsBookingOpen(true)}
                className={`premium-btn sm:ml-auto w-full sm:w-auto ${
                  settings.payment_required
                    ? "premium-btn-primary"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
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
        <section className="py-8 border-t border-b border-white/5 bg-white/[0.01]">
          <div className="section-container">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300 mb-3">
              Designed For
            </p>
            <div className="flex flex-wrap gap-2.5">
              {offer.target_audience.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/85"
                >
                  ✨ {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Comparison: What's Included vs What's NOT Included */}
      <section className="premium-section py-14">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="premium-eyebrow">Scope & Deliverables</span>
            <h2 className="font-display text-3xl font-bold text-white mt-2">
              Clear Scope Boundaries Before You Buy
            </h2>
            <p className="text-white/60 text-sm mt-2">
              We believe in 100% transparency so you get maximum value with zero surprises.
            </p>
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
                {(offer.whats_included?.length
                  ? offer.whats_included
                  : [offer.detailed_description || "Professional responsive layout"]
                ).map((item, idx) => (
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
                {(offer.whats_not_included?.length
                  ? offer.whats_not_included
                  : ["Custom backend programming", "Free unlimited revisions"]
                ).map((item, idx) => (
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
      <section className="premium-section pt-0 pb-12">
        <div className="section-container space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="premium-eyebrow">Important Service Policies</span>
            <h2 className="font-display text-3xl font-bold text-white mt-2">
              Update & Ownership Terms
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Update Policy */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-lg">
                <AlertTriangle size={22} />
                <h3>Update Policy</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/75">
                {offer.update_policy ||
                  "Important: The monthly plan includes website hosting and availability only. Any content updates, image changes, text modifications, or feature additions are billed separately according to support charges."}
              </p>
            </div>

            {/* Ownership Policy */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-cyan-300 font-semibold text-lg">
                <ShieldCheck size={22} />
                <h3>Ownership & Code Policy</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/75">
                {offer.ownership_policy ||
                  "Website remains hosted and managed by Techneyo Solutions. Subscription covers hosting and availability. Source code and hosting credentials are not included unless acquired separately via buyout."}
              </p>
            </div>
          </div>

          {/* Suggested Terms List */}
          {offer.terms && offer.terms.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-xs text-white/60">
              <span className="font-semibold text-white uppercase tracking-wider block mb-3">
                Contract Terms & Guarantees
              </span>
              <div className="flex flex-wrap gap-2">
                {offer.terms.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-white/5 border border-white/10 px-3 py-1 font-medium text-white/80"
                  >
                    📌 {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEO Tags & Cross-Linking Hub */}
      {offer.target_keywords && offer.target_keywords.length > 0 && (
        <section className="py-10 border-t border-white/5 bg-white/[0.015]">
          <div className="section-container">
            <div className="flex items-center gap-2 mb-4 text-cyan-300">
              <Tag size={16} />
              <h3 className="text-xs font-semibold uppercase tracking-widest">
                Related Topics & Industry Tags
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {offer.target_keywords.map((kw, idx) => (
                <Link
                  key={idx}
                  to={`/offers?tag=${encodeURIComponent(kw)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-white/75 hover:text-white transition-all"
                >
                  <span>#{kw}</span>
                </Link>
              ))}
            </div>

            {/* Cross-Link to Core Services */}
            <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
              <span>Need custom software or dedicated web engineering?</span>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/services/website-development"
                  className="text-cyan-300 hover:text-white hover:underline flex items-center gap-1"
                >
                  Custom Website Development <ArrowRight size={12} />
                </Link>
                <Link
                  to="/services/business-automation"
                  className="text-cyan-300 hover:text-white hover:underline flex items-center gap-1"
                >
                  Business Automation <ArrowRight size={12} />
                </Link>
                <Link
                  to="/services"
                  className="text-cyan-300 hover:text-white hover:underline flex items-center gap-1"
                >
                  All Services <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Frequently Asked Questions Accordion */}
      <section className="premium-section py-14 border-t border-white/5">
        <div className="section-container max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="premium-eyebrow">Got Questions?</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mt-2">
              Everything you need to know about this offer, onboarding, and support.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {pageFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-white/10 rounded-xl px-5 bg-white/[0.02] backdrop-blur-sm data-[state=open]:border-cyan-500/30"
              >
                <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-white hover:text-cyan-300 py-4 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 text-xs sm:text-sm leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Sticky Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/15 bg-neutral-950/90 backdrop-blur-md py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[11px] text-white/50 block truncate">Selected Offer</span>
            <span className="font-display font-bold text-white text-xs sm:text-base truncate block">
              {offer.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={businessInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn premium-btn-ghost text-xs px-3 py-2 hidden sm:inline-flex"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <button
              onClick={() => setIsBookingOpen(true)}
              className={`premium-btn text-xs px-4 py-2 ${
                settings.payment_required
                  ? "premium-btn-primary"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
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

