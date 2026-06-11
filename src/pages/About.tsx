import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Award, Zap, Clock, TrendingUp } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const values = [
  { icon: Heart, title: "Client First", desc: "Every decision we make starts with our client's success in mind." },
  { icon: Zap, title: "Innovation", desc: "We stay ahead of technology trends to deliver cutting-edge solutions." },
  { icon: Users, title: "Collaboration", desc: "We work as an extension of your team, not just a vendor." },
  { icon: Award, title: "Excellence", desc: "Quality is embedded in every line of code and every pixel we design." },
];

const milestones = [
  { year: "2021", title: "Founded", desc: "NexaTech established in New Delhi with a vision to democratize technology." },
  { year: "2022", title: "50+ Projects", desc: "Crossed 50 successful project deliveries across multiple industries." },
  { year: "2023", title: "Team Expansion", desc: "Grew to 25+ talented professionals and expanded service offerings." },
  { year: "2024", title: "AI & Cloud", desc: "Launched dedicated AI solutions and cloud consulting divisions." },
  { year: "2025", title: "200+ Projects", desc: "Reached 200+ projects with clients across India and globally." },
];

const team = [
  { name: "Vikram Singh", role: "Founder & CEO", initials: "VS" },
  { name: "Ananya Gupta", role: "CTO", initials: "AG" },
  { name: "Rohan Joshi", role: "Head of Design", initials: "RJ" },
  { name: "Sneha Kapoor", role: "Lead Developer", initials: "SK" },
];

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 hero-gradient">
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">About Us</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">
              Building the Future, One Solution at a Time
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 text-lg leading-relaxed">
              Since 2021, we've been helping businesses across India and beyond leverage technology to grow, innovate, and succeed.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Our Story</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold text-foreground mb-5">
                From a Vision to a Trusted IT Partner
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground leading-relaxed mb-4">
                NexaTech was founded in 2021 in the heart of New Delhi with a clear mission — to make world-class technology solutions accessible to businesses of all sizes. What started as a small team of passionate developers has grown into a full-service IT company.
              </motion.p>
              <motion.p variants={fadeUp} custom={3} className="text-muted-foreground leading-relaxed">
                Today, we serve 50+ clients with a team of 30+ professionals, delivering everything from custom web applications to enterprise cloud solutions.
              </motion.p>
            </div>
            <motion.div variants={fadeUp} custom={2} className="grid grid-cols-2 gap-4">
              {[
                { value: "200+", label: "Projects" },
                { value: "50+", label: "Clients" },
                { value: "30+", label: "Team Size" },
                { value: "4+", label: "Years" },
              ].map((s) => (
                <div key={s.label} className="card-elevated p-6 text-center">
                  <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
                  <div className="text-muted-foreground text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} custom={0} className="card-elevated p-8">
              <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center mb-4">
                <Target size={24} className="text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower businesses with innovative, scalable, and cost-effective technology solutions that drive real results and lasting competitive advantage.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} className="card-elevated p-8">
              <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center mb-4">
                <Eye size={24} className="text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become India's most trusted IT partner for growing businesses, recognized for our technical excellence, innovation, and unwavering commitment to client success.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-14">
              <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Core Values</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-foreground">What Drives Us</motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <motion.div key={v.title} variants={fadeUp} custom={i + 2} className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                    <v.icon size={22} className="text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-14">
              <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Our Team</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-foreground">Meet the Experts</motion.h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((m, i) => (
                <motion.div key={m.name} variants={fadeUp} custom={i + 2} className="card-elevated p-6 text-center">
                  <div className="w-16 h-16 rounded-full hero-gradient mx-auto mb-4 flex items-center justify-center">
                    <span className="font-display text-xl font-bold text-primary-foreground">{m.initials}</span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm">{m.name}</h3>
                  <p className="text-muted-foreground text-xs mt-1">{m.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-14">
              <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Our Journey</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl font-bold text-foreground">Company Milestones</motion.h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-0">
              {milestones.map((m, i) => (
                <motion.div key={m.year} variants={fadeUp} custom={i + 2} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center shrink-0">
                      <TrendingUp size={16} className="text-primary-foreground" />
                    </div>
                    {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                  </div>
                  <div className="pb-10">
                    <span className="text-accent font-display font-bold text-sm">{m.year}</span>
                    <h3 className="font-display font-semibold text-foreground mt-1">{m.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
