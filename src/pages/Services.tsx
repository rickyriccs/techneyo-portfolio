import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe, MapPin, MessageCircle, Star, Sparkles, ArrowRight, CheckCircle2, PhoneCall, ShieldCheck, Zap, HelpCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import PageMeta from "@/components/PageMeta";
import { businessInfo, pageDescriptions } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";
import ServiceMatrix from "@/components/interactive/ServiceMatrix";
import { usePersonalization } from "@/context/PersonalizationContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const businessOutcomes = [
  {
    icon: Globe,
    title: "1. Professional Business Website",
    desc: "A clean, modern website that works perfectly on phones and computers, showing your products, services, and contact details to every visitor.",
  },
  {
    icon: MapPin,
    title: "2. Rank #1 on Google Maps",
    desc: "Help nearby local customers find your business when they search on Google Maps and Google Search for your services.",
  },
  {
    icon: MessageCircle,
    title: "3. Direct WhatsApp & Call Enquiries",
    desc: "Turn website visitors into instant customer conversations. Visitors can message your WhatsApp or call you with one simple tap.",
  },
  {
    icon: Star,
    title: "4. Social Media & Video Branding",
    desc: "High-quality short video Reels and graphic posts for Instagram & Facebook that make your business look trusted and popular.",
  },
];

const faqs = [
  {
    q: "Do I need any technical knowledge to manage my website?",
    a: "Not at all! We set up everything for you. You get a simple panel where you can change text, upload photos, or add new offers in just a few clicks from your phone.",
  },
  {
    q: "How fast will my website or service be live?",
    a: "Most business websites are ready in 5 to 7 days. If you choose our VIP Express Delivery, we fast-track your launch in just 3 days.",
  },
  {
    q: "Will my website show up when customers search on Google?",
    a: "Yes! Every website we build includes Google Search indexing, local map setup, and basic SEO so local customers can easily find you.",
  },
  {
    q: "Can I receive customer enquiries directly on my WhatsApp?",
    a: "Yes! We build direct 1-tap WhatsApp buttons and auto-reply bots so every customer enquiry lands straight in your WhatsApp inbox.",
  },
];

const Services = () => {
  const { openProposalModal } = usePersonalization();

  return (
    <div className="public-premium min-h-screen overflow-hidden bg-[#030711] text-white">
      <PageMeta
        title="Services | High-Converting Websites, Mobile Apps & Digital Marketing"
        description={pageDescriptions.services}
        keywords="website development Bharat, mobile app development, social media marketing, local SEO Google Maps, WhatsApp business automation"
        canonicalPath="/services"
        schema={organizationSchema}
      />

      {/* Hero Section */}
      <section className="premium-hero relative overflow-hidden pb-16 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Simple & Clear Business Services
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="mb-6 font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              Services Designed to Bring You More Customers & Sales.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="max-w-2xl text-lg leading-8 text-white/70">
              No technical confusion. We build fast websites, mobile apps, viral social media Reels, and Google ads that turn online visitors into paying clients.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => openProposalModal()}
                className="premium-btn premium-btn-primary flex items-center gap-2"
              >
                <Sparkles size={18} /> Get Custom AI Proposal & Pricing <ArrowRight size={18} />
              </button>
              <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="premium-btn premium-btn-ghost flex items-center gap-2">
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Service Matrix Hub */}
      <ServiceMatrix />

      {/* Business Outcomes Section */}
      <section className="py-16 bg-white/[0.02] border-y border-white/10">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-2">How We Help Your Business Grow</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">4 Simple Steps to Get More Customers Online</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {businessOutcomes.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-[#0b1329]/90 border border-white/10 shadow-xl space-y-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-300 w-fit">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Non-Technical FAQs */}
      <section className="py-16">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">Clear Answers for Business Owners</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#0b1329]/80 border border-white/10 shadow-md">
                <h4 className="font-display text-base font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-sm text-white/70 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-cyan-900/30 via-[#0b1329] to-blue-900/30 border-t border-white/10">
        <div className="section-container text-center max-w-3xl mx-auto space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
            Ready to Stand Out & Get More Enquiries?
          </h2>
          <p className="text-base text-white/70">
            Tell us your business goal and we’ll prepare a custom proposal with zero technical jargon.
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

export default Services;
