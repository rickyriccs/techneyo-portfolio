import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe, Smartphone, Cloud, Brain, Palette, Megaphone, Server, Shield, ArrowRight, CheckCircle2
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
    icon: Globe, title: "Web Development",
    desc: "We build high-performance websites and web applications using modern technologies like React, Next.js, and Node.js.",
    features: ["Custom Web Applications", "E-commerce Solutions", "Progressive Web Apps", "CMS Development"],
  },
  {
    icon: Smartphone, title: "Mobile App Development",
    desc: "Native and cross-platform mobile applications for iOS and Android that deliver seamless user experiences.",
    features: ["iOS & Android Apps", "React Native / Flutter", "App Store Optimization", "Maintenance & Updates"],
  },
  {
    icon: Cloud, title: "Cloud & DevOps",
    desc: "Scalable cloud infrastructure design, migration, and management with automated CI/CD pipelines.",
    features: ["AWS / Azure / GCP", "Cloud Migration", "CI/CD Pipelines", "Infrastructure as Code"],
  },
  {
    icon: Brain, title: "AI & Automation",
    desc: "Leverage artificial intelligence and machine learning to automate processes and gain intelligent insights.",
    features: ["Machine Learning Models", "Chatbots & NLP", "Process Automation", "Predictive Analytics"],
  },
  {
    icon: Palette, title: "UI/UX Design",
    desc: "User-centered design that combines aesthetics with functionality to create engaging digital experiences.",
    features: ["User Research", "Wireframing & Prototyping", "Visual Design", "Usability Testing"],
  },
  {
    icon: Megaphone, title: "Digital Marketing",
    desc: "Data-driven marketing strategies that increase your online visibility and drive qualified leads.",
    features: ["SEO Optimization", "PPC Campaigns", "Social Media Marketing", "Content Strategy"],
  },
  {
    icon: Server, title: "Server Management",
    desc: "24/7 server monitoring, maintenance, and security to ensure your infrastructure runs smoothly.",
    features: ["Server Setup & Config", "Performance Monitoring", "Security Hardening", "Backup & Recovery"],
  },
  {
    icon: Shield, title: "IT Consulting",
    desc: "Strategic technology consulting to align your IT infrastructure with business goals and drive growth.",
    features: ["Technology Assessment", "Digital Strategy", "Vendor Management", "IT Roadmap Planning"],
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
              Comprehensive IT Solutions for Your Business
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 text-lg leading-relaxed">
              From concept to deployment and beyond — we offer end-to-end technology services tailored to your needs.
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
                  Get Quote <ArrowRight size={14} />
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
              Need a Custom Solution?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">
              Every business is unique. Let us build a tailored solution that fits your exact requirements.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all">
                Contact Us <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
