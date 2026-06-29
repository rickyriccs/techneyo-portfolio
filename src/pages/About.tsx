import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Eye, Heart, MapPin, Target, Users, Workflow, Zap } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { businessInfo, pageDescriptions } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const values = [
  { icon: Heart, title: "Business-first thinking", desc: "We design around trust, enquiries, follow-ups and real business outcomes." },
  { icon: Zap, title: "Fast practical launch", desc: "Start with a focused website or digital tool, then improve as the business grows." },
  { icon: Workflow, title: "Systems over pages", desc: "Website, WhatsApp, CRM, offers, and automation work together as one flow." },
  { icon: Users, title: "Built for owners", desc: "We keep the language, admin controls, and customer journey simple enough to use daily." },
];

const stats = [
  { value: "Rs. 999", label: "Starter website offer" },
  { value: "All India", label: "Remote service coverage" },
  { value: "24/7", label: "Website enquiry capture" },
  { value: "Admin", label: "Controlled website modules" },
];

const timeline = [
  { title: "Understand", desc: "We study your business, customers, city, offer, and enquiry process." },
  { title: "Design", desc: "We create a premium, mobile-first experience that builds trust quickly." },
  { title: "Connect", desc: "We connect forms, WhatsApp, offers, services, and lead tracking." },
  { title: "Improve", desc: "We keep the system ready for packages, tools, automation, and growth." },
];

const About = () => {
  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta title="About Techneyo Solutions | Digital Solutions for Businesses" description={pageDescriptions.about} canonicalPath="/about" schema={organizationSchema} />
      <section className="premium-hero relative overflow-hidden pb-20 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          <motion.div initial="hidden" animate="visible">
            <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">About Techneyo Solutions</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              We help businesses turn digital presence into trust, leads, and momentum.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 max-w-3xl text-lg leading-8 text-white/68">
              Techneyo Solutions builds affordable websites, digital tools, automation systems, and business software for startups, local businesses, professionals, and growing companies across India.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="premium-btn premium-btn-primary">Get Free Consultation <ArrowRight size={18} /></Link>
              <Link to="/services" className="premium-btn premium-btn-ghost">Explore Services</Link>
              <Link to="/company-profile" className="premium-btn premium-btn-ghost">Company Profile</Link>
            </motion.div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="premium-dashboard">
            <p className="premium-eyebrow">Operating philosophy</p>
            <div className="space-y-4">
              {["Affordable launch", "Lead capture", "Admin control", "Automation ready"].map((item, index) => (
                <div key={item} className="premium-flow-row">
                  <span className="flex items-center gap-3"><BadgeCheck size={17} className="text-cyan-200" /> {item}</span>
                  <span className="font-mono text-white/45">0{index + 1}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">Our story</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold text-white sm:text-5xl">
                Practical technology for businesses that need results, not jargon.
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} custom={2} className="premium-card p-6 sm:p-8">
              <p className="text-lg leading-8 text-white/68">
                Many businesses are good at what they do, but their online presence does not show it. We help fix that with websites, service pages, WhatsApp flows, CRM-style tracking, admin-managed offers, and custom tools that make customer enquiries easier to capture and follow up.
              </p>
              <p className="mt-5 text-lg leading-8 text-white/68">
                The goal is simple: make your business look trusted, make it easier for customers to contact you, and give you a system that can grow over time.
              </p>
            </motion.div>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index} className="premium-stat">
                <div className="font-display text-3xl font-bold text-white">{stat.value}</div>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section bg-white/[0.025]">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid gap-5 md:grid-cols-2">
            {[
              { icon: Target, title: "Mission", desc: "Make premium websites, digital presence and business tools affordable and useful for Indian businesses." },
              { icon: Eye, title: "Vision", desc: "Become a trusted digital growth partner for businesses that want better leads, systems and customer experience." },
            ].map((item, index) => (
              <motion.div key={item.title} variants={fadeUp} custom={index} className="premium-card premium-card-hover p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100">
                  <item.icon size={24} />
                </div>
                <h3 className="font-display text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 leading-7 text-white/62">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-container">
          <div className="premium-card p-6 sm:p-8">
            <p className="premium-eyebrow">What we provide</p>
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">Business-ready digital services under one brand.</h2>
                <p className="mt-4 leading-7 text-white/62">
                  {businessInfo.name} supports local businesses, service providers, startups, and growing teams with practical digital systems that customers can understand and owners can manage.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {businessInfo.services.map((service) => (
                  <div key={service} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3 text-sm text-white/68">
                    <BadgeCheck size={16} className="shrink-0 text-cyan-200" />
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="premium-eyebrow">What drives us</p>
              <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">A small set of principles for building better business systems.</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <motion.div key={value.title} variants={fadeUp} custom={index} className="premium-card premium-card-hover p-6">
                  <value.icon size={24} className="mb-5 text-orange-200" />
                  <h3 className="font-display text-xl font-semibold text-white">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section bg-white/[0.025]">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="premium-final-cta">
            <div>
              <p className="premium-eyebrow">How we work</p>
              <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">A clear path from idea to digital growth system.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {timeline.map((step, index) => (
                <div key={step.title} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                  <p className="font-mono text-xs text-cyan-200">0{index + 1}</p>
                  <h3 className="mt-2 font-display font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/58">{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-container">
          <div className="premium-card grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 text-cyan-200" />
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Serving businesses across India</h2>
                <p className="mt-2 text-white/60">Based from Punjab, built for remote collaboration, fast launches, and India-wide service delivery.</p>
              </div>
            </div>
            <Link to="/contact" className="premium-btn premium-btn-primary">Start a Project</Link>
          </div>
        </div>
      </section>

      <section className="premium-section pt-0">
        <div className="section-container">
          <div className="premium-card p-6 sm:p-8">
            <p className="premium-eyebrow">Official communication</p>
            <h2 className="font-display text-2xl font-bold text-white">Verification-supporting business information</h2>
            <p className="mt-3 max-w-4xl leading-7 text-white/62">
              Techneyo Solutions uses official business communication channels for client enquiries, project discussions, and support. For service-related communication, customers can contact us through our website, email, phone, or WhatsApp.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/68">
              <a href={businessInfo.website} className="premium-badge">{businessInfo.displayWebsite}</a>
              <a href={`mailto:${businessInfo.email}`} className="premium-badge">{businessInfo.email}</a>
              <a href={businessInfo.phoneHref} className="premium-badge">{businessInfo.phoneDisplay}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
