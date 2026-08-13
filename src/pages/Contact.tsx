import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { createContactEnquiry } from "@/lib/contact-enquiries";
import PageMeta from "@/components/PageMeta";
import { businessInfo, pageDescriptions } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";
import { trackEvent } from "@/lib/analytics";
import { setLeadContext } from "@/lib/utm";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const contactInfo = [
  { icon: Phone, title: "Call / WhatsApp Direct", detail: businessInfo.phoneDisplay, href: businessInfo.phoneHref },
  { icon: Mail, title: "Official Email", detail: businessInfo.email, href: `mailto:${businessInfo.email}` },
  { icon: MapPin, title: "Primary Service Area", detail: `${businessInfo.location} | Serving Nationwide`, href: businessInfo.website },
  { icon: Clock, title: "Business Support Hours", detail: "Mon - Sat: 9:00 AM - 7:00 PM" },
];

const needOptions = [
  "High-Converting Website & Web App",
  "Google Map #1 Ranking & Local Leads",
  "Mobile App Development (iOS & Android)",
  "Paid Ads (Google & Meta Lead Campaigns)",
  "Social Media & Video Reels Branding",
  "24/7 WhatsApp Lead Automation",
  "Full IT & Growth Suite",
  "Not Sure - Need Free Founder Guidance",
];

