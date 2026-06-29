import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageMeta from "@/components/PageMeta";
import SeoCta from "@/components/SeoCta";
import { businessInfo } from "@/lib/business-info";
import { getServicePage, servicePages, servicePath } from "@/lib/seo-content";
import { breadcrumbSchema, faqSchema, graphSchema, serviceSchema } from "@/lib/schema";

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <section className="premium-card p-6 sm:p-8">
    <h2 className="font-display text-2xl font-bold text-white">{title}</h2>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3 text-sm leading-6 text-white/64">
          <CheckCircle2 size={16} className="mt-1 shrink-0 text-cyan-200" />
          {item}
        </div>
      ))}
    </div>
  </section>
);

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = getServicePage(slug);

  if (!service) return <Navigate to="/services" replace />;

  const relatedServices = service.related
    .map((relatedSlug) => servicePages.find((item) => item.slug === relatedSlug))
    .filter(Boolean);

  const schema = graphSchema(
    serviceSchema(service),
    faqSchema(service.faqs),
    breadcrumbSchema([
      { name: "Home", url: businessInfo.website },
      { name: "Services", url: `${businessInfo.website}/services` },
      { name: service.title, url: `${businessInfo.website}${servicePath(service.slug)}` },
    ]),
  );

  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta title={service.seoTitle} description={service.metaDescription} canonicalPath={servicePath(service.slug)} schema={schema} />
      <section className="premium-hero relative overflow-hidden pb-16 pt-32">
        <div className="premium-grid-bg" />
        <div className="section-container relative z-10">
          <Breadcrumbs items={[{ label: "Home", path: "/" }, { label: "Services", path: "/services" }, { label: service.title, path: servicePath(service.slug) }]} />
          <div className="max-w-4xl">
            <p className="premium-eyebrow">{service.title}</p>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">{service.h1}</h1>
            <p className="mt-6 text-lg leading-8 text-white/68">{service.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="premium-btn premium-btn-primary">
                Get Website Quote <ArrowRight size={18} />
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
            <h2 className="font-display text-2xl font-bold text-white">Why this service matters</h2>
            <p className="mt-4 leading-8 text-white/64">{service.whyChoose}</p>
          </div>
          <Section title="Who this service is for" items={service.forWhom} />
          <Section title="Business problems solved" items={service.problems} />
          <Section title="Key features" items={service.features} />
          <Section title="Our process" items={service.process} />
          <Section title="Business benefits" items={service.benefits} />

          <section className="premium-card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-white">Frequently asked questions</h2>
            <div className="mt-5 space-y-4">
              {service.faqs.map((faq) => (
                <article key={faq.question} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                  <h3 className="flex items-start gap-3 font-display text-lg font-semibold text-white">
                    <HelpCircle size={18} className="mt-1 shrink-0 text-cyan-200" />
                    {faq.question}
                  </h3>
                  <p className="mt-2 leading-7 text-white/62">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-5 font-display text-3xl font-bold text-white">Related services</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {relatedServices.map((item) => (
                <Link key={item!.slug} to={servicePath(item!.slug)} className="premium-card premium-card-hover p-5">
                  <h3 className="font-display text-xl font-bold text-white">{item!.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">{item!.metaDescription}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
                    Explore service <ArrowRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <SeoCta title={`Need ${service.title.toLowerCase()} for your business?`} />
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
