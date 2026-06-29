import { Link } from "react-router-dom";
import { Globe2, Phone, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";
import { businessInfo } from "@/lib/business-info";

const services = [
  "Website Development",
  "Local SEO",
  "Lead Management CRM",
  "WhatsApp Automation",
  "Custom Software",
  "AI Business Tools",
  "Digital Marketing",
];

const quickLinks = [
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
  { label: "Refund & Cancellation Policy", path: "/refund-cancellation-policy" },
  { label: "Support", path: "/support" },
  { label: "Services", path: "/services" },
];

const Footer = () => {
  return (
    <footer className="public-premium border-t border-white/10 text-white">
      <div className="section-container pt-16">
        <div className="premium-final-cta mb-12">
          <div>
            <p className="premium-eyebrow">{businessInfo.name}</p>
            <h2 className="font-display text-3xl font-bold text-white">Ready to grow digitally?</h2>
          </div>
          <Link to="/contact" className="premium-btn premium-btn-primary">Discuss Your Digital Requirement</Link>
        </div>
      </div>
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-12 w-40 rounded-md bg-white px-2 py-1 flex items-center justify-center">
                <img src="/logo.png" alt="Techneyo Solutions Logo" className="h-full w-full object-contain" />
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {businessInfo.name} provides {businessInfo.tagline.toLowerCase()} for businesses that need trusted digital presence, lead capture, and practical systems.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "https://www.facebook.com/techneyo" },
                { icon: Instagram, href: "https://www.instagram.com/techneyo" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-cyan-300/20 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <Globe2 size={16} className="mt-0.5 shrink-0 text-accent" />
                Website: <a href={businessInfo.website} className="hover:text-white transition-colors">{businessInfo.displayWebsite}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={16} className="shrink-0 text-accent" />
                <a href={businessInfo.phoneHref} className="hover:text-white transition-colors">Call/WhatsApp: {businessInfo.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={16} className="shrink-0 text-accent" />
                <a href={`mailto:${businessInfo.email}`} className="hover:text-white transition-colors">Email: {businessInfo.email}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <MessageCircle size={16} className="shrink-0 text-accent" />
                <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Chat on WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {businessInfo.name}. All rights reserved.</p>
          <p>{businessInfo.tagline}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
