import { Link } from "react-router-dom";
import { Copy, ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import SeoCta from "@/components/SeoCta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";

const shortDescription = "Techneyo Solutions provides website development, CRM systems, admin dashboards, business automation, WhatsApp automation consultation, SEO, and custom web-based software for businesses in India.";
const longDescription = "Techneyo Solutions is a business-focused digital solutions company helping local businesses, service providers, startups, consultants, clinics, institutes, manufacturers, and growing teams build professional websites, lead capture systems, CRM dashboards, WhatsApp enquiry flows, SEO foundations, and custom web-based software. The company focuses on practical digital presence, clear communication, ethical SEO, and systems that make it easier for customers to discover, trust, and contact a business.";

const CompanyProfile = () => (
  <div className="public-premium min-h-screen overflow-hidden text-white">
    <PageMeta
      title="Company Profile | Techneyo Solutions"
      description="Official company profile and media kit for Techneyo Solutions, including business description, services, logo, website, email, phone, and social links."
      canonicalPath="/company-profile"
      schema={organizationSchema}
    />
    <section className="premium-hero relative overflow-hidden pb-16 pt-32">
      <div className="premium-grid-bg" />
      <div className="section-container relative z-10 max-w-4xl">
        <p className="premium-eyebrow">Company profile</p>
        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">Official Techneyo Solutions media kit and business profile.</h1>
        <p className="mt-6 text-lg leading-8 text-white/68">
          Use this page for genuine directory submissions, business listings, partnership references, PR mentions, and backlink outreach. No partnerships or certifications are claimed unless separately verified.
        </p>
      </div>
    </section>

    <section className="premium-section pt-8">
      <div className="section-container space-y-8">
        <div className="premium-card grid gap-8 p-6 sm:p-8 lg:grid-cols-[320px_1fr]">
          <div>
            <div className="rounded-lg bg-white p-4">
              <img src="/logo.png" alt="Techneyo Solutions Logo" width={640} height={220} loading="lazy" className="h-auto w-full" />
            </div>
            <p className="mt-3 text-sm text-white/55">Logo usage: use the official logo clearly on light or uncluttered backgrounds. Do not distort, crop, or imply certifications.</p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-white">{businessInfo.name}</h2>
            <p className="mt-3 text-white/64">{businessInfo.tagline}</p>
            <div className="mt-6 grid gap-3 text-sm text-white/64 sm:grid-cols-2">
              <a href={businessInfo.website} className="flex items-center gap-3 hover:text-white"><ExternalLink size={16} className="text-cyan-200" /> {businessInfo.displayWebsite}</a>
              <a href={`mailto:${businessInfo.email}`} className="flex items-center gap-3 hover:text-white"><Mail size={16} className="text-cyan-200" /> {businessInfo.email}</a>
              <a href={businessInfo.phoneHref} className="flex items-center gap-3 hover:text-white"><Phone size={16} className="text-cyan-200" /> {businessInfo.phoneDisplay}</a>
              <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white"><MessageCircle size={16} className="text-cyan-200" /> WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {[{ title: "Short business description", text: shortDescription }, { title: "Long business description", text: longDescription }].map((item) => (
            <article key={item.title} className="premium-card p-6">
              <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-white"><Copy size={20} className="text-cyan-200" /> {item.title}</h2>
              <p className="mt-4 leading-8 text-white/64">{item.text}</p>
            </article>
          ))}
        </div>

        <section className="premium-card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-white">Services</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {businessInfo.services.map((service) => (
              <div key={service} className="rounded-lg border border-white/10 bg-white/[0.045] p-3 text-sm text-white/68">{service}</div>
            ))}
          </div>
        </section>

        <section className="premium-card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-white">Official profiles</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {businessInfo.socialProfiles.map((profile) => (
              <a key={profile.url} href={profile.url} target="_blank" rel="noopener noreferrer" className="premium-badge">
                {profile.label}
              </a>
            ))}
            <Link to="/contact" className="premium-badge">Contact page</Link>
          </div>
        </section>

        <SeoCta title="Need official Techneyo Solutions details for a listing?" />
      </div>
    </section>
  </div>
);

export default CompanyProfile;
