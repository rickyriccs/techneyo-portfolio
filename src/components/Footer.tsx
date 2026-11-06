import { Link } from "react-router-dom";
import { Phone, Mail, Facebook, Instagram, MessageCircle, Calendar, Sparkles, Clock, ShieldCheck, CreditCard } from "lucide-react";
import { businessInfo } from "@/lib/business-info";
import { MagneticButton } from "@/components/ui/MagneticButton";

const services = [
  { label: "Website Development", path: "/services/website-development" },
  { label: "Business Website Design", path: "/services/business-website-design" },
  { label: "CRM Development", path: "/services/crm-development" },
  { label: "Admin Dashboard Development", path: "/services/admin-dashboard-development" },
  { label: "Business Automation", path: "/services/business-automation" },
  { label: "WhatsApp Automation", path: "/services/whatsapp-automation" },
  { label: "SEO & Digital Presence", path: "/services/seo-digital-presence" },
  { label: "Custom Software", path: "/services/custom-software-development" },
];

const quickLinks = [
  { label: "Global Tech Partner (Offshore)", path: "/global" },
  { label: "Needs Diagnostic Quiz (60s)", path: "/solution-finder" },
  { label: "Instant Payment Portal (USD/INR)", path: "/pay" },
  { label: "Portfolio & Case Studies", path: "/portfolio" },
  { label: "Blog & Insights", path: "/blog" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
  { label: "Company Profile", path: "/company-profile" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
  { label: "Refund & Cancellation Policy", path: "/refund-cancellation-policy" },
  { label: "Support", path: "/support" },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#020817] text-white overflow-hidden">
      {/* Ambient glow background */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#011B52]/40 to-transparent blur-[120px]"
        aria-hidden="true"
      />

      {/* Dual Conversion Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.12] bg-gradient-to-r from-[#06122B] via-[#0B1E45] to-[#020817] p-8 sm:p-12 shadow-[0_20px_50px_rgba(1,27,82,0.6)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Pathway 1: Solution Finder Quiz */}
            <div className="space-y-4 lg:border-r lg:border-white/[0.08] lg:pr-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                <Sparkles size={12} className="text-[#00A0E0]" />
                <span>Instant Self-Service</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Find Your Solution in 60 Seconds
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Answer 4 quick questions about your industry bottleneck to receive instant recommendations, urgency ratings, and immediate solutions.
              </p>
              <Link to="/solution-finder" className="inline-block">
                <button className="btn-brand-secondary rounded-xl px-5 py-2.5 text-xs font-bold text-cyan-200 hover:text-white flex items-center gap-2">
                  <Sparkles size={14} className="text-cyan-400" />
                  <span>Start 60s Needs Quiz →</span>
                </button>
              </Link>
            </div>

            {/* Pathway 2: Executive Strategy Call */}
            <div className="space-y-4 lg:pl-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-[#FE6F17]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-300">
                <Calendar size={12} className="text-[#FE6F17]" />
                <span>Executive Strategy Call</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Book a 15-Minute Architecture Session
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Direct discussion with our lead systems architect. Review scope, offshore cost arbitrage, and receive a fixed-price roadmap within 24 hours.
              </p>
              <Link to="/contact" className="inline-block">
                <MagneticButton variant="primary" className="py-2.5 px-6 text-xs font-bold shadow-brand-orange">
                  <Calendar size={14} />
                  <span>Schedule 15-Min Discovery Call</span>
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Socials */}
          <div className="space-y-4">
            <div className="flex h-12 w-40 items-center justify-center rounded-lg bg-white px-2 py-1 shadow-[0_0_20px_rgba(0,160,224,0.15)]">
              <img
                src="/logo.png"
                alt="Techneyo Solutions Logo"
                width={160}
                height={48}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {businessInfo.name} delivers Silicon Valley-calibre web software, mobile apps, and autonomous AI systems with global offshore cost efficiency.
            </p>

            {/* Operating Hours Pill */}
            <div className="rounded-xl border border-white/[0.08] bg-[#06122B] p-3 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-2 font-medium text-cyan-300">
                <Clock size={13} />
                <span>Working Hours (IST):</span>
              </div>
              <p className="text-slate-400 pl-5">Mon - Sat: 11:00 AM - 7:00 PM</p>
              <p className="text-emerald-400 pl-5 font-mono text-[11px]">Daily US & CA overlap guaranteed</p>
            </div>

            <div className="flex gap-2.5 pt-1">
              {[
                { icon: Facebook, href: "https://www.facebook.com/techneyo", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/techneyo", label: "Instagram" },
              ].map(({ icon: Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white tracking-wide mb-4">
              Navigation & Platforms
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white tracking-wide mb-4">
              Core Engineering
            </h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.path}>
                  <Link
                    to={s.path}
                    className="text-sm text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact & Verified Badges */}
          <div>
            <h4 className="font-display font-semibold text-white tracking-wide mb-4">
              Direct Contact & Support
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <Phone size={15} className="shrink-0 text-cyan-400" />
                <a href={businessInfo.phoneHref} className="hover:text-white transition-colors">
                  {businessInfo.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="shrink-0 text-cyan-400" />
                <a href={`mailto:${businessInfo.email}`} className="hover:text-white transition-colors">
                  {businessInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={15} className="shrink-0 text-emerald-400" />
                <a
                  href={businessInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline transition-colors font-medium"
                >
                  Direct WhatsApp Channel →
                </a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <CreditCard size={15} className="shrink-0 text-orange-400" />
                <Link to="/pay" className="text-orange-300 hover:underline transition-colors font-medium">
                  Custom Invoice Payment Portal →
                </Link>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#06122B] p-3 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck size={14} />
                <span>100% Day-One IP Transferred</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Delaware & Canada NDA compliant contracts. High-security escrow and encrypted repositories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer Copyright */}
      <div className="border-t border-white/[0.08] bg-[#010B1E]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {businessInfo.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Delaware & Ontario Standard Architecture</span>
            <span>•</span>
            <span>Sub-Second Response Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
