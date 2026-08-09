import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Smartphone,
  Share2,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Check,
  BarChart3,
  Clock,
} from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";

interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface ServiceData {
  id: string;
  categoryKey: string;
  title: string;
  tagline: string;
  icon: React.ElementType;
  gradient: string;
  startingPrice: number;
  estimatedDays: string;
  projectedRoi: string;
  techStack: string[];
  deliverables: string[];
  features: string[];
  availableAddons: Addon[];
}

const serviceCatalog: ServiceData[] = [
  {
    id: "website-dev",
    categoryKey: "website",
    title: "Website & Web Application Development",
    tagline: "High-trust, ultra-fast, mobile-first websites designed for maximum lead conversion.",
    icon: Globe,
    gradient: "from-blue-600 to-cyan-500",
    startingPrice: 4999,
    estimatedDays: "5 - 10 Days",
    projectedRoi: "3x - 5x Lead Growth",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Supabase / Node.js", "SEO Metadata"],
    deliverables: [
      "Custom Responsive Design (Mobile & Desktop)",
      "High-Converting Lead Forms & WhatsApp Routing",
      "Admin Dashboard for Offer & Content Management",
      "Complete On-Page SEO & Google Search Setup",
      "Lightning Fast Speed (95+ Lighthouse Score)",
      "1-Year Hosting & Security SSL Support",
    ],
    features: [
      "E-Commerce & Payment Gateway Integration",
      "Booking & Appointment Scheduling Flow",
      "Live Chat & CRM Contact Sync",
      "Interactive Product Catalog / Portfolios",
    ],
    availableAddons: [
      { id: "web-addon-seo", name: "Advanced Local SEO Package", price: 2499, description: "Google Business Profile + Top Keyword Indexing" },
      { id: "web-addon-wa", name: "Automated WhatsApp Bot", price: 1999, description: "Auto-reply, instant lead alert & enquiry management" },
      { id: "web-addon-copy", name: "Professional Sales Copywriting", price: 1499, description: "Persuasive headline & offer copywriting" },
    ],
  },
  {
    id: "mobile-app",
    categoryKey: "mobile_app",
    title: "Mobile App Development (iOS & Android)",
    tagline: "Scalable cross-platform mobile apps with seamless UX, push notifications, and admin APIs.",
    icon: Smartphone,
    gradient: "from-purple-600 to-indigo-500",
    startingPrice: 14999,
    estimatedDays: "14 - 30 Days",
    projectedRoi: "4x User Engagement",
    techStack: ["React Native", "Flutter", "Firebase", "REST / GraphQL", "Push Notifications"],
    deliverables: [
      "Cross-Platform iOS & Android App",
      "Sleek UI/UX Design & Smooth Animations",
      "User Authentication & Account Management",
      "Real-Time Push Notifications & Alerts",
      "Secure Payment Gateway Integration",
      "App Store & Play Store Publishing Assistance",
    ],
    features: [
      "Offline Data Syncing & Cache",
      "In-App Messaging & Support Chat",
      "Role-Based Admin Management API",
      "Location / GPS Tracking Capabilities",
    ],
    availableAddons: [
      { id: "app-addon-store", name: "Store Optimization (ASO)", price: 2999, description: "Rank higher on Apple App Store & Google Play" },
      { id: "app-addon-analytics", name: "Advanced Behavioral Analytics", price: 1999, description: "Track user funnels, clicks & drop-off metrics" },
      { id: "app-addon-maint", name: "3-Month Maintenance & Updates", price: 3999, description: "Dedicated bug fixes & feature enhancements" },
    ],
  },
  {
    id: "social-media",
    categoryKey: "social_media",
    title: "Social Media Management & Branding",
    tagline: "Build a strong brand presence with viral Reels, graphic design, and engaged community growth.",
    icon: Share2,
    gradient: "from-pink-600 to-rose-500",
    startingPrice: 3999,
    estimatedDays: "Ongoing Monthly",
    projectedRoi: "10x Brand Impression",
    techStack: ["Canva Pro", "Adobe Premiere Pro", "CapCut Pro", "Meta Suite", "Analytics Pro"],
    deliverables: [
      "12 to 20 High-Quality HD Posts & Graphic Assets / Month",
      "4 to 8 Trending Short-Form Reels / TikTok Videos",
      "Strategic Copywriting & Target Hashtag Research",
      "Social Profile Bio & Highlight Branding Overhaul",
      "Monthly Engagement & Reach Performance Reports",
      "Comment & Direct Message Community Response Strategy",
    ],
    features: [
      "Custom Brand Style Guide & Color Palette",
      "Content Calendar Approval Workflow",
      "Influencer Outreach & Collaboration Management",
      "Competitor Benchmarking & Trend Analysis",
    ],
    availableAddons: [
      { id: "sm-addon-reels", name: "Extra 4 Custom Video Reels", price: 1999, description: "Professionally edited short video content" },
      { id: "sm-addon-ad-creative", name: "High-Converting Ad Creatives", price: 1499, description: "5 custom graphic/video ad variations" },
    ],
  },
  {
    id: "digital-marketing",
    categoryKey: "paid_ads",
    title: "Paid Ads & Digital Marketing (Google & Meta Ads)",
    tagline: "Data-driven advertising campaigns that generate qualified leads and high-return sales.",
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-600",
    startingPrice: 4999,
    estimatedDays: "Setup in 48 Hours",
    projectedRoi: "400%+ Ad Spend Return (ROAS)",
    techStack: ["Google Ads", "Meta Ads Manager", "GA4 Analytics", "Conversion API", "Landing Page Pixel"],
    deliverables: [
      "Complete Google Search & Meta (Instagram/Facebook) Campaign Setup",
      "Audience Segmentation & Precision Targeting",
      "High-Converting Ad Copy & Creative Visual Assets",
      "Conversion Tracking Pixel & CAPI Server Setup",
      "A/B Split Testing for Lowest Cost Per Lead (CPL)",
      "Weekly Performance Optimization & ROI Reports",
    ],
    features: [
      "Retargeting Funnels for Abandoned Visitors",
      "Negative Keyword & Waste Budget Elimination",
      "Instant WhatsApp Lead Ad Extensions",
      "Lead Quality Verification & Spam Filtering",
    ],
    availableAddons: [
      { id: "ads-addon-landing", name: "High-Converting Landing Page Setup", price: 2999, description: "Dedicated single-page sales funnel page" },
      { id: "ads-addon-crm", name: "Instant Lead Auto-SMS & WhatsApp Sync", price: 1499, description: "Send immediate follow-up when ad lead submits" },
    ],
  },
];

