import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Activity,
  Layers,
  ShoppingCart,
  Building2,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BadgePill } from "@/components/ui/BadgePill";
import { GlassCard } from "@/components/ui/GlassCard";

type IndustryKey = "saas" | "ecommerce" | "healthcare" | "proptech";

interface IndustryData {
  id: IndustryKey;
  label: string;
  icon: React.ElementType;
  url: string;
  headline: string;
  metricLabel: string;
  metricValue: string;
  metricChange: string;
}

const industries: IndustryData[] = [
  {
    id: "saas",
    label: "B2B SaaS & AI",
    icon: Cpu,
    url: "https://preview.techneyo.com/saas-console",
    headline: "Autonomous Pipeline & Revenue Engine",
    metricLabel: "Monthly Recurring Revenue (MRR)",
    metricValue: "$124,850",
    metricChange: "+42.8% MoM",
  },
  {
    id: "ecommerce",
    label: "High-Speed D2C",
    icon: ShoppingCart,
    url: "https://preview.techneyo.com/headless-store",
    headline: "Sub-Second Headless Commerce",
    metricLabel: "Cart-to-Checkout Conversion",
    metricValue: "4.82%",
    metricChange: "+138% vs Shopify default",
  },
  {
    id: "healthcare",
    label: "HealthTech / HIPAA",
    icon: Activity,
    url: "https://preview.techneyo.com/patient-triage",
    headline: "Zero-Knowledge Encrypted Intake",
    metricLabel: "Patient Check-in Latency",
    metricValue: "42 sec",
    metricChange: "-65% Admin overhead",
  },
  {
    id: "proptech",
    label: "PropTech & Real Estate",
    icon: Building2,
    url: "https://preview.techneyo.com/proptech-matrix",
    headline: "Automated Valuation & Buyer Funnel",
    metricLabel: "Qualified Investor Inquiries",
    metricValue: "1,420+",
    metricChange: "94% WhatsApp conversion",
  },
];

