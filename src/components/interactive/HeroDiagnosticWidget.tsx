import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Smartphone,
  Share2,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Rocket,
  ShoppingBag,
  Building2,
  ShieldCheck,
  Zap,
  Gift,
  ExternalLink,
} from "lucide-react";
import {
  usePersonalization,
  PrimaryGoal,
  BusinessType,
  TimelineBudget,
} from "@/context/PersonalizationContext";

const goals: { id: PrimaryGoal; title: string; desc: string; icon: React.ElementType; badge: string }[] = [
  {
    id: "website",
    title: "Website & Web App",
    desc: "High-trust business websites, landing pages & web apps",
    icon: Globe,
    badge: "Most Popular",
  },
  {
    id: "mobile_app",
    title: "Mobile App Development",
    desc: "Custom iOS & Android apps built for performance",
    icon: Smartphone,
    badge: "High Growth",
  },
  {
    id: "social_media",
    title: "Social Media & Branding",
    desc: "Reels, viral content & full brand identity management",
    icon: Share2,
    badge: "Engagement",
  },
  {
    id: "paid_ads",
    title: "Paid Ads & Digital Marketing",
    desc: "Google Ads, Meta Ads & lead generation campaigns",
    icon: TrendingUp,
    badge: "High ROI",
  },
  {
    id: "full_stack",
    title: "Full IT & Growth Suite",
    desc: "Complete Web + Mobile + Ads & Automation package",
    icon: Sparkles,
    badge: "Best Value",
  },
];

const businessTypes: { id: BusinessType; title: string; icon: React.ElementType; mappedSlug: string }[] = [
  { id: "startup", title: "New Startup / Founder", icon: Rocket, mappedSlug: "ecommerce-retail" },
  { id: "ecommerce", title: "E-Commerce & Retail Shop", icon: ShoppingBag, mappedSlug: "ecommerce-retail" },
  { id: "local_business", title: "Clinic / Healthcare / Local Service", icon: Building2, mappedSlug: "healthcare-clinics" },
  { id: "enterprise", title: "Real Estate / Scale-Up / Coaching", icon: ShieldCheck, mappedSlug: "real-estate" },
];

const timelines: { id: TimelineBudget; title: string; badge: string; bonus: string }[] = [
  { id: "urgent", title: "Fast Launch (7-14 Days)", badge: "Express Delivery", bonus: "Free SEO Audit Included" },
  { id: "standard", title: "Standard Growth (2-4 Weeks)", badge: "Balanced", bonus: "Free WhatsApp Automation Setup" },
  { id: "scale", title: "Full Scale-Up (1-2 Months)", badge: "Comprehensive", bonus: "Free 1-Month Ad Setup & Optimization" },
];

