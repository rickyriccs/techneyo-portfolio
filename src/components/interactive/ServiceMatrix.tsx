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
  ShieldCheck,
  Star,
  MessageSquare,
  Calendar,
  ShoppingBag,
  Video,
  Rocket,
} from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";

interface IndustryAddon {
  id: string;
  name: string;
  price: number;
  category: "Local Dominance" | "Automation" | "Industry Features" | "Marketing & Media" | "VIP Delivery";
  description: string;
  icon: React.ElementType;
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
  trustGuarantees: string[];
  deliverables: string[];
  features: string[];
  availableAddons: IndustryAddon[];
}

const serviceCatalog: ServiceData[] = [
  {
    id: "website-dev",
    categoryKey: "website",
    title: "High-Converting Business Website",
    tagline: "Ultra-fast, mobile-first website designed to explain your services clearly and generate daily customer leads.",
    icon: Globe,
    gradient: "from-blue-600 to-cyan-500",
    startingPrice: 4999,
    estimatedDays: "5 - 7 Days",
    projectedRoi: "3x - 5x More Enquiries",
    trustGuarantees: ["100% Mobile Ready", "Ultra-Fast Load", "Google Search Ready", "1-Year Free Hosting", "SSL Security"],
    deliverables: [
      "Custom Design Tailored to Your Industry (Mobile & Desktop)",
      "Instant WhatsApp & One-Tap Direct Call Buttons",
      "Easy Content & Offer Manager (Update Text & Photos Anytime)",
      "Google Search Indexing & On-Page SEO Setup",
      "Customer Contact & Lead Capture Forms",
      "Free Domain, SSL Certificate & 1-Year Hosting Support",
    ],
    features: [
      "Product & Service Photo Showcase Gallery",
      "Customer Testimonial & Social Proof Section",
      "Google Maps Location & Directions Integration",
      "Instant Enquiry Notification Setup",
    ],
    availableAddons: [
      { id: "web-addon-seo", name: "Google Map #1 Ranking & Local Dominance", price: 2999, category: "Local Dominance", description: "Rank top on Google Maps when nearby customers search for your business", icon: Star },
      { id: "web-addon-wa", name: "Instant WhatsApp Auto-Reply Lead Bot", price: 2499, category: "Automation", description: "Greet customers instantly 24/7 & collect contact details automatically", icon: MessageSquare },
      { id: "web-addon-booking", name: "Clinic / Service Appointment Booking Engine", price: 3499, category: "Industry Features", description: "Allow clients to view available slots and book appointments directly online", icon: Calendar },
      { id: "web-addon-store", name: "E-Commerce Online Store & UPI Payment Setup", price: 4999, category: "Industry Features", description: "List products and accept instant payments via GooglePay, PhonePe & Cards", icon: ShoppingBag },
      { id: "web-addon-express", name: "VIP Express 3-Day Rush Launch Guarantee", price: 3999, category: "VIP Delivery", description: "Priority technical execution for urgent business launches", icon: Rocket },
    ],
  },
  {
    id: "mobile-app",
    categoryKey: "mobile_app",
    title: "Custom iOS & Android Mobile App",
    tagline: "Professional mobile app for your business that keeps customers engaged with instant push notifications.",
    icon: Smartphone,
    gradient: "from-purple-600 to-indigo-500",
    startingPrice: 14999,
    estimatedDays: "14 - 21 Days",
    projectedRoi: "4x Repeat Customers",
    trustGuarantees: ["Works on Apple & Android", "Push Notifications", "Fast Performance", "App Store Ready"],
    deliverables: [
      "Custom Mobile App for iOS (iPhone) & Android Devices",
      "Modern, Intuitive Design Simple for Non-Technical Users",
      "Customer Account Signup & Profile Management",
      "Unlimited Push Notifications Sent Directly to Phones",
      "Secure Online Payment & Wallet Integration",
      "Publishing Assistance on Google Play Store & Apple App Store",
    ],
    features: [
      "Offline Mode for Browsing Without Internet",
      "In-App Customer Support & Direct Chat",
      "Order / Appointment Status Tracker",
      "Exclusive Loyalty Points & Discount Coupon Engine",
    ],
    availableAddons: [
      { id: "app-addon-wa", name: "Instant WhatsApp SMS Sync", price: 2499, category: "Automation", description: "Send automatic WhatsApp notifications whenever a customer places an order", icon: MessageSquare },
      { id: "app-addon-booking", name: "Advanced Booking Calendar & Staff Allocator", price: 3999, category: "Industry Features", description: "Manage doctor, stylist, or service staff schedules inside the app", icon: Calendar },
      { id: "app-addon-store", name: "Multi-Category Product Catalog & Payment Gateway", price: 4999, category: "Industry Features", description: "Full digital store setup with instant payment settlements", icon: ShoppingBag },
      { id: "app-addon-maint", name: "3-Month VIP Maintenance & Updates Support", price: 3999, category: "VIP Delivery", description: "Dedicated technical updates and feature enhancements", icon: ShieldCheck },
    ],
  },
  {
    id: "social-media",
    categoryKey: "social_media",
    title: "Social Media Branding & Video Reels",
    tagline: "Build a strong, trustworthy brand with viral video Reels and professionally designed social posts.",
    icon: Share2,
    gradient: "from-pink-600 to-rose-500",
    startingPrice: 3999,
    estimatedDays: "Ongoing Monthly",
    projectedRoi: "10x Brand Visibility",
    trustGuarantees: ["HD Graphic Design", "Viral Short Videos", "High-Converting Copy", "Monthly Growth Reports"],
    deliverables: [
      "12 to 20 Professionally Designed HD Social Media Posts / Month",
      "4 to 8 Trending Short-Form Video Reels for Instagram & Facebook",
      "Persuasive Caption Writing & Targeted Local Hashtags",
      "Complete Social Profile Bio & Highlight Cover Makeover",
      "Monthly Audience Growth & Engagement Reports",
      "Strategic Content Calendar Pre-Approved by You",
    ],
    features: [
      "Custom Brand Logo & Color Palette Styling",
      "Festival & Special Offer Creative Banners",
      "Competitor Analysis & Local Trend Optimization",
      "Direct Message Customer Response Strategy",
    ],
    availableAddons: [
      { id: "sm-addon-reels", name: "4x Extra HD Video Reels (Instagram & Meta)", price: 2999, category: "Marketing & Media", description: "High-impact video reels featuring your products, services, or clinic", icon: Video },
      { id: "sm-addon-ad-creative", name: "5x High-Converting Paid Ad Creatives", price: 1999, category: "Marketing & Media", description: "Custom graphic and video ads tested to get maximum customer clicks", icon: TrendingUp },
      { id: "sm-addon-seo", name: "Google Business 5-Star Review Booster", price: 2999, category: "Local Dominance", description: "Strategy & QR code setup to get more positive 5-star customer reviews", icon: Star },
    ],
  },
  {
    id: "digital-marketing",
    categoryKey: "paid_ads",
    title: "Google & Meta Ads (Get Leads in 48 Hours)",
    tagline: "Data-driven advertising campaigns that bring direct phone calls and WhatsApp enquiries from ready buyers.",
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-600",
    startingPrice: 4999,
    estimatedDays: "Live in 48 Hours",
    projectedRoi: "4x-8x Return on Ad Spend",
    trustGuarantees: ["Ready Buyers Only", "Zero Wasted Spend", "Direct WhatsApp Leads", "Weekly Reports"],
    deliverables: [
      "Complete Google Search & Meta (Instagram/Facebook) Ad Campaign Setup",
      "Laser-Targeted Audience Selection (Nearby Customers Searching for Your Service)",
      "High-Converting Ad Headlines, Graphics & Offer Copies",
      "Direct WhatsApp Lead Ads (Customers message you directly with 1 click)",
      "Negative Keyword Protection to Stop Unwanted Clicks",
      "Weekly Performance Optimization for Lowest Lead Cost",
    ],
    features: [
      "Retargeting Ads for People Who Showed Interest",
      "Call-Only Campaign Setup for Direct Phone Inquiries",
      "Lead Quality Filtering to Block Spam",
      "Daily Ad Budget Control & Expense Tracking",
    ],
    availableAddons: [
      { id: "ads-addon-landing", name: "High-Converting Single-Page Sales Funnel", price: 2999, category: "Industry Features", description: "Dedicated fast-loading offer page engineered specifically for ad leads", icon: Globe },
      { id: "ads-addon-wa", name: "Instant Auto-SMS & WhatsApp Lead Alerts", price: 2499, category: "Automation", description: "Get instant WhatsApp alerts on your phone the second an ad lead submits", icon: MessageSquare },
      { id: "ads-addon-reels", name: "3x High-Impact Video Ad Creatives", price: 2999, category: "Marketing & Media", description: "Short video ads engineered for maximum customer attention and clicks", icon: Video },
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
            Simple Business Growth Packages
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            Explore Services & Customize Your Business Offer
          </h2>
          <p className="mt-3 text-base text-white/70">
            Select a service below to view what’s included, choose optional upgrades tailored for your industry, and get your custom proposal instantly.
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
                    Complete Service Package
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                  {activeService.title}
                </h3>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">
                  {activeService.tagline}
                </p>
              </div>

              {/* Guarantees Badges */}
              <div>
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider block mb-2">
                  Guaranteed Standards Included
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeService.trustGuarantees.map((guarantee, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white/5 text-cyan-200 text-xs font-medium border border-white/10 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-cyan-400" />
                      {guarantee}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> What You Get (Included Items)
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
                  Built-in Business Growth Features
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
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Delivery Time
                  </div>
                  <span className="text-sm font-bold text-white">{activeService.estimatedDays}</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-center">
                  <div className="flex items-center justify-center text-xs text-white/60 gap-1 mb-1">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Expected Result
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
                    Recommended High-Value Upgrades
                  </span>
                  <span className="text-[11px] text-white/50">Click to select</span>
                </div>
                <div className="space-y-2">
                  {activeService.availableAddons.map((addon) => {
                    const isSelected = currentAddons.includes(addon.id);
                    const AddonIcon = addon.icon;
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(activeService.id, addon.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
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
                            <span className="text-[11px] text-white/60 block mt-0.5">{addon.description}</span>
                          </div>
                        </div>
                        <span className="font-bold text-cyan-300 shrink-0 text-xs">+₹{addon.price.toLocaleString("en-IN")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calculated Price Summary */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-white/60 font-medium">Total Package Estimate</span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Free Strategy Call Included
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                      ₹{calculatedTotal.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-white/50 font-normal">One-time</span>
                  </div>
                  {totalAddonPrice > 0 && (
                    <span className="text-xs text-cyan-300 font-semibold">
                      (Base ₹{activeService.startingPrice.toLocaleString("en-IN")} + ₹{totalAddonPrice.toLocaleString("en-IN")} Upgrades)
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
                Claim This Offer & Get Custom Proposal
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