export const HeroShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IndustryKey>("saas");
  const [isCopied, setIsCopied] = useState(false);
  const currentIndustry = industries.find((i) => i.id === activeTab) || industries[0];

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentIndustry.url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative w-full">
      {/* Silicon Valley Standard Browser Window */}
      <GlassCard
        className="overflow-hidden border border-white/[0.12] bg-[#06122B]/90 shadow-[0_20px_60px_-15px_rgba(1,27,82,0.8)]"
        glowColor="cyan"
      >
        {/* Browser Top Chrome / Nav Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#020817]/80 px-4 py-3">
          {/* macOS Window Controls */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>

          {/* Interactive URL Bar */}
          <div
            onClick={handleCopyUrl}
            title="Click to copy demo URL"
            className="flex max-w-[340px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs font-mono text-slate-300 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <Lock size={11} className="text-emerald-400" />
            <span className="truncate">{currentIndustry.url}</span>
            {isCopied && <span className="text-[10px] text-cyan-300 font-bold ml-1">Copied!</span>}
          </div>

          {/* 100/100 Core Web Vitals Micro-Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-[11px] font-mono font-bold text-cyan-300">
            <Zap size={12} className="text-[#00A0E0]" />
            <span>100/100 SPEED</span>
          </div>
        </div>

        {/* Industry Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-white/[0.06] bg-[#030B1E]/60 p-2 sm:p-3">
          {industries.map((industry) => {
            const Icon = industry.icon;
            const isActive = activeTab === industry.id;
            return (
              <button
                key={industry.id}
                onClick={() => setActiveTab(industry.id)}
                className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndustryIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,160,224,0.25)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon
                    size={14}
                    className={isActive ? "text-[#00A0E0]" : "text-slate-400"}
                  />
                  <span>{industry.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Viewport Canvas */}
        <div className="p-4 sm:p-6 min-h-[340px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Header & Main Metric */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FE6F17] animate-pulse" />
                    <span className="text-xs uppercase tracking-wider text-orange-300 font-bold">
                      Live Interface Engine
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                    {currentIndustry.headline}
                  </h3>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#020817]/60 p-3 sm:text-right">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                    {currentIndustry.metricLabel}
                  </p>
                  <div className="flex items-baseline sm:justify-end gap-2 mt-0.5">
                    <span className="font-mono text-2xl font-bold text-white">
                      {currentIndustry.metricValue}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      {currentIndustry.metricChange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-Demo Interactive Preview Based on Industry */}
              {activeTab === "saas" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5">
                    <p className="text-xs text-slate-400">API Response Time</p>
                    <p className="font-mono text-lg font-bold text-cyan-300 mt-1">18ms Global</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Edge routed across 280+ cities</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#020817]/50 p-3.5">
                    <p className="text-xs text-slate-400">Database Read/Write</p>
                    <p className="font-mono text-lg font-bold text-white mt-1">4.2k ops/sec</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Multi-tenant PostgreSQL + Redis</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#020817]/50 p-3.5">
                    <p className="text-xs text-slate-400">Autonomous AI Triage</p>
                    <p className="font-mono text-lg font-bold text-emerald-400 mt-1">99.4% Precision</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Background agent workers</p>
                  </div>
                </div>
              )}

              {activeTab === "ecommerce" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-orange-500/20 bg-orange-950/20 p-3.5">
                    <p className="text-xs text-slate-400">Checkout Render Time</p>
                    <p className="font-mono text-lg font-bold text-orange-300 mt-1">0.32 seconds</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Zero bundle bloating</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#020817]/50 p-3.5">
                    <p className="text-xs text-slate-400">Payment Gateway</p>
                    <p className="font-mono text-lg font-bold text-white mt-1">Stripe + Razorpay</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Dual-currency multi-region</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#020817]/50 p-3.5">
                    <p className="text-xs text-slate-400">Instant Cart Retention</p>
                    <p className="font-mono text-lg font-bold text-emerald-400 mt-1">+28% Recovered</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Automated WhatsApp recovery</p>
                  </div>
                </div>
              )}

              {activeTab === "healthcare" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5">
                    <p className="text-xs text-slate-400">HIPAA & SOC-2 Layer</p>
                    <p className="font-mono text-lg font-bold text-cyan-300 mt-1">AES-256 GCM</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">End-to-end encrypted storage</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#020817]/50 p-3.5">
                    <p className="text-xs text-slate-400">Patient Telehealth Triage</p>
                    <p className="font-mono text-lg font-bold text-white mt-1">1-Click Booking</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Integrated Google Meet & SMS</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#020817]/50 p-3.5">
                    <p className="text-xs text-slate-400">Uptime SLA</p>
                    <p className="font-mono text-lg font-bold text-emerald-400 mt-1">99.99% Guaranteed</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Multi-zone high availability</p>
                  </div>
                </div>
              )}

              {activeTab === "proptech" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5">
                    <p className="text-xs text-slate-400">Lead Qualification Speed</p>
                    <p className="font-mono text-lg font-bold text-cyan-300 mt-1">&lt; 30 Seconds</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Interactive quiz & CRM routing</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#020817]/50 p-3.5">
                    <p className="text-xs text-slate-400">Interactive Floorplans</p>
                    <p className="font-mono text-lg font-bold text-white mt-1">60 FPS WebGL</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Smooth mobile pinch & zoom</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#020817]/50 p-3.5">
                    <p className="text-xs text-slate-400">Buyer Conversion</p>
                    <p className="font-mono text-lg font-bold text-emerald-400 mt-1">3.4x Industry Avg</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Direct WhatsApp agent link</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Live Bar inside Mock Browser */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 size={13} />
                <span>Production Verified</span>
              </span>
              <span>•</span>
              <span className="font-mono text-slate-300">LCP: 0.68s</span>
              <span>•</span>
              <span className="font-mono text-slate-300">CLS: 0.00</span>
            </div>

            <Link
              to="/solution-finder"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-300 hover:text-white transition-colors"
            >
              <span>Test Your Industry Need in 60s</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default HeroShowcase;
