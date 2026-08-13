import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, LayoutDashboard, MessageCircle, Workflow, Wrench } from "lucide-react";
import { supabase } from "@/lib/supabase";
import PageMeta from "@/components/PageMeta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema } from "@/lib/schema";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" as const },
  }),
};

type Tool = {
  id: string;
  name: string;
  description: string;
  business_use_case: string | null;
  starting_price: number | null;
  cta_type: string;
  cta_url: string | null;
};

const fallbackTools: Tool[] = [
  {
    id: "lead-capture",
    name: "Lead Capture Form",
    description: "A website enquiry form connected to database tracking and follow-up status.",
    business_use_case: "Capture website visitors, qualify leads, and manage follow-ups from an admin panel.",
    starting_price: 1999,
    cta_type: "Contact Form",
    cta_url: null,
  },
  {
    id: "whatsapp-enquiry",
    name: "WhatsApp Enquiry Button",
    description: "A quick WhatsApp contact CTA that works across mobile and desktop pages.",
    business_use_case: "Reduce friction for customer enquiries and route users to direct chat.",
    starting_price: 999,
    cta_type: "WhatsApp",
    cta_url: null,
  },
];

const formatPrice = (price: number | null) => {
  if (!price) return "Custom";
  return `Rs. ${Number(price).toLocaleString("en-IN")}`;
};

const ctaHref = (tool: Tool) => {
  if (tool.cta_type === "WhatsApp") return businessInfo.whatsappUrl;
  if (tool.cta_type === "Call") return "tel:+919988773122";
  if (tool.cta_type === "Custom Link" && tool.cta_url) return tool.cta_url;
  return "/contact";
};

const toolIcons = [LayoutDashboard, Workflow, MessageCircle, Bot, Wrench];

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>(fallbackTools);

  useEffect(() => {
    const loadTools = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("digital_tools")
        .select("id,name,description,business_use_case,starting_price,cta_type,cta_url")
        .eq("status", "active")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Failed to load tools", error);
        return;
      }

      if (data?.length) setTools(data as Tool[]);
    };

    loadTools();
  }, []);

  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta
        title="Digital Business Tools & Automation | Techneyo Solutions"
        description="Techneyo Solutions digital tools for lead capture, WhatsApp enquiries, booking flows, CRM dashboards, reports, and business automation worldwide."
        keywords="digital business tools, lead capture software, WhatsApp enquiry tools, business CRM tools, admin dashboard tools, workflow automation tools"
        canonicalPath="/tools"
        schema={organizationSchema}
      />
      <section className="premium-hero relative overflow-hidden pb-20 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl">
            <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">Digital tools</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              Business tools that capture leads, automate work, and keep follow-ups moving.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              Add practical tools to your website: lead forms, WhatsApp enquiry flows, booking systems, mini CRM dashboards, reports, automation, and custom workflows.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-container">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool, index) => {
              const Icon = toolIcons[index % toolIcons.length];
              const href = ctaHref(tool);
              const isExternal = href.startsWith("http") || href.startsWith("tel:");

              return (
                <motion.div
                  key={tool.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={index}
                  className="premium-card premium-card-hover flex h-full flex-col p-6"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100">
                    <Icon size={23} />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white">{tool.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/62">{tool.description}</p>
                  {tool.business_use_case && (
                    <div className="mt-5 flex items-start gap-2 text-sm leading-6 text-white/58">
                      <CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-200" />
                      {tool.business_use_case}
                    </div>
                  )}
                  <p className="mt-5 font-display text-2xl font-bold text-orange-200">{formatPrice(tool.starting_price)}</p>
                  {isExternal ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="premium-btn premium-btn-primary mt-6" data-offer-name={tool.name} data-cta-location="tools_grid">
                      Discuss Tool <ArrowRight size={16} />
                    </a>
                  ) : (
                    <Link to={href} className="premium-btn premium-btn-primary mt-6" data-offer-name={tool.name} data-cta-location="tools_grid">
                      Discuss Tool <ArrowRight size={16} />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="premium-section pt-0">
        <div className="section-container">
          <div className="premium-final-cta">
            <div>
              <p className="premium-eyebrow">Need a custom workflow?</p>
              <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">We can plan a tool around your business process.</h2>
            </div>
            <Link to="/contact" className="premium-btn premium-btn-primary" data-cta-location="tools_final_cta">Get Free Consultation</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tools;
