import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Stethoscope,
  ShoppingBag,
  Building2,
  GraduationCap,
  Utensils,
  Scissors,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { industryRegistry } from "@/lib/industry-data";
import { usePersonalization } from "@/context/PersonalizationContext";

const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  ShoppingBag,
  Building2,
  GraduationCap,
  Utensils,
  Scissors,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export const Industries: React.FC = () => {
  const { openProposalModal } = usePersonalization();
  const industriesList = Object.values(industryRegistry);

  return (
    <div className="public-premium min-h-screen overflow-hidden bg-[#030711] text-white">
      <PageMeta
        title="Industry Solutions | Customized Websites, Apps & Ads for Your Business"
        description="Tailored digital solutions for Healthcare & Clinics, E-Commerce, Real Estate, Education, Restaurants, and Local Business Services across Bharat & Asia."
        canonicalPath="/industries"
      />

      {/* Hero */}
      <section className="premium-hero relative overflow-hidden pb-16 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tailored Industry Solutions
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mb-6 font-display text-4xl sm:text-6xl font-extrabold leading-tight text-white"
            >
              Digital Growth Solutions Built Specifically for Your Industry.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="max-w-2xl text-lg leading-8 text-white/70"
            >
              Every business vertical has unique needs. Select your industry below to view custom packages, industry-specific deliverables, and tailored ROI guarantees.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Industry Grid */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industriesList.map((ind, idx) => {
              const IconComponent = iconMap[ind.iconName] || Building2;
              return (
                <motion.div
                  key={ind.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0b1329]/90 border border-white/10 shadow-xl hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${ind.gradient} text-white shadow-md`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                        From ₹{ind.startingPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {ind.title}
                      </h3>
                      <p className="text-xs text-cyan-200/80 font-medium mt-0.5">{ind.subtitle}</p>
                      <p className="text-xs text-white/70 mt-2 leading-relaxed">{ind.tagline}</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      {ind.includedDeliverables.slice(0, 3).map((item, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs text-white/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-4 flex items-center justify-between border-t border-white/5">
                    <Link
                      to={`/industries/${ind.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 group-hover:text-white transition-colors"
                    >
                      View Industry Package <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proposal Trigger CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-900/30 via-[#0b1329] to-blue-900/30 border-t border-white/10 text-center">
        <div className="section-container max-w-3xl mx-auto space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
            Don’t See Your Exact Industry Listed?
          </h2>
          <p className="text-base text-white/70">
            We build custom digital solutions for any business category. Tell us your goals and get a tailored proposal in 60 seconds.
          </p>
          <button
            onClick={() => openProposalModal()}
            className="premium-btn premium-btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
          >
            <Sparkles size={20} /> Build My Custom Business Proposal <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Industries;
