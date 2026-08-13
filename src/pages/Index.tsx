import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import PageMeta from "@/components/PageMeta";
import { businessInfo, pageDescriptions } from "@/lib/business-info";
import { organizationSchema, offersSchema, graphSchema } from "@/lib/schema";
import { servicePages, servicePath } from "@/lib/seo-content";
import ClientsSection from "@/components/ClientsSection";
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
  HelpCircle,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  Workflow,
  Stethoscope,
  GraduationCap,
  Utensils,
  Scissors,
  Smartphone,
  TrendingUp,
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
  "Serving businesses worldwide & across global markets",
  "Affordable digital presence",
  "Admin-controlled website tools",
  "Lead capture ready",
  "Mobile-first design",
  "WhatsApp-ready enquiry flow",
];

const heroBadges = ["Website from Rs. 499/month", "Global Coverage", "Fast Delivery", "SEO Friendly", "WhatsApp Ready", "Business-Focused UI"];

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
  { icon: Globe2, title: "Business Websites", text: "High-trust websites, landing pages, e-commerce & online booking." },
  { icon: MessageCircle, title: "Direct Lead Flows", text: "WhatsApp routing, direct phone call buttons & enquiry alerts." },
  { icon: Smartphone, title: "Mobile App Development", text: "Custom iOS & Android apps designed for smooth performance & customer engagement." },
  { icon: TrendingUp, title: "Google & Meta Ad Campaigns", text: "Targeted ad campaigns that bring phone calls and WhatsApp buyers within 48 hours." },
];

type Offer = {
  id: string;
  title: string;
  short_description: string;
  detailed_description: string | null;
  offer_type: string;
  starting_price: number | null;
  discount_price: number | null;
  button_text: string;
  button_action: string;
  button_url: string | null;
  is_featured: boolean;
  valid_from?: string | null;
  valid_till?: string | null;
};


const actionHref = (offer: Offer) => {
  if (offer.button_action === "WhatsApp") return businessInfo.whatsappUrl;
  if (offer.button_action === "Call") return "tel:+919988773122";
  if (offer.button_action === "Custom Link" && offer.button_url) return offer.button_url;
  return "/contact";
};

const formatPriceVal = (price: number | null) => {
  if (!price) return "";
  return `Rs. ${Number(price).toLocaleString("en-IN")}`;
};

const CountdownTimer = ({ validTill }: { validTill: string }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const targetDate = new Date(`${validTill}T23:59:59`);

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(" "));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [validTill]);

  if (!timeLeft || timeLeft === "Expired") return null;

  return (
    <div className="mt-4 rounded-md border border-orange-500/20 bg-orange-500/5 px-3 py-2 text-center text-xs font-semibold text-orange-300 flex items-center justify-center gap-1.5 animate-pulse">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
      Ends in: {timeLeft}
    </div>
  );
};

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

import HeroDiagnosticWidget from "@/components/interactive/HeroDiagnosticWidget";
// import ServiceMatrix from "@/components/interactive/ServiceMatrix";
import GlobalPresenceVisual from "@/components/interactive/GlobalPresenceVisual";
import ProblemSolverSection from "@/components/ProblemSolverSection";
import { usePersonalization } from "@/context/PersonalizationContext";



