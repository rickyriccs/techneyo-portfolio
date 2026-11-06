import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  MessageCircle,
  PhoneCall,
  Calendar,
  Lock,
  ChevronRight,
  RefreshCw,
  Building2,
  Activity,
  ShoppingBag,
  Factory,
  Utensils,
  Briefcase,
  GraduationCap,
  Cpu,
  Store,
  HelpCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import PageMeta from "@/components/PageMeta";
import { organizationSchema } from "@/lib/schema";
import { businessInfo } from "@/lib/business-info";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/context/CurrencyContext";
import { BookingModal } from "@/components/BookingModal";
import type { Offer } from "@/types/offer";
import {
  QUIZ_INDUSTRIES,
  QUIZ_BOTTLENECKS,
  QUIZ_DIGITAL_STATUS,
  QUIZ_TIMELINES,
  calculateQuizUrgency,
  matchRecommendedOffer,
} from "@/lib/quiz-data";
import {
  submitClientNeedsAssessment,
  buildClientWhatsAppUrl,
} from "@/lib/client-needs";

const industryIcons: Record<string, React.ElementType> = {
  Activity,
  ShoppingBag,
  Building2,
  Factory,
  Utensils,
  Briefcase,
  GraduationCap,
  Cpu,
  Store,
};

export default function SolutionFinder() {
  const { formatPrice, currency } = useCurrency();
  const navigate = useNavigate();

  // Wizard Steps: 1 = Industry, 2 = Bottleneck, 3 = Digital Status, 4 = Timeline, 5 = Results
  const [step, setStep] = useState<number>(1);

  // Selected Answers
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>("healthcare");
  const [selectedBottleneckId, setSelectedBottleneckId] = useState<string>("no_website");
  const [selectedStatusId, setSelectedStatusId] = useState<string>("old_dated_site");
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>("urgent_7_days");

  // Contact capture details for the assessment lead
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
  });

  // Offers from DB
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);

  // Recommended Offer & Booking Modal
  const [recommendedOffer, setRecommendedOffer] = useState<Offer | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [hasSavedLead, setHasSavedLead] = useState(false);
  const [showWelcomeSuccessModal, setShowWelcomeSuccessModal] = useState(false);

  // Fetch active offers from Supabase / MySQL
  useEffect(() => {
    async function loadOffers() {
      try {
        setIsLoadingOffers(true);
        if (supabase) {
          const { data, error } = await supabase
            .from("offers")
            .select("*")
            .eq("status", "Active")
            .order("display_order", { ascending: true });

          if (!error && data && data.length > 0) {
            setAvailableOffers(data as Offer[]);
          }
        }
      } catch (err) {
        console.warn("Could not load offers:", err);
      } finally {
        setIsLoadingOffers(false);
      }
    }
    loadOffers();
  }, []);

  // Current objects
  const selectedIndustry = QUIZ_INDUSTRIES.find((i) => i.id === selectedIndustryId) || QUIZ_INDUSTRIES[0];
  const selectedBottleneck = QUIZ_BOTTLENECKS.find((b) => b.id === selectedBottleneckId) || QUIZ_BOTTLENECKS[0];
  const selectedStatus = QUIZ_DIGITAL_STATUS.find((s) => s.id === selectedStatusId) || QUIZ_DIGITAL_STATUS[0];
  const selectedTimeline = QUIZ_TIMELINES.find((t) => t.id === selectedTimelineId) || QUIZ_TIMELINES[0];

  // Live recalculated urgency score
  const urgency = calculateQuizUrgency(
    selectedIndustryId,
    selectedBottleneckId,
    selectedStatusId,
    selectedTimelineId
  );

  // Live reactive hint for the currently selected bottleneck in this industry
  const currentUrgencyHint =
    selectedBottleneck.industryHints?.[selectedIndustryId] || selectedBottleneck.defaultHint;

  // When reaching step 5 (results), resolve recommended offer
  useEffect(() => {
    if (step === 5) {
      const matched = matchRecommendedOffer(selectedBottleneckId, urgency.level, availableOffers);
      setRecommendedOffer(matched);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, selectedBottleneckId, urgency.level, availableOffers]);

  // Handle auto-saving lead or manual submission
  const handleLeadSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!contact.phone && !contact.email && !contact.name) {
      toast.error("Please provide at least a Phone or Email to save your diagnosis.");
      return;
    }

    setIsSubmittingLead(true);
    try {
      const res = await submitClientNeedsAssessment({
        customer_name: contact.name,
        customer_email: contact.email,
        customer_phone: contact.phone,
        business_name: contact.businessName,
        industry: selectedIndustry.id,
        industry_name: selectedIndustry.name,
        bottleneck: selectedBottleneck.id,
        bottleneck_title: selectedBottleneck.title,
        digital_status: selectedStatus.title,
        timeline: selectedTimeline.title,
        urgency_score: urgency.score,
        urgency_level: urgency.level,
        recommended_offer_id: recommendedOffer?.id || null,
        recommended_offer_title: recommendedOffer?.title || null,
        answers: {
          industry: selectedIndustry.name,
          bottleneck: selectedBottleneck.title,
          status: selectedStatus.title,
          timeline: selectedTimeline.title,
          urgencyScore: urgency.score,
        },
      });

      if (res.success) {
        setHasSavedLead(true);
        setShowWelcomeSuccessModal(true);
        toast.success("Diagnostic saved! Your customized action plan is ready.");
      } else {
        toast.error("Could not save diagnostic, but you can still book or chat below.");
      }
    } catch {
      toast.error("Network error while submitting.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 200, behavior: "smooth" });
    } else {
      setStep(5);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setHasSavedLead(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageMeta
        title="Find Your Solution | Exact Industry Needs & Urgency Diagnostic | Techneyo"
        description="Discover exactly what your business needs in your industry. Complete our 30-second diagnostic quiz to reveal real-time urgency hints, competitor benchmarks, and instant purchasable solution packages."
        canonicalPath="/solution-finder"
        schema={organizationSchema}
      />

      <div className="relative min-h-screen bg-[#030711] pt-24 pb-20 text-white selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Subtle background glow effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-purple-600/10 blur-[140px]" />

        <div className="section-container relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header Badge & Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md mb-4"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Industry Needs & Solution Diagnostic</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white"
            >
              Determine What Your Business <span className="text-gradient">Actually Needs</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-gray-400"
            >
              Answer 4 quick questions to receive real-time urgency hints, industry revenue benchmarks, and an immediate tailored solution you can deploy in days.
            </motion.p>
          </div>

          {/* Real-time Urgency Gauge & Step Progress Bar (Steps 1-4) */}
          {step <= 4 && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                {/* Step Indicators */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      onClick={() => setStep(s)}
                      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition-all ${
                        s === step
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/50"
                          : s < step
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-white/5 text-gray-500 border border-white/5"
                      }`}
                    >
                      {s < step ? <CheckCircle2 className="h-4 w-4" /> : s}
                    </div>
                  ))}
                  <span className="ml-2 text-xs font-medium text-gray-400">
                    Step {step} of 4:{" "}
                    <span className="text-white font-semibold">
                      {step === 1 && "Select Industry"}
                      {step === 2 && "Core Business Bottleneck"}
                      {step === 3 && "Digital Presence Status"}
                      {step === 4 && "Growth Timeline"}
                    </span>
                  </span>
                </div>

                {/* Live Urgency Status Meter */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wider text-gray-400">Live Urgency Rating</div>
                    <div className="flex items-center gap-1.5 font-bold text-sm" style={{ color: urgency.badgeColor }}>
                      <Flame className="h-4 w-4 animate-pulse" />
                      <span>{urgency.badgeText} ({urgency.score}/100)</span>
                    </div>
                  </div>
                  {/* Circular or pill meter */}
                  <div className="h-10 w-10 rounded-full border-2 border-white/10 flex items-center justify-center font-bold text-xs" style={{ borderColor: urgency.badgeColor }}>
                    {urgency.score}
                  </div>
                </div>
              </div>

              {/* Real-time Urgency Hint Alert Box (Immediate feedback!) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndustryId + selectedBottleneckId + step}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-3 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200"
                  style={{
                    borderColor: urgency.level === "Critical" ? "rgba(239, 68, 68, 0.4)" : urgency.level === "Moderate" ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)",
                    backgroundColor: urgency.level === "Critical" ? "rgba(239, 68, 68, 0.08)" : urgency.level === "Moderate" ? "rgba(245, 158, 11, 0.08)" : "rgba(16, 185, 129, 0.08)",
                    color: urgency.level === "Critical" ? "#fca5a5" : urgency.level === "Moderate" ? "#fde68a" : "#6ee7b7",
                  }}
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold block mb-0.5">
                      {selectedIndustry.name} Benchmark Alert:
                    </span>
                    <span>{currentUrgencyHint}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Step 1: Industry Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  1. Which industry does your business operate in?
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  We tailor performance benchmarks, SEO standards, and conversion funnels to your specific market.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {QUIZ_INDUSTRIES.map((ind) => {
                  const IconComp = industryIcons[ind.iconName] || Building2;
                  const isSelected = selectedIndustryId === ind.id;
                  return (
                    <div
                      key={ind.id}
                      onClick={() => setSelectedIndustryId(ind.id)}
                      className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                            isSelected
                              ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/40"
                              : "bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10"
                          }`}
                        >
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm flex items-center justify-between">
                            {ind.name}
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{ind.description}</p>
                          <div className="mt-2.5 inline-block rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-gray-300 border border-white/5">
                            📊 {ind.statHighlight}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNextStep}
                  className="premium-btn premium-btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold shadow-lg shadow-cyan-500/25"
                >
                  Continue to Business Challenge
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Primary Bottleneck */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  2. What is your biggest digital bottleneck right now?
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Select the issue that hurts your revenue, customer acquisition, or operational time most.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUIZ_BOTTLENECKS.map((b) => {
                  const isSelected = selectedBottleneckId === b.id;
                  const urgencyBadgeColor =
                    b.urgencyLevel === "Critical"
                      ? "bg-red-500/20 text-red-300 border-red-500/40"
                      : b.urgencyLevel === "Moderate"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";

                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBottleneckId(b.id)}
                      className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${urgencyBadgeColor}`}>
                          {b.urgencyLevel === "Critical" && "🔴 Critical Need"}
                          {b.urgencyLevel === "Moderate" && "🟡 Moderate Need"}
                          {b.urgencyLevel === "Optimization" && "🟢 Growth Need"}
                        </span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                      </div>

                      <h3 className="font-semibold text-white text-base group-hover:text-cyan-300 transition-colors">
                        {b.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{b.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="premium-btn premium-btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold shadow-lg shadow-cyan-500/25"
                >
                  Continue to Current Presence
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Current Digital Status */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  3. What does your current digital presence look like?
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Knowing your starting baseline helps us determine whether you need a fresh architecture or an optimization sprint.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUIZ_DIGITAL_STATUS.map((s) => {
                  const isSelected = selectedStatusId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStatusId(s.id)}
                      className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-white text-base group-hover:text-cyan-300">
                          {s.title}
                        </h3>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{s.description}</p>
                      <div className="mt-3 text-[11px] text-cyan-300/80 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2">
                        💡 {s.hint}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="premium-btn premium-btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold shadow-lg shadow-cyan-500/25"
                >
                  Continue to Timeline
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Target Timeline & Desired Outcome */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  4. How urgently do you need this solution implemented?
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  We offer expedited rapid launches within 7–14 days as well as full custom roadmaps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {QUIZ_TIMELINES.map((t) => {
                  const isSelected = selectedTimelineId === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTimelineId(t.id)}
                      className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-gray-300 mb-2">
                        {t.badge}
                      </span>
                      <h3 className="font-semibold text-white text-base group-hover:text-cyan-300">
                        {t.title}
                      </h3>
                      <p className="text-xs text-cyan-400 font-medium mt-1">{t.timeframe}</p>
                      {isSelected && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-cyan-300 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Selected Priority
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="premium-btn premium-btn-primary inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold shadow-lg shadow-cyan-500/25"
                >
                  Generate My Need Diagnosis & Solution
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Comprehensive Diagnosis, Matched Solution & Checkout */}
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Diagnostic Top Banner */}
              <div
                className="rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                style={{
                  borderColor: urgency.level === "Critical" ? "rgba(239, 68, 68, 0.4)" : urgency.level === "Moderate" ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)",
                  background: urgency.level === "Critical"
                    ? "radial-gradient(circle at top right, rgba(239, 68, 68, 0.15), rgba(3, 7, 17, 0.95))"
                    : urgency.level === "Moderate"
                    ? "radial-gradient(circle at top right, rgba(245, 158, 11, 0.15), rgba(3, 7, 17, 0.95))"
                    : "radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), rgba(3, 7, 17, 0.95))",
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ borderColor: urgency.badgeColor, color: urgency.badgeColor, backgroundColor: "rgba(0,0,0,0.4)" }}>
                      <Flame className="h-3.5 w-3.5 animate-pulse" />
                      <span>{urgency.badgeText} • {urgency.score} / 100 Urgency Score</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Diagnostic Summary for <span className="text-cyan-300">{selectedIndustry.name}</span>
                    </h2>

                    <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                      {urgency.summary}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={resetQuiz}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Retake Quiz
                    </button>
                  </div>
                </div>

                {/* Specific Industry Benchmark Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-6">
                  <div className="rounded-xl bg-black/40 border border-white/5 p-3.5">
                    <div className="text-[11px] uppercase tracking-wider text-gray-400">Target Industry</div>
                    <div className="font-semibold text-white text-sm mt-0.5">{selectedIndustry.name}</div>
                    <div className="text-[11px] text-gray-400 mt-1">📊 {selectedIndustry.statHighlight}</div>
                  </div>

                  <div className="rounded-xl bg-black/40 border border-white/5 p-3.5">
                    <div className="text-[11px] uppercase tracking-wider text-gray-400">Identified Bottleneck</div>
                    <div className="font-semibold text-white text-sm mt-0.5">{selectedBottleneck.title}</div>
                    <div className="text-[11px] text-amber-300/90 mt-1">Priority: {selectedBottleneck.urgencyLevel}</div>
                  </div>

                  <div className="rounded-xl bg-black/40 border border-white/5 p-3.5">
                    <div className="text-[11px] uppercase tracking-wider text-gray-400">Deployment Window</div>
                    <div className="font-semibold text-white text-sm mt-0.5">{selectedTimeline.timeframe}</div>
                    <div className="text-[11px] text-cyan-300 mt-1">Status: {selectedStatus.title}</div>
                  </div>
                </div>
              </div>

              {/* Matched Recommended Solution Package */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-cyan-400" />
                      Recommended Solution Package
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                      Directly engineered to solve your {selectedIndustry.name} bottleneck and launch on schedule.
                    </p>
                  </div>
                </div>

                {isLoadingOffers ? (
                  <div className="p-12 text-center text-gray-400">Finding matching solution package...</div>
                ) : recommendedOffer ? (
                  <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-black/40 to-black/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                          <span>{recommendedOffer.offer_type}</span>
                          {recommendedOffer.billing_period && (
                            <span className="text-gray-400 uppercase text-[10px]">• {recommendedOffer.billing_period}</span>
                          )}
                        </div>

                        <h4 className="text-2xl sm:text-3xl font-bold text-white">
                          {recommendedOffer.title}
                        </h4>

                        <p className="text-sm text-gray-300 leading-relaxed">
                          {recommendedOffer.short_description || recommendedOffer.detailed_description}
                        </p>

                        {/* What's Included Pills */}
                        {Array.isArray(recommendedOffer.whats_included) && recommendedOffer.whats_included.length > 0 && (
                          <div className="pt-2">
                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                              What's Included In This Solution:
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {recommendedOffer.whats_included.slice(0, 6).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Pricing & Checkout Column */}
                      <div className="lg:w-80 shrink-0 rounded-2xl border border-white/10 bg-black/60 p-6 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-gray-400">Total Investment</div>
                          <div className="mt-1 flex items-baseline gap-2">
                            {recommendedOffer.discount_price ? (
                              <>
                                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                                  {formatPrice(
                                    recommendedOffer.discount_price,
                                    recommendedOffer.discount_price_usd
                                  )}
                                </span>
                                {recommendedOffer.starting_price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(
                                      recommendedOffer.starting_price,
                                      recommendedOffer.starting_price_usd
                                    )}
                                  </span>
                                )}
                              </>
                            ) : recommendedOffer.starting_price ? (
                              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                                {formatPrice(
                                  recommendedOffer.starting_price,
                                  recommendedOffer.starting_price_usd
                                )}
                              </span>
                            ) : (
                              <span className="text-2xl font-bold text-white">Custom Package</span>
                            )}
                          </div>

                          {recommendedOffer.booking_amount && (
                            <div className="mt-1.5 text-xs text-cyan-300">
                              🔒 Advance to Lock & Start:{" "}
                              <span className="font-bold">
                                {formatPrice(
                                  recommendedOffer.booking_amount,
                                  recommendedOffer.booking_amount_usd
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Instant Buy / Book Button */}
                        <div className="space-y-2.5">
                          <button
                            onClick={() => setIsBookingModalOpen(true)}
                            className="w-full premium-btn premium-btn-primary flex items-center justify-center gap-2 py-3.5 text-sm font-bold shadow-xl shadow-cyan-500/25"
                          >
                            <Lock className="h-4 w-4" />
                            Book & Start Solution Now
                          </button>

                          <a
                            href={buildClientWhatsAppUrl({
                              industry: selectedIndustry.name,
                              bottleneck: selectedBottleneck.title,
                              urgencyLevel: urgency.level,
                              businessName: contact.businessName || undefined,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Chat with Architect on WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-gray-300">
                    <p>No active package matched directly, but our architects can build a custom roadmap for you.</p>
                    <a
                      href={buildClientWhatsAppUrl({
                        industry: selectedIndustry.name,
                        bottleneck: selectedBottleneck.title,
                        urgencyLevel: urgency.level,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 premium-btn premium-btn-primary px-6 py-2.5 text-sm font-semibold"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Discuss on WhatsApp
                    </a>
                  </div>
                )}
              </div>

              {/* Lead Save & Consultation Form */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl">
                <div className="max-w-2xl">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-cyan-400" />
                    Save Your Diagnosis & Schedule a Free Discovery Call
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Enter your contact details so our tech leads can review your quiz answers and send you a detailed action plan.
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">WhatsApp / Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Business Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Health Clinic"
                      value={contact.businessName}
                      onChange={(e) => setContact({ ...contact, businessName: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isSubmittingLead || hasSavedLead}
                      className="w-full premium-btn premium-btn-primary flex items-center justify-center gap-2 py-2.5 text-sm font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                    >
                      {hasSavedLead ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          Saved to Admin
                        </>
                      ) : isSubmittingLead ? (
                        "Saving..."
                      ) : (
                        <>
                          Save Diagnosis
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Direct Booking Modal */}
              {recommendedOffer && (
                <BookingModal
                  offer={recommendedOffer}
                  isOpen={isBookingModalOpen}
                  onClose={() => setIsBookingModalOpen(false)}
                  onSuccess={(bookingId) => {
                    setIsBookingModalOpen(false);
                    toast.success("Booking confirmed! Our team will contact you within 2 hours.");
                    navigate(`/thank-you?booking_id=${bookingId}`);
                  }}
                />
              )}

              {/* Instant WhatsApp & Email Welcome Modal */}
              {showWelcomeSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative max-w-lg w-full rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#0b1329] via-[#030711] to-[#030711] p-6 sm:p-8 text-center shadow-2xl space-y-6"
                  >
                    <button
                      onClick={() => setShowWelcomeSuccessModal(false)}
                      className="absolute right-4 top-4 rounded-xl p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
                      <Sparkles className="h-8 w-8" />
                    </div>

                    <div>
                      <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 border border-emerald-500/20 mb-2">
                        Diagnosis Saved & Sent
                      </span>
                      <h3 className="text-2xl font-bold text-white">Your Action Plan is Ready!</h3>
                      <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                        {contact.email
                          ? `A copy of your diagnosis report was dispatched to ${contact.email}.`
                          : "Your requirements have been securely logged for our solutions team."}
                        {" "}Our team is ready on WhatsApp to review your industry roadmap right now.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-left space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Industry:</span>
                        <span className="font-semibold text-white">{selectedIndustry.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Urgency:</span>
                        <span className="font-bold text-cyan-300">{urgency.level} ({urgency.score}/100)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Recommended Solution:</span>
                        <span className="font-semibold text-emerald-300 line-clamp-1">{recommendedOffer?.title || "Custom Architecture"}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <a
                        href={buildClientWhatsAppUrl({
                          industry: selectedIndustry.name,
                          bottleneck: selectedBottleneck.title,
                          urgencyLevel: urgency.level,
                          businessName: contact.businessName || undefined,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowWelcomeSuccessModal(false)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 text-sm shadow-xl shadow-emerald-600/30 transition-all"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Open Action Plan on WhatsApp Now
                      </a>

                      <button
                        onClick={() => {
                          setShowWelcomeSuccessModal(false);
                          setIsBookingModalOpen(true);
                        }}
                        className="w-full premium-btn premium-btn-ghost text-xs py-2.5 text-center"
                      >
                        Book Recommended Package Online
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
