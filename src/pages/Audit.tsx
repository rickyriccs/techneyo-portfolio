import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Globe,
  Search,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Share2,
  Copy,
  Check,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Video,
  Lock,
  Unlock,
  Linkedin,
  Twitter,
  MessageCircle,
  HelpCircle,
  BarChart3,
  Flame,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import PageMeta from "@/components/PageMeta";
import { organizationSchema } from "@/lib/schema";
import { businessInfo } from "@/lib/business-info";
import {
  runWebsiteAudit,
  runCompetitorBenchmark,
  buildViralShareLinks,
  AuditResult,
  CompetitorComparison,
  normalizeUrl,
  extractDomain,
} from "@/lib/audit-analyzer";
import { createContactEnquiry } from "@/lib/contact-enquiries";
import { auditOffer } from "@/lib/audit-offer";
import { BookingModal } from "@/components/BookingModal";
import { useCurrency } from "@/context/CurrencyContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const scanSteps = [
  "Resolving domain & verifying SSL certificates...",
  "Testing Google Core Web Vitals & mobile load speed...",
  "Analyzing Google SEO indexing & heading architecture...",
  "Scanning 1-tap WhatsApp hooks & conversion friction...",
  "Synthesizing 360° health scorecard & solution roadmap...",
];

export const Audit: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currency, formatPrice } = useCurrency();

  const [targetUrl, setTargetUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [showCompetitor, setShowCompetitor] = useState(false);

  // Diagnostic wizard options
  const [primaryGoal, setPrimaryGoal] = useState("leads");
  const [monthlyVisitors, setMonthlyVisitors] = useState("under-1k");
  const [hasLocalBusiness, setHasLocalBusiness] = useState(true);

  // Audit state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [comparison, setComparison] = useState<CompetitorComparison | null>(null);

  // Lead Gate state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // Upsell / Booking Modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  // Handle URL pre-fill from query params (e.g. ?site=example.com)
  useEffect(() => {
    const siteParam = searchParams.get("site");
    const competitorParam = searchParams.get("competitor");
    if (siteParam) {
      setTargetUrl(siteParam);
    }
    if (competitorParam) {
      setCompetitorUrl(competitorParam);
      setShowCompetitor(true);
    }
  }, [searchParams]);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      toast.error("Please enter a valid website URL to audit.");
      return;
    }

    setIsScanning(true);
    setResult(null);
    setComparison(null);
    setScanStepIndex(0);

    // Update query params for shareability
    const domain = extractDomain(targetUrl);
    setSearchParams(
      showCompetitor && competitorUrl
        ? { site: domain, competitor: extractDomain(competitorUrl) }
        : { site: domain }
    );

    // Step ticker animation
    const stepInterval = setInterval(() => {
      setScanStepIndex((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      if (showCompetitor && competitorUrl.trim()) {
        const compResult = await runCompetitorBenchmark(targetUrl, competitorUrl);
        clearInterval(stepInterval);
        setComparison(compResult);
        setResult(compResult.primary);
      } else {
        const auditData = await runWebsiteAudit(targetUrl, {
          monthlyVisitors,
          primaryGoal,
          hasLocalBusiness,
        });
        clearInterval(stepInterval);
        setResult(auditData);
      }
    } catch (err) {
      clearInterval(stepInterval);
      toast.error("Failed to complete audit. Please check the URL and try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleUnlockDetailedReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      toast.error("Please provide your name and phone/WhatsApp number to unlock.");
      return;
    }

    setIsSubmittingLead(true);
    try {
      await createContactEnquiry({
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim() || undefined,
        businessName: result?.domain || targetUrl,
        serviceRequired: "360° Digital Health & Growth Audit",
        message: `Generated instant audit score of ${result?.overallScore}/100 (${result?.overallGrade}) for ${result?.domain}. Diagnostic Goal: ${primaryGoal}, Traffic: ${monthlyVisitors}.`,
        sourcePage: "/audit",
        serviceInterested: "360-digital-audit",
      });

      setIsUnlocked(true);
      toast.success("Detailed Strengths, Weaknesses & Solutions unlocked!");
    } catch (error) {
      // Unlock anyway so user isn't stuck
      setIsUnlocked(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const shareLinks = result ? buildViralShareLinks(result) : null;

  const handleCopyLink = () => {
    if (!shareLinks) return;
    navigator.clipboard.writeText(shareLinks.auditUrl);
    setHasCopiedLink(true);
    toast.success("Audit scorecard link copied to clipboard!");
    setTimeout(() => setHasCopiedLink(false), 2500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  const getGradeBadge = (grade: string) => {
    if (grade.startsWith("A")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    if (grade === "B") return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    if (grade === "C") return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    return "bg-rose-500/20 text-rose-300 border-rose-500/40";
  };

  return (
    <div className="public-premium min-h-screen overflow-hidden bg-[#030711] text-white">
      <PageMeta
        title="Free 360° Website & Digital Presence Audit | Techneyo Solutions"
        description="Run an instant 360° audit of your business website and online presence. Discover mobile speed bottlenecks, SEO gaps, conversion leaks, and competitor benchmarks."
        keywords="website audit tool, online presence audit, free website health check, conversion rate audit, mobile speed score, SEO checkup"
        canonicalPath="/audit"
        schema={organizationSchema}
      />

      {/* Hero Header */}
      <section className="premium-hero relative overflow-hidden pb-12 pt-32 sm:pb-16">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-xs font-semibold uppercase tracking-wider mb-5 shadow-lg shadow-cyan-500/10"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Global 360° Digital Health & Growth Analyzer
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl tracking-tight"
            >
              Is Your Website Losing You High-Paying Customers?
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-5 text-lg leading-8 text-white/70 max-w-2xl mx-auto"
            >
              Enter your website URL below. Our automated engine analyzes your mobile speed, Google SEO ranking signals, WhatsApp conversion hooks, and benchmarks you against competitors in seconds.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Audit Form Card */}
      <section className="relative z-10 -mt-4 pb-16">
        <div className="section-container max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/10 bg-[#0b1329]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleStartAudit} className="space-y-6">
              {/* Primary URL */}
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  Your Business Website URL
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-cyan-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourbusiness.com or https://company.com"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 py-3.5 pl-12 pr-4 text-white placeholder-white/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-base"
                  />
                </div>
              </div>

              {/* Competitor Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowCompetitor(!showCompetitor)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  {showCompetitor ? "– Remove Competitor Comparison" : "+ Compare Head-to-Head with a Competitor"}
                </button>

                <AnimatePresence>
                  {showCompetitor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <label className="block text-xs font-medium text-white/80 mb-1.5">
                        Competitor Website URL
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-4 text-amber-400">
                          <Flame className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. competitor.com"
                          value={competitorUrl}
                          onChange={(e) => setCompetitorUrl(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-black/40 py-3 pl-11 pr-4 text-sm text-white placeholder-white/40 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3 Quick Diagnostic Questions */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-300/80">
                  Quick Diagnostic Setup (Optional)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">
                      What is your #1 business goal?
                    </label>
                    <select
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#050b18] py-2 px-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="leads">Generate More Inbound WhatsApp & Call Leads</option>
                      <option value="seo">Rank #1 on Google Search & Google Maps</option>
                      <option value="sales">Increase Direct Online Orders & E-Commerce Sales</option>
                      <option value="brand">Establish High-End Corporate Brand Credibility</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">
                      Current Monthly Website Traffic
                    </label>
                    <select
                      value={monthlyVisitors}
                      onChange={(e) => setMonthlyVisitors(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#050b18] py-2 px-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="under-1k">Under 1,000 visitors / month</option>
                      <option value="1k-10k">1,000 to 10,000 visitors / month</option>
                      <option value="10k+">10,000+ visitors / month</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isScanning}
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 py-4 px-6 text-base font-bold text-white shadow-xl shadow-cyan-500/25 transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Analyzing Your Online Footprint...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-white text-white" />
                    <span>Run Free 360° Digital Health Audit</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Live Scanning Progress Overlay */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-5 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-sm font-semibold text-cyan-300">
                      Live Analysis in Progress
                    </span>
                  </div>
                  <p className="text-sm text-white/90 font-medium">
                    {scanSteps[scanStepIndex]}
                  </p>
                  <div className="w-full bg-white/10 rounded-full h-1.5 mt-4 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full"
                      initial={{ width: "10%" }}
                      animate={{ width: `${((scanStepIndex + 1) / scanSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pb-24"
          >
            <div className="section-container max-w-5xl mx-auto space-y-12">
              
              {/* Scorecard Hero Card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e1938] to-[#070e22] p-8 sm:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Left: Domain & Verdict */}
                  <div className="space-y-4 text-center md:text-left max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-cyan-300">
                      <Globe className="w-3.5 h-3.5" />
                      {result.domain}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                      360° Digital Health Performance
                    </h2>

                    <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                      {result.summarySentence}
                    </p>

                    <div className="text-xs text-white/50">
                      Audited on {new Date(result.analyzedAt).toLocaleDateString()} • Mobile Viewport Strategy
                    </div>
                  </div>

                  {/* Right: Giant Grade & Score Badge */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-black/40 text-center min-w-[200px]">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                      Overall Health Score
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl sm:text-6xl font-black font-display text-white">
                        {result.overallScore}
                      </span>
                      <span className="text-lg text-white/50 font-semibold">/ 100</span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1 rounded-full border text-sm font-extrabold tracking-wide uppercase shadow-sm">
                      <Award className="w-4 h-4" />
                      Grade: {result.overallGrade}
                    </div>
                  </div>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
                  {Object.values(result.pillars).map((pillar) => (
                    <div
                      key={pillar.name}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/80">{pillar.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getGradeBadge(pillar.grade)}`}>
                          {pillar.grade}
                        </span>
                      </div>
                      <div className="text-2xl font-bold font-display text-white mb-2">
                        {pillar.score} <span className="text-xs text-white/40 font-normal">/ 100</span>
                      </div>
                      <p className="text-[11px] text-white/60 line-clamp-2">
                        {pillar.summary}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Viral Share Bar */}
                {shareLinks && (
                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-cyan-400" />
                      <span>Share your scorecard with founders & team:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        LinkedIn
                      </a>

                      <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 transition-colors"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                        X / Twitter
                      </a>

                      <a
                        href={shareLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>

                      <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs font-semibold text-white/80 hover:bg-white/10 transition-colors"
                      >
                        {hasCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {hasCopiedLink ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Competitor Head-to-Head Benchmark Card (if present) */}
              {comparison && (
                <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-black to-[#0b1329] p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Flame className="w-4 h-4" />
                    Head-to-Head Competitor Benchmark
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-cyan-300 font-semibold mb-1">Your Website</div>
                        <div className="text-xl font-bold text-white">{comparison.primary.domain}</div>
                      </div>
                      <div className="text-3xl font-extrabold text-cyan-300 font-display">
                        {comparison.primary.overallScore} <span className="text-xs text-white/50">pts</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-amber-300 font-semibold mb-1">Competitor</div>
                        <div className="text-xl font-bold text-white">{comparison.competitor.domain}</div>
                      </div>
                      <div className="text-3xl font-extrabold text-amber-300 font-display">
                        {comparison.competitor.overallScore} <span className="text-xs text-white/50">pts</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-sm text-white/80 italic bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    💡 <strong>Strategic Verdict:</strong> {comparison.verdict}
                  </p>
                </div>
              )}

              {/* Two-Stage Reveal: Strengths, Weaknesses, Solutions */}
              <div className="relative">
                {!isUnlocked && (
                  <div className="relative rounded-3xl border border-cyan-500/30 bg-[#070e22]/95 p-8 sm:p-10 shadow-2xl text-center max-w-2xl mx-auto z-20">
                    <div className="inline-flex p-3 rounded-full bg-cyan-500/10 text-cyan-400 mb-4 border border-cyan-500/20">
                      <Lock className="w-6 h-6" />
                    </div>

                    <h3 className="text-2xl font-bold font-display text-white mb-2">
                      Unlock Your Full Strengths, Weaknesses & Solutions Breakdown
                    </h3>
                    <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
                      Enter your details below to instantly reveal the exact technical bottlenecks hurting your rankings and conversion rates.
                    </p>

                    <form onSubmit={handleUnlockDetailedReport} className="space-y-4 max-w-md mx-auto text-left">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-black/50 py-2.5 px-3.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1">
                            Phone / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+1 (555) 000-0000"
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-black/50 py-2.5 px-3.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/80 mb-1">
                            Work Email (Optional)
                          </label>
                          <input
                            type="email"
                            placeholder="you@company.com"
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-black/50 py-2.5 px-3.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                      >
                        {isSubmittingLead ? (
                          "Unlocking..."
                        ) : (
                          <>
                            <Unlock className="w-4 h-4" />
                            <span>Unlock Full Analysis Instantly (Free)</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Detailed Report Content */}
                <div className={`space-y-8 transition-all duration-500 ${!isUnlocked ? "filter blur-md pointer-events-none opacity-40 select-none" : "opacity-100"}`}>
                  
                  {/* Strengths & Weaknesses Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-base font-display">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        Identified Strengths ({result.strengths.length})
                      </div>
                      <div className="space-y-3">
                        {result.strengths.map((s) => (
                          <div key={s.id} className="p-3.5 rounded-xl border border-white/5 bg-black/30">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-white">{s.title}</span>
                              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                                {s.category}
                              </span>
                            </div>
                            <p className="text-xs text-white/70">{s.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weaknesses */}
                    <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 space-y-4">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-base font-display">
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                        Critical Bottlenecks & Leaks ({result.weaknesses.length})
                      </div>
                      <div className="space-y-3">
                        {result.weaknesses.map((w) => (
                          <div key={w.id} className="p-3.5 rounded-xl border border-white/5 bg-black/30">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-white">{w.title}</span>
                              <span className="text-[10px] uppercase font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded">
                                {w.category}
                              </span>
                            </div>
                            <p className="text-xs text-white/70">{w.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Solutions & Strategic Action Plan */}
                  <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#0b1329] to-[#040813] p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                          Tailored Growth Blueprint
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                          High-Impact Solutions to Double Your Conversions
                        </h3>
                      </div>
                      <span className="text-xs text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10 self-start sm:self-auto">
                        Prioritized by Revenue ROI
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.solutions.map((sol, index) => (
                        <div
                          key={sol.id}
                          className="rounded-xl border border-white/10 bg-black/40 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono font-bold text-cyan-300">
                                SPRINT 0{index + 1}
                              </span>
                              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                {sol.estimatedRoi}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1.5">{sol.title}</h4>
                            <p className="text-xs text-white/70 leading-relaxed mb-4">{sol.description}</p>
                          </div>

                          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[11px] text-white/50">{sol.category}</span>
                            <button
                              onClick={() => setIsBookingOpen(true)}
                              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Fix this leak</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* High-Converting Impulse Upsell Banner ($29 / ₹1,999) */}
                  <div className="relative overflow-hidden rounded-3xl border border-cyan-400/40 bg-gradient-to-r from-blue-900/60 via-[#0e1c42] to-cyan-950/60 p-8 sm:p-10 shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                      <div className="space-y-4 max-w-2xl text-center lg:text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                          <Video className="w-3.5 h-3.5" />
                          VIP Video Teardown & Implementation Roadmap
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                          Want Us to Personally Audit & Fix These Leaks for You?
                        </h3>

                        <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                          Receive a personalized 15-minute video walkthrough tearing down every friction point on your live website, an itemized developer fix checklist, and direct WhatsApp consulting.
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/90 pt-1 justify-center lg:justify-start">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 15-min Loom Video Teardown
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Developer Fix Checklist
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Money-Back Guarantee
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-cyan-400/30 bg-black/60 text-center min-w-[240px]">
                        <div className="text-xs text-white/60 uppercase font-semibold mb-1">
                          Special Teardown Offer
                        </div>
                        <div className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-1">
                          {formatPrice(auditOffer.discount_price, auditOffer.discount_price_usd)}
                        </div>
                        <div className="text-xs text-white/40 line-through mb-4">
                          Regular {formatPrice(auditOffer.starting_price, auditOffer.starting_price_usd)}
                        </div>

                        <button
                          onClick={() => setIsBookingOpen(true)}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Book Teardown Now</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <BookingModal
        offer={auditOffer}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={() => {
          setIsBookingOpen(false);
          toast.success("Audit booking confirmed! Check your email and WhatsApp for confirmation.");
        }}
      />
    </div>
  );
};

export default Audit;
