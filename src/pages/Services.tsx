import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe, MapPin, MessageCircle, Brain, Palette, Megaphone, Server, Users, ArrowRight, CheckCircle2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import PageMeta from "@/components/PageMeta";
import { pageDescriptions } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";
import { servicePages, servicePath } from "@/lib/seo-content";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const iconMap = {
  Globe,
  MapPin,
  MessageCircle,
  Brain,
  Palette,
  Megaphone,
  Server,
  Users,
};

type Service = {
  id?: string;
  icon_name: keyof typeof iconMap;
  title: string;
  description: string;
  features: string[];
};

const fallbackServices: Service[] = [
  {
    icon_name: "Globe",
    title: "Website & Landing Page Development",
    description: "Professional, mobile-friendly websites and landing pages that explain your services clearly and convert visitors into inquiries.",
    features: ["Business Website", "Landing Page", "Service Pages", "Portfolio/Gallery"],
  },
  {
    icon_name: "MapPin",
    title: "Google Business & Local SEO",
    description: "Improve local search visibility so nearby customers can find your business on Google and trust your online presence.",
    features: ["Google Business Profile", "Local Keywords", "Review Strategy", "Location SEO"],
  },
  {
    icon_name: "MessageCircle",
    title: "WhatsApp Inquiry & Follow-up System",
    description: "Convert website visitors into WhatsApp leads and manage inquiry conversations more professionally.",
    features: ["WhatsApp Button", "Form to WhatsApp", "Auto-reply Flow", "Follow-up Templates"],
  },
  {
    icon_name: "Users",
    title: "Lead Management CRM",
    description: "Track inquiries, follow-ups, customer notes, status, source, and conversion in one simple lead management system.",
    features: ["Lead Capture", "Status Tracking", "Follow-up Reminders", "Admin Dashboard"],
  },
  {
    icon_name: "Server",
    title: "Custom Software & Business Automation",
    description: "Custom dashboards, booking systems, reports, billing tools, portals, and workflow automation for growing businesses.",
    features: ["Admin Dashboards", "Booking Systems", "Report Systems", "Customer Portals"],
  },
  {
    icon_name: "Megaphone",
    title: "Digital Marketing & Ad-Ready Setup",
    description: "Prepare your business for Google, Facebook, Instagram, and WhatsApp campaigns with landing pages and tracking.",
    features: ["Campaign Creatives", "Offer Pages", "Lead Forms", "Tracking Setup"],
  },
  {
    icon_name: "Brain",
    title: "AI-Powered Business Tools",
    description: "Use AI for customer support, reports, content, lead qualification, internal automation, and business insights.",
    features: ["AI Chatbot", "AI FAQ Assistant", "AI Reports", "AI Lead Qualification"],
  },
  {
    icon_name: "Palette",
    title: "Branding & Creative Design",
    description: "Professional visual identity and marketing creatives that make your business look trustworthy online and offline.",
    features: ["Logo Design", "Social Creatives", "Posters", "Offer Banners"],
  },
];

const Services = () => {
  const [services, setServices] = useState<Service[]>(fallbackServices);

  useEffect(() => {
    const loadServices = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("services")
        .select("id,title,description,icon_name,features")
        .eq("status", "active")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Failed to load services", error);
        return;
      }

      if (data?.length) {
        setServices(
          data.map((service) => ({
            ...service,
            icon_name: iconMap[service.icon_name as keyof typeof iconMap] ? service.icon_name : "Globe",
          })) as Service[],
        );
      }
    };

    loadServices();
  }, []);

  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta title="Website Development, CRM, SEO & Automation Services | Techneyo Solutions" description={pageDescriptions.services} canonicalPath="/services" schema={organizationSchema} />
      {/* Hero */}
      <section className="premium-hero relative overflow-hidden pb-20 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">Our Services</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="mb-6 font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              Website, CRM, SEO & automation services for businesses across India.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="max-w-2xl text-lg leading-8 text-white/68">
              From starter websites to CRM dashboards, WhatsApp enquiry flows and custom software, Techneyo Solutions helps businesses across India look trusted and capture leads.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-3">
              {["Website from Rs. 999", "Lead capture ready", "Admin controlled", "All India service"].map((item) => (
                <span key={item} className="premium-badge">{item}</span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section pt-0">
        <div className="section-container">
          <div className="mb-10 max-w-3xl">
            <p className="premium-eyebrow">SEO service pages</p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">Explore detailed website, CRM, SEO, and automation services.</h2>
            <p className="mt-4 leading-7 text-white/62">
              Each service page explains who it is for, business problems solved, features, process, benefits, FAQs, and related services.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {servicePages.map((service) => (
              <Link key={service.slug} to={servicePath(service.slug)} className="premium-card premium-card-hover p-5">
                <h3 className="font-display text-xl font-bold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{service.metaDescription}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
                  View service <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="tools" className="premium-section scroll-mt-24">
        <div className="section-container">
          <div className="mb-10 max-w-3xl">
            <p className="premium-eyebrow">Dynamic service stack</p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">Services controlled from Supabase and ready for admin updates.</h2>
          </div>
          <div className="space-y-6">
            {services.map((s, i) => {
              const ServiceIcon = iconMap[s.icon_name] || Globe;

              return (
              <motion.div
                key={s.id || s.title}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.2), duration: 0.25 }}
                className="premium-card premium-card-hover grid items-start gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:p-8"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100">
                  <ServiceIcon size={26} />
                </div>
                <div>
                  <h3 className="mb-2 font-display text-xl font-bold text-white">{s.title}</h3>
                  <p className="mb-4 leading-relaxed text-white/62">{s.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {s.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-white/60">
                        <CheckCircle2 size={14} className="shrink-0 text-emerald-200" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="premium-btn premium-btn-primary shrink-0 self-start px-5 py-2.5 text-xs"
                >
                  Request Audit <ArrowRight size={14} />
                </Link>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="offers" className="premium-section scroll-mt-24">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="premium-final-cta">
            <div>
            <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">Free consultation</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="mb-4 font-display text-3xl font-bold text-white sm:text-5xl">
              Need a Digital Growth System?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="max-w-xl text-lg leading-8 text-white/65">
              We will review your current presence and suggest a practical setup for more inquiries, better follow-ups, and smoother operations.
            </motion.p>
            </div>
            <motion.div variants={fadeUp} custom={3}>
              <Link to="/contact" className="premium-btn premium-btn-primary">
                Request Free Business Audit <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
