import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import SeoCta from "@/components/SeoCta";
import { blogPosts } from "@/lib/seo-content";
import { organizationSchema } from "@/lib/schema";

const Resources = () => (
  <div className="public-premium min-h-screen overflow-hidden text-white">
    <PageMeta
      title="Resources & Guides | Website, CRM, SEO & Automation | Techneyo Solutions"
      description="Read practical Techneyo Solutions resources about websites, CRM, WhatsApp automation, SEO, dashboards, and digital growth for businesses worldwide."
      keywords="digital business guides, website development guide, CRM setup tutorial, WhatsApp automation guide, global business SEO tips"
      canonicalPath="/resources"
      schema={organizationSchema}
    />
    <section className="premium-hero relative overflow-hidden pb-16 pt-32">
      <div className="premium-grid-bg" />
      <div className="section-container relative z-10 max-w-4xl">
        <p className="premium-eyebrow">Resources</p>
        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">Practical digital growth guides for modern & global businesses.</h1>
        <p className="mt-6 text-lg leading-8 text-white/68">
          Learn about website development, landing pages, CRM, WhatsApp automation, SEO, admin dashboards, and business software for growing enterprises worldwide.
        </p>
      </div>
    </section>
    <section className="premium-section pt-8">
      <div className="section-container space-y-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/resources/${post.slug}`} className="premium-card premium-card-hover flex h-full flex-col p-6">
              <BookOpen className="mb-5 text-cyan-200" size={24} />
              <h2 className="font-display text-xl font-bold text-white">{post.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-white/62">{post.metaDescription}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
                Read guide <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
        <SeoCta title="Want help applying these ideas to your business?" />
      </div>
    </section>
  </div>
);

export default Resources;
