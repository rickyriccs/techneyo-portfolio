import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  CheckCircle2,
  Send,
  MessageSquare,
  Zap,
  Gift,
  PhoneCall,
  Mail,
  User,
  Building,
  FileText,
  Check,
  Tag,
} from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";
import { createContactEnquiry } from "@/lib/contact-enquiries";

export const SmartProposalModal: React.FC = () => {
  const {
    isProposalModalOpen,
    closeProposalModal,
    proposalData,
    preferences,
  } = usePersonalization();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRefCode, setSubmittedRefCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isProposalModalOpen) return null;

  const targetService =
    proposalData?.serviceTitle ||
    (preferences.primaryGoal ? preferences.primaryGoal.replace("_", " ").toUpperCase() : "IT GROWTH SOLUTION");

  const basePrice = proposalData?.startingPrice;
  const totalPrice = proposalData?.totalPrice;
  const selectedAddons = proposalData?.selectedAddons || [];

  const bonusOffer =
    preferences.timelineBudget === "urgent"
      ? "FREE Local SEO & Speed Audit"
      : preferences.timelineBudget === "standard"
      ? "FREE WhatsApp Automation Bot Setup"
      : "FREE 1-Month Meta / Google Ad Campaign Setup";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    setErrorMessage("");
    const refCode = `PROP-${Math.floor(100000 + Math.random() * 900000)}`;

    const addonsText = selectedAddons.length > 0
      ? selectedAddons.map((a) => `${a.name} (+₹${a.price.toLocaleString("en-IN")})`).join(", ")
      : "None selected";

    const formattedBudget = totalPrice
      ? `₹${totalPrice.toLocaleString("en-IN")}`
      : basePrice
      ? `₹${basePrice.toLocaleString("en-IN")}`
      : "Custom Quote";

    const detailedMessage = `[PROPOSAL REF: ${refCode}]
Service: ${targetService}
Calculated Investment: ${formattedBudget}
Base Price: ${basePrice ? `₹${basePrice.toLocaleString("en-IN")}` : "N/A"}
Selected Add-ons: ${addonsText}
Included Bonus: ${bonusOffer}
Goal: ${preferences.primaryGoal || "Not specified"}
Business Stage: ${preferences.businessType || "Not specified"}
User Notes: ${formData.notes || "None"}`;

    try {
      await createContactEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        businessName: formData.businessName,
        serviceRequired: `${targetService}${totalPrice ? ` (Total: ₹${totalPrice.toLocaleString("en-IN")})` : ""}`,
        budgetRange: formattedBudget,
        message: detailedMessage,
        sourcePage: window.location.pathname,
      });
    } catch (err: any) {
      console.warn("Error submitting proposal enquiry", err);
      setErrorMessage(err.message || "Failed to record enquiry to database.");
    }

    setSubmittedRefCode(refCode);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const getFormattedWhatsAppUrl = () => {
    const addonsSummary = selectedAddons.length > 0
      ? selectedAddons.map((a) => `• ${a.name} (+₹${a.price})`).join("\n")
      : "None";

    const text = `Hello Techneyo Team, I generated my Custom AI Proposal on your website!\n\n📋 *Proposal Ref:* ${submittedRefCode}\n👤 *Name:* ${formData.name}\n📞 *Phone:* ${formData.phone}\n💼 *Service:* ${targetService}\n💰 *Calculated Total:* ${totalPrice ? `₹${totalPrice.toLocaleString("en-IN")}` : "Custom Quote"}\n➕ *Add-ons Selected:*\n${addonsSummary}\n🎁 *Included Bonus:* ${bonusOffer}\n🏢 *Business:* ${formData.businessName || "Not specified"}\n\nPlease review my proposal and share the execution roadmap.`;
    return `https://wa.me/919988773122?text=${encodeURIComponent(text)}`;
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({ name: "", email: "", phone: "", businessName: "", notes: "" });
    closeProposalModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#0b1329] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0d1733]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Custom AI Proposal & Special Offer
                </h3>
                <span className="text-xs text-white/60 block">
                  Tailored package for: <span className="font-semibold text-cyan-300">{targetService}</span>
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSubmitted ? (
            <div className="p-6 space-y-6">
              {/* Itemized Proposal Summary Box */}
              <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Itemized Package Breakdown
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Free Consultation Included
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Base Package Line */}
                  <div className="flex items-center justify-between bg-white/[0.04] p-2.5 rounded-lg border border-white/5">
                    <span className="text-white/80 font-medium">Base Service ({targetService.split(" (")[0]})</span>
                    <span className="font-bold text-cyan-300 text-[11px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      Standard Global Scope
                    </span>
                  </div>

                  {/* Selected Add-ons List */}
                  {selectedAddons.length > 0 && (
                    <div className="bg-white/[0.04] p-2.5 rounded-lg border border-white/5 space-y-1.5">
                      <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                        Selected Upgrades ({selectedAddons.length})
                      </span>
                      {selectedAddons.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between text-[11px]">
                          <span className="text-white/70 flex items-center gap-1">
                            <Check className="w-3 h-3 text-cyan-400" /> {addon.name}
                          </span>
                          <span className="font-semibold text-cyan-300">Included</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Total & Bonus Line */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500/20 to-blue-600/20 p-3 rounded-lg border border-cyan-500/30">
                    <div>
                      <span className="text-xs font-bold text-white block">Project Scope Status</span>
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Gift className="w-3 h-3" /> Includes: {bonusOffer}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-cyan-300 font-display bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-500/30">
                      Tailored Global Proposal
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/90 mb-1">
                      Your Full Name <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/90 mb-1">
                      Phone / WhatsApp Number <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <PhoneCall className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 99887 73122"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/90 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rahul@company.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/90 mb-1">
                      Company / Business Name (Optional)
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="e.g. Nexa Retail Pvt Ltd"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/90 mb-1">
                    Project Requirements / Specific Goals (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Briefly describe target launch date or custom features..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving Proposal Lead...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Proposal & Get Instant WhatsApp Confirmation
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Proposal Saved & Sent to Admin Team!
                </span>
                <h4 className="text-2xl font-bold text-white mt-1 font-display">
                  Thank You, {formData.name}!
                </h4>
                <p className="text-xs text-white/70 mt-2 max-w-md mx-auto">
                  Your customized proposal reference is <strong className="text-cyan-300">{submittedRefCode}</strong>. Our senior solution architect is reviewing your itemized requirements.
                </p>
              </div>

              {/* Instant WhatsApp Action */}
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-left space-y-3">
                <div className="flex items-center gap-2 text-green-300 font-bold text-sm">
                  <MessageSquare className="w-5 h-5 shrink-0" />
                  Instant WhatsApp Proposal Delivery
                </div>
                <p className="text-xs text-white/70">
                  Click below to open WhatsApp with your pre-filled proposal code for instant direct communication with our technical team.
                </p>
                <a
                  href={getFormattedWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Open WhatsApp & Send Proposal Code Now
                </a>
              </div>

              <button
                onClick={handleClose}
                className="text-xs text-white/60 hover:text-white underline font-medium"
              >
                Close & Return to Website
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SmartProposalModal;
