import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Brain,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  GraduationCap,
  HeartPulse,
  Home,
  LineChart,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Search,
  ServerCog,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Target,
  Utensils,
  Users,
  Workflow,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const auditItems = [
  "Google Business Profile review",
  "Website and landing page review",
  "WhatsApp inquiry flow review",
  "Competitor visibility check",
  "Local SEO suggestions",
  "Lead capture improvements",
];

const problems = [
  "Customers cannot find your business on Google",
  "You receive inquiries but do not track follow-ups",
  "Your website looks outdated or does not generate leads",
  "WhatsApp conversations are unmanaged",
  "You depend only on referrals and offline marketing",
  "Competitors look more professional online",
  "You need a system for leads, bookings, or reports",
  "You want to use AI but do not know where to start",
];

const services = [
  {
    icon: BriefcaseBusiness,
    title: "Website & Landing Page Development",
    desc: "Professional, mobile-friendly websites and landing pages designed to build trust, explain your services clearly, and convert visitors into inquiries.",
    features: ["Business website", "Landing page", "Service pages", "Portfolio/gallery", "Contact and WhatsApp buttons", "Fast mobile experience"],
  },
  {
    icon: MapPin,
    title: "Google Business & Local SEO",
    desc: "Improve your local search visibility so nearby customers can find your business on Google.",
    features: ["Google Business Profile optimization", "Local keywords", "Reviews strategy", "Photos and updates", "Location-based SEO", "Search visibility improvement"],
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Inquiry & Follow-up System",
    desc: "Convert visitors into WhatsApp leads and manage inquiries more professionally.",
    features: ["WhatsApp click button", "Inquiry form to WhatsApp", "Auto-reply message flow", "Follow-up templates", "Customer tagging", "Campaign-ready structure"],
  },
  {
    icon: Users,
    title: "Lead Management CRM",
    desc: "A simple CRM system to track customer inquiries, follow-ups, status, and conversion.",
    features: ["Lead capture", "Lead status tracking", "Follow-up reminders", "Customer notes", "Source tracking", "Admin dashboard"],
  },
  {
    icon: ServerCog,
    title: "Custom Software & Business Automation",
    desc: "Custom software solutions to reduce manual work and improve business operations.",
    features: ["Admin dashboards", "Booking systems", "Report systems", "Billing/invoice systems", "Customer portals", "Workflow automation"],
  },
  {
    icon: Target,
    title: "Digital Marketing & Ad-Ready Setup",
    desc: "Make your business ready for Google, Facebook, Instagram, and WhatsApp marketing campaigns.",
    features: ["Landing pages", "Tracking setup", "Campaign creatives", "Offer pages", "Lead forms", "Conversion-focused content"],
  },
  {
    icon: Brain,
    title: "AI-Powered Business Tools",
    desc: "Use AI to automate customer support, content generation, reports, follow-ups, and business insights.",
    features: ["AI chatbot", "AI report generation", "AI customer assistant", "AI content support", "AI lead qualification", "Business recommendations"],
  },
  {
    icon: Palette,
    title: "Branding & Creative Design",
    desc: "Professional visual identity and marketing creatives that make your business look trustworthy.",
    features: ["Logo design", "Social media creatives", "Posters", "Business profile graphics", "Offer banners", "Brand assets"],
  },
];

const industries = [
  { icon: HeartPulse, title: "Clinics & Healthcare", features: ["Appointment website", "Patient inquiry system", "Report sharing", "WhatsApp reminders", "Google profile optimization"] },
  { icon: GraduationCap, title: "Coaching & Education Institutes", features: ["Admission inquiry landing page", "Demo class booking", "Lead tracking CRM", "Student follow-up", "Local SEO"] },
  { icon: Utensils, title: "Restaurants & Cafes", features: ["Digital menu", "WhatsApp ordering", "Review QR", "Offer page", "Google listing improvement"] },
  { icon: Sparkles, title: "Salons, Boutiques & Gyms", features: ["Portfolio website", "Booking inquiry", "Instagram landing page", "Gallery section", "WhatsApp follow-up"] },
  { icon: Home, title: "Real Estate & Property Dealers", features: ["Property listing website", "Buyer/seller inquiry form", "WhatsApp lead routing", "Location pages", "Lead CRM"] },
  { icon: Building2, title: "Manufacturers & Traders", features: ["Corporate website", "Product catalogue", "B2B inquiry forms", "Export-ready profile", "Company presentation"] },
  { icon: ShoppingBag, title: "Pharmacies & Local Stores", features: ["Product/service listing", "WhatsApp order inquiry", "Local SEO", "Customer follow-up", "Offer promotion system"] },
  { icon: Store, title: "Service Providers", features: ["Lead generation website", "Service area pages", "Call and WhatsApp CTA", "Review collection", "Inquiry tracking"] },
];

