import { Link } from "react-router-dom";
import { Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";

type PolicyPageProps = {
  type: "privacy" | "terms" | "refund" | "support";
};

const pageContent = {
  privacy: {
    path: "/privacy-policy",
    title: "Privacy Policy | Techneyo Solutions",
    description:
      "Read the Techneyo Solutions privacy policy to understand how we collect, use, and protect enquiry and contact information.",
    eyebrow: "Privacy Policy",
    heading: "How Techneyo Solutions handles business enquiry and service data.",
    intro:
      "This Privacy Policy explains how Techneyo Solutions collects, uses, and protects information shared through our website, contact forms, WhatsApp, phone, email, and service discussions.",
    sections: [
      {
        title: "Information we collect",
        body: "We may collect your name, business name, phone number, email address, city, state, service interest, budget range, message details, source page, user agent, and campaign source details when you submit a form or contact us.",
      },
      {
        title: "How we use your information",
        body: "We use contact details to respond to enquiries, discuss website, software, CRM, automation, SEO, and digital presence requirements, provide quotes, deliver services, offer support, and improve our enquiry process.",
      },
      {
        title: "Cookies, analytics, and third-party tools",
        body: "Our website may use basic cookies, analytics, hosting, database, email, WhatsApp, or other third-party tools required to operate the website, understand enquiries, and communicate with clients.",
      },
      {
        title: "Data security",
        body: "We use reasonable technical and organizational measures to protect enquiry and service data. No internet-based system is completely risk-free, but we work to keep access limited and business data handled responsibly.",
      },
      {
        title: "User rights and contact",
        body: `You may request correction, update, or deletion of your contact details by emailing ${businessInfo.email} or calling ${businessInfo.phoneDisplay}.`,
      },
    ],
  },
  terms: {
    path: "/terms-and-conditions",
    title: "Terms & Conditions | Techneyo Solutions",
    description:
      "Read the terms and conditions for using the Techneyo Solutions website and services.",
    eyebrow: "Terms & Conditions",
    heading: "Clear terms for website use, consultations, and service delivery.",
    intro:
      "These Terms & Conditions apply when you use the Techneyo Solutions website or contact us for website development, CRM, admin dashboard, automation, SEO, digital presence, or custom software services.",
    sections: [
      {
        title: "Website use",
        body: "The website is provided for business information, service enquiries, and consultation requests. Users should not misuse the website, submit false information, or attempt unauthorized access.",
      },
      {
        title: "Service consultation and delivery",
        body: "Project scope, timeline, deliverables, pricing, payment schedule, revisions, and support terms are discussed before or during project confirmation. Custom work may depend on client inputs, approvals, content, and timely communication.",
      },
      {
        title: "Client responsibilities",
        body: "Clients are responsible for providing accurate business information, content, media, login access when needed, legal permissions for assets, and timely feedback required for delivery.",
      },
      {
        title: "Payments and project terms",
        body: "Payments, milestones, and project start dates may vary by service type. Work may begin after agreed advance payment, written confirmation, or mutual approval through official communication channels.",
      },
      {
        title: "Limitation of liability",
        body: "Techneyo Solutions works to deliver professional and reliable digital services, but we are not liable for indirect losses, third-party platform downtime, client-side delays, or outcomes outside the agreed scope.",
      },
      {
        title: "Questions",
        body: `For questions about these terms, contact ${businessInfo.email} or ${businessInfo.phoneDisplay}.`,
      },
    ],
  },
  refund: {
    path: "/refund-cancellation-policy",
    title: "Refund & Cancellation Policy | Techneyo Solutions",
    description:
      "Understand the refund and cancellation policy for Techneyo Solutions website, software, CRM, and digital service projects.",
    eyebrow: "Refund & Cancellation Policy",
    heading: "A practical refund and cancellation policy for custom digital work.",
    intro:
      "This policy explains how cancellation and refund requests are reviewed for Techneyo Solutions service projects, including websites, landing pages, CRM tools, automation, SEO setup, and custom software.",
    sections: [
      {
        title: "Refund eligibility",
        body: "Refund eligibility depends on the service stage, approved scope, work already completed, third-party costs, and resources allocated to the project.",
      },
      {
        title: "Custom work",
        body: "Custom software, website design, development, CRM, dashboard, automation, content, SEO setup, and configuration work may not be refundable after work has started or deliverables have been shared.",
      },
      {
        title: "Cancellation process",
        body: "To request cancellation, contact us through email, phone, or WhatsApp with your name, business name, service booked, payment details, and reason for cancellation.",
      },
      {
        title: "Review and response",
        body: "We review cancellation or refund requests case by case and respond through official communication channels. Approved refunds, if any, are processed using a mutually agreed method.",
      },
      {
        title: "Contact",
        body: `For refund or cancellation support, email ${businessInfo.email} or call/WhatsApp ${businessInfo.phoneDisplay}.`,
      },
    ],
  },
  support: {
    path: "/support",
    title: "Support | Techneyo Solutions",
    description:
      "Get support from Techneyo Solutions through WhatsApp, phone, or email for website, CRM, SEO, automation, and software service queries.",
    eyebrow: "Support",
    heading: "Support for websites, CRM tools, automation, and digital services.",
    intro:
      "Techneyo Solutions provides support through official website, email, phone, and WhatsApp channels for client enquiries, project discussions, and service-related communication.",
    sections: [
      {
        title: "Support channels",
        body: `You can contact us by WhatsApp/call at ${businessInfo.phoneDisplay} or email at ${businessInfo.email}. The contact form on this website can also be used for service and support requests.`,
      },
      {
        title: "Response expectations",
        body: "We aim to respond to business and support enquiries as soon as practical during working hours. Project-specific response times may depend on the service plan, issue type, and current workload.",
      },
      {
        title: "Details to include",
        body: "Please share your name, business name, phone number, project or website link if available, service type, issue summary, screenshots when useful, and the urgency of the request.",
      },
      {
        title: "Official communication note",
        body: "Techneyo Solutions uses official business communication channels for client enquiries, project discussions, and support. Customers can contact us through our website, email, phone, or WhatsApp.",
      },
    ],
  },
};

const PolicyPage = ({ type }: PolicyPageProps) => {
  const content = pageContent[type];

  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta title={content.title} description={content.description} canonicalPath={content.path} schema={organizationSchema} />
      <section className="premium-hero relative overflow-hidden pb-16 pt-32">
        <div className="premium-grid-bg" />
        <div className="section-container relative z-10 max-w-4xl">
          <p className="premium-eyebrow">{content.eyebrow}</p>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">{content.heading}</h1>
          <p className="mt-6 text-lg leading-8 text-white/68">{content.intro}</p>
        </div>
      </section>

      <section className="premium-section pt-8">
        <div className="section-container grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            {content.sections.map((section) => (
              <article key={section.title} className="premium-card p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <ShieldCheck className="text-cyan-200" size={22} />
                  <h2 className="font-display text-2xl font-bold text-white">{section.title}</h2>
                </div>
                <p className="leading-7 text-white/64">{section.body}</p>
              </article>
            ))}
          </div>

          <aside className="premium-card h-fit p-6">
            <p className="premium-eyebrow">Official contact</p>
            <h2 className="font-display text-2xl font-bold text-white">{businessInfo.name}</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">{businessInfo.tagline}</p>
            <div className="mt-6 space-y-3 text-sm text-white/64">
              <a href={businessInfo.phoneHref} className="flex items-center gap-3 hover:text-white">
                <Phone size={16} className="text-cyan-200" /> {businessInfo.phoneDisplay}
              </a>
              <a href={`mailto:${businessInfo.email}`} className="flex items-center gap-3 hover:text-white">
                <Mail size={16} className="text-cyan-200" /> {businessInfo.email}
              </a>
              <a href={businessInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
                <MessageCircle size={16} className="text-cyan-200" /> Chat on WhatsApp
              </a>
            </div>
            <Link to="/contact" className="premium-btn premium-btn-primary mt-6 w-full">
              Discuss Your Digital Requirement
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default PolicyPage;
