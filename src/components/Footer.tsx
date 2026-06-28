import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Linkedin, Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

const services = [
  "Website Development",
  "Local SEO",
  "Lead Management CRM",
  "WhatsApp Automation",
  "Custom Software",
  "AI Business Tools",
  "Digital Marketing",
];

const Footer = () => {
  return (
    <footer className="public-premium border-t border-white/10 text-white">
      <div className="section-container pt-16">
        <div className="premium-final-cta mb-12">
          <div>
            <p className="premium-eyebrow">Techneyo Solutions</p>
            <h2 className="font-display text-3xl font-bold text-white">Ready to grow digitally?</h2>
          </div>
          <Link to="/contact" className="premium-btn premium-btn-primary">Start Website from Rs. 999</Link>
        </div>
      </div>
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-12 w-40 rounded-md bg-white px-2 py-1 flex items-center justify-center">
                <img src="/logo.png" alt="Techneyo Solutions" className="h-full w-full object-contain" />
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Techneyo Solutions helps businesses across India grow with affordable websites, lead capture, WhatsApp enquiry systems, automation tools, and custom software.
            </p>
            <div className="flex gap-3">
              {[
                // { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "https://www.facebook.com/techneyo" },
                { icon: Instagram, href: "https://www.instagram.com/techneyo" },
                // { icon: Twitter, href: "#" },
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
              {["Home", "About", "Services", "Offers", "Tools", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" us", "")}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item}
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
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                Website: techneyo.com
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={16} className="shrink-0 text-accent" />
                <a href="tel:+919988773122" className="hover:text-white transition-colors">+91 99887 73122</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={16} className="shrink-0 text-accent" />
                <a href="mailto:hello@techneyo.com" className="hover:text-white transition-colors">hello@techneyo.com</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <MessageCircle size={16} className="shrink-0 text-accent" />
                <a href="https://wa.me/919988773122" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Chat on WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Techneyo Solutions. All rights reserved.</p>
          <p>Website, SEO, CRM, WhatsApp automation, software, and AI tools</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