const packages = [
  {
    title: "Starter Digital Presence",
    bestFor: "Best for small shops and service providers.",
    cta: "Start with Basic Presence",
    features: ["1-page business website", "WhatsApp inquiry button", "Google Business Profile basic optimization", "Contact form", "Basic SEO", "Review QR code"],
  },
  {
    title: "Lead Generation System",
    bestFor: "Best for clinics, coaching centers, salons, gyms, and real estate.",
    cta: "Build My Lead System",
    features: ["Landing page", "Inquiry form", "WhatsApp lead flow", "Lead tracking sheet/CRM", "Follow-up templates", "Basic analytics"],
  },
  {
    title: "Business Automation System",
    bestFor: "Best for growing businesses.",
    cta: "Automate My Business",
    features: ["Website", "Admin dashboard", "CRM", "Booking/order/inquiry system", "Reports and notifications", "Payment or AI tools if required"],
  },
];

const process = [
  { icon: ClipboardCheck, title: "Free Business Audit", desc: "We review your website, Google profile, inquiry system, and competitors." },
  { icon: LineChart, title: "Solution Planning", desc: "We suggest the right digital setup based on your business goal." },
  { icon: Workflow, title: "Design & Development", desc: "We build your website, CRM, automation, or marketing system." },
  { icon: BarChart3, title: "Launch & Growth Support", desc: "We help you launch, track results, and improve continuously." },
];

const whyChooseUs = [
  { icon: BadgeCheck, title: "Practical Business Understanding", desc: "We focus on solving real business problems, not just building pages." },
  { icon: Workflow, title: "Website + Marketing + Automation", desc: "We combine website development, Google visibility, WhatsApp, CRM, and automation." },
  { icon: ShieldCheck, title: "Custom Solutions", desc: "We build according to your business process instead of forcing fixed templates." },
  { icon: MapPin, title: "Local Business Friendly", desc: "We understand how local businesses manage inquiries, customers, and follow-ups." },
  { icon: ServerCog, title: "Scalable Technology", desc: "Start small and upgrade later with CRM, software, mobile app, or AI tools." },
  { icon: Clock, title: "Ongoing Support", desc: "We support improvements, updates, and growth after launch." },
];

const caseStudies = [
  {
    name: "Sunny Coaching Classes",
    industry: "Education",
    problem: "Needed a better online presence and a clearer inquiry flow for students and parents.",
    solution: "Created a professional website with course information, trust-building content, and contact options.",
    impact: "Improved online presentation and made it easier for students to inquire online.",
  },
  {
    name: "Local Service Business",
    industry: "Home & Professional Services",
    problem: "Relied heavily on referrals and did not have a structured way to capture local inquiries.",
    solution: "Planned a conversion-focused landing page with call, form, and WhatsApp lead capture.",
    impact: "Simplified the inquiry path and made service information easier to access.",
  },
  {
    name: "Retail & Catalogue Setup",
    industry: "Local Store",
    problem: "Products and offers were shared manually, making follow-ups slow and inconsistent.",
    solution: "Built a digital catalogue direction with WhatsApp inquiry support and promotional content.",
    impact: "Created a more professional customer experience for product and offer inquiries.",
  },
];

const testimonials = [
  { name: "Rajesh Sharma", role: "Business Owner", tag: "Website Development", text: "Techneyo Solutions made our online presence more professional and helped customers understand our services faster.", rating: 5 },
  { name: "Priya Mehta", role: "Founder, StyleHub", tag: "Local Business Growth", text: "Their team understood our business needs and created a practical digital setup for inquiries and customer communication.", rating: 5 },
  { name: "Amit Verma", role: "Operations Lead", tag: "Software Solution", text: "Techneyo helped us organize our workflow with a reliable custom solution and clear communication throughout the project.", rating: 5 },
];

