import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Wifi,
  Building2,
  User,
  Phone,
  Mail,
  Briefcase,
  Copy,
  Check,
  Coffee,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { createContactEnquiry } from "@/lib/contact-enquiries";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

const PURPOSES = [
  { id: "client_meeting", label: "Client Consultation / Pitch" },
  { id: "project_review", label: "Project Review / Milestone" },
  { id: "interview", label: "Interview / Candidate" },
  { id: "vendor_partner", label: "Vendor / Partner / Delivery" },
  { id: "casual_coffee", label: "Coffee / Networking" },
];

const HOSTS = [
  "Ricky / Leadership Team",
  "Engineering / Tech Lead",
  "Design & Product Team",
  "Operations / HR",
  "First Available Team Member",
];

export default function VisitorCheckin() {
  const [formMountTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [purpose, setPurpose] = useState(PURPOSES[0].label);
  const [host, setHost] = useState(HOSTS[0]);
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const wifiSsid = "TechNeyo-Guest";
  const wifiPass = "TechNeyo@Ldh2026";

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(wifiPass);
    setCopiedWifi(true);
    toast.success("Guest Wi-Fi password copied!");
    setTimeout(() => setCopiedWifi(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        businessName: company.trim() || undefined,
        serviceRequired: `Office Visitor Check-in: ${purpose}`,
        message: [
          `🏢 TechNeyo Ludhiana Office Visitor Check-In`,
          `Host Requested: ${host}`,
          `Purpose: ${purpose}`,
          company ? `Organization: ${company}` : "",
          notes ? `Notes / Agenda: ${notes}` : "",
          `Check-in Time: ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
        ]
          .filter(Boolean)
          .join("\n"),
        sourcePage: "/checkin",
        website_url: honeypot || undefined,
        fill_time_ms: Date.now() - formMountTime,
      });

      trackEvent("visitor_checkin_submit", {
        purpose,
        host,
      });

      setIsSubmitted(true);
      toast.success("Check-in successful! Your host has been notified.");
    } catch (err: any) {
      console.error("Check-in error:", err);
      toast.error(err.message || "Failed to check in. Please inform the front desk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setCompany("");
    setPurpose(PURPOSES[0].label);
    setHost(HOSTS[0]);
    setNotes("");
    setIsSubmitted(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <PageMeta
        title="Visitor Check-in | TechNeyo Ludhiana Studio"
        description="Welcome to TechNeyo Studio in Ludhiana. Quick digital check-in for clients, candidates, and guests."
      />

      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-10 -translate-x-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-10 top-1/3 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-xl">
        {/* Header Branding */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            <span>TechNeyo Studio • Ludhiana</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">TechNeyo</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Please check in to let your host know you have arrived.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="checkin-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field */}
                <input
                  type="text"
                  name="website_url"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Your Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaspreet Singh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Mobile / WhatsApp Number <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* Company / Email Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Company / Organization <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Company name"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Email Address <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Purpose of Visit */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Purpose of Visit
                  </label>
                  <div className="relative">
                    <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-slate-800/90 py-3 pl-10 pr-10 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    >
                      {PURPOSES.map((item) => (
                        <option key={item.id} value={item.label} className="bg-slate-900 text-white">
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Host */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Whom are you meeting today?
                  </label>
                  <select
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-slate-800/90 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  >
                    {HOSTS.map((item) => (
                      <option key={item} value={item} className="bg-slate-900 text-white">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Notes / Remarks <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Here for 3:30 PM website strategy discussion"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Checking In..." : "Complete Check-in"}
                </button>

                <div className="flex items-center justify-center gap-2 pt-1 text-center text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Your information remains strictly confidential.</span>
                </div>
              </form>
            </motion.div>
          ) : (
            /* Success & Wi-Fi Access Screen */
            <motion.div
              key="checkin-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              {/* Checked In Badge */}
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 ring-8 ring-cyan-500/10">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">You're Checked In!</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Welcome to TechNeyo, <span className="font-semibold text-cyan-300">{name}</span>.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  We've notified <span className="font-medium text-slate-200">{host}</span> of your arrival. Please take a seat in our lounge.
                </p>
              </div>

              {/* Guest Wi-Fi Card */}
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2.5">
                    <Wifi className="h-5 w-5 text-cyan-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Guest High-Speed Wi-Fi</h3>
                      <p className="text-xs text-slate-400">Complimentary 300 Mbps Fiber Access</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
                    Active
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Network Name (SSID):</span>
                    <span className="font-mono font-medium text-white">{wifiSsid}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Password:</span>
                    <span className="font-mono font-medium text-cyan-300">{wifiPass}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyWifi}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-2.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 active:scale-[0.99]"
                >
                  {copiedWifi ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Wi-Fi Password</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hospitality note */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <Coffee className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Fresh water & tea/coffee are on the house</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Power multi-plugs available at your table</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Check in another guest</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Studio Footer Info */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>TechNeyo Studio • Ludhiana, Punjab, India</p>
          <p className="mt-1">For immediate assistance, dial +91 88720 03403</p>
        </div>
      </div>
    </div>
  );
}
