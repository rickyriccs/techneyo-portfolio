import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  ShoppingBag,
  Building2,
  GraduationCap,
  Utensils,
  Scissors,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Check,
  BarChart3,
  Clock,
  MessageSquare,
  Star,
  Calendar,
  Video,
  TrendingUp,
  PhoneCall,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { industryRegistry } from "@/lib/industry-data";
import { usePersonalization } from "@/context/PersonalizationContext";
import { businessInfo } from "@/lib/business-info";

const iconComponents: Record<string, React.ElementType> = {
  Stethoscope,
  ShoppingBag,
  Building2,
  GraduationCap,
  Utensils,
  Scissors,
  Calendar,
  Star,
  MessageSquare,
  Video,
  TrendingUp,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export const IndustryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { openProposalModal } = usePersonalization();

  const industry = slug ? industryRegistry[slug] : null;

  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  if (!industry) {
    return (
      <div className="min-h-screen bg-[#030711] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto" />
          <h2 className="text-2xl font-bold font-display">Industry Solution Not Found</h2>
          <p className="text-sm text-white/70">
            The industry page you are looking for does not exist or has been updated.
          </p>
          <Link
            to="/industries"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-white font-bold text-sm"
          >
            Explore All Industry Solutions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const IndustryIcon = iconComponents[industry.iconName] || Building2;

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const selectedAddonsList = industry.addons.filter((a) => selectedAddonIds.includes(a.id));
  const totalAddonPrice = selectedAddonsList.reduce((sum, a) => sum + a.price, 0);
  const calculatedTotal = industry.startingPrice + totalAddonPrice;

  const handleClaimProposal = () => {
    openProposalModal({
      serviceTitle: `${industry.title} - Customized Solution`,
      startingPrice: industry.startingPrice,
      totalPrice: calculatedTotal,
      selectedAddons: selectedAddonsList.map((a) => ({ id: a.id, name: a.name, price: a.price })),
      estimatedDays: industry.estimatedDays,
      projectedRoi: industry.projectedRoi,
    });
  };

  return (
    <div className="public-premium min-h-screen overflow-hidden bg-[#030711] text-white">
      <PageMeta
        title={`${industry.title} Website & Digital Growth Solutions | Techneyo`}
        description={industry.heroDescription}
        canonicalPath={`/industries/${industry.slug}`}
      />

      {/* Hero Section */}
      <section className="premium-hero relative overflow-hidden pb-16 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <IndustryIcon className="w-4 h-4 text-cyan-300" />
              {industry.badge} Solution
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mb-6 font-display text-4xl sm:text-6xl font-extrabold leading-tight text-white"
            >
              {industry.heroHeadline}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="max-w-3xl text-lg leading-8 text-white/70"
            >
              {industry.heroDescription}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleClaimProposal}
                className="premium-btn premium-btn-primary flex items-center gap-2 text-sm sm:text-base px-6 py-3.5"
              >
                <Sparkles size={18} /> Get {industry.title} Proposal & Pricing <ArrowRight size={18} />
              </button>
              <a
                href={businessInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-btn premium-btn-ghost flex items-center gap-2 text-sm sm:text-base px-6 py-3.5"
              >
                <MessageSquare size={18} /> Talk to Solution Specialist
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points & Solutions */}
      <section className="py-16 bg-white/[0.02] border-y border-white/10">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-2">
              Industry Challenges Solved
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Why Business Owners in {industry.title} Trust Us
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {industry.painPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0b1329]/90 border border-white/10 shadow-xl space-y-4 relative overflow-hidden"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 font-bold text-xs flex items-center justify-center border border-red-500/20">
                  0{idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider mb-1">
                    Common Problem
                  </h4>
                  <p className="text-sm font-semibold text-white/90">{pt.problem}</p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Our Direct Solution
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">{pt.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package & Addon Customizer */}
      <section className="py-16">
        <div className="section-container max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-2">
              Tailored Package Configurator
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Customize Your {industry.title} Solution
            </h2>
            <p className="text-sm text-white/70 mt-2">
              Select optional upgrades below to build your custom package in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start rounded-2xl bg-[#0b1329]/90 border border-white/10 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
            {/* Left Column: Deliverables (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Included Base Package
                </span>
                <h3 className="text-2xl font-bold text-white font-display mt-1">
                  Complete {industry.title} Growth Package
                </h3>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
                  Included Deliverables & Setup
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {industry.includedDeliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-white/90 bg-white/[0.03] p-2.5 rounded-lg border border-white/5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                  Built-in Growth Features
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white font-medium">
                  {industry.growthFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Add-ons (5 Cols) */}
            <div className="lg:col-span-5 rounded-xl bg-gradient-to-b from-[#121c3b] via-[#0d1630] to-[#0b1329] border border-white/10 p-5 sm:p-6 space-y-6 shadow-xl">
              <div className="grid grid-cols-2 gap-3 pb-4 border-b border-white/10">
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-center">
                  <div className="flex items-center justify-center text-xs text-white/60 gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Delivery Time
                  </div>
                  <span className="text-sm font-bold text-white">{industry.estimatedDays}</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-center">
                  <div className="flex items-center justify-center text-xs text-white/60 gap-1 mb-1">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Projected ROI
                  </div>
                  <span className="text-sm font-bold text-emerald-400">
                    {industry.projectedRoi}
                  </span>
                </div>
              </div>

              {/* Addons List */}
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                  Specialized Industry Add-ons
                </span>
                <div className="space-y-2">
                  {industry.addons.map((addon) => {
                    const isSelected = selectedAddonIds.includes(addon.id);
                    const AddonIcon = iconComponents[addon.iconName] || Star;
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-cyan-500/15 border-cyan-400 text-white"
                            : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                              isSelected ? "bg-cyan-500 border-cyan-400 text-white" : "border-white/30"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <span className="font-semibold text-white flex items-center gap-1.5">
                              <AddonIcon className="w-3.5 h-3.5 text-cyan-300" />
                              {addon.name}
                            </span>
                            <span className="text-[11px] text-white/60 block mt-0.5">
                              {addon.description}
                            </span>
                          </div>
                        </div>
                        <span className={`font-semibold shrink-0 text-xs px-2 py-0.5 rounded border ${isSelected ? "text-cyan-300 bg-cyan-500/15 border-cyan-500/30" : "text-white/50 bg-white/5 border-white/10"}`}>
                          {isSelected ? "Selected" : "Optional Upgrade"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Package Scope & Consultation Summary */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-white/60 font-medium block">Custom Scope & Strategy</span>
                    <span className="text-sm font-bold text-white font-display">
                      {selectedAddonsList.length > 0
                        ? `${selectedAddonsList.length} Add-on Upgrades Selected`
                        : "Core Industry Package Selected"}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-sm">
                    Free Consultation
                  </span>
                </div>
              </div>

              <button
                onClick={handleClaimProposal}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 hover:brightness-110 transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" />
                Request Custom Proposal & Scope
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Industry FAQs */}
      <section className="py-16 bg-white/[0.02] border-t border-white/10">
        <div className="section-container max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" /> Industry FAQs
            </div>
            <h2 className="font-display text-3xl font-bold text-white">Questions from {industry.title} Owners</h2>
          </div>
          <div className="space-y-4">
            {industry.faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#0b1329]/80 border border-white/10 shadow-md">
                <h4 className="font-display text-base font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-sm text-white/70 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-900/30 via-[#0b1329] to-blue-900/30 border-t border-white/10 text-center">
        <div className="section-container max-w-3xl mx-auto space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
            Ready to Grow Your {industry.title} Business?
          </h2>
          <p className="text-base text-white/70">
            Get your customized proposal with zero technical jargon in under 60 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={handleClaimProposal}
              className="premium-btn premium-btn-primary flex items-center gap-2 text-base px-8 py-4"
            >
              <Sparkles size={20} /> Build My Custom {industry.title} Offer <ArrowRight size={20} />
            </button>
            <a
              href="tel:+919988773122"
              className="premium-btn premium-btn-ghost flex items-center gap-2 text-base px-8 py-4"
            >
              <PhoneCall size={18} /> Call +91 99887 73122
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustryDetail;