const aiTools = ["AI chatbot for website", "AI FAQ assistant", "AI report generator", "AI content assistant", "AI lead qualification", "AI-based business insights"];
const leadMagnets = ["Free Digital Audit", "Free Website Health Check", "Free Google Business Profile Review", "Free WhatsApp Inquiry Flow Review"];

const SectionIntro = ({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-12">
    <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
      {eyebrow}
    </motion.p>
    <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-foreground">
      {title}
    </motion.h2>
    {text && (
      <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed mt-4">
        {text}
      </motion.p>
    )}
  </div>
);

const Index = () => {
  return (
    <div>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Modern business team planning digital growth" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-gradient opacity-90" />
        </div>
        <div className="section-container relative z-10 py-32">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
              Local Business Growth & Automation Partner
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Grow Your Local Business with Website, Marketing & Automation Solutions
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/75 text-lg sm:text-xl max-w-3xl mb-8 leading-relaxed">
              Techneyo Solutions helps Ludhiana businesses get more inquiries, improve Google visibility, manage leads, and automate customer follow-ups with modern digital tools.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-hero">
                Request Free Business Audit <ArrowRight size={18} />
              </Link>
              <a href="https://wa.me/919988773122" target="_blank" rel="noopener noreferrer" className="btn-outline-hero">
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </motion.div>
            <motion.div variants={fadeUp} custom={4} className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-10 max-w-3xl pb-16 sm:pb-0">
              {["Website development", "Google Business Profile", "WhatsApp inquiry system", "Lead management", "Business automation", "AI-powered support tools"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 px-3 py-2 text-primary-foreground/85 text-sm">
                  <CheckCircle2 size={15} className="text-accent shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="card-elevated p-6 md:p-8 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
            <div>
              <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
                Free Business Audit
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold text-foreground mb-4">
                Get a Free Digital Business Audit
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground leading-relaxed mb-6">
                We will review your current online presence and suggest practical improvements to help you get more genuine local inquiries.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
                <Link to="/contact" className="btn-hero">Request Free Business Audit <ArrowRight size={18} /></Link>
                <a href="tel:+919988773122" className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors">
                  <Phone size={17} /> Call for Guidance
                </a>
              </motion.div>
            </div>
            <motion.div variants={fadeUp} custom={4} className="grid sm:grid-cols-2 gap-3">
              {auditItems.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <SectionIntro eyebrow="Problems We Solve" title="Common Problems We Solve" text="Techneyo turns scattered online presence, missed follow-ups, and manual work into practical growth systems for local businesses." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {problems.map((problem, i) => (
                <motion.div key={problem} variants={fadeUp} custom={i + 2} className="card-elevated p-5 h-full">
                  <Search size={20} className="text-accent mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{problem}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <SectionIntro eyebrow="Solutions" title="Business Growth Services" text="We help local businesses build a strong online presence, generate more leads, manage customer inquiries, and automate daily operations." />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {services.map((s, i) => (
                <motion.div key={s.title} variants={fadeUp} custom={i + 2} className="card-elevated p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-lg hero-gradient mb-4 flex items-center justify-center">
                    <s.icon size={23} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
                  <div className="space-y-2 mt-auto">
                    {s.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 size={13} className="text-accent mt-0.5 shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/contact" className="btn-hero">Improve My Online Presence <ArrowRight size={18} /></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <SectionIntro eyebrow="Local Industries" title="Solutions for Local Businesses" text="Whether you run a clinic, coaching center, restaurant, salon, manufacturing business, or service company, we build digital systems that help you get more inquiries and manage customers better." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry, i) => (
                <motion.div key={industry.title} variants={fadeUp} custom={i + 2} className="card-elevated p-6 h-full">
                  <industry.icon size={24} className="text-accent mb-4" />
                  <h3 className="font-display font-semibold text-foreground mb-3">{industry.title}</h3>
                  <ul className="space-y-2">
                    {industry.features.map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-accent mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <SectionIntro eyebrow="Packages" title="Choose a Practical Starting Point" text="Start small or build a complete system. We suggest the right setup after reviewing your business needs." />
            <div className="grid lg:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <motion.div key={pkg.title} variants={fadeUp} custom={i + 2} className="card-elevated p-6 h-full flex flex-col">
                  <p className="text-accent text-sm font-semibold mb-2">Custom Quote</p>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">{pkg.title}</h3>
                  <p className="text-muted-foreground text-sm mb-5">{pkg.bestFor}</p>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 size={15} className="text-accent mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="btn-hero mt-auto w-full">{pkg.cta}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <SectionIntro eyebrow="How It Works" title="From Audit to Growth Support" />
            <div className="grid md:grid-cols-4 gap-6">
              {process.map((step, i) => (
                <motion.div key={step.title} variants={fadeUp} custom={i + 2} className="card-elevated p-6 h-full">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon size={21} className="text-primary" />
                  </div>
                  <p className="text-accent text-sm font-semibold mb-2">Step {i + 1}</p>
                  <h3 className="font-display font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <SectionIntro eyebrow="Why Techneyo" title="Why Choose Techneyo Solutions" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseUs.map((item, i) => (
                <motion.div key={item.title} variants={fadeUp} custom={i + 2} className="card-elevated p-6 h-full">
                  <item.icon size={24} className="text-accent mb-4" />
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div>
              <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">AI Business Tools</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                AI Tools for Modern Businesses
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed mb-6">
                We help businesses use AI for customer support, content, reports, lead qualification, internal automation, and faster decision-making.
              </motion.p>
              <motion.div variants={fadeUp} custom={3}>
                <Link to="/contact" className="btn-hero">Explore AI for My Business <ArrowRight size={18} /></Link>
              </motion.div>
            </div>
            <motion.div variants={fadeUp} custom={4} className="grid sm:grid-cols-2 gap-4">
              {aiTools.map((tool) => (
                <div key={tool} className="card-elevated p-5 flex items-center gap-3">
                  <Bot size={20} className="text-accent shrink-0" />
                  <span className="text-sm text-muted-foreground">{tool}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <SectionIntro eyebrow="Selected Work" title="Case Studies with Practical Impact" text="We avoid fake numbers. Where exact metrics are not available, we explain the real problem, solution, and business improvement clearly." />
            <div className="grid lg:grid-cols-3 gap-6">
              {caseStudies.map((study, i) => (
                <motion.div key={study.name} variants={fadeUp} custom={i + 2} className="card-elevated p-6 h-full flex flex-col">
                  <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-2">{study.industry}</p>
                  <h3 className="font-display text-xl font-bold text-foreground mb-4">{study.name}</h3>
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed mb-6">
                    <p><span className="font-semibold text-foreground">Problem:</span> {study.problem}</p>
                    <p><span className="font-semibold text-foreground">Solution:</span> {study.solution}</p>
                    <p><span className="font-semibold text-foreground">Impact:</span> {study.impact}</p>
                  </div>
                  <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary mt-auto">
                    Discuss a Similar Project <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <SectionIntro eyebrow="Testimonials" title="Business-Focused Client Feedback" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={t.name} variants={fadeUp} custom={i + 2} className="card-elevated p-6">
                  <div className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-4">{t.tag}</div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={16} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                  <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="section-container relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
              Ludhiana, Punjab and Remote Clients
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Build a Digital Growth System for Your Business
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/75 text-lg max-w-3xl mx-auto mb-8">
              Based in Punjab, Techneyo Solutions works with local businesses in Ludhiana and beyond to build practical digital systems that improve visibility, inquiries, and customer management.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all">
                Get Free Consultation <ArrowRight size={18} />
              </Link>
              <a href="https://wa.me/919988773122" target="_blank" rel="noopener noreferrer" className="btn-outline-hero">
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <SectionIntro eyebrow="Free Reviews" title="Lead Magnets for Local Businesses" text="Choose the review that fits your current stage. Each one connects to the same consultation flow." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadMagnets.map((item, i) => (
                <motion.div key={item} variants={fadeUp} custom={i + 2} className="card-elevated p-6 text-center h-full">
                  <ClipboardCheck size={24} className="text-accent mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-foreground mb-4">{item}</h3>
                  <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Request Review <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
