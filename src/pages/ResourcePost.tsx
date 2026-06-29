import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageMeta from "@/components/PageMeta";
import SeoCta from "@/components/SeoCta";
import { businessInfo } from "@/lib/business-info";
import { getBlogPost, servicePages, servicePath } from "@/lib/seo-content";
import { articleSchema, breadcrumbSchema, faqSchema, graphSchema } from "@/lib/schema";

const ResourcePost = () => {
  const { slug } = useParams();
  const post = getBlogPost(slug);

  if (!post) return <Navigate to="/resources" replace />;

  const schema = graphSchema(
    articleSchema(post),
    faqSchema(post.faqs),
    breadcrumbSchema([
      { name: "Home", url: businessInfo.website },
      { name: "Resources", url: `${businessInfo.website}/resources` },
      { name: post.title, url: `${businessInfo.website}/resources/${post.slug}` },
    ]),
  );

  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta title={post.seoTitle} description={post.metaDescription} canonicalPath={`/resources/${post.slug}`} schema={schema} />
      <section className="premium-hero relative overflow-hidden pb-16 pt-32">
        <div className="premium-grid-bg" />
        <div className="section-container relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", path: "/" }, { label: "Resources", path: "/resources" }, { label: post.title, path: `/resources/${post.slug}` }]} />
          <p className="premium-eyebrow">Business guide</p>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">{post.title}</h1>
          <p className="mt-6 text-lg leading-8 text-white/68">{post.intro}</p>
        </div>
      </section>

      <section className="premium-section pt-8">
        <div className="section-container grid gap-8 lg:grid-cols-[1fr_320px]">
          <article className="space-y-5">
            {post.sections.map((section) => (
              <section key={section.heading} className="premium-card p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-white">{section.heading}</h2>
                <p className="mt-4 leading-8 text-white/64">{section.body}</p>
              </section>
            ))}
            <section className="premium-card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-white">FAQ</h2>
              <div className="mt-5 space-y-4">
                {post.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                    <h3 className="flex items-start gap-3 font-display text-lg font-semibold text-white">
                      <HelpCircle size={18} className="mt-1 shrink-0 text-cyan-200" />
                      {faq.question}
                    </h3>
                    <p className="mt-2 leading-7 text-white/62">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
            <SeoCta title="Need a practical digital setup for your business?" />
          </article>

          <aside className="premium-card h-fit p-6">
            <p className="premium-eyebrow">Related services</p>
            <div className="mt-4 space-y-3">
              {post.relatedServices.map((slug) => {
                const service = servicePages.find((item) => item.slug === slug);
                if (!service) return null;
                return (
                  <Link key={slug} to={servicePath(slug)} className="block rounded-lg border border-white/10 bg-white/[0.045] p-3 hover:bg-white/[0.07]">
                    <span className="font-display text-sm font-semibold text-white">{service.title}</span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-cyan-100">
                      Learn more <ArrowRight size={13} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default ResourcePost;
