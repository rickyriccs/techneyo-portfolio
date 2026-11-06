import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Menu, MessageCircle, X, Globe, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { businessInfo } from "@/lib/business-info";
import { usePersonalization } from "@/context/PersonalizationContext";
import { MagneticButton } from "@/components/ui/MagneticButton";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Solution Finder", path: "/solution-finder", isHighlight: true, badge: "60s Quiz" },
  { label: "Services", path: "/services" },
  { label: "Global Model", path: "/global", icon: Globe },
  { label: "Industries", path: "/industries" },
  { label: "Free Audit", path: "/audit" },
  { label: "Offers", path: "/offers" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { openProposalModal } = usePersonalization();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    const [pathname, hash] = path.split("#");
    return location.pathname === pathname && (!hash || location.hash === `#${hash}`);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 sm:px-6 pt-2 sm:pt-3 transition-all duration-300">
      <div
        className={`mx-auto max-w-7xl rounded-2xl border transition-all duration-300 ${
          isScrolled
            ? "border-white/15 bg-[#06122B]/90 shadow-[0_12px_36px_0_rgba(1,27,82,0.6)] backdrop-blur-2xl"
            : "border-white/[0.08] bg-[#06122B]/75 shadow-[0_8px_30px_0_rgba(1,27,82,0.35)] backdrop-blur-xl"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo & Availability Status */}
          <div className="flex items-center gap-3">
            <Link to="/" className="group flex items-center gap-2">
              <div className="flex h-10 w-32 sm:w-36 items-center justify-center rounded-lg bg-white px-2 py-1 shadow-[0_0_15px_rgba(0,160,224,0.2)] transition-transform duration-200 group-hover:scale-[1.02]">
                <img
                  src="/logo.png"
                  alt="Techneyo Solutions Logo"
                  width={144}
                  height={44}
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>

            {/* Subtle Availability Dot */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span>Available for Q1/Q2</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                    active
                      ? "text-white"
                      : link.isHighlight
                      ? "text-orange-300 hover:text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {/* Sliding active pill indicator */}
                  {active && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute inset-0 rounded-lg bg-white/[0.1] border border-cyan-400/30 shadow-[0_0_15px_rgba(0,160,224,0.2)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {Icon && <Icon size={12} className="text-cyan-400" />}
                    {link.label}
                    {link.badge && (
                      <span className="rounded-full bg-[#FE6F17]/20 border border-[#FE6F17]/40 px-1.5 py-0.2 text-[10px] text-orange-300 font-bold uppercase tracking-wider">
                        {link.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => openProposalModal()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-cyan-400/30 hover:bg-white/[0.1] hover:text-white"
            >
              <Sparkles size={13} className="text-cyan-400" />
              <span>AI Proposal</span>
            </button>

            <Link to="/contact">
              <MagneticButton
                variant="primary"
                className="py-1.5 px-4 text-xs shadow-brand-orange"
              >
                <Calendar size={13} />
                <span>Book Strategy Call</span>
              </MagneticButton>
            </Link>

            <a
              href={businessInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              <MessageCircle size={15} />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            className="rounded-xl border border-white/10 bg-white/[0.05] p-2 text-white transition-colors hover:bg-white/10 xl:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden border-t border-white/[0.08] px-4 py-4 xl:hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-semibold"
                          : link.isHighlight
                          ? "bg-[#FE6F17]/10 text-orange-300 border border-[#FE6F17]/30 font-semibold"
                          : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {Icon && <Icon size={14} className="text-cyan-400" />}
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="rounded-full bg-[#FE6F17]/20 border border-[#FE6F17]/40 px-2 py-0.5 text-[10px] text-orange-300 font-bold">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile CTAs */}
              <div className="mt-4 flex flex-col sm:flex-row gap-2 border-t border-white/[0.08] pt-3">
                <Link to="/contact" className="w-full">
                  <button className="btn-brand-primary w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                    <Calendar size={14} />
                    <span>Book Strategy Call</span>
                  </button>
                </Link>
                <a
                  href={businessInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
