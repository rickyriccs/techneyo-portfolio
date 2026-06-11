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
  { icon: Phone, title: "Phone", detail: "+91 123 456 7890", href: "tel:+911234567890" },
  { icon: Mail, title: "Email", detail: "hello@nexatech.in", href: "mailto:hello@nexatech.in" },
  { icon: MapPin, title: "Address", detail: "Connaught Place, New Delhi, India 110001", href: "#" },
  { icon: Clock, title: "Business Hours", detail: "Mon - Sat: 9:00 AM - 7:00 PM", href: "#" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 hero-gradient">
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">Contact Us</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">
              Let's Start a Conversation
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 text-lg leading-relaxed">
              Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
              {submitted && (
                <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                  Thank you! Your message has been sent. We'll get back to you shortly.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button type="submit" className="btn-hero">
                  <Send size={16} /> Send Message
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
                href="https://wa.me/911234567890"
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14006.552270028998!2d77.21505565!3d28.6328295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="NexaTech Location - New Delhi"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
