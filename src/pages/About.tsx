import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  MapPin,
  Target,
  Users,
  Workflow,
  Zap,
  Sparkles,
  MessageCircle,
  PhoneCall,
  Flame,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  Award,
} from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { businessInfo, pageDescriptions } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";
import { usePersonalization } from "@/context/PersonalizationContext";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const strugglePoints = [
  {
    title: "1. The 'Pretty Website' Trap",
    desc: "Paying ₹25,000 to ₹50,000 to agencies who delivered pretty graphics and technical jargon, but ZERO phone calls or customer messages.",
  },
  {
    title: "2. Working 14 Hours & Losing to Competitors",
    desc: "Working hard every day, only to watch local competitors with better Google Map rankings steal nearby customers.",
  },
  {
    title: "3. Confusing Tech Jargon & Slow Delivery",
    desc: "Agencies talking about 'database schemas & API frameworks' instead of focusing on what business owners actually need: Daily Leads.",
  },
];

const breakthroughSteps = [
  {
    step: "Step 1",
    title: "Google Map #1 Dominance",
    desc: "Optimizing local search so nearby buyers searching for your service find your business at the very top.",
  },
  {
    step: "Step 2",
    title: "High-Trust Mobile Website",
    desc: "Clean, ultra-fast website that explains your services clearly so visitors instantly trust your business.",
  },
  {
    step: "Step 3",
    title: "1-Tap WhatsApp Lead Engine",
    desc: "Direct WhatsApp & call buttons that convert website visitors into live enquiries on your phone 24/7.",
  },
];

const stats = [
  { value: "100+", label: "Businesses Transformed" },
  { value: "10,000+", label: "Customer Enquiries Delivered" },
  { value: "48 Hours", label: "Fast Campaign Launch" },
  { value: "98%", label: "Client Satisfaction" },
];

export const About: React.FC = () => {
  const { openProposalModal } = usePersonalization();

  return (
    <div className="public-premium min-h-screen overflow-hidden bg-[#030711] text-white">
      <PageMeta
        title="Our Story | How We Built a Direct Lead System for Business Owners"
        description={pageDescriptions.about}
        canonicalPath="/about"
        schema={organizationSchema}
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              The Story Behind Techneyo Solutions
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl sm:text-6xl font-extrabold leading-tight text-white mb-6"
            >
              We Started Techneyo Because We Were Tired of Seeing Business Owners Get Burned by Useless Web Agencies.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="max-w-3xl text-lg leading-8 text-white/70"
            >
              Fancy digital graphics mean nothing if your phone isn't ringing. Here is our journey of struggle, breakthrough, and how we built a simple lead engine that has helped 100+ business owners get daily enquiries.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => openProposalModal()}
                className="premium-btn premium-btn-primary flex items-center gap-2 text-base px-6 py-3.5"
              >
                <Sparkles size={18} /> Get Custom Proposal <ArrowRight size={18} />
              </button>
              <a
                href={businessInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-btn premium-btn-ghost flex items-center gap-2 text-base px-6 py-3.5"
              >
                <MessageCircle size={18} /> WhatsApp Free Strategy Call
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Act 1: The Struggle Story */}
      <section className="py-16 bg-white/[0.02] border-y border-white/10">
        <div className="section-container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2">
                Act I: The Frustrating Struggle
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
                The Hard Truth About Most Digital Agencies
              </h2>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-[#0b1329]/90 border border-white/10 shadow-2xl space-y-6 text-white/80 leading-relaxed text-base">
              <p>
                Years ago, when we started working with local business owners—clinic doctors, shop owners, restaurant founders, and local service providers—we noticed a shocking pattern:
              </p>
              <blockquote className="p-4 rounded-xl bg-red-500/10 border-l-4 border-red-500 text-white font-medium italic">
                "Business owners were spending lakhs of rupees on web agencies that spoke complicated technical jargon, took 3 months to deliver a site, and left them with a pretty website that generated <strong className="text-red-300">ZERO phone calls and ZERO WhatsApp messages</strong>."
              </blockquote>
              <p>
                Hardworking entrepreneurs were working 14 hours a day, only to watch competitors who simply had a better Google Maps ranking steal their local customers. They felt scammed, frustrated, and convinced that "digital marketing doesn't work for real businesses."
              </p>
            </div>

            {/* 3 Struggle Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              {strugglePoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-white text-base">{pt.title}</h3>
                  <p className="text-xs text-white/70 leading-relaxed">{pt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Act 2: The Turning Point & Breakthrough */}
      <section className="py-16">
        <div className="section-container max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-2">
              Act II: The Breakthrough
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
              We Threw Out the Fluff & Built a Direct Lead System
            </h2>
            <p className="text-base text-white/70 mt-3 max-w-2xl mx-auto">
              We realized business owners don't want pretty digital art projects—they want a predictable customer engine. So we built Techneyo around 3 simple rules:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {breakthroughSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0b1329]/90 border border-cyan-500/30 shadow-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    {step.step}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{step.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* High-Converting Lead Trigger Box */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-cyan-900/40 via-[#0b1329] to-blue-900/40 border border-cyan-500/40 text-center space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                Don't Make the Same Expensive Mistakes
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-bold text-white">
                Stop Wasting Money on Agencies That Don't Bring Phone Calls.
              </h3>
              <p className="text-sm text-white/70 mt-2 max-w-xl mx-auto">
                Talk to our senior solution team today. We'll analyze your current online presence and show you how to get daily customer enquiries.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => openProposalModal()}
                className="premium-btn premium-btn-primary flex items-center gap-2 text-base px-8 py-3.5"
              >
                <Sparkles size={18} /> Get Free Custom AI Proposal <ArrowRight size={18} />
              </button>
              <a
                href={businessInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-btn premium-btn-ghost flex items-center gap-2 text-base px-8 py-3.5"
              >
                <MessageCircle size={18} /> WhatsApp Free Founder Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Act 3: Victory & Transformation Stats */}
      <section className="py-16 bg-white/[0.02] border-t border-white/10">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Act III: The Transformation & Victory
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
              Trusted by 100+ Business Owners Worldwide
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0b1329]/90 border border-white/10 text-center space-y-2">
                <div className="font-display text-3xl font-extrabold text-white">{stat.value}</div>
                <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-cyan-900/30 via-[#0b1329] to-blue-900/30 border-t border-white/10 text-center">
        <div className="section-container max-w-3xl mx-auto space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
            Ready to Build a Real Customer Lead Engine?
          </h2>
          <p className="text-base text-white/70">
            Join 100+ growing businesses that rely on Techneyo Solutions for daily phone calls and WhatsApp orders.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => openProposalModal()}
              className="premium-btn premium-btn-primary flex items-center gap-2 text-base px-8 py-4"
            >
              <Sparkles size={20} /> Build My Custom Business Offer <ArrowRight size={20} />
            </button>
            <a href="tel:+919988773122" className="premium-btn premium-btn-ghost flex items-center gap-2 text-base px-8 py-4">
              <PhoneCall size={18} /> Call +91 99887 73122
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
