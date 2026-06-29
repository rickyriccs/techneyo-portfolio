import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, MessageCircle } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";
import { getLeadContext, getSourceData } from "@/lib/utm";
import { trackEvent } from "@/lib/analytics";

const ThankYou = () => {
  useEffect(() => {
    const leadContext = getLeadContext();
    const source = getSourceData();

    trackEvent("lead_thank_you_view", {
      source_page_url: leadContext.source_page_url || source.current_page_url,
      service_name: leadContext.service_name,
      utm_source: source.utm_source,
      utm_medium: source.utm_medium,
      utm_campaign: source.utm_campaign,
      referrer: source.referrer || source.initial_referrer,
    });
  }, []);

  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta
        title="Thank You | Techneyo Solutions"
        description="Thank you for contacting Techneyo Solutions. Your enquiry has been received and our team will contact you soon."
        canonicalPath="/thank-you"
        robots="noindex, follow"
        schema={organizationSchema}
      />
      <section className="premium-hero relative flex min-h-screen items-center overflow-hidden pt-28">
        <div className="premium-grid-bg" />
        <div className="section-container relative z-10 py-20">
          <div className="premium-card mx-auto max-w-3xl p-6 text-center sm:p-10">
            <p className="premium-eyebrow">Enquiry received</p>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              Thank You for Contacting Techneyo Solutions
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/68">
              Your enquiry has been received successfully. Our team will review your requirement and contact you soon through phone, WhatsApp, or email.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="premium-btn premium-btn-primary" data-cta-location="thank-you">
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
              <Link to="/services" className="premium-btn premium-btn-ghost" data-cta-location="thank-you">
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link to="/" className="premium-btn premium-btn-ghost" data-cta-location="thank-you">
                <Home size={18} /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThankYou;
