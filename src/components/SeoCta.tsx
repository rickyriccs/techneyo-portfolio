import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { businessInfo } from "@/lib/business-info";

interface SeoCtaProps {
  title?: string;
  text?: string;
  className?: string;
}

export const SeoCta: React.FC<SeoCtaProps> = ({
  title = "Need a practical digital setup for your business?",
  text = "Talk to Techneyo Solutions about your website, CRM, automation, SEO, or custom software requirement.",
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`premium-final-cta relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#08152b]/95 via-[#0a1b36]/90 to-[#040a14]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl ${className}`}
  >
    {/* Background Ambient Radial Glow Meshes */}
    <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-[90px]" />
    <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-[90px]" />
    <div className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[70px]" />

    <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          Start Digital Growth
        </div>

        <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300/80">
          {text}
        </p>

        {/* Micro-Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 text-xs font-medium text-slate-300">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
            <Zap className="h-3.5 w-3.5 text-yellow-400" /> &lt; 15 Min Response
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Direct Tech Advisory
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Free Proposal & Offer
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 shrink-0 justify-center">
        <Link
          to="/contact"
          className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40 active:scale-[0.98]"
          data-cta-location="final_cta"
        >
          <span>Discuss Your Requirement</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <a
          href={businessInfo.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3.5 text-sm font-semibold text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-emerald-200 active:scale-[0.98]"
          data-cta-location="final_cta"
        >
          <MessageCircle className="h-4 w-4 text-emerald-400" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  </motion.div>
);

export default SeoCta;
