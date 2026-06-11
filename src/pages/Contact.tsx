import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const contactInfo = [
  { icon: Phone, title: "Phone", detail: "+91 99887 73122", href: "tel:+919988773122" },
  { icon: Mail, title: "Email", detail: "hello@techneyo.com", href: "mailto:hello@techneyo.com" },
  { icon: MapPin, title: "Address", detail: "Ludhiana, Punjab", href: "#" },
  { icon: Clock, title: "Business Hours", detail: "Mon - Sat: 9:00 AM - 7:00 PM", href: "#" },
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
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    city: "",
    businessType: "",
    hasWebsite: "",
    hasGoogleProfile: "",
    need: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({
      name: "",
      businessName: "",
      phone: "",
      city: "",
      businessType: "",
      hasWebsite: "",
      hasGoogleProfile: "",
      need: "",
      message: "",
    });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 hero-gradient">
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">Contact Us</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">
              Request a Free Digital Business Audit
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 text-lg leading-relaxed">
              Tell us about your business. We will review your website, Google visibility, WhatsApp inquiry flow, and lead capture opportunities.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <motion.div variants={fadeUp} custom={0} className="lg:col-span-3">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Business Audit Form</h2>
              {submitted && (
                <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                  Thank you. Our team will review your business requirements and contact you with practical improvement suggestions.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Business Name</label>
                    <input
                      type="text"
                      required
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder="Your business name"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone/WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">City</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder="Ludhiana"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Business Type</label>
                  <input
                    type="text"
                    required
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="Clinic, coaching institute, restaurant, salon, real estate, manufacturing..."
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Do you already have a website?</label>
                    <select
                      required
                      value={form.hasWebsite}
                      onChange={(e) => setForm({ ...form, hasWebsite: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    >
                      <option value="">Select one</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Do you have Google Business Profile?</label>
                    <select
                      required
                      value={form.hasGoogleProfile}
                      onChange={(e) => setForm({ ...form, hasGoogleProfile: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    >
                      <option value="">Select one</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Not sure">Not Sure</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">What do you need?</label>
                  <select
                    required
                    value={form.need}
                    onChange={(e) => setForm({ ...form, need: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  >
                    <option value="">Select a requirement</option>
                    {needOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    placeholder="Tell us what you want to improve, automate, or promote..."
                  />
                </div>
                <button type="submit" className="btn-hero">
                  <Send size={16} /> Request Free Audit
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={fadeUp} custom={1} className="lg:col-span-2 space-y-5">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              {contactInfo.map((c) => (
                <a key={c.title} href={c.href} className="card-elevated p-5 flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <c.icon size={18} className="text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm">{c.title}</h3>
                    <p className="text-muted-foreground text-sm mt-0.5">{c.detail}</p>
                  </div>
                </a>
              ))}

              {/* WhatsApp */}
              <a
                href="https://wa.me/919988773122"
                target="_blank"
                rel="noopener noreferrer"
                className="card-elevated p-5 flex items-center gap-4 border-accent/30 group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#25D366" }}>
                  <MessageCircle size={18} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">WhatsApp</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">Quick connect on WhatsApp</p>
                </div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-muted/50">
        <div className="section-container py-10">
          <div className="rounded-xl overflow-hidden border border-border" style={{ height: 400 }}>
            <iframe
              src="https://www.google.com/maps?q=Ludhiana%2C%20Punjab&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Techneyo Solutions Location - Ludhiana, Punjab"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
