import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Linkedin, Facebook, Instagram, Twitter } from "lucide-react";

const services = [
  "Web Development",
  "Mobile App Development",
  "Cloud & DevOps",
  "AI & Automation",
  "UI/UX Design",
  "Digital Marketing",
  "IT Consulting",
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
                <span className="font-display font-bold text-lg text-primary-foreground">N</span>
              </div>
              <span className="font-display font-bold text-xl">NexaTech</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed mb-5">
              Delivering innovative IT solutions since 2021. Based in New Delhi, India, we empower businesses with cutting-edge technology.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
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
              {["Home", "About", "Services", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" us", "")}`}
                    className="text-sm text-background/60 hover:text-background transition-colors"
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
                    className="text-sm text-background/60 hover:text-background transition-colors"
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
              <li className="flex items-start gap-3 text-sm text-background/60">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                New Delhi, India
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Phone size={16} className="shrink-0 text-accent" />
                +91 123 456 7890
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Mail size={16} className="shrink-0 text-accent" />
                hello@nexatech.in
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="section-container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-background/40">
          <p>© {new Date().getFullYear()} NexaTech. All rights reserved.</p>
          <p>Established 2021 · New Delhi, India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
