import { MessageCircle, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { businessInfo } from "@/lib/business-info";

const WhatsAppButton = () => {
  return (
    <>
      <div className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-[#030711] p-2 shadow-sm shadow-black/20 sm:hidden">
        <a
          href={businessInfo.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cta-location="mobile_sticky"
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-2 text-xs font-bold text-primary-foreground"
        >
          <MessageCircle size={15} /> WhatsApp
        </a>
        <a
          href={businessInfo.phoneHref}
          data-cta-location="mobile_sticky"
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-white/12 bg-white/10 px-2 text-xs font-bold text-white"
        >
          <Phone size={15} /> Call
        </a>
        <Link
          to="/contact"
          data-cta-location="mobile_sticky"
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-cyan-200/20 bg-cyan-300/15 px-2 text-xs font-bold text-cyan-50"
        >
          <Send size={15} /> Quote
        </Link>
      </div>
      <a
        href={businessInfo.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cta-location="desktop_floating"
        className="fixed bottom-4 right-4 z-50 hidden h-14 w-14 items-center justify-center rounded-full shadow-md transition-transform duration-150 hover:scale-105 sm:bottom-6 sm:right-6 sm:flex"
        style={{ background: "#25D366" }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} className="text-primary-foreground" />
      </a>
    </>
  );
};

export default WhatsAppButton;
