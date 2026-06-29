import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageMeta from "@/components/PageMeta";
import { businessInfo, pageDescriptions } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";
import { servicePages, servicePath } from "@/lib/seo-content";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  LayoutDashboard,
  MessageCircle,
  MousePointerClick,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: "easeOut" as const },
  }),
};

const trustItems = [
  "Serving businesses across India",
  "Affordable digital presence",
  "Admin-controlled website tools",
  "Lead capture ready",
  "Mobile-first design",
  "WhatsApp-ready enquiry flow",
];

const heroBadges = ["Website from Rs. 999", "All India Service", "Fast Delivery", "SEO Friendly", "WhatsApp Ready", "Business-Focused UI"];

const problems = [
  "No professional website",
  "No lead capture",
  "No WhatsApp enquiry flow",
  "No digital trust",
  "No booking/contact system",
  "No automation",
  "Outdated design",
  "Missed follow-ups",
];

const solutions = [
  { icon: Globe2, title: "Business websites", text: "High-trust websites, landing pages, ecommerce and booking experiences." },
  { icon: MessageCircle, title: "Lead flows", text: "Contact forms, WhatsApp routing, follow-ups and enquiry tracking." },
  { icon: LayoutDashboard, title: "Admin tools", text: "Offers, services, packages and leads controlled from a clean dashboard." },
  { icon: Bot, title: "Automation", text: "Custom workflows, dashboards, CRM tools and AI-ready business systems." },
];

const offers = [
  { title: "Starter Website", bestFor: "New shops, freelancers, local services", price: "From Rs. 999", features: ["One-page launch", "Mobile responsive", "WhatsApp CTA", "Basic SEO"] },
  { title: "Business Website", bestFor: "Growing teams and service brands", price: "From Rs. 7,999", features: ["Up to 5 pages", "Lead form", "Trust sections", "Google-ready structure"] },
  { title: "Campaign Landing Page", bestFor: "Ads, offers, launches", price: "Custom", features: ["Fast funnel", "Offer blocks", "Lead capture", "Tracking-ready"] },
  { title: "Website + WhatsApp Flow", bestFor: "Businesses needing quick enquiries", price: "Custom", features: ["Form + WhatsApp", "Auto message", "Lead source data", "Follow-up ready"] },
  { title: "Digital Presence Setup", bestFor: "Businesses starting online", price: "Custom", features: ["Website", "Google profile", "Review QR", "Business content"] },
  { title: "Custom Business Tool", bestFor: "CRM, booking, operations", price: "Consultation", features: ["Dashboard", "Database", "Roles", "Reports"] },
];

const services = [
  "Website Development",
  "Business Website",
  "Landing Page",
  "Ecommerce Website",
  "Booking Website",
  "CRM / Admin Tools",
  "WhatsApp Automation",
  "Custom Business Software",
  "SEO-ready Website Structure",
  "Website Maintenance",
];

const process = [
  { icon: Users, title: "Discuss your business", text: "We understand what you sell, who you serve, and what kind of leads matter." },
  { icon: MousePointerClick, title: "Select website/tool offer", text: "Choose a starter website, digital presence setup, automation, or custom tool." },
  { icon: Sparkles, title: "We design and build", text: "We create a mobile-first, trust-building experience with enquiry flow built in." },
  { icon: BarChart3, title: "You start receiving leads", text: "Launch with WhatsApp, form tracking, and admin-ready lead management." },
];

const showcases = [
  { icon: Building2, title: "Clinic website", text: "Appointment enquiry, services, doctor profile, WhatsApp follow-up." },
  { icon: ClipboardCheck, title: "Coaching institute", text: "Courses, demo class leads, admission enquiry and follow-up dashboard." },
  { icon: ShoppingBag, title: "Product catalogue", text: "Offer-led product pages with WhatsApp order and enquiry routing." },
  { icon: Workflow, title: "Admin dashboard", text: "Lead status, offers, packages, tools and activity tracking." },
];