const Index = () => {
  const [dbOffers, setDbOffers] = useState<Offer[]>([]);
  const { openProposalModal, preferences } = usePersonalization();

  useEffect(() => {
    const loadOffers = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("offers")
        .select("id,title,short_description,detailed_description,offer_type,starting_price,discount_price,button_text,button_action,button_url,is_featured,valid_from,valid_till")
        .eq("status", "Active")
        .eq("is_featured", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Failed to load offers from DB", error);
        return;
      }
      if (data) {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const todayStr = `${year}-${month}-${day}`;

        const activeOffers = (data as Offer[]).filter((offer) => {
          if (offer.valid_from && offer.valid_from > todayStr) return false;
          if (offer.valid_till && offer.valid_till < todayStr) return false;
          return true;
        });

        setDbOffers(activeOffers);
      }
    };
    loadOffers();
  }, []);

  const pageSchema = graphSchema(organizationSchema, offersSchema(dbOffers));

  return (
    <div className="public-premium min-h-screen overflow-hidden bg-[#030711] text-white">
      <PageMeta
        title="Techneyo Solutions | Website, Mobile Apps, Social Media & Digital Marketing Services"
        description={pageDescriptions.home}
        canonicalPath="/"
        schema={pageSchema}
      />

      <section className="premium-hero relative flex min-h-screen items-center overflow-hidden pt-28 pb-12">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="premium-orbit premium-orbit-b" />
        <div className="section-container relative z-10 space-y-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial="hidden" animate="visible">
              <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">High-Converting IT & Digital Services Worldwide</motion.p>
              <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.96] tracking-[-0.03em] text-white">
                {preferences.primaryGoal ? (
                  <>
                    Customized <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 capitalize">{preferences.primaryGoal.replace("_", " ")}</span> Solutions for Your Business
                  </>
                ) : (
                  <>
                    Website, Mobile Apps, Social Media & High-ROI Digital Marketing
                  </>
                )}
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="mt-6 max-w-3xl text-lg leading-8 text-white/68 sm:text-xl">
                Techneyo Solutions builds high-impact websites, custom mobile apps, viral social media campaigns, and data-driven ad funnels to turn online traffic into loyal customers.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => openProposalModal()}
                  className="premium-btn premium-btn-primary flex items-center gap-2"
                >
                  <Sparkles size={18} /> Get AI Proposal & Custom Offer <ArrowRight size={18} />
                </button>
                <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="premium-btn premium-btn-ghost flex items-center gap-2">
                  <MessageCircle size={18} /> Instant WhatsApp Consultation
                </a>
              </motion.div>
              <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-wrap gap-2">
                {heroBadges.map((badge) => (
                  <span key={badge} className="premium-badge">{badge}</span>
                ))}
              </motion.div>
            </motion.div>
            <GlobalPresenceVisual />
          </div>
          {/* Problem Solver Interactive Section */}
          <ProblemSolverSection />

          {/* Interactive Hero Diagnostic Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <HeroDiagnosticWidget />
          </motion.div>
        </div>
      </section>


      <div className="premium-marquee border-y border-white/10 bg-white/[0.03] py-4">
        <div className="premium-marquee-track">
          {trustItems.map((item) => (
            <span key={item}><BadgeCheck size={16} /> {item}</span>
          ))}
        </div>
      </div>

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

      {/*{dbOffers.length > 0 && (*/}
      {/*  <section className="premium-section bg-white/[0.025]">*/}
      {/*    <div className="section-container">*/}
      {/*      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>*/}
      {/*        <SectionIntro eyebrow="Offers" title="Start small, launch fast, upgrade when the leads begin." text="Clear offer cards help business owners choose the next right step without confusion." />*/}
      {/*        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">*/}
      {/*          {dbOffers.map((offer, index) => {*/}
      {/*            const href = actionHref(offer);*/}
      {/*            const isExternal = href.startsWith("http") || href.startsWith("tel:");*/}
      {/*            const features = offer.detailed_description*/}
      {/*              ? offer.detailed_description.split("\n").map((f) => f.trim()).filter(Boolean)*/}
      {/*              : [];*/}

      {/*            return (*/}
      {/*              <motion.div key={offer.id} variants={fadeUp} custom={index + 1} className="premium-card premium-card-hover flex h-full flex-col p-6">*/}
      {/*                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">{offer.offer_type}</p>*/}
      {/*                <h3 className="mt-3 font-display text-2xl font-semibold text-white">{offer.title}</h3>*/}
      {/*                <div className="mt-2 flex items-end gap-3 min-h-[2rem]">*/}
      {/*                  {offer.discount_price || offer.starting_price ? (*/}
      {/*                    <>*/}
      {/*                      <span className="font-display text-2xl font-bold text-orange-200">*/}
      {/*                        {offer.discount_price && offer.starting_price ? "" : "From "}*/}
      {/*                        {formatPriceVal(offer.discount_price || offer.starting_price)}*/}
      {/*                      </span>*/}
      {/*                      {offer.discount_price && offer.starting_price && (*/}
      {/*                        <span className="pb-1 text-sm text-white/35 line-through">{formatPriceVal(offer.starting_price)}</span>*/}
      {/*                      )}*/}
      {/*                    </>*/}
      {/*                  ) : (*/}
      {/*                    <span className="font-display text-2xl font-bold text-orange-200">*/}
      {/*                      {offer.id === "custom-tool" ? "Consultation" : "Custom"}*/}
      {/*                    </span>*/}
      {/*                  )}*/}
      {/*                </div>*/}
      {/*                {offer.short_description && (*/}
      {/*                  <p className="mt-3 text-sm leading-6 text-white/60">{offer.short_description}</p>*/}
      {/*                )}*/}
      {/*                <div className="mt-5 space-y-2 flex-grow">*/}
      {/*                  {features.map((feature) => (*/}
      {/*                    <div key={feature} className="flex items-center gap-2 text-sm text-white/64">*/}
      {/*                      <CheckCircle2 size={15} className="text-emerald-200 shrink-0" />*/}
      {/*                      <span>{feature}</span>*/}
      {/*                    </div>*/}
      {/*                  ))}*/}
      {/*                </div>*/}
      {/*                {offer.valid_till && <CountdownTimer validTill={offer.valid_till} />}*/}
      {/*                {isExternal ? (*/}
      {/*                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="premium-link mt-6" data-offer-name={offer.title} data-cta-location="home_offers">*/}
      {/*                    {offer.button_text || "View offer"} <ArrowRight size={16} />*/}
      {/*                  </a>*/}
      {/*                ) : (*/}
      {/*                  <Link to={href} className="premium-link mt-6" data-offer-name={offer.title} data-cta-location="home_offers">*/}
      {/*                    {offer.button_text || "View offer"} <ArrowRight size={16} />*/}
      {/*                  </Link>*/}
      {/*                )}*/}
      {/*              </motion.div>*/}
      {/*            );*/}
      {/*          })}*/}
      {/*        </div>*/}
      {/*      </motion.div>*/}
      {/*    </div>*/}
      {/*  </section>*/}
      {/*)}*/}

      {/* Interactive Service Matrix Hub */}
      {/*<ServiceMatrix />*/}

      {/* Industry Solutions Showcase */}
      <section className="premium-section bg-white/[0.02]">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <SectionIntro
              eyebrow="Solutions by Industry"
              title="Tailored Websites, Mobile Apps & Digital Ads for Your Specific Industry"
              text="Explore custom solutions, industry pain points solved, and pricing packages built for your business category."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                { slug: "healthcare-clinics", title: "Healthcare & Clinics", desc: "Patient appointment booking, doctor profiles & Google Map #1 ranking", icon: Stethoscope },
                { slug: "ecommerce-retail", title: "E-Commerce & Retail Stores", desc: "Online shopping store, UPI payment gateway & instant WhatsApp orders", icon: ShoppingBag },
                { slug: "real-estate", title: "Real Estate & Builders", desc: "High-converting property landing pages & Meta buyer lead ads", icon: Building2 },
                { slug: "education-coaching", title: "Coaching & Institutes", desc: "Course portals, student demo class registration & result showcases", icon: GraduationCap },
                { slug: "restaurants-food", title: "Restaurants & Cafes", desc: "QR digital food menus, direct WhatsApp orders & 5-star Google review stands", icon: Utensils },
                { slug: "local-services", title: "Salons & Local Services", desc: "Local service catalog, appointment slot booking & instant phone call leads", icon: Scissors },
              ].map((ind, index) => {
                const IconComp = ind.icon;
                return (
                  <motion.div key={ind.slug} variants={fadeUp} custom={index + 1}>
                    <Link to={`/industries/${ind.slug}`} className="premium-card premium-card-hover block h-full p-6 group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                          <IconComp size={24} />
                        </div>
                        <span className="text-xs font-semibold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                          View Solution →
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {ind.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/60">{ind.desc}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link to="/industries" className="premium-btn premium-btn-ghost inline-flex items-center gap-2">
                Explore All 6 Industry Solutions <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/*<section className="premium-section pt-0">*/}
      {/*  <div className="section-container">*/}
      {/*    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>*/}
      {/*      <SectionIntro*/}
      {/*        eyebrow="Service pages"*/}
      {/*        title="Detailed service pages for website, CRM, SEO, and automation needs."*/}
      {/*        text="Use these pages to understand each service, compare related solutions, and move toward the right contact flow."*/}
      {/*      />*/}
      {/*      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">*/}
      {/*        {servicePages.map((service, index) => (*/}
      {/*          <motion.div key={service.slug} variants={fadeUp} custom={index + 1}>*/}
      {/*            <Link to={servicePath(service.slug)} className="premium-card premium-card-hover block h-full p-5">*/}
      {/*              <h3 className="font-display text-xl font-semibold text-white">{service.title}</h3>*/}
      {/*              <p className="mt-3 text-sm leading-6 text-white/60">{service.metaDescription}</p>*/}
      {/*              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">*/}
      {/*                Learn more <ArrowRight size={15} />*/}
      {/*              </span>*/}
      {/*            </Link>*/}
      {/*          </motion.div>*/}
      {/*        ))}*/}
      {/*      </div>*/}
      {/*      <div className="mt-8 flex flex-wrap justify-center gap-3">*/}
      {/*        <Link to="/website-development-company-ludhiana" className="premium-btn premium-btn-ghost">Worldwide Website Development</Link>*/}
      {/*        <Link to="/resources" className="premium-btn premium-btn-ghost">Read Resources</Link>*/}
      {/*        <Link to="/company-profile" className="premium-btn premium-btn-ghost">Company Profile</Link>*/}
      {/*      </div>*/}
      {/*    </motion.div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/*<section className="premium-section bg-white/[0.025]">*/}
      {/*  <div className="section-container">*/}
      {/*    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>*/}
      {/*      <SectionIntro eyebrow="Process" title="From business conversation to live lead system." />*/}
      {/*      <div className="grid gap-5 lg:grid-cols-4">*/}
      {/*        {process.map((step, index) => (*/}
      {/*          <motion.div key={step.title} variants={fadeUp} custom={index + 1} className="premium-card p-6">*/}
      {/*            <div className="mb-5 flex items-center justify-between">*/}
      {/*              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-300/10 text-purple-100">*/}
      {/*                <step.icon size={21} />*/}
      {/*              </div>*/}
      {/*              <span className="font-mono text-xs text-white/35">0{index + 1}</span>*/}
      {/*            </div>*/}
      {/*            <h3 className="font-display text-xl font-semibold text-white">{step.title}</h3>*/}
      {/*            <p className="mt-3 text-sm leading-6 text-white/60">{step.text}</p>*/}
      {/*          </motion.div>*/}
      {/*        ))}*/}
      {/*      </div>*/}
      {/*    </motion.div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/*<section className="premium-section">*/}
      {/*  <div className="section-container">*/}
      {/*    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>*/}
      {/*      <SectionIntro eyebrow="What we can build" title="Conceptual demos for real business workflows worldwide." />*/}
      {/*      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">*/}
      {/*        {showcases.map((item, index) => (*/}
      {/*          <motion.div key={item.title} variants={fadeUp} custom={index + 1} className="premium-showcase-card">*/}
      {/*            <item.icon size={24} className="text-cyan-200" />*/}
      {/*            <h3 className="mt-5 font-display text-xl font-semibold text-white">{item.title}</h3>*/}
      {/*            <p className="mt-3 text-sm leading-6 text-white/60">{item.text}</p>*/}
      {/*          </motion.div>*/}
      {/*        ))}*/}
      {/*      </div>*/}
      {/*    </motion.div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      <ClientsSection />

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
