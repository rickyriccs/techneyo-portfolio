import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe2,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  Zap,
  Lock,
  MessageCircle,
  PhoneCall,
  Calendar,
  Building2,
  Award,
  ChevronRight,
  Calculator,
} from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";
import { usePersonalization } from "@/context/PersonalizationContext";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Global Clocks Component
const GlobalClocks = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { city: "San Francisco", zone: "America/Los_Angeles", label: "PST", flag: "🇺🇸", overlap: "3-4h Overlap" },
    { city: "New York", zone: "America/New_York", label: "EST", flag: "🇺🇸", overlap: "4-5h Overlap" },
    { city: "London", zone: "Europe/London", label: "GMT", flag: "🇬🇧", overlap: "6-7h Overlap" },
    { city: "Dubai", zone: "Asia/Dubai", label: "GST", flag: "🇦🇪", overlap: "Full Day Overlap" },
    { city: "India HQ", zone: "Asia/Kolkata", label: "IST", flag: "🇮🇳", overlap: "Your Engineering Hub" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cities.map((c) => {
        const timeStr = now.toLocaleTimeString("en-US", {
          timeZone: c.zone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const isHQ = c.label === "IST";

        return (
          <div
            key={c.city}
            className={`rounded-2xl border p-3.5 backdrop-blur-md transition-all ${
              isHQ
                ? "border-cyan-400/50 bg-cyan-500/15 shadow-lg shadow-cyan-500/10"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5 font-medium text-white">
                <span>{c.flag}</span> {c.city}
              </span>
              <span className="font-mono text-[10px] text-cyan-300">{c.label}</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-white font-mono">
              {timeStr}
            </div>
            <div className="mt-1 text-[11px] font-medium text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {c.overlap}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function Global() {
  const { openProposalModal } = usePersonalization();

  // Cost Calculator State
  const [teamSize, setTeamSize] = useState<number>(2);
  const [durationMonths, setDurationMonths] = useState<number>(6);
  const [seniority, setSeniority] = useState<"Mid" | "Senior" | "Lead">("Senior");

  // US/Western benchmark: $130,000/yr salary + 25% benefits = $162,500/yr ($13,540/mo per dev)
  const usCostPerDevMonthly = seniority === "Mid" ? 11000 : seniority === "Senior" ? 14500 : 18000;
  // Techneyo Dedicated Rate: Mid $2,600, Senior $3,400, Lead $4,400
  const techneyoCostPerDevMonthly = seniority === "Mid" ? 2600 : seniority === "Senior" ? 3400 : 4400;

  const totalUsCost = teamSize * usCostPerDevMonthly * durationMonths;
  const totalTechneyoCost = teamSize * techneyoCostPerDevMonthly * durationMonths;
  const savings = totalUsCost - totalTechneyoCost;
  const savingsPercent = Math.round((savings / totalUsCost) * 100);

  return (
    <>
      <PageMeta
        title="Offshore Software & Web Development Partner in India | Techneyo Solutions"
        description="Hire top 1% senior full-stack developers and dedicated tech squads in India. Save 70% compared to US/UK agencies with 4-8 hours daily timezone overlap and 100% IP ownership."
        canonicalPath="/global"
        schema={organizationSchema}
      />

      <div className="relative min-h-screen bg-[#030711] pt-24 pb-20 text-white selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Glow Backgrounds */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[150px]" />

        <div className="section-container relative z-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-20">
          {/* Hero Section */}
          <section className="text-center pt-8 space-y-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md"
            >
              <Globe2 className="h-4 w-4 text-cyan-400" />
              <span>Global Technology Partner • US, UK, UAE & Europe</span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]"
            >
              Silicon Valley Code Quality. <br />
              <span className="text-gradient">70% Cost Advantage.</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Scale your engineering velocity with dedicated senior developers in India. We work directly inside your Slack, Jira, and GitHub repositories with 4–8 hours of daily real-time timezone overlap.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <button
                onClick={() => openProposalModal()}
                className="premium-btn premium-btn-primary flex items-center gap-2 px-8 py-4 text-sm font-bold shadow-xl shadow-cyan-500/25"
              >
                <Sparkles className="h-4 w-4" />
                Get Custom Offshore Proposal
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href="https://wa.me/919988773122?text=Hi%20Techneyo!%20I'm%20looking%20for%20an%20offshore%20engineering%20team%20for%20my%20business.%20Let's%20schedule%20a%20call."
                target="_blank"
                rel="noopener noreferrer"
                className="premium-btn premium-btn-ghost flex items-center gap-2 px-6 py-4 text-sm font-semibold"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                Chat Direct on WhatsApp
              </a>
            </motion.div>

            {/* Live Global Time Zone Clock Card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
              className="pt-8 max-w-4xl mx-auto"
            >
              <div className="rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-300">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span>Real-Time Collaboration Hours</span>
                  </div>
                  <span className="text-xs text-gray-400">Zero Communication Lag • Daily Standups</span>
                </div>
                <GlobalClocks />
              </div>
            </motion.div>
          </section>

          {/* Interactive Cost Savings ROI Calculator */}
          <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-black/50 to-black/80 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 border border-cyan-400/20 mb-2">
                ROI & Cost Calculator
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                How Much Will You Save With Techneyo?
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                Compare local US / UK / European agency and hiring rates against our dedicated engineering model.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-300">Dedicated Engineers:</span>
                    <span className="text-cyan-400 font-bold">{teamSize} {teamSize === 1 ? "Developer" : "Developers"}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-white/10 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                    <span>1 Solo Engineer</span>
                    <span>5 Squad</span>
                    <span>10 Full Team</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-300">Project / Retainer Duration:</span>
                    <span className="text-cyan-400 font-bold">{durationMonths} Months</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-white/10 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                    <span>1 Month Sprint</span>
                    <span>6 Months</span>
                    <span>12 Months (Annual)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Engineer Seniority Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Mid", "Senior", "Lead"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSeniority(lvl)}
                        className={`rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                          seniority === lvl
                            ? "border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/20"
                            : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        {lvl} Level
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Savings Card */}
              <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-black/60 p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10 text-center">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400">US / UK Agency Cost</div>
                    <div className="text-2xl font-bold text-gray-400 line-through mt-1">
                      ${totalUsCost.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-cyan-400">Techneyo Investment</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      ${totalTechneyoCost.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <span className="inline-block rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                    🚀 {savingsPercent}% Projected Cost Savings
                  </span>
                  <div className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                    ${savings.toLocaleString()} USD
                  </div>
                  <p className="text-xs text-gray-400">
                    Capital re-investable directly into your user acquisition, marketing, and runway.
                  </p>
                </div>

                <button
                  onClick={() => openProposalModal()}
                  className="w-full premium-btn premium-btn-primary flex items-center justify-center gap-2 py-3.5 text-sm font-bold shadow-xl shadow-cyan-500/25"
                >
                  <Sparkles className="h-4 w-4" />
                  Lock In This Dedicated Team Rate
                </button>
              </div>
            </div>
          </section>

          {/* Pillars of Trust */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Engineered for High-Trust International Delivery
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                We remove the traditional headaches of offshore outsourcing with modern enterprise safeguards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-white">100% IP & Source Code Ownership</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  You own every line of code, patent, and asset from day one. All contracts backed by international NDAs and clear intellectual property assignment.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-white">7-Day Risk-Free Trial</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Test your dedicated developer or squad for one full week. If you are not 100% thrilled with code quality and velocity, you pay nothing.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-white">Modern Enterprise Stack</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Flutter, and AI LLM integrations. No messy spaghetti code, no dated legacy frameworks.
                </p>
              </div>
            </div>
          </section>

          {/* Fixed-Price Sprints vs Dedicated Monthly Teams */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-block rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 border border-cyan-400/20 mb-2">
                Flexible Engagement Models
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Transparent International Pricing in USD
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Plan 1 */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Launchpad Sprint</div>
                  <h3 className="text-2xl font-bold text-white">High-Converting Web Sprint</h3>
                  <div className="text-3xl font-extrabold text-white">
                    $1,499 <span className="text-xs text-gray-400 font-normal">/ fixed-price</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Ideal for startups and growing businesses needing a world-class landing page, marketing site, or corporate presence built in 14 days.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> Custom React / Next.js architecture</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> Sub-second Core Web Vitals speed</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> Full SEO & Schema markup</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> 14-Day guaranteed turnaround</li>
                  </ul>
                </div>
                <Link to="/solution-finder" className="w-full premium-btn premium-btn-ghost text-xs py-3 text-center">
                  Start Web Sprint
                </Link>
              </div>

              {/* Plan 2: Flagship Dedicated */}
              <div className="rounded-3xl border border-cyan-400 bg-gradient-to-b from-cyan-950/30 to-black p-6 sm:p-8 flex flex-col justify-between space-y-6 relative shadow-2xl ring-1 ring-cyan-400/50">
                <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-cyan-400 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-black shadow-lg">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Dedicated Squad</div>
                  <h3 className="text-2xl font-bold text-white">Full-Time Senior Engineer</h3>
                  <div className="text-3xl font-extrabold text-white">
                    $3,400 <span className="text-xs text-gray-400 font-normal">/ month (160 hrs)</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    A dedicated top 1% engineer working 40 hrs/week exclusively for your company. Integrates directly into your GitHub & team Slack.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> Senior Full-Stack (React, Node, Python, Cloud)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> 4–5 Hours daily US/UK timezone overlap</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> Daily standups & sprint reviews</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> 7-Day risk-free trial included</li>
                  </ul>
                </div>
                <button
                  onClick={() => openProposalModal()}
                  className="w-full premium-btn premium-btn-primary text-xs py-3.5 text-center font-bold shadow-lg shadow-cyan-500/25"
                >
                  Hire Senior Engineer
                </button>
              </div>

              {/* Plan 3 */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Product Engineering</div>
                  <h3 className="text-2xl font-bold text-white">Custom MVP & SaaS Build</h3>
                  <div className="text-3xl font-extrabold text-white">
                    $4,999 - $9,999 <span className="text-xs text-gray-400 font-normal">/ fixed milestone</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    End-to-end product development for web apps, SaaS platforms, and mobile apps (iOS & Android) with auth, database, and payments.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> Full UX prototype & system architecture</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> Database, Auth & Stripe/Payment Gateway</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> Automated CI/CD deployment</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> 30-Day post-launch warranty support</li>
                  </ul>
                </div>
                <Link to="/contact" className="w-full premium-btn premium-btn-ghost text-xs py-3 text-center">
                  Discuss MVP Scope
                </Link>
              </div>
            </div>
          </section>

          {/* Final Global CTA Banner */}
          <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-black p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white max-w-3xl mx-auto">
              Ready to Expand Your Tech Bandwidth?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
              Schedule a 20-minute architecture discovery call. We'll review your project scope and pair you with the ideal senior developer within 48 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => openProposalModal()}
                className="premium-btn premium-btn-primary flex items-center gap-2 px-8 py-4 text-sm font-bold shadow-xl shadow-cyan-500/25"
              >
                <Calendar className="h-4 w-4" /> Schedule Discovery Call
              </button>
              <a
                href="https://wa.me/919988773122?text=Hello%20Techneyo!%20I'm%20interested%20in%20your%20offshore%20tech%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="premium-btn premium-btn-ghost flex items-center gap-2 px-6 py-4 text-sm font-semibold"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp Direct
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
