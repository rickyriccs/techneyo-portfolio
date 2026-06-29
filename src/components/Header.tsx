import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { businessInfo } from "@/lib/business-info";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Ludhiana", path: "/website-development-company-ludhiana" },
  { label: "Resources", path: "/resources" },
  { label: "Offers", path: "/offers" },
  { label: "About", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    const [pathname, hash] = path.split("#");
    return location.pathname === pathname && (!hash || location.hash === `#${hash}`);
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#030711]/88 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "md:bg-[#030711]/92" : "md:bg-[#030711]/76"
      }`}
    >
      <div className="section-container">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-11 w-36 items-center justify-center rounded-md bg-white px-2 py-1 shadow-sm shadow-cyan-400/10">
              <img src="/logo.png" alt="Techneyo Solutions Logo" width={144} height={44} className="h-full w-full object-contain" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-cyan-300/18 text-cyan-50 shadow-[0_0_24px_rgb(34_211_238_/_0.14)]"
                    : "text-slate-300 hover:bg-white/10 hover:text-cyan-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={businessInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="header"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-200/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-cyan-300/15"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/10 bg-[#030711]/95 backdrop-blur-xl md:hidden"
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-cyan-300/18 text-cyan-50"
                      : "text-slate-300 hover:bg-white/10 hover:text-cyan-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={businessInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-location="mobile_menu"
                className="premium-btn premium-btn-primary mt-3 w-full"
              >
                <MessageCircle size={16} className="inline mr-2" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
