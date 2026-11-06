import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Cpu,
  Zap,
  Globe2,
  ShieldCheck,
  Check,
  Play,
  ArrowRight,
  Sparkles,
  Clock,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { BadgePill } from "@/components/ui/BadgePill";

export const BentoGridServices: React.FC = () => {
  // Terminal state for Tile 1
  const [terminalOutput, setTerminalOutput] = useState<string>("Ready to test deploy");
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Timezone clocks state for Tile 4
  const [activeTz, setActiveTz] = useState<"SF" | "NYC" | "TOR" | "IST">("NYC");

  const runTestDeploy = () => {
    setIsDeploying(true);
    setTerminalOutput("Compiling Edge bundle...");
    setTimeout(() => {
      setTerminalOutput("Deployed to 280+ edge nodes in 340ms (100% Cache HIT)");
      setIsDeploying(false);
    }, 900);
  };

  return (
    <section className="relative py-16 sm:py-24">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#00A0E0]/15 to-[#FE6F17]/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Intro */}
        <div className="mx-auto mb-14 max-w-3xl text-center space-y-4">
          <BadgePill variant="cyan" pulsing>
            Silicon Valley Architectural Stack
          </BadgePill>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Engineered for Companies That Refuse to Settle
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Every layer of our infrastructure is benchmarked against the world's most demanding engineering studios. High performance is our baseline, not an add-on.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Tile 1: Full-Stack Engineering & Cloud Architecture (Large 2x2 or 2 col span) */}
          <GlassCard
            className="md:col-span-2 lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between"
            glowColor="cyan"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2.5 text-[#00A0E0]">
                    <Code2 size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                    Core Full-Stack Infrastructure
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">Next.js • React 18 • TypeScript</span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-white">
                Ultra-Low Latency Web Platforms & Enterprise Applications
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-xl">
                We design and engineer bespoke web software that loads in sub-second times, converts visitors into paying customers, and effortlessly scales from hundreds to millions of users.
              </p>

              {/* Interactive Code Terminal Preview */}
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#020817] p-4 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-cyan-400" />
                    <span>techneyo-edge-deploy.sh</span>
                  </div>
                  <button
                    onClick={runTestDeploy}
                    disabled={isDeploying}
                    className="flex items-center gap-1.5 rounded bg-cyan-500/20 border border-cyan-400/40 px-2.5 py-1 text-[11px] font-bold text-cyan-200 hover:bg-cyan-500/30 transition-colors"
                  >
                    <Play size={10} />
                    <span>{isDeploying ? "Deploying..." : "Simulate Deploy"}</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="text-slate-500">
                    $ <span className="text-slate-300">curl -I https://api.techneyo.com/v1/health</span>
                  </div>
                  <div className="text-emerald-400 font-semibold">
                    HTTP/2 200 OK • x-edge-latency: 14ms • server: Techneyo-Global-Mesh
                  </div>
                  <div className="text-cyan-300 pt-1 font-semibold flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>status: {terminalOutput}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-slate-400">TypeScript • PostgreSQL • Redis • Cloudflare</span>
              <Link
                to="/services"
                className="inline-flex items-center gap-1 font-semibold text-cyan-300 hover:text-white transition-colors"
              >
                <span>Explore Full Stack</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </GlassCard>

          {/* Tile 2: 100/100 Core Web Vitals & Speedometer (1x1) */}
          <GlassCard className="p-6 flex flex-col justify-between" glowColor="cyan">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2.5 text-[#00A0E0]">
                  <Zap size={20} />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                  Speed Budget
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-bold text-white">
                100/100 Core Web Vitals
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Zero bloated themes or clunky plugins. Every asset is optimized for Google's strictest ranking algorithms.
              </p>

              {/* Speed Meter Graphic */}
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-cyan-500/20 bg-[#020817]/70 p-4">
                <div className="font-mono text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  100
                </div>
                <p className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold mt-1">
                  Google PageSpeed Score
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 w-full text-center text-[10px] font-mono border-t border-white/[0.06] pt-2 text-slate-400">
                  <div>LCP: &lt; 0.7s</div>
                  <div>CLS: 0.00</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-slate-400 flex justify-between items-center">
              <span>Google Rank Guaranteed</span>
              <span className="text-emerald-400 font-bold">Top 1% Global</span>
            </div>
          </GlassCard>

          {/* Tile 3: AI Automation & Autonomous Agents (Wide 2x1) */}
          <GlassCard className="md:col-span-2 p-6 sm:p-8 flex flex-col justify-between" glowColor="orange">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl border border-orange-500/30 bg-[#FE6F17]/10 p-2.5 text-[#FE6F17]">
                  <Cpu size={20} />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-orange-300 uppercase">
                  Autonomous AI Workflows
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-white">
                Turn Manual Overhead into Autonomous 24/7 AI Pipelines
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-xl">
                We integrate custom LLM agents, automated WhatsApp enquiry triage, CRM enrichment, and smart document parsing directly into your operational workflow.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/[0.08] bg-[#020817]/60 p-3.5">
                  <p className="text-xs font-semibold text-white">Instant Lead Triage</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Automated scoring, enrichment & WhatsApp push in 3 seconds.
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#020817]/60 p-3.5">
                  <p className="text-xs font-semibold text-white">Smart Invoice Dispatch</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Multi-currency Razorpay & Stripe 1-click checkout creation.
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#020817]/60 p-3.5">
                  <p className="text-xs font-semibold text-white">Multi-Agent Handshakes</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Sync Zendesk, Slack, HubSpot, and MySQL seamlessly.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-slate-400">Cut 20+ hours of weekly repetitive tasks</span>
              <Link
                to="/solution-finder"
                className="inline-flex items-center gap-1 font-semibold text-orange-300 hover:text-white transition-colors"
              >
                <span>Find Your Automation Fit</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </GlassCard>

          {/* Tile 4: Global Timezone Synchronizer (1x1) */}
          <GlassCard className="p-6 flex flex-col justify-between" glowColor="cyan">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2.5 text-[#00A0E0]">
                  <Clock size={20} />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                  Timezone Overlap
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-bold text-white">
                5+ Hours Daily Overlap
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Full working hours synchronization with North American business mornings.
              </p>

              {/* Timezone Toggles */}
              <div className="mt-5 space-y-2">
                {[
                  { id: "NYC", city: "New York (EST)", hours: "9:00 AM - 2:00 PM Overlap" },
                  { id: "TOR", city: "Toronto (EST)", hours: "9:00 AM - 2:00 PM Overlap" },
                  { id: "SF", city: "San Francisco (PST)", hours: "8:00 AM - 12:00 PM Overlap" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#020817]/60 px-3 py-2 text-xs"
                  >
                    <span className="text-slate-300 font-medium">{item.city}</span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-slate-400 flex justify-between items-center">
              <span>Zero communication lags</span>
              <span className="text-cyan-300 font-semibold">Daily Standups</span>
            </div>
          </GlassCard>

          {/* Tile 5: Enterprise Security & Compliance (1x1 or 2x1) */}
          <GlassCard className="md:col-span-2 lg:col-span-3 p-6 sm:p-8" glowColor="navy">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                  <ShieldCheck size={16} />
                  <span>North American Enterprise Compliance Standard</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  100% Day-One IP Ownership, Strict NDA & Institutional Security
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  All work is performed under binding Delaware or Canadian contract frameworks. Your proprietary codebase, secrets, and business logic remain strictly your intellectual property from day one.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs text-slate-200">
                  🔒 AES-256 Cloud Encryption
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs text-slate-200">
                  📜 Delaware/Ontario NDA
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs text-slate-200">
                  ⚡ 14-Day Risk-Free Trial
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default BentoGridServices;