const testimonials = [
  { name: "Business Owner", tag: "Website Launch", text: "Techneyo Solutions made our online presence clearer, faster and easier for customers to contact us." },
  { name: "Service Provider", tag: "Lead Flow", text: "The WhatsApp and contact flow helped us stop losing enquiries between calls and messages." },
  { name: "Growing Team", tag: "Automation", text: "They understood the business problem first, then built a practical digital system around it." },
];

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="premium-stat">
    <div className="font-display text-3xl font-bold text-white">{value}</div>
    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">{label}</p>
  </div>
);

const SectionIntro = ({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) => (
  <motion.div variants={fadeUp} custom={0} className="mx-auto mb-12 max-w-3xl text-center">
    <p className="premium-eyebrow">{eyebrow}</p>
    <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">{title}</h2>
    {text && <p className="mt-4 text-base leading-7 text-white/62 sm:text-lg">{text}</p>}
  </motion.div>
);

const DashboardVisual = () => (
  <motion.div className="premium-dashboard" variants={fadeUp} custom={3}>
    <div className="flex items-center justify-between border-b border-white/10 pb-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Growth Console</p>
        <h3 className="mt-1 font-display text-xl font-semibold text-white">Business launch system</h3>
      </div>
      <div className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">Live</div>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <Stat value="29" label="Leads" />
      <Stat value="8" label="Offers" />
      <Stat value="24h" label="Response" />
    </div>
    <div className="mt-5 space-y-3">
      {[
        { icon: Globe2, label: "Website launch", value: "Ready" },
        { icon: MessageCircle, label: "WhatsApp enquiry", value: "Connected" },
        { icon: Workflow, label: "Automation flow", value: "Mapped" },
        { icon: LayoutDashboard, label: "Admin-controlled offers", value: "Active" },
      ].map((item) => (
        <div key={item.label} className="premium-flow-row">
          <div className="flex items-center gap-3">
            <item.icon size={17} className="text-cyan-200" />
            <span>{item.label}</span>
          </div>
          <span className="text-cyan-100">{item.value}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

const Index = () => {
  return (
    <div className="public-premium min-h-screen overflow-hidden bg-[#030711] text-white">
      <PageMeta
        title="Techneyo Solutions | Website, CRM & Business Automation Services in India"
        description={pageDescriptions.home}
        canonicalPath="/"
        schema={organizationSchema}
      />

      <section className="premium-hero relative flex min-h-screen items-center overflow-hidden pt-28">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="premium-orbit premium-orbit-b" />
        <div className="section-container relative z-10 grid items-center gap-12 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial="hidden" animate="visible">
            <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">Affordable digital growth across India</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl font-bold leading-[0.96] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
              Website, CRM & Business Automation Solutions for Businesses Across India
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 max-w-3xl text-lg leading-8 text-white/68 sm:text-xl">
              Techneyo Solutions is based in Ludhiana and serves businesses across India with website development, CRM, SEO, WhatsApp automation, admin dashboards, and custom software solutions.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact" className="premium-btn premium-btn-primary" data-offer-name="Starter website consultation" data-cta-location="home_hero">
                Start Website from Rs. 999 <ArrowRight size={18} />
              </Link>
              <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="premium-btn premium-btn-ghost" data-cta-location="home_hero">
                <MessageCircle size={18} /> WhatsApp Free Consultation
              </a>
            </motion.div>
            <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-wrap gap-2">
              {heroBadges.map((badge) => (
                <span key={badge} className="premium-badge">{badge}</span>
              ))}
            </motion.div>
          </motion.div>
          <DashboardVisual />
        </div>
      </section>

      <div className="premium-marquee border-y border-white/10 bg-white/[0.03] py-4">
        <div className="premium-marquee-track">
          {trustItems.map((item) => (
            <span key={item}><BadgeCheck size={16} /> {item}</span>
          ))}
        </div>
      </div>

      <section className="premium-section">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <SectionIntro
              eyebrow="The business gap"
              title="Your business may be good, but customers first check your online presence."
              text="If that first impression is weak, slow, or missing, your best customers may never reach you."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {problems.map((problem, index) => (
                <motion.div key={problem} variants={fadeUp} custom={index + 1} className="premium-card p-5">
                  <Search size={20} className="mb-4 text-orange-200" />
                  <p className="text-sm leading-6 text-white/68">{problem}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section pt-0">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <SectionIntro eyebrow="The Techneyo Solutions system" title="A practical digital growth stack, not just a pretty website." />
            <div className="grid gap-5 lg:grid-cols-4">
              {solutions.map((solution, index) => (
                <motion.div key={solution.title} variants={fadeUp} custom={index + 1} className="premium-card premium-card-hover p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200">
                    <solution.icon size={23} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">{solution.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{solution.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section bg-white/[0.025]">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <SectionIntro eyebrow="Offers" title="Start small, launch fast, upgrade when the leads begin." text="Clear offer cards help business owners choose the next right step without confusion." />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {offers.map((offer, index) => (
                <motion.div key={offer.title} variants={fadeUp} custom={index + 1} className="premium-card premium-card-hover flex h-full flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">{offer.bestFor}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-white">{offer.title}</h3>
                  <p className="mt-2 text-2xl font-bold text-orange-200">{offer.price}</p>
                  <div className="mt-5 space-y-2">
                    {offer.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-white/64">
                        <CheckCircle2 size={15} className="text-emerald-200" /> {feature}
                      </div>
                    ))}
                  </div>
                  <Link to="/contact" className="premium-link mt-6" data-offer-name={offer.title} data-cta-location="home_offers">
                    View offer <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <SectionIntro eyebrow="Services" title="Everything a growing business needs to look trusted and capture leads." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {services.map((service, index) => (
                <motion.div key={service} variants={fadeUp} custom={index + 1} className="premium-chip-card">
                  <Zap size={16} /> {service}
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/services" className="premium-btn premium-btn-primary">
                Explore Services <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section pt-0">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <SectionIntro
              eyebrow="Service pages"
              title="Detailed service pages for website, CRM, SEO, and automation needs."
              text="Use these pages to understand each service, compare related solutions, and move toward the right contact flow."
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {servicePages.map((service, index) => (
                <motion.div key={service.slug} variants={fadeUp} custom={index + 1}>
                  <Link to={servicePath(service.slug)} className="premium-card premium-card-hover block h-full p-5">
                    <h3 className="font-display text-xl font-semibold text-white">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/60">{service.metaDescription}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
                      Learn more <ArrowRight size={15} />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/website-development-company-ludhiana" className="premium-btn premium-btn-ghost">Website Development in Ludhiana</Link>
              <Link to="/resources" className="premium-btn premium-btn-ghost">Read Resources</Link>
              <Link to="/company-profile" className="premium-btn premium-btn-ghost">Company Profile</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section bg-white/[0.025]">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <SectionIntro eyebrow="Process" title="From business conversation to live lead system." />
            <div className="grid gap-5 lg:grid-cols-4">
              {process.map((step, index) => (
                <motion.div key={step.title} variants={fadeUp} custom={index + 1} className="premium-card p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-300/10 text-purple-100">
                      <step.icon size={21} />
                    </div>
                    <span className="font-mono text-xs text-white/35">0{index + 1}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <SectionIntro eyebrow="What we can build" title="Conceptual demos for real Indian business workflows." />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {showcases.map((item, index) => (
                <motion.div key={item.title} variants={fadeUp} custom={index + 1} className="premium-showcase-card">
                  <item.icon size={24} className="text-cyan-200" />
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section bg-white/[0.025]">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <SectionIntro eyebrow="Social proof ready" title="Built around trust, clarity, and business outcomes." />
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div key={testimonial.tag} variants={fadeUp} custom={index + 1} className="premium-card p-6">
                  <div className="mb-4 flex gap-1 text-orange-200">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className="fill-current" />)}
                  </div>
                  <p className="text-sm leading-7 text-white/68">"{testimonial.text}"</p>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">{testimonial.tag}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-container">
          <div className="premium-final-cta">
            <div>
              <p className="premium-eyebrow">Ready to grow digitally?</p>
              <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
                Your customers are already online. Let’s make sure they find you first.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="premium-btn premium-btn-primary" data-cta-location="home_final_cta">Get Free Consultation</Link>
              <a href="tel:+919988773122" className="premium-btn premium-btn-ghost" data-cta-location="home_final_cta">Call Now</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