const Contact = () => {
  const navigate = useNavigate();
  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/30 focus:border-cyan-400 focus:bg-white/[0.08] focus:ring-2 focus:ring-cyan-500/20";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cyan-300";

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    businessType: "",
    hasWebsite: "",
    hasGoogleProfile: "",
    need: "",
    budgetRange: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      await createContactEnquiry({
        name: form.name,
        phone: form.phone,
        email: form.email,
        businessName: form.businessName,
        city: form.city,
        state: form.state,
        serviceRequired: form.need,
        budgetRange: form.budgetRange,
        message: [
          form.message,
          form.businessType ? `Business Category: ${form.businessType}` : "",
          form.hasWebsite ? `Has Existing Website: ${form.hasWebsite}` : "",
          form.hasGoogleProfile ? `Has Google Profile: ${form.hasGoogleProfile}` : "",
        ].filter(Boolean).join("\n"),
        sourcePage: "/contact",
        serviceInterested: form.need,
      });

      trackEvent("contact_form_submit", {
        service_name: form.need,
        cta_location: "contact_form",
      });
      trackEvent("service_enquiry_submit", {
        service_name: form.need,
        cta_location: "contact_form",
      });
      setLeadContext({
        service_name: form.need,
        source_page_url: window.location.href,
      });
      setSubmitted(true);
      setForm({
        name: "",
        businessName: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        businessType: "",
        hasWebsite: "",
        hasGoogleProfile: "",
        need: "",
        budgetRange: "",
        message: "",
      });
      navigate(`/thank-you?service=${encodeURIComponent(form.need || "general")}`, { replace: false });
    } catch (error) {
      console.error("Contact enquiry submission failed", error);
      setSubmitError("We could not save your enquiry right now. Please try again or message us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="public-premium min-h-screen overflow-hidden bg-[#030711] text-white">
      <PageMeta
        title="Get Free Strategy Consultation & Custom Proposal | Techneyo Solutions"
        description="Contact Techneyo Solutions for high-converting websites, custom mobile apps, Google & Meta lead campaigns, local SEO rankings, and WhatsApp lead automation."
        canonicalPath="/contact"
        schema={organizationSchema}
      />

      {/* Hero */}
      <section className="premium-hero relative overflow-hidden pb-16 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              1-on-1 Growth Consultation & Proposal
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mb-6 font-display text-4xl sm:text-6xl font-extrabold leading-tight text-white"
            >
              Get a Customized Growth Proposal & Direct Lead Strategy
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="max-w-2xl text-lg leading-8 text-white/70"
            >
              Stop wasting money on agencies that don't bring phone calls. Tell us about your business, and our senior growth team will craft a clear plan to bring you daily customer enquiries.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-6 flex flex-wrap gap-3">
              <Link to="/services/website-development" className="premium-badge">Website & Web Apps</Link>
              <Link to="/services/seo-digital-presence" className="premium-badge">Google Map #1 Ranking</Link>
              <Link to="/services/whatsapp-automation" className="premium-badge">24/7 WhatsApp Automation</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <motion.div variants={fadeUp} custom={0} className="premium-card lg:col-span-3 p-6 sm:p-8 rounded-2xl bg-[#0b1329]/90 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                    Instant AI Lead Diagnostic
                  </span>
                  <h2 className="font-display text-2xl font-bold text-white">Service Enquiry & Proposal Request</h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-300 flex items-center justify-center font-bold">
                  <Send size={18} />
                </div>
              </div>

              {submitted && (
                <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300">
                  Thank you! Our senior team will review your business details and send your custom proposal via WhatsApp and email.
                </div>
              )}
              {submitError && (
                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-300">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={fieldClass}
                      placeholder="e.g. Dr. Rajesh / Amit Sharma"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Business / Shop Name *</label>
                    <input
                      type="text"
                      required
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className={fieldClass}
                      placeholder="e.g. City Care Clinic / Apex Real Estate"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={fieldClass}
                      placeholder="+91 99887 73122"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={fieldClass}
                      placeholder="name@business.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={fieldClass}
                      placeholder="New Delhi / Mumbai / Chandigarh"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className={fieldClass}
                      placeholder="Punjab / Delhi NCR / Maharashtra"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Business Category (Optional)</label>
                  <input
                    type="text"
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    className={fieldClass}
                    placeholder="Clinic, retail shop, real estate, institute, salon, restaurant..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Do you have a website?</label>
                    <select
                      value={form.hasWebsite}
                      onChange={(e) => setForm({ ...form, hasWebsite: e.target.value })}
                      className={`${fieldClass} bg-[#0b1329]`}
                    >
                      <option value="">Select option</option>
                      <option value="Yes">Yes (Need Re-design / Better Leads)</option>
                      <option value="No">No (Need New Website)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Google Maps Profile?</label>
                    <select
                      value={form.hasGoogleProfile}
                      onChange={(e) => setForm({ ...form, hasGoogleProfile: e.target.value })}
                      className={`${fieldClass} bg-[#0b1329]`}
                    >
                      <option value="">Select option</option>
                      <option value="Yes">Yes (Need #1 Ranking)</option>
                      <option value="No">No (Need New Setup)</option>
                      <option value="Not sure">Not Sure</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>What is your primary requirement? *</label>
                  <select
                    required
                    value={form.need}
                    onChange={(e) => setForm({ ...form, need: e.target.value })}
                    className={`${fieldClass} bg-[#0b1329]`}
                  >
                    <option value="">Select your main objective</option>
                    {needOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Estimated Budget Range</label>
                  <select
                    value={form.budgetRange}
                    onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                    className={`${fieldClass} bg-[#0b1329]`}
                  >
                    <option value="">Select budget preference</option>
                    <option value="Starter (Rs. 2,999 - Rs. 9,999)">Starter (Rs. 2,999 - Rs. 9,999)</option>
                    <option value="Growth (Rs. 10,000 - Rs. 25,000)">Growth (Rs. 10,000 - Rs. 25,000)</option>
                    <option value="Scale-Up (Rs. 25,000 - Rs. 50,000)">Scale-Up (Rs. 25,000 - Rs. 50,000)</option>
                    <option value="Enterprise (Rs. 50,000+)">Enterprise (Rs. 50,000+)</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Tell Us About Your Growth Goals</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${fieldClass} resize-none`}
                    placeholder="Tell us what services you sell, who your main competitors are, and how many daily enquiries you'd like to receive..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all hover:scale-[1.01]"
                  disabled={isSubmitting}
                >
                  <Sparkles size={18} />
                  {isSubmitting ? "Submitting Request..." : "Generate My Custom Proposal"}
                  <ArrowRight size={18} />
                </button>

                <p className="text-xs leading-5 text-white/40 pt-1">
                  🔒 Your details are 100% private. We will analyze your online presence and send you a custom proposal via WhatsApp and email.
                </p>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={fadeUp} custom={1} className="lg:col-span-2 space-y-5">
              <h2 className="mb-4 font-display text-2xl font-bold text-white">Direct Channels</h2>

              <div className="p-6 rounded-2xl bg-[#0b1329]/90 border border-white/10 space-y-3">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">Official Agency Profile</span>
                <h3 className="font-display text-2xl font-bold text-white">{businessInfo.name}</h3>
                <p className="text-xs leading-relaxed text-white/60">{businessInfo.tagline}</p>
                <a
                  href={businessInfo.website}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:underline pt-1"
                >
                  {businessInfo.displayWebsite} →
                </a>
              </div>

              {contactInfo.map((c) => {
                const CardTag = c.href ? "a" : "div";
                return (
                  <CardTag
                    key={c.title}
                    href={c.href}
                    data-cta-location="contact_info"
                    className="p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      <c.icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white text-sm">{c.title}</h3>
                      <p className="text-white/60 text-xs mt-0.5">{c.detail}</p>
                    </div>
                  </CardTag>
                );
              })}

              {/* WhatsApp Callout */}
              <a
                href={businessInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-location="contact_info"
                className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#25D366] text-white shadow-lg shadow-emerald-500/20">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-sm">Instant WhatsApp Founder Chat</h3>
                  <p className="text-emerald-300 text-xs mt-0.5">Click to chat directly on WhatsApp for instant guidance</p>
                </div>
              </a>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Our Non-Technical Guarantee
                </div>
                <p className="text-xs leading-relaxed text-white/60">
                  We explain everything in plain English with 0 technical jargon. You get full control over your website, enquiries, and lead data.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      {/*<section className="pb-16">*/}
      {/*  <div className="section-container">*/}
      {/*    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ height: 380 }}>*/}
      {/*      <iframe*/}
      {/*        src="https://www.google.com/maps?q=Ludhiana%2C%20Punjab&output=embed"*/}
      {/*        width="100%"*/}
      {/*        height="100%"*/}
      {/*        style={{ border: 0 }}*/}
      {/*        allowFullScreen*/}
      {/*        loading="lazy"*/}
      {/*        referrerPolicy="no-referrer-when-downgrade"*/}
      {/*        title="Techneyo Solutions Service Area - India"*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}
    </div>
  );
};

export default Contact;
