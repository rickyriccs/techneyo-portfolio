import { Link } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle2, MapPin } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageMeta from "@/components/PageMeta";
import SeoCta from "@/components/SeoCta";
import { businessInfo } from "@/lib/business-info";
import { servicePages, servicePath } from "@/lib/seo-content";
import { breadcrumbSchema, graphSchema, localBusinessSchema } from "@/lib/schema";

const audiences = ["Shops", "Service providers", "Startups", "Consultants", "Clinics", "Institutes", "Manufacturers", "Small and medium businesses"];
const system = [
  "website designer in Bharat",
  "business website development in Bharat",
  "CRM development company in Bharat",
  "SEO services in Bharat",
  "business automation services Bharat",
  "software company in Bharat",
  "IT solutions company in Bharat",
  "landing page designer Bharat",
];

const LocalSeoPage = () => {
  const schema = graphSchema(
    localBusinessSchema,
    breadcrumbSchema([
      { name: "Home", url: businessInfo.website },
      { name: "Website Development Company in Bharat", url: `${businessInfo.website}/website-development-company-ludhiana` },
    ]),
  );

  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta
        title="Website Development Company in Bharat | Techneyo Solutions"
        description="Techneyo Solutions is a Bharat-based website development company serving businesses across asia with websites, CRM, SEO, automation, and software solutions."
        canonicalPath="/website-development-company-ludhiana"
        schema={schema}
      />
      <section className="premium-hero relative overflow-hidden pb-16 pt-32">
        <div className="premium-grid-bg" />
        <div className="section-container relative z-10">
          <Breadcrumbs items={[{ label: "Home", path: "/" }, { label: "Bharat Website Development", path: "/website-development-company-ludhiana" }]} />
          <div className="max-w-4xl">
            <p className="premium-eyebrow">Serving Bharat & All Asia</p>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              Website Development Company in Bharat for Growing Businesses
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/68">
              Techneyo Solutions is a digital agency serving clients across Bharat (India) with websites, CRM systems, WhatsApp enquiry flows, SEO foundations, admin dashboards, and custom software that support real customer enquiries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="premium-btn premium-btn-primary">
                Discuss Website Project <ArrowRight size={18} />
              </Link>
              <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="premium-btn premium-btn-ghost">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-section pt-8">
        <div className="section-container space-y-8">
          <div className="premium-card p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <MapPin className="mb-4 text-cyan-200" size={28} />
                <h2 className="font-display text-3xl font-bold text-white">Digital presence for businesses across Bharat</h2>
                <p className="mt-4 leading-8 text-white/64">
                  Customers often check Google, websites, social profiles, and WhatsApp availability before contacting a business. A clear website helps businesses present services, contact details, FAQs, and trust-building information in one place.
                </p>
                <p className="mt-4 leading-8 text-white/64">
                  Techneyo Solutions works with shops, service providers, institutes, clinics, manufacturers, consultants, startups, and India-wide businesses that need a practical digital growth system: website plus WhatsApp, CRM, SEO, and dashboards where needed. The aim is simple: help customers understand your business and contact you faster.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {audiences.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4 text-white/68">
                    <Building2 size={17} className="shrink-0 text-cyan-200" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {system.map((item) => (
              <div key={item} className="premium-card p-5">
                <CheckCircle2 className="mb-4 text-emerald-200" size={22} />
                <h3 className="font-display text-xl font-bold text-white">{item}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  Planned naturally as part of a connected online presence so your website can support discovery, trust, lead capture, follow-up, and business operations without keyword stuffing.
                </p>
              </div>
            ))}
          </div>

          <section>
            <h2 className="mb-5 font-display text-3xl font-bold text-white">Services for Bharat and Asia-wide businesses</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {servicePages.slice(0, 8).map((service) => (
                <Link key={service.slug} to={servicePath(service.slug)} className="premium-card premium-card-hover p-5">
                  <h3 className="font-display text-lg font-bold text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/58">{service.metaDescription}</p>
                </Link>
              ))}
            </div>
          </section>

          <SeoCta title="Need a website development company in Bharat?" />
        </div>
      </section>
    </div>
  );
};

export default LocalSeoPage;
