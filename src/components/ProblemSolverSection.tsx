import React from "react";
import { motion } from "framer-motion";
import { Globe, Boxes, Workflow, ShieldCheck, Bot, Cpu, ArrowRight } from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";

const problemCards = [
  {
    title: "Need a Website That Gets You Customers?",
    desc: "We build fast, modern websites that show up on Google and make it effortless for visitors to call you or message on WhatsApp.",
    cta: "Build My Website",
    serviceKey: "Business Website Development",
    icon: Globe,
  },
  {
    title: "Have a Software Idea But Don't Know How to Build It?",
    desc: "We take your concept and build a clean, easy-to-use software product ready for your customers to sign up and pay for.",
    cta: "Discuss Software Idea",
    serviceKey: "SaaS & Digital Product Development",
    icon: Boxes,
  },
  {
    title: "Tired of Managing Everything Manually in Excel?",
    desc: "Replace spreadsheet clutter with a custom dashboard that organizes your orders, clients, and team tasks automatically.",
    cta: "Automate Workflows",
    serviceKey: "Custom Software & Dashboards",
    icon: Workflow,
  },
  {
    title: "Is Your Current Website or Software Slow or Buggy?",
    desc: "We audit your existing system, fix bugs, speed up page loads, and make it simple for your team and customers to use.",
    cta: "Audit My Software",
    serviceKey: "Custom Software & Dashboards",
    icon: ShieldCheck,
  },
  {
    title: "Want to Use AI to Save Time & Money?",
    desc: "Let AI handle 24/7 customer questions, send automated WhatsApp confirmations, and read PDF invoices automatically.",
    cta: "Explore AI Solutions",
    serviceKey: "AI & Business Automation",
    icon: Bot,
  },
  {
    title: "Need Honest Tech Advice Before Investing?",
    desc: "Get clear, friendly advisory on choosing the right tools, estimating realistic costs, and reviewing developer proposals.",
    cta: "Get Tech Guidance",
    serviceKey: "Technology Advisory & Guidance",
    icon: Cpu,
  },
];

interface ProblemSolverSectionProps {
  className?: string;
  onSelectService?: (serviceKey: string) => void;
}

export const ProblemSolverSection: React.FC<ProblemSolverSectionProps> = ({
  className = "",
  onSelectService,
}) => {
  const { openProposalModal } = usePersonalization();

  const handleCardClick = (serviceKey: string) => {
    if (onSelectService) {
      onSelectService(serviceKey);
    } else {
      openProposalModal(serviceKey);
    }
  };

  return (
    <section className={`premium-section py-16 sm:py-20 ${className}`}>
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Problem Solver
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight">
            Have a Specific Tech Problem?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-white/60">
            Click on your main challenge below and let's turn it into a smooth digital solution.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {problemCards.map((p, idx) => {
            const IconC = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#060e1d]/80 p-6 backdrop-blur-md transition-all hover:border-cyan-400/40 hover:bg-[#0a162d]/90 shadow-xl group"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                    <IconC size={21} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">
                    {p.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleCardClick(p.serviceKey)}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 py-2.5 px-4 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-400 hover:text-black hover:border-cyan-400"
                >
                  <span>{p.cta}</span>
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolverSection;