export const ServiceMatrix: React.FC = () => {
  const { openProposalModal, preferences } = usePersonalization();

  const defaultServiceId =
    serviceCatalog.find((s) => s.categoryKey === preferences.primaryGoal)?.id || serviceCatalog[0].id;

  const [activeServiceId, setActiveServiceId] = useState<string>(defaultServiceId);
  const [selectedAddonIds, setSelectedAddonIds] = useState<Record<string, string[]>>({});

  const activeService = serviceCatalog.find((s) => s.id === activeServiceId) || serviceCatalog[0];

  const toggleAddon = (serviceId: string, addonId: string) => {
    setSelectedAddonIds((prev) => {
      const current = prev[serviceId] || [];
      const updated = current.includes(addonId)
        ? current.filter((id) => id !== addonId)
        : [...current, addonId];
      return { ...prev, [serviceId]: updated };
    });
  };

  const currentAddons = selectedAddonIds[activeService.id] || [];
  const selectedAddonsList = activeService.availableAddons.filter((a) =>
    currentAddons.includes(a.id)
  );

  const totalAddonPrice = selectedAddonsList.reduce((sum, a) => sum + a.price, 0);
  const calculatedTotal = activeService.startingPrice + totalAddonPrice;

  const handleClaimProposal = () => {
    openProposalModal({
      serviceTitle: activeService.title,
      startingPrice: activeService.startingPrice,
      totalPrice: calculatedTotal,
      selectedAddons: selectedAddonsList.map((a) => ({ id: a.id, name: a.name, price: a.price })),
      estimatedDays: activeService.estimatedDays,
      projectedRoi: activeService.projectedRoi,
    });
  };

  return (
    <section id="services-matrix" className="py-12 sm:py-16 bg-[#030711] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive IT Service Hub
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            Explore Services & Customize Your Solution
          </h2>
          <p className="mt-3 text-base text-white/70">
            Select a service category below to view detailed deliverables, tech stack, projected ROI, and build your custom package in real-time.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-8 no-scrollbar gap-2 sm:gap-3">
          {serviceCatalog.map((service) => {
            const IconComp = service.icon;
            const isActive = service.id === activeServiceId;
            return (
              <button
                key={service.id}
                onClick={() => setActiveServiceId(service.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25 scale-[1.02]"
                    : "bg-[#0b1329]/70 text-slate-300 border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{service.title.split(" (")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Service Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start rounded-2xl bg-[#0b1329]/90 border border-white/10 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Left Column: Details & Deliverables (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-r ${activeService.gradient} text-white shadow-md`}>
                    <activeService.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Comprehensive Package
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                  {activeService.title}
                </h3>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">
                  {activeService.tagline}
                </p>
              </div>

              {/* Tech Stack Pills */}
              <div>
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider block mb-2">
                  Powered By & Technologies
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeService.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white/5 text-cyan-200 text-xs font-medium border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Key Included Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeService.deliverables.map((item, idx) => (
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

              {/* Key Highlights */}
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                  Core Capabilities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white font-medium">
                  {activeService.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Addon Configurator (5 Cols) */}
            <div className="lg:col-span-5 rounded-xl bg-gradient-to-b from-[#121c3b] via-[#0d1630] to-[#0b1329] border border-white/10 p-5 sm:p-6 space-y-6 shadow-xl relative z-10">
              {/* ROI & Delivery Stats */}
              <div className="grid grid-cols-2 gap-3 pb-4 border-b border-white/10">
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-center">
                  <div className="flex items-center justify-center text-xs text-white/60 gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Est. Turnaround
                  </div>
                  <span className="text-sm font-bold text-white">{activeService.estimatedDays}</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-center">
                  <div className="flex items-center justify-center text-xs text-white/60 gap-1 mb-1">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Target ROI
                  </div>
                  <span className="text-sm font-bold text-emerald-400">
                    {activeService.projectedRoi}
                  </span>
                </div>
              </div>

              {/* Optional Addon Toggles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Recommended Add-ons
                  </span>
                  <span className="text-[11px] text-white/50">Click to toggle</span>
                </div>
                <div className="space-y-2">
                  {activeService.availableAddons.map((addon) => {
                    const isSelected = currentAddons.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(activeService.id, addon.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-cyan-500/15 border-cyan-400 text-white"
                            : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected ? "bg-cyan-500 border-cyan-400 text-white" : "border-white/30"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{addon.name}</span>
                            <span className="text-[11px] text-white/60">{addon.description}</span>
                          </div>
                        </div>
                        <span className="font-bold text-cyan-300 shrink-0">+₹{addon.price.toLocaleString("en-IN")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calculated Price Summary */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-white/60 font-medium">Calculated Package Investment</span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Free Consultation Included
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                      ₹{calculatedTotal.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-white/50 font-normal">Starting</span>
                  </div>
                  {totalAddonPrice > 0 && (
                    <span className="text-xs text-cyan-300 font-semibold">
                      (Base ₹{activeService.startingPrice.toLocaleString("en-IN")} + ₹{totalAddonPrice.toLocaleString("en-IN")} Add-ons)
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleClaimProposal}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 hover:brightness-110 transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" />
                Claim This Offer & Get AI Proposal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ServiceMatrix;