export const HeroDiagnosticWidget: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, setPreferences, openProposalModal } = usePersonalization();
  const [step, setStep] = useState<number>(preferences.hasCompletedQuiz ? 4 : 1);

  const [selectedGoal, setSelectedGoal] = useState<PrimaryGoal | null>(preferences.primaryGoal);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessType | null>(preferences.businessType);
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineBudget | null>(preferences.timelineBudget);

  const handleGoalSelect = (goal: PrimaryGoal) => {
    setSelectedGoal(goal);
    setPreferences({ primaryGoal: goal });
    setStep(2);
  };

  const handleBusinessSelect = (bType: BusinessType) => {
    setSelectedBusiness(bType);
    setPreferences({ businessType: bType });
    setStep(3);
  };

  const handleTimelineSelect = (tBudget: TimelineBudget) => {
    setSelectedTimeline(tBudget);
    setPreferences({
      timelineBudget: tBudget,
      hasCompletedQuiz: true,
    });
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedGoal(null);
    setSelectedBusiness(null);
    setSelectedTimeline(null);
    setPreferences({
      primaryGoal: null,
      businessType: null,
      timelineBudget: null,
      hasCompletedQuiz: false,
    });
  };

  const getMappedIndustrySlug = (): string => {
    if (selectedBusiness === "ecommerce" || selectedBusiness === "startup") return "ecommerce-retail";
    if (selectedBusiness === "local_business") return "healthcare-clinics";
    if (selectedBusiness === "enterprise") return "real-estate";
    return "healthcare-clinics";
  };

  const getRecommendationText = () => {
    if (selectedGoal === "website") return "Tailored High-Converting Business Website & SEO Package";
    if (selectedGoal === "mobile_app") return "Native iOS & Android App Development Strategy";
    if (selectedGoal === "social_media") return "30-Day Social Content & Organic Lead Blueprint";
    if (selectedGoal === "paid_ads") return "High-ROI Meta & Google Ads Campaign Setup";
    return "All-in-One Web, Mobile & Digital Marketing Suite";
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 rounded-2xl bg-[#0b1329]/90 border border-white/10 shadow-2xl p-4 sm:p-6 md:p-8 backdrop-blur-xl relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Interactive Diagnostic
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            {step === 4 ? "Your Customized Growth Match" : "Find Your Custom IT Solution & Dynamic Offer"}
          </h3>
        </div>
        {step < 4 && (
          <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
            <span>Step {step} of 3</span>
            <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Questionnaire Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <p className="text-sm text-white/70 font-medium">
              1. What is your primary objective today?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {goals.map((g) => {
                const IconComponent = g.icon;
                return (
                  <button
                    key={g.id}
                    onClick={() => handleGoalSelect(g.id)}
                    className="group relative flex flex-col items-start text-left p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {g.badge}
                      </span>
                    </div>
                    <span className="font-semibold text-base text-white group-hover:text-cyan-300 transition-colors">
                      {g.title}
                    </span>
                    <span className="text-xs text-white/60 mt-1 line-clamp-2">
                      {g.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70 font-medium">
                2. Which best describes your business category?
              </p>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-cyan-300 hover:underline font-medium"
              >
                ← Back
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {businessTypes.map((b) => {
                const IconComp = b.icon;
                return (
                  <button
                    key={b.id}
                    onClick={() => handleBusinessSelect(b.id)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-200 text-left group shadow-sm"
                  >
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-white block group-hover:text-cyan-300 transition-colors">
                        {b.title}
                      </span>
                      <span className="text-xs text-white/50">Select to tailor industry features</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70 font-medium">
                3. What is your ideal launch timeframe?
              </p>
              <button
                onClick={() => setStep(2)}
                className="text-xs text-cyan-300 hover:underline font-medium"
              >
                ← Back
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {timelines.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTimelineSelect(t.id)}
                  className="flex flex-col items-start p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-200 text-left group shadow-sm"
                >
                  <span className="text-xs font-bold text-cyan-300 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 mb-2">
                    {t.badge}
                  </span>
                  <span className="font-semibold text-sm text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {t.title}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-2">
                    <Gift className="w-3 h-3" />
                    {t.bonus}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl bg-gradient-to-br from-cyan-500/10 via-[#0d1733] to-[#0b1329] border border-cyan-500/30 p-5 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/25">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Matched Growth Solution
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> 98% Industry Match
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white font-display mt-0.5">
                    {getRecommendationText()}
                  </h4>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors font-medium px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Diagnostic
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                <span className="text-xs text-white/50 block">Primary Goal</span>
                <span className="text-sm font-semibold text-white capitalize">
                  {selectedGoal ? selectedGoal.replace("_", " ") : "Website & Web App"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                <span className="text-xs text-white/50 block">Business Category</span>
                <span className="text-sm font-semibold text-white capitalize">
                  {selectedBusiness ? selectedBusiness.replace("_", " ") : "Retail / Local Business"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                <span className="text-xs text-white/50 block">Free Included Bonus</span>
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  {selectedTimeline === "urgent"
                    ? "Free SEO Audit"
                    : selectedTimeline === "standard"
                    ? "WhatsApp Automation"
                    : "Free 1-Month Ad Setup"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => navigate(`/industries/${getMappedIndustrySlug()}`)}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 hover:brightness-110 transition-all hover:scale-[1.01]"
              >
                <ExternalLink className="w-4 h-4" />
                View Custom Industry Solution Page
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openProposalModal(selectedGoal || "website")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-white/20 bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Get Instant Proposal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroDiagnosticWidget;
