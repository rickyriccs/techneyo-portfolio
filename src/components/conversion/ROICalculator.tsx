import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Users, Shield, ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const ROICalculator: React.FC = () => {
  const [teamSize, setTeamSize] = useState<number>(2);

  // US/Canada average engineering cost per fullstack engineer (salary + benefits + overhead): ~$145,000/yr
  const usCostPerEngineer = 145000;
  // Techneyo Dedicated High-Seniority Pod: ~$42,000/yr
  const techneyoCostPerEngineer = 42000;

  const totalUsCost = teamSize * usCostPerEngineer;
  const totalTechneyoCost = teamSize * techneyoCostPerEngineer;
  const annualSavings = totalUsCost - totalTechneyoCost;
  const savingsPercent = Math.round((annualSavings / totalUsCost) * 100);

  return (
    <GlassCard
      className="overflow-hidden border border-white/[0.12] bg-[#06122B]/95 p-6 sm:p-10 shadow-2xl"
      glowColor="orange"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        {/* Left: Interactive Controls */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-[#FE6F17]/10 px-3 py-1 text-xs font-semibold text-orange-300">
            <DollarSign size={13} className="text-[#FE6F17]" />
            <span>North America Offshore Arbitrage Model</span>
          </div>

          <h3 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Calculate Your Annual Engineering Cost Savings
          </h3>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Silicon Valley engineering craft delivered with global timezone overlap. Compare typical US/Canadian local agency hiring costs against Techneyo's dedicated dedicated pods.
          </p>

          {/* Interactive Slider */}
          <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-[#020817]/70 p-5">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-300 flex items-center gap-2">
                <Users size={16} className="text-cyan-400" />
                Dedicated Senior Engineers Needed:
              </span>
              <span className="font-mono text-xl text-white bg-white/[0.08] px-3 py-1 rounded-lg">
                {teamSize} {teamSize === 1 ? "Engineer" : "Engineers"}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FE6F17]"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>1 Pod (Lean)</span>
              <span>4 Engineers (Core)</span>
              <span>8 Engineers (Scale)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-emerald-400" />
              <span>100% Day-One IP Ownership</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-emerald-400" />
              <span>14-Day Risk-Free Trial Period</span>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Savings Metric Display */}
        <div className="relative rounded-2xl border border-orange-500/30 bg-gradient-to-b from-[#0B1E45] to-[#020817] p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(254,111,23,0.15)]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-widest text-orange-300 font-bold">
              Guaranteed Bottom-Line Impact
            </div>

            <div>
              <div className="text-xs text-slate-400">Estimated Annual Cost Savings:</div>
              <motion.div
                key={annualSavings}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-[#FE6F17] mt-1"
              >
                ${annualSavings.toLocaleString()} USD
              </motion.div>
              <div className="text-xs font-semibold text-emerald-400 mt-1">
                Save ~{savingsPercent}% vs hiring in US / Canada
              </div>
            </div>

            <div className="space-y-2 border-t border-white/[0.08] pt-4 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>US/Canada In-House / Agency:</span>
                <span className="line-through text-red-300 font-bold">
                  ${totalUsCost.toLocaleString()}/yr
                </span>
              </div>
              <div className="flex justify-between text-cyan-300 font-bold">
                <span>Techneyo Dedicated Pod:</span>
                <span>${totalTechneyoCost.toLocaleString()}/yr</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
            <Link to="/contact" className="w-full">
              <MagneticButton
                variant="primary"
                className="w-full py-3 text-sm font-bold shadow-brand-orange"
              >
                <Calendar size={15} />
                <span>Book 15-Min Discovery Call</span>
                <ArrowRight size={15} />
              </MagneticButton>
            </Link>

            <Link
              to="/solution-finder"
              className="text-center text-xs font-medium text-slate-300 hover:text-white transition-colors py-1"
            >
              Or take our 60-second Solution Finder Quiz →
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ROICalculator;
