import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe, Smartphone, Cloud, Brain, Palette, Megaphone, Server, Shield,
  CheckCircle2, Star, ArrowRight, Phone, Mail, MapPin, Users, Award, Zap, Clock
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const services = [
  { icon: Globe, title: "Web Development", desc: "Custom websites and web applications built with modern frameworks." },
  { icon: Smartphone, title: "Mobile App Development", desc: "Native and cross-platform mobile apps for iOS and Android." },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Scalable cloud infrastructure and CI/CD pipeline solutions." },
  { icon: Brain, title: "AI & Automation", desc: "Intelligent automation and machine learning solutions." },
  { icon: Palette, title: "UI/UX Design", desc: "User-centered design that drives engagement and conversions." },
  { icon: Megaphone, title: "Digital Marketing", desc: "SEO, PPC, social media, and content marketing strategies." },
  { icon: Server, title: "Server Management", desc: "24/7 monitoring, maintenance, and security for your servers." },
  { icon: Shield, title: "IT Consulting", desc: "Strategic technology consulting to accelerate your growth." },
];

const whyChooseUs = [
  { icon: Award, title: "Proven Expertise", desc: "3+ years delivering solutions across industries." },
  { icon: Users, title: "Dedicated Team", desc: "Skilled professionals committed to your success." },
  { icon: Zap, title: "Agile Approach", desc: "Fast iterations and transparent communication." },
  { icon: Clock, title: "24/7 Support", desc: "Round-the-clock assistance when you need it." },
];

const testimonials = [
  { name: "Rajesh Sharma", role: "CEO, FinEdge Solutions", text: "Techneyo Solutions transformed our digital presence. Their web development team delivered beyond expectations.", rating: 5 },
  { name: "Priya Mehta", role: "Founder, StyleHub", text: "The mobile app they built for us increased our revenue by 40%. Highly recommend their services.", rating: 5 },
  { name: "Amit Verma", role: "CTO, DataFlow Inc.", text: "Their cloud migration expertise saved us significant costs. Professional and reliable team.", rating: 5 },
];

const stats = [
  { value: "200+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "30+", label: "Team Members" },
  { value: "99%", label: "Client Satisfaction" },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-gradient opacity-85" />
        </div>
        <div className="section-container relative z-10 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
              Innovative IT Solutions Since 2021
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Empowering Businesses with{" "}
              <span className="text-accent">Next-Gen Technology</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 text-lg sm:text-xl max-w-2xl mb-8 leading-relaxed">
              From web & mobile development to AI and cloud solutions — we deliver end-to-end IT services that drive growth and innovation.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-hero">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn-outline-hero">
                Our Services
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                custom={i + 4}
                className="text-center bg-primary-foreground/10 backdrop-blur-sm rounded-xl py-5 px-4 border border-primary-foreground/10"
              >
                <div className="font-display text-3xl font-bold text-primary-foreground">{s.value}</div>
                <div className="text-primary-foreground/60 text-sm mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Brief */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
              About Us
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-5">
              Your Trusted IT Partner in Ludhiana
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed">
              Established in 2021, Techneyo Solutions is a full-service IT company based in Ludhiana, Punjab. We combine technical expertise with creative thinking to deliver digital solutions that help businesses thrive in today's competitive landscape.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8">
              <Link to="/about" className="btn-hero">
                Learn More About Us <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
              What We Do
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Our Services
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((s, i) => (
              <motion.div key={s.title} variants={fadeUp} custom={i} className="card-elevated p-6 text-center group">
                <div className="w-14 h-14 rounded-xl hero-gradient mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <s.icon size={26} className="text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Link to="/services" className="btn-hero">
                View All Services <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="text-center mb-14">
              <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
                Why Techneyo
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Why Choose Us
              </motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item, i) => (
                <motion.div key={item.title} variants={fadeUp} custom={i + 2} className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                    <item.icon size={22} className="text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="text-center mb-14">
              <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
                Testimonials
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                What Our Clients Say
              </motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={t.name} variants={fadeUp} custom={i + 2} className="card-elevated p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={16} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">
              Let's discuss how our IT solutions can help you achieve your goals. Get in touch today.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all">
                Contact Us <ArrowRight size={18} />
              </Link>
              <a href="tel:+919988773122" className="btn-outline-hero">
                <Phone size={18} /> Call Now
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="text-center mb-14">
              <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
                Get In Touch
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Contact Us
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} custom={2} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Phone, title: "Call Us", detail: "+91 99887 73122", href: "tel:+919988773122" },
                { icon: Mail, title: "Email Us", detail: "hello@techneyo.com", href: "mailto:hello@techneyo.com" },
                { icon: MapPin, title: "Visit Us", detail: "Ludhiana, Punjab", href: "#" },
              ].map((c) => (
                <a key={c.title} href={c.href} className="card-elevated p-6 text-center group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <c.icon size={20} className="text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm mb-1">{c.title}</h3>
                  <p className="text-muted-foreground text-sm">{c.detail}</p>
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
