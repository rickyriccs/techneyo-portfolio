import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe, MapPin, MessageCircle, Brain, Palette, Megaphone, Server, Users, ArrowRight, CheckCircle2
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const services = [
  {
    icon: Globe, title: "Website & Landing Page Development",
    desc: "Professional, mobile-friendly websites and landing pages that explain your services clearly and convert visitors into inquiries.",
    features: ["Business Website", "Landing Page", "Service Pages", "Portfolio/Gallery"],
  },
  {
    icon: MapPin, title: "Google Business & Local SEO",
    desc: "Improve local search visibility so nearby customers can find your business on Google and trust your online presence.",
    features: ["Google Business Profile", "Local Keywords", "Review Strategy", "Location SEO"],
  },
  {
    icon: MessageCircle, title: "WhatsApp Inquiry & Follow-up System",
    desc: "Convert website visitors into WhatsApp leads and manage inquiry conversations more professionally.",
    features: ["WhatsApp Button", "Form to WhatsApp", "Auto-reply Flow", "Follow-up Templates"],
  },
  {
    icon: Users, title: "Lead Management CRM",
    desc: "Track inquiries, follow-ups, customer notes, status, source, and conversion in one simple lead management system.",
    features: ["Lead Capture", "Status Tracking", "Follow-up Reminders", "Admin Dashboard"],
  },
  {
    icon: Server, title: "Custom Software & Business Automation",
    desc: "Custom dashboards, booking systems, reports, billing tools, portals, and workflow automation for growing businesses.",
    features: ["Admin Dashboards", "Booking Systems", "Report Systems", "Customer Portals"],
  },
  {
    icon: Megaphone, title: "Digital Marketing & Ad-Ready Setup",
    desc: "Prepare your business for Google, Facebook, Instagram, and WhatsApp campaigns with landing pages and tracking.",
    features: ["Campaign Creatives", "Offer Pages", "Lead Forms", "Tracking Setup"],
  },
  {
    icon: Brain, title: "AI-Powered Business Tools",
    desc: "Use AI for customer support, reports, content, lead qualification, internal automation, and business insights.",
    features: ["AI Chatbot", "AI FAQ Assistant", "AI Reports", "AI Lead Qualification"],
  },
  {
    icon: Palette, title: "Branding & Creative Design",
    desc: "Professional visual identity and marketing creatives that make your business look trustworthy online and offline.",
    features: ["Logo Design", "Social Creatives", "Posters", "Offer Banners"],
  },
];

const Services = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 hero-gradient">
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">Our Services</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">
              Local Business Growth & Automation Solutions
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 text-lg leading-relaxed">
              Websites, Google visibility, WhatsApp inquiry systems, CRM, custom software, marketing setup, and AI tools for practical business growth.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-8"
          >
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                custom={i}
                className="card-elevated p-6 md:p-8 grid md:grid-cols-[auto_1fr_auto] gap-6 items-start"
              >
                <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center shrink-0">
                  <s.icon size={26} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {s.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 size={14} className="text-accent shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="btn-hero text-xs px-5 py-2.5 self-start shrink-0"
                >
                  Request Audit <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 hero-gradient">
        <div className="section-container relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Need a Digital Growth System?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">
              We will review your current presence and suggest a practical setup for more inquiries, better follow-ups, and smoother operations.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all">
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
