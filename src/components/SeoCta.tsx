import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { businessInfo } from "@/lib/business-info";

const SeoCta = ({ title = "Ready to discuss your digital requirement?", text = "Talk to Techneyo Solutions about your website, CRM, automation, SEO, or custom software requirement." }: { title?: string; text?: string }) => (
  <div className="premium-final-cta">
    <div>
      <p className="premium-eyebrow">Start digital growth</p>
      <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-white/62">{text}</p>
    </div>
    <div className="flex flex-wrap gap-3">
      <Link to="/contact" className="premium-btn premium-btn-primary">
        Discuss Your Requirement <ArrowRight size={18} />
      </Link>
      <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="premium-btn premium-btn-ghost">
        <MessageCircle size={18} /> Chat on WhatsApp
      </a>
    </div>
  </div>
);

export default SeoCta;
