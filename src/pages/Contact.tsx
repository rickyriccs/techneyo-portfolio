import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { createContactEnquiry } from "@/lib/contact-enquiries";
import PageMeta from "@/components/PageMeta";
import { businessInfo, pageDescriptions } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";
import { trackEvent } from "@/lib/analytics";
import { setLeadContext } from "@/lib/utm";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const contactInfo = [
  { icon: Phone, title: "Call/WhatsApp", detail: businessInfo.phoneDisplay, href: businessInfo.phoneHref },
  { icon: Mail, title: "Email", detail: businessInfo.email, href: `mailto:${businessInfo.email}` },
  { icon: MapPin, title: "Service Area", detail: `${businessInfo.location} | Serving Bharat & Asia`, href: businessInfo.website },
  { icon: Clock, title: "Business Hours", detail: "Mon - Sat: 9:00 AM - 7:00 PM" },
];

const needOptions = [
  "Website",
  "Google Business Profile",
  "SEO",
  "WhatsApp inquiry system",
  "CRM",
  "Custom software",
  "Mobile app",
  "AI automation",
  "Not sure, need guidance",
];

const Contact = () => {
  const navigate = useNavigate();
  const fieldClass = "w-full rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-cyan-200/50 focus:ring-2 focus:ring-cyan-300/15";
  const labelClass = "mb-1.5 block text-sm font-medium text-white/82";
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
          `Business type: ${form.businessType}`,
          `Has website: ${form.hasWebsite}`,
          `Has Google Business Profile: ${form.hasGoogleProfile}`,
        ].join("\n"),
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
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta title="Contact Techneyo Solutions | Discuss Website, CRM or Automation Requirement" description="Contact Techneyo Solutions to discuss website development, CRM, SEO, WhatsApp automation, admin dashboard, or custom software requirements for your business." canonicalPath="/contact" schema={organizationSchema} />
      {/* Hero */}
      <section className="premium-hero relative overflow-hidden pb-20 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">Contact Us</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="mb-6 font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              Discuss Your Website, CRM or Automation Requirement
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="max-w-2xl text-lg leading-8 text-white/68">
              Contact Techneyo Solutions for website development, CRM systems, admin dashboards, business automation, SEO setup, WhatsApp automation consultation, and custom web-based software.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-6 flex flex-wrap gap-3">
              <Link to="/services/website-development" className="premium-badge">website development company in Bharat</Link>
              <Link to="/services/crm-development" className="premium-badge">CRM development company in Bharat</Link>
              <Link to="/services/business-automation" className="premium-badge">business automation solutions Bharat</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="premium-section">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <motion.div variants={fadeUp} custom={0} className="premium-card lg:col-span-3 p-6 sm:p-8">
              <p className="premium-eyebrow">Lead form</p>
              <h2 className="mb-6 font-display text-2xl font-bold text-white">Service Enquiry Form</h2>
              {submitted && (
                <div className="mb-6 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-medium text-emerald-100">
                  Thank you. Our team will review your business requirements and contact you with practical improvement suggestions.
                </div>
              )}
              {submitError && (
                <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={fieldClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Business Name</label>
                    <input
                      type="text"
                      required
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className={fieldClass}
                      placeholder="Your business name"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Phone/WhatsApp Number</label>
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
                    <label className={labelClass}>Email</label>
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
                    <label className={labelClass}>City</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={fieldClass}
                      placeholder="New Delhi / Mumbai"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className={fieldClass}
                      placeholder="Punjab"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Business Type</label>
                  <input
                    type="text"
                    required
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    className={fieldClass}
                    placeholder="Clinic, coaching institute, restaurant, salon, real estate, manufacturing..."
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Do you already have a website?</label>
                    <select
                      required
                      value={form.hasWebsite}
                      onChange={(e) => setForm({ ...form, hasWebsite: e.target.value })}
                      className={fieldClass}
                    >
                      <option value="">Select one</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Do you have Google Business Profile?</label>
                    <select
                      required
                      value={form.hasGoogleProfile}
                      onChange={(e) => setForm({ ...form, hasGoogleProfile: e.target.value })}
                      className={fieldClass}
                    >
                      <option value="">Select one</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Not sure">Not Sure</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>What do you need?</label>
                  <select
                    required
                    value={form.need}
                    onChange={(e) => setForm({ ...form, need: e.target.value })}
                    className={fieldClass}
                  >
                    <option value="">Select a requirement</option>
                    {needOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Budget Range</label>
                  <select
                    value={form.budgetRange}
                    onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                    className={fieldClass}
                  >
                    <option value="">Select budget range</option>
                    <option value="Under Rs. 5,000">Under Rs. 5,000</option>
                    <option value="Rs. 5,000 - Rs. 15,000">Rs. 5,000 - Rs. 15,000</option>
                    <option value="Rs. 15,000 - Rs. 50,000">Rs. 15,000 - Rs. 50,000</option>
                    <option value="Above Rs. 50,000">Above Rs. 50,000</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${fieldClass} resize-none`}
                    placeholder="Tell us what you want to improve, automate, or promote..."
                  />
                </div>
                <button type="submit" className="premium-btn premium-btn-primary" disabled={isSubmitting}>
                  <Send size={16} /> {isSubmitting ? "Submitting..." : "Discuss Your Digital Requirement"}
                </button>
                <p className="text-xs leading-5 text-white/45">
                  By submitting this form, you agree that Techneyo Solutions may contact you by phone, WhatsApp, or email regarding your enquiry.
                </p>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={fadeUp} custom={1} className="lg:col-span-2 space-y-5">
              <h2 className="mb-6 font-display text-2xl font-bold text-white">Contact Information</h2>
              <div className="premium-card p-5">
                <p className="premium-eyebrow">Business name</p>
                <h3 className="font-display text-2xl font-bold text-white">{businessInfo.name}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{businessInfo.tagline}</p>
                <a href={businessInfo.website} className="mt-3 inline-block text-sm font-semibold text-cyan-100 hover:text-white">
                  {businessInfo.displayWebsite}
                </a>
              </div>
              {contactInfo.map((c) => {
                const CardTag = c.href ? "a" : "div";
                return (
                <CardTag key={c.title} href={c.href} data-cta-location="contact_info" className="premium-card premium-card-hover p-5 flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-cyan-300/10 flex items-center justify-center shrink-0 text-cyan-100">
                    <c.icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-white text-sm">{c.title}</h3>
                    <p className="text-white/58 text-sm mt-0.5">{c.detail}</p>
                  </div>
                </CardTag>
              );
              })}

              {/* WhatsApp */}
              <a
                href={businessInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-location="contact_info"
                className="premium-card premium-card-hover p-5 flex items-center gap-4 border-accent/30 group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#25D366" }}>
                  <MessageCircle size={18} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white text-sm">WhatsApp</h3>
                  <p className="text-white/58 text-sm mt-0.5">Chat on WhatsApp for project or support queries</p>
                </div>
              </a>

              <div className="premium-card p-5">
                <p className="premium-eyebrow">Official channels</p>
                <p className="text-sm leading-6 text-white/60">
                  Techneyo Solutions uses official business communication channels for client enquiries, project discussions, and support. Customers can contact us through our website, email, phone, or WhatsApp.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-12">
        <div className="section-container py-10">
          <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: 400 }}>
            <iframe
              src="https://www.google.com/maps?q=Ludhiana%2C%20Punjab&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Techneyo Solutions Service Area - Bharat (India)"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
