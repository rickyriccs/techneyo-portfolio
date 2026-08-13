import { useState, useId } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProblemSolverSection from "@/components/ProblemSolverSection";
import {
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Server,
  Zap,
  Globe,
  Database,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ChevronDown,
  Building2,
  Workflow,
  TrendingUp,
  LineChart,
  Boxes,
  Briefcase,
  Terminal,
  Send,
  Sparkle,
  Bot,
  UserCheck,
  Layout,
  FileCode2,
  Check,
  Smile,
  Clock3,
  Lightbulb,
  Headphones
} from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { businessInfo } from "@/lib/business-info";
import { createContactEnquiry } from "@/lib/contact-enquiries";
import { trackEvent } from "@/lib/analytics";
import { setLeadContext } from "@/lib/utm";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Easy-to-understand Trust & Capability Highlights
const trustItems = [
  { label: "7+ Years Experience", value: "Trusted Industry Expertise" },
  { label: "Custom Websites", value: "Fast, Modern & Mobile Friendly" },
  { label: "Business Software", value: "Easy-to-Use Dashboards" },
  { label: "Mobile Apps", value: "iOS & Android Solutions" },
  { label: "AI & Automation", value: "24/7 Smart Customer Chat" },
  { label: "Integrations", value: "WhatsApp & Payment Gateways" },
  { label: "Cloud Hosting", value: "Safe, Secure & Always Online" },
  { label: "Ongoing Support", value: "We Are Always Here to Help" },
];

// Easy-to-understand Service Grid Items
const serviceList = [
  {
    id: "web-dev",
    title: "Business Website Development",
    icon: Globe,
    badge: "Attract Customers",
    desc: "Custom, beautiful websites designed to show up on Google, look amazing on mobile phones, and turn casual visitors into paying customers.",
    cta: "Build My Website",
    features: [
      "Mobile-Friendly & Easy to Navigate",
      "Optimized to Rank Higher on Google",
      "Ultra-Fast Page Load Speed",
      "Instant WhatsApp & Lead Forms",
    ],
  },
  {
    id: "custom-app",
    title: "Custom Software & Dashboards",
    icon: Layout,
    badge: "Save Time & Work",
    desc: "Tailored business software, customer management systems (CRM), and internal team dashboards that organize your operations and eliminate manual work.",
    cta: "Discuss My Software",
    features: [
      "Simple, Easy Admin Panels for Your Team",
      "Live Reports & Business Analytics",
      "Automated Order & Client Tracking",
      "Zero Technical Knowledge Required",
    ],
  },
  {
    id: "saas-product",
    title: "SaaS & Digital Product Development",
    icon: Boxes,
    badge: "Turn Ideas into Income",
    desc: "Turn your software idea into a working online product that users can sign up for, subscribe to, and pay for month after month.",
    cta: "Build My Product",
    features: [
      "User Registration & Subscription Billing",
      "Secure Online Payment Setup",
      "Built to Handle Thousands of Users",
      "Clean & Professional User Experience",
    ],
  },
  {
    id: "ai-automation",
    title: "AI & Business Automation",
    icon: Bot,
    badge: "24/7 Smart Assistant",
    desc: "Put AI to work in your business with automated customer chat support, instant WhatsApp replies, and automatic document processing.",
    cta: "Explore AI Solutions",
    features: [
      "24/7 Intelligent Customer Chatbots",
      "Automated WhatsApp Message Replies",
      "Automatic Invoice & PDF Data Reader",
      "Saves Dozens of Staff Hours Weekly",
    ],
  },
  {
    id: "tech-leadership",
    title: "Technology Advisory & Guidance",
    icon: Cpu,
    badge: "Expert Tech Advice",
    desc: "Get honest, plain-English guidance on choosing the right tools, evaluating software costs, reviewing developer work, and making smart tech investments.",
    cta: "Get Tech Guidance",
    features: [
      "Plain-English Explanations (No Jargon)",
      "Software Security & Performance Audits",
      "Vendor & Developer Evaluation",
      "Cost-Saving Technology Roadmaps",
    ],
  },
  {
    id: "api-integration",
    title: "Payment & System Integrations",
    icon: Workflow,
    badge: "Connected Tools",
    desc: "Connect your website and software with WhatsApp, online payment tools, accounting systems, and automated customer notifications.",
    cta: "Discuss Integrations",
    features: [
      "WhatsApp Instant Notifications",
      "UPI, Card & Netbanking Payments",
      "Automated Email & SMS Receipts",
      "Sync Data Between Different Apps",
    ],
  },
];

// Easy-to-understand Tech Stack Categories
const techCategories = [
  "All Tools",
  "Websites & Frontend",
  "Software & Backend",
  "Mobile Apps",
  "Databases",
  "AI & Automation",
  "Hosting & Servers",
  "Payment & Integrations",
] as const;

type TechCategory = (typeof techCategories)[number];

interface TechItem {
  name: string;
  category: TechCategory;
  level: string;
  meaning: string;
  icon: string;
}

const techItems: TechItem[] = [
  // Web & Frontend
  { name: "React.js & Next.js", category: "Websites & Frontend", level: "Ultra Fast", meaning: "Super fast, interactive web screens", icon: "⚛️" },
  { name: "HTML5 & CSS3", category: "Websites & Frontend", level: "Standard", meaning: "Clean webpage layout & design", icon: "🌐" },
  { name: "TypeScript & JavaScript", category: "Websites & Frontend", level: "Reliable", meaning: "Smooth interactive website features", icon: "📘" },
  { name: "Tailwind CSS", category: "Websites & Frontend", level: "Modern", meaning: "Beautiful, responsive styling", icon: "🎨" },

  // Software & Backend
  { name: "PHP & Laravel", category: "Software & Backend", level: "Secure", meaning: "Rock-solid core for custom software", icon: "🚀" },
  { name: "Python & FastAPI", category: "Software & Backend", level: "Smart", meaning: "Powers AI intelligence & fast APIs", icon: "🐍" },
  { name: "Node.js", category: "Software & Backend", level: "Real-Time", meaning: "Instant updates & live communication", icon: "🟢" },
  { name: "Yii & CodeIgniter", category: "Software & Backend", level: "Proven", meaning: "Stable backend frameworks", icon: "🔥" },

  // Mobile Apps
  { name: "Flutter", category: "Mobile Apps", level: "Cross-Platform", meaning: "One app that works on iPhone & Android", icon: "📱" },
  { name: "Hybrid Mobile Frameworks", category: "Mobile Apps", level: "Responsive", meaning: "Fast mobile customer experience", icon: "📲" },

  // Databases
  { name: "MySQL & PostgreSQL", category: "Databases", level: "Safe & Private", meaning: "Securely stores all your business data", icon: "🐬" },
  { name: "Supabase", category: "Databases", level: "Cloud Database", meaning: "Instant real-time data synchronization", icon: "⚡" },
  { name: "Redis", category: "Databases", level: "High Speed", meaning: "Supercharged speed for heavy traffic", icon: "🔴" },

  // AI & Automation
  { name: "Generative AI & LLMs", category: "AI & Automation", level: "Smart AI", meaning: "Intelligent chatbot & content creation", icon: "🧠" },
  { name: "OpenAI & Gemini APIs", category: "AI & Automation", level: "AI Brain", meaning: "Answers customer questions 24/7", icon: "✨" },
  { name: "Document Reader AI", category: "AI & Automation", level: "Automatic", meaning: "Reads PDF invoices & documents", icon: "📄" },
  { name: "LangChain & AI Agents", category: "AI & Automation", level: "Automated", meaning: "Automates complex multi-step tasks", icon: "🤖" },

  // Hosting & Servers
  { name: "Linux Cloud VPS", category: "Hosting & Servers", level: "High Performance", meaning: "Fast, private cloud server hosting", icon: "☁️" },
  { name: "Docker & Nginx", category: "Hosting & Servers", level: "Stable", meaning: "Keeps your website running smoothly", icon: "🐳" },
  { name: "Git & Automated Backups", category: "Hosting & Servers", level: "Protected", meaning: "Safe code versioning & daily backups", icon: "🔀" },

  // Integrations
  { name: "WhatsApp Business API", category: "Payment & Integrations", level: "Instant Chat", meaning: "Send automated WhatsApp notifications", icon: "💬" },
  { name: "Razorpay, UPI & Stripe", category: "Payment & Integrations", level: "Instant Payments", meaning: "Accept payments directly from customers", icon: "💳" },
  { name: "REST APIs & Webhooks", category: "Payment & Integrations", level: "Connected", meaning: "Connects your software with external apps", icon: "🔌" },
];

// Easy-to-understand Projects Showcase
const projectCategories = ["All Solutions", "Websites", "Business Software", "AI & Automation", "Mobile Apps"] as const;
type ProjectCategory = (typeof projectCategories)[number];

interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  tag: string;
  problem: string;
  solution: string;
  result: string;
  easyTech: string;
}

const projectsList: ProjectItem[] = [
  {
    id: "b2b-portal",
    title: "B2B Wholesale Ordering Portal",
    category: "Business Software",
    tag: "Online B2B Ordering",
    problem: "Distributors were taking orders through phone calls and paper slips, leading to mistakes and delayed deliveries.",
    solution: "We built a simple online order portal where dealers can view live stock, place orders 24/7, and download invoices instantly.",
    result: "Cut order processing time by 75% and eliminated 90% of manual order entry mistakes.",
    easyTech: "Custom Web Software + Database",
  },
  {
    id: "saas-crm",
    title: "Automated Lead & Sales CRM",
    category: "Business Software",
    tag: "Sales Management",
    problem: "Sales reps were forgetting to follow up with leads, causing lost sales and low conversion.",
    solution: "We created a clean sales dashboard that automatically assigns leads, sends instant WhatsApp alerts, and tracks follow-ups.",
    result: "Increased lead conversion by 35% across 20+ active companies.",
    easyTech: "Cloud Software + WhatsApp Integration",
  },
  {
    id: "food-ordering",
    title: "Direct Food Ordering System for Restaurants",
    category: "Websites",
    tag: "Direct Online Ordering",
    problem: "High third-party delivery app commissions (up to 30%) were hurting restaurant profits.",
    solution: "We designed a direct online ordering website with live kitchen screens, instant WhatsApp receipts, and UPI payment checkout.",
    result: "Saved restaurants 25% in commissions and drove 40% repeat direct orders.",
    easyTech: "Online Store + Online Payments",
  },
  {
    id: "table-reservation",
    title: "Automated Table & Event Booking Engine",
    category: "Business Software",
    tag: "Online Booking",
    problem: "Double bookings and manual phone calls caused empty tables and customer complaints.",
    solution: "We built an automated reservation page where customers pick date & time, receive instant WhatsApp confirmation, and pay advance deposits.",
    result: "Reduced missed appointments by 60% and fully automated weekend booking management.",
    easyTech: "Booking Software + SMS Alerts",
  },
  {
    id: "ai-assistant",
    title: "24/7 AI Customer Support Assistant",
    category: "AI & Automation",
    tag: "AI Chatbot",
    problem: "Support staff was overwhelmed answering the same product questions hundreds of times a day.",
    solution: "We deployed a smart AI chatbot trained on company documents that answers customer queries instantly 24/7 in friendly language.",
    result: "Handled 80% of routine customer questions automatically in less than 2 seconds.",
    easyTech: "Smart AI + Custom Chatbot",
  },
  {
    id: "business-erp",
    title: "Multi-Store Inventory & Billing Manager",
    category: "Business Software",
    tag: "Multi-Store Management",
    problem: "Store owners could not see inventory or daily sales across 5 branch locations in real-time.",
    solution: "We created a central dashboard connecting all store billing counters, stock movements, and daily profit/loss reports.",
    result: "Gave owners 100% real-time stock clarity and prevented store stockouts.",
    easyTech: "Cloud Management Dashboard",
  },
  {
    id: "corporate-tech-web",
    title: "High-Converting Corporate Website",
    category: "Websites",
    tag: "Company Website",
    problem: "An outdated, slow website generated zero client calls or website enquiries.",
    solution: "We built a modern, ultra-fast website showcasing services clearly with instant call-to-action buttons and WhatsApp chat.",
    result: "Boosted Google visitors by 180% and generated 4x more customer enquiries.",
    easyTech: "Fast Website + Lead Capture",
  },
  {
    id: "mobile-commerce",
    title: "On-Demand Service Booking Mobile App",
    category: "Mobile Apps",
    tag: "Mobile App (iOS & Android)",
    problem: "Customers wanted an easy mobile app to book repair technicians and track them live.",
    solution: "We launched a clean mobile application for iOS & Android with instant booking, live map tracking, and simple card/UPI payments.",
    result: "Achieved a 4.8/5 app store rating with over 15,000 completed customer bookings.",
    easyTech: "Flutter Mobile App",
  },
  {
    id: "whatsapp-api-engine",
    title: "Instant WhatsApp Checkout & UPI Engine",
    category: "AI & Automation",
    tag: "WhatsApp Automation",
    problem: "Taking customer orders on WhatsApp manually required typing payment details and copying delivery addresses.",
    solution: "We created an automated WhatsApp bot that takes the customer's order details, sends an instant UPI payment link, and saves the address automatically.",
    result: "Reduced customer checkout time from 10 minutes to under 60 seconds.",
    easyTech: "WhatsApp Bot + Payment Gateway",
  },
];

// Easy-to-understand Why Choose Us Matrix
const comparisonMatrix = [
  { feature: "Goal & Focus", developer: "Just writes code to order", techneyo: "Solves your business problems & helps you grow" },
  { feature: "Communication", developer: "Uses confusing technical jargon", techneyo: "Explains everything in simple, plain English" },
  { feature: "User Experience", developer: "Hard to use for non-tech users", techneyo: "Clean, simple screens your staff can use easily" },
  { feature: "AI & Automation", developer: "No AI experience", techneyo: "Implements 24/7 AI chat & automated customer replies" },
  { feature: "Project Management", developer: "Requires you to manage everything", techneyo: "Complete end-to-end management from start to launch" },
  { feature: "Post-Launch Support", developer: "Hard to reach after payment", techneyo: "Long-term tech partner providing support & updates" },
];



// Simple AI Benefits
const aiFeatures = [
  { title: "24/7 Customer Chatbot", desc: "Answers customer questions on your website even while you sleep." },
  { title: "Instant WhatsApp Replies", desc: "Sends instant order receipts, booking confirmations, and payment links." },
  { title: "Smart Document Reader", desc: "Reads PDF invoices, bills, and contracts, saving hours of manual typing." },
  { title: "Automated Lead Scoring", desc: "Tells your sales team which customer inquiries are most likely to buy." },
  { title: "Automated Email Replies", desc: "Drafts quick, helpful responses for common customer inquiries." },
  { title: "Smart Internal Search", desc: "Find any company document, price list, or policy in less than 2 seconds." },
];

// Advisory Benefits for Non-Tech Clients
const techLeadershipServices = [
  "Plain-English Advice on Choosing the Right Tech",
  "Clear Budget Planning & Cost Reduction",
  "Independent Review of Developer Work & Proposals",
  "Easy-to-Understand System Design Blueprints",
  "Security Checks to Protect Customer Data",
  "Guidance on Scaling Your Online Business",
  "Automating Daily Team Operations",
  "Choosing the Best Hosting & Cloud Plans",
];

// Testimonials
const testimonials = [
  {
    name: "Vikram Malhotra",
    role: "Founder, SupplyTech Systems",
    content: "Techneyo Solutions made software development so easy to understand. They guided us step-by-step, avoided unnecessary costs, and built a simple portal our clients love using.",
    rating: 5,
  },
  {
    name: "Rajesh K. Verma",
    role: "Managing Director, RetailFlow",
    content: "Unlike traditional developers who talk in technical jargon, Techneyo speaks business. They streamlined our store inventory system and set up automated WhatsApp receipts smoothly.",
    rating: 5,
  },
  {
    name: "Anita Sharma",
    role: "Product Lead, HealthFlex",
    content: "The AI chatbot Techneyo built for us handles 80% of our customer questions automatically. Our support team is less stressed, and our customers get instant answers!",
    rating: 5,
  },
];

// Non-Technical FAQ Accordion
const faqList = [
  {
    q: "I am not technical at all. Will I be able to manage my website or software?",
    a: "Yes, 100%! We design everything to be simple and user-friendly. You will get an easy admin panel where you can add text, view customer inquiries, or check orders with just a few clicks. Plus, we give you full walkthrough guidance so your team feels completely confident.",
  },
  {
    q: "How do I get started with Techneyo Solutions?",
    a: "It's super easy! Just fill out our brief form below or message us on WhatsApp. We'll have a friendly, jargon-free conversation to understand what you need, answer your questions, and give you a clear proposal.",
  },
  {
    q: "How long does it take to complete a project?",
    a: "For a business website, it usually takes 1 to 2 weeks. For custom software or apps, it generally ranges from 3 to 6 weeks depending on features. We always give you a clear timeline before starting and keep you updated every step of the way.",
  },
  {
    q: "Will my website work well on mobile phones?",
    a: "Absolutely! Over 80% of web traffic comes from smartphones. Every website and software we build is fully mobile-responsive, looks great on all screens, and loads lightning fast.",
  },
  {
    q: "What if I need help or updates after the website is launched?",
    a: "We don't disappear after launching! We provide dedicated post-launch support and offer simple maintenance plans to keep your website updated, secure, and fast at all times.",
  },
  {
    q: "Can you help automate my manual daily business tasks?",
    a: "Yes! If you're spending hours copying data between spreadsheets, answering repetitive customer calls, or sending manual receipts, we can set up automated workflows and WhatsApp bots to handle it for you.",
  },
  {
    q: "What do I need to provide before starting?",
    a: "Just tell us about your business, your main goals, and any examples of websites or software you like. We handle all technical requirements, design ideas, and server setups for you.",
  },
  {
    q: "Do you work with clients outside India?",
    a: "Yes! We work with business owners and companies across India, the US, UK, UAE, Australia, and worldwide. We use simple messaging, email updates, and online video calls to keep communication effortless.",
  },
];

const Portfolio = () => {
  const serviceSelectId = useId();
  const budgetSelectId = useId();

  const [activeTechCategory, setActiveTechCategory] = useState<TechCategory>("All Tools");
  const [activeProjectCategory, setActiveProjectCategory] = useState<ProjectCategory>("All Solutions");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form State
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    serviceRequired: "Business Website Development",
    budgetRange: "₹25,000 - ₹50,000 ($300 - $600)",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleServiceSelect = (serviceName: string) => {
    setForm((prev) => ({ ...prev, serviceRequired: serviceName }));
    const formElement = document.getElementById("lead-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      await createContactEnquiry({
        name: form.name,
        phone: form.phone,
        email: form.email,
        businessName: form.businessName,
        serviceRequired: form.serviceRequired,
        budgetRange: form.budgetRange,
        message: form.message,
        sourcePage: "/portfolio",
        serviceInterested: form.serviceRequired,
      });

      trackEvent("contact_form_submit", {
        service_name: form.serviceRequired,
        cta_location: "portfolio_lead_form",
      });
      trackEvent("project_enquiry", {
        service_name: form.serviceRequired,
        cta_location: "portfolio_lead_form",
      });

      setLeadContext({
        service_name: form.serviceRequired,
        source_page_url: window.location.href,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit enquiry. Please try WhatsApp or call direct.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTech =
    activeTechCategory === "All Tools"
      ? techItems
      : techItems.filter((t) => t.category === activeTechCategory);

  const filteredProjects =
    activeProjectCategory === "All Solutions"
      ? projectsList
      : projectsList.filter((p) => p.category === activeProjectCategory);

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Techneyo Solutions",
    description: "Easy-to-Understand Business Websites, Custom Software, AI Automation & Technology Advisory.",
    url: `${businessInfo.website}/portfolio`,
    telephone: businessInfo.phoneDisplay,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Business Website Development",
      "Custom Business Software",
      "AI & Automation Solutions",
      "Mobile Applications",
      "Technology Advisory",
    ],
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-cyan-500 selection:text-black">
      <PageMeta
        title="Techneyo Solutions | Easy-to-Understand Websites, Software & AI Solutions"
        description="We turn your business ideas into simple, high-converting websites, easy custom software, mobile apps, and 24/7 AI automations. No technical jargon."
        keywords="Business Website Development, Custom Software Solutions, AI Automation, Easy Software for Business, Mobile Apps India, Techneyo Solutions"
        canonicalPath="/portfolio"
        schema={portfolioSchema}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1324] via-[#070b14] to-[#070b14] py-16 lg:py-24">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-purple-500/15 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="lg:col-span-7"
            >
              {/* Badges */}
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  "7+ Years Experience",
                  "Websites & Apps",
                  "AI & Automation",
                  "Tech Business Advisory",
                ].map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300"
                  >
                    <Sparkles size={12} className="text-cyan-400" />
                    {badge}
                  </span>
                ))}
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Turning Business Ideas Into{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Scalable Digital Solutions.
                </span>
              </h1>

              {/* Supporting Text (Non-Technical & Clear) */}
              <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">
                We build fast, high-converting websites, easy-to-use custom business software, mobile apps, and 24/7 AI automations that help your business get more customers, save time, and run smoothly.
              </p>

              {/* Positioning Callout */}
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                <p className="text-xs font-medium text-cyan-200/90 sm:text-sm">
                  <span className="font-bold text-white">Your All-in-One Tech Partner:</span> We handle design, development, cloud setup, and AI automation so you can focus on growing your business without managing developers.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#lead-form-section"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:brightness-110"
                >
                  <span>Let's Discuss Your Project</span>
                  <ArrowRight size={18} />
                </a>

                <a
                  href="#work"
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-cyan-400/50 hover:bg-white/10"
                >
                  <span>View Our Work</span>
                </a>

                <a
                  href={businessInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3.5 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp Direct</span>
                </a>
              </div>
            </motion.div>

            {/* Hero Graphic Card */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-600 opacity-30 blur-xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/80 p-3 backdrop-blur-xl shadow-2xl">
                  <img
                    src="/techneyo-hero.jpg"
                    alt="Techneyo Solutions Digital Architecture & AI Graphic"
                    className="h-auto w-full rounded-xl object-cover shadow-inner"
                    loading="eager"
                  />
                  <div className="mt-3 flex items-center justify-between px-2 text-xs font-semibold text-white/80">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Zap size={14} /> Easy to Use
                    </span>
                    <span className="flex items-center gap-1 text-purple-300">
                      <Cpu size={14} /> AI Powered
                    </span>
                    <span className="flex items-center gap-1 text-emerald-300">
                      <ShieldCheck size={14} /> 99.9% Online
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST / EXPERTISE HIGHLIGHTS BAR */}
      <section className="border-y border-white/10 bg-white/[0.02] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-cyan-400">
            Why Business Owners Trust Techneyo Solutions
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {trustItems.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center transition-all hover:border-cyan-400/30 hover:bg-white/[0.06]"
              >
                <span className="text-xs font-bold text-white">{item.label}</span>
                <span className="mt-1 text-[10px] text-white/50">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT TECHNEYO SECTION */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Who We Are
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                More Than Developers.{" "}
                <span className="text-cyan-300">Your Complete Technology Partner.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                Building custom software or launching a website shouldn't feel overwhelming. At Techneyo Solutions, we handle everything from initial planning and clean design to coding, cloud setup, and ongoing support.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                You don't need to learn technical jargon or micromanage developers. We communicate clearly in plain English, keep you updated regularly, and build software that is effortless for you, your team, and your customers to use.
              </p>

              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Solutions We Have Built Across Industries:
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Business Websites",
                    "Wholesale B2B Portals",
                    "Sales CRMs",
                    "Subscription SaaS",
                    "Food Ordering Systems",
                    "Table Reservations",
                    "Mobile Apps",
                    "WhatsApp Integrations",
                    "AI Customer Support",
                    "Business Automation",
                  ].map((domain, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80"
                    >
                      ✓ {domain}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#lead-form-section"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-cyan-300"
                >
                  <span>Work With Us</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: "No Tech Management", desc: "We manage the entire project so you can focus on business.", icon: Headphones },
                  { title: "Easy for Your Staff", desc: "Simple admin panels that require zero technical training.", icon: Smile },
                  { title: "Business Growth Focus", desc: "Every feature is designed to save time or drive revenue.", icon: LineChart },
                  { title: "Safe & Secure Hosting", desc: "Cloud servers with 99.9% uptime and daily backups.", icon: Server },
                  { title: "24/7 AI Automation", desc: "Smart AI assistants that handle customer inquiries anytime.", icon: Bot },
                  { title: "Clear Communication", desc: "Transparent progress updates without confusing jargon.", icon: Lightbulb },
                ].map((card, idx) => {
                  const IconComp = card.icon;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-white/[0.06]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
                        <IconComp size={20} />
                      </div>
                      <h3 className="mt-3 font-display text-sm font-bold text-white">{card.title}</h3>
                      <p className="mt-1 text-xs text-white/60">{card.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE CAN HELP YOU WITH (SERVICES GRID) */}
      <section id="services" className="border-t border-white/10 bg-white/[0.01] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Core Offerings
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              What We Can Help You With
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
              Clear, practical digital services designed to help your business get clients, automate work, and scale up.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceList.map((s) => {
              const IconComponent = s.icon;
              return (
                <div
                  key={s.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
                        <IconComponent size={24} />
                      </div>
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                        {s.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      {s.desc}
                    </p>

                    <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
                      {s.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-white/70">
                          <CheckCircle2 size={13} className="text-cyan-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleServiceSelect(s.title)}
                    className="mt-6 flex items-center justify-center gap-2 w-full rounded-xl bg-white/10 py-2.5 text-xs font-bold text-white transition-all group-hover:bg-cyan-400 group-hover:text-black"
                  >
                    <span>{s.cta}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECHNICAL STACK & CAPABILITIES (EXPLAINED IN PLAIN ENGLISH) */}
      <section id="stack" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Tools We Master
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Our Technology & Building Blocks
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
              We select modern, fast, and secure tools so your website and software run reliably without freezing or crashing.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {techCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTechCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeTechCategory === cat
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-500/20"
                    : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredTech.map((item, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all hover:border-cyan-400/50 hover:bg-white/[0.08]"
              >
                <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <span className="rounded bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300">
                      {item.level}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/60">{item.meaning}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WORK SHOWCASE ("SOLUTIONS WE'VE BUILT") */}
      <section id="work" className="border-t border-white/10 bg-white/[0.01] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Real Projects
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                Solutions We've Built For Clients
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Explore real business problems we solved with simple, high-impact digital products.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {projectCategories.map((pCat) => (
                <button
                  key={pCat}
                  onClick={() => setActiveProjectCategory(pCat)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    activeProjectCategory === pCat
                      ? "bg-cyan-400 text-black font-bold"
                      : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  {pCat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all hover:border-cyan-400/40 hover:bg-white/[0.06]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold text-cyan-300">
                      {p.tag}
                    </span>
                    <span className="text-[10px] font-medium text-white/40">{p.easyTech}</span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-white">{p.title}</h3>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="rounded-lg bg-red-500/10 p-2.5 border border-red-500/20">
                      <span className="font-bold text-red-400">The Problem: </span>
                      <span className="text-white/70">{p.problem}</span>
                    </div>

                    <div className="rounded-lg bg-cyan-500/10 p-2.5 border border-cyan-500/20">
                      <span className="font-bold text-cyan-300">What We Built: </span>
                      <span className="text-white/70">{p.solution}</span>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                    <TrendingUp size={16} className="shrink-0" />
                    <span>Business Result: {p.result}</span>
                  </div>
                </div>

                <a
                  href="#lead-form-section"
                  onClick={() => handleServiceSelect(p.tag)}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2.5 text-xs font-bold text-white transition-all hover:border-cyan-400 hover:bg-cyan-400 hover:text-black"
                >
                  <span>Build Something Similar</span>
                  <ArrowRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK (5-STEP SIMPLE PROCESS) */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Simple & Transparent
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              How We Work With You (5 Simple Steps)
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
              No stress, no technical confusion. Here is our straightforward process from start to launch.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { num: "01", step: "Simple Discussion", desc: "We listen to your business goals, what problem you want to solve, and your budget." },
              { num: "02", step: "Clear Blueprint", desc: "We map out an easy-to-understand plan, design preview, and fixed timeline." },
              { num: "03", step: "Expert Building", desc: "Our technical team designs and builds your project using fast, secure standards." },
              { num: "04", step: "Testing & Launch", desc: "We test everything thoroughly on all phones & computers, then launch it live." },
              { num: "05", step: "Growth & Support", desc: "We provide ongoing maintenance, security backups, and technical support whenever you need." },
            ].map((st, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-white/[0.06]"
              >
                <div className="font-display text-3xl font-extrabold text-cyan-400/40">{st.num}</div>
                <h3 className="mt-2 font-display text-base font-bold text-white">{st.step}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#lead-form-section"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-cyan-500/20 transition-all hover:brightness-110"
            >
              <span>Start a Project Discussion</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* WHY WORK WITH TECHNEYO */}
      <section className="border-t border-white/10 bg-white/[0.01] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Clear Comparison
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Why Businesses Choose a Dedicated Partner Instead of Just a Developer
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
              We handle the tech end-to-end so you don't have to worry about broken code, delayed launches, or complex setups.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/10 font-display text-xs text-white">
                  <tr>
                    <th className="p-4">What Matters</th>
                    <th className="p-4 text-white/50">Traditional Freelance Developer</th>
                    <th className="p-4 font-bold text-cyan-300">Techneyo Solutions (Your Tech Partner)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {comparisonMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="p-4 font-bold text-white">{row.feature}</td>
                      <td className="p-4 text-white/50">{row.developer}</td>
                      <td className="p-4 font-semibold text-cyan-300">{row.techneyo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS PROBLEMS WE SOLVE */}
      <ProblemSolverSection onSelectService={handleServiceSelect} />

      {/* AI & AUTOMATION SECTION */}
      <section id="ai" className="relative border-t border-white/10 bg-gradient-to-b from-[#0b1324] to-[#070b14] py-20">
        <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                <Bot size={14} /> AI & Business Automation
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                Let's Put AI to Work in Your Business.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Imagine having an intelligent assistant working for your business 24/7. We build practical AI tools that answer customer questions on your website, send instant WhatsApp receipts, draft replies, and organize your business documents automatically.
              </p>

              <div className="mt-8">
                <button
                  onClick={() => handleServiceSelect("AI & Business Automation")}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-purple-500/20 transition-all hover:brightness-110"
                >
                  <Sparkles size={16} />
                  <span>Discuss an AI Idea</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {aiFeatures.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all hover:border-purple-400/40 hover:bg-white/[0.06]"
                  >
                    <h4 className="flex items-center gap-2 font-display text-sm font-bold text-white">
                      <Sparkle size={14} className="text-purple-400 shrink-0" />
                      {f.title}
                    </h4>
                    <p className="mt-1 text-xs text-white/60">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY LEADERSHIP & CONSULTING SECTION */}
      <section id="leadership" className="border-t border-white/10 bg-[#05080f] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-[#0b1324] to-slate-950 p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  Friendly Executive Advisory
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                  Need Honest Tech Guidance Before Investing Your Capital?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  Avoid costly software mistakes. Techneyo Solutions provides virtual technology advisory to review developer estimates, check software security, recommend the best tools, and guide your digital decisions in simple, jargon-free English.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {techLeadershipServices.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white/80">
                      <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleServiceSelect("Technology Advisory & Guidance")}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-black transition-all hover:bg-cyan-300"
                  >
                    <UserCheck size={18} />
                    <span>Book a Tech Advisory Consultation</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-md">
                  <Cpu size={48} className="mx-auto text-cyan-400" />
                  <h3 className="mt-4 font-display text-xl font-bold text-white">Virtual Tech Advisory</h3>
                  <p className="mt-2 text-xs text-white/60">
                    Get clear, executive-level technical advice on demand without hiring full-time internal leadership.
                  </p>
                  <div className="mt-4 rounded-xl bg-white/5 p-3 text-xs font-semibold text-cyan-300">
                    ✓ Flexible Project Audits or Monthly Guidance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS & MEASURABLE OUTCOMES */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Business Outcomes
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Proven Results For Our Partners
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
              We measure our success by how much time, money, and hassle we save your business.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { stat: "70%", label: "Manual Work Saved" },
              { stat: "3x", label: "Faster Launch Times" },
              { stat: "99.9%", label: "Website Uptime & Speed" },
              { stat: "100%", label: "Automated Lead Alerts" },
              { stat: "40%", label: "More Customer Enquiries" },
            ].map((res, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-sm transition-all hover:border-cyan-400/40"
              >
                <div className="font-display text-3xl font-extrabold text-cyan-300 sm:text-4xl">{res.stat}</div>
                <div className="mt-2 text-xs font-medium text-white/70">{res.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-white/10 bg-white/[0.01] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Client Feedback
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              What Business Owners Say
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
              >
                <p className="text-xs leading-relaxed italic text-white/80">"{t.content}"</p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <div className="font-display text-sm font-bold text-white">{t.name}</div>
                  <div className="text-[11px] text-cyan-300">{t.role}</div>
                  <div className="mt-1 flex text-amber-400 text-xs">{"★".repeat(t.rating)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#lead-form-section"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 hover:underline"
            >
              <span>Let's Build Something Together →</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (PLAIN ENGLISH & EASY TO READ) */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Got Questions?
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Frequently Asked Questions (Answered Simply)
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left font-display text-sm font-bold text-white hover:text-cyan-300"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-cyan-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 text-xs leading-relaxed text-white/70"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HIGH-CONVERTING LEAD FORM SECTION */}
      <section id="lead-form-section" className="border-t border-white/10 bg-gradient-to-b from-[#070b14] via-[#0b1324] to-[#070b14] py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                <Send size={14} /> Start Your Project
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Tell Us What You're Building.
              </h2>
              <p className="mt-2 text-xs text-white/60 sm:text-sm">
                Fill out the simple details below and our team will get back to you with a clear plan and consultation.
              </p>
            </div>

            {submitted ? (
              <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
                <CheckCircle2 size={48} className="mx-auto text-emerald-400" />
                <h3 className="mt-4 font-display text-2xl font-bold text-white">Thank You!</h3>
                <p className="mt-2 text-sm text-white/80">
                  Thanks! We've received your requirements and will review them shortly.
                </p>
                <div className="mt-6">
                  <a
                    href={businessInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-emerald-400"
                  >
                    <MessageCircle size={18} />
                    <span>Chat Directly on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {submitError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                      Company / Business Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nexus Tech Ltd"
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 99887 73122"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={serviceSelectId} className="mb-1 block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                      What do you need help with? *
                    </label>
                    <select
                      id={serviceSelectId}
                      value={form.serviceRequired}
                      onChange={(e) => setForm({ ...form, serviceRequired: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-xs text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="Business Website Development">Business Website Development</option>
                      <option value="Custom Software & Dashboards">Custom Software & Dashboards</option>
                      <option value="SaaS & Digital Product Development">SaaS & Product Development</option>
                      <option value="Mobile Application">Mobile Application</option>
                      <option value="AI & Business Automation">AI & Business Automation</option>
                      <option value="Payment & System Integrations">Payment & System Integrations</option>
                      <option value="Technology Advisory & Guidance">Technology Advisory & Guidance</option>
                      <option value="Other">Other Requirement</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={budgetSelectId} className="mb-1 block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                      Estimated Budget Range
                    </label>
                    <select
                      id={budgetSelectId}
                      value={form.budgetRange}
                      onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-xs text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="₹25,000 - ₹50,000 ($300 - $600)">₹25,000 - ₹50,000 ($300 - $600)</option>
                      <option value="₹50,000 - ₹1,00,000 ($600 - $1,200)">₹50,000 - ₹1,00,000 ($600 - $1,200)</option>
                      <option value="₹1,00,000 - ₹3,00,000 ($1,200 - $3,500)">₹1,00,000 - ₹3,00,000 ($1,200 - $3,500)</option>
                      <option value="₹3,00,000+ ($3,500+)">₹3,00,000+ ($3,500+)</option>
                      <option value="Flexible / Needs Advisory">Flexible / Needs Advisory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    Project Description / Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us a little bit about what you want to build or what problem you'd like to solve..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/25 transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Send Project Enquiry</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FINAL CONTACT SECTION */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Have an Idea, Problem or Project?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 sm:text-base">
              Let's discuss how technology can help you build, automate, or grow your business.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#lead-form-section"
                className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-black transition-all hover:bg-cyan-300"
              >
                <span>Start a Project</span>
                <ArrowRight size={16} />
              </a>

              <a
                href={businessInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3.5 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20"
              >
                <MessageCircle size={18} />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={businessInfo.phoneHref}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                <Phone size={18} />
                <span>Call Direct</span>
              </a>
            </div>

            {/* Direct Details */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-white/60">
              <div>Email: <a href={`mailto:${businessInfo.email}`} className="text-white hover:underline">{businessInfo.email}</a></div>
              <div>Phone: <a href={businessInfo.phoneHref} className="text-white hover:underline">{businessInfo.phoneDisplay}</a></div>
              <div>Location: <span className="text-white">India (Serving Clients Worldwide)</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 p-3 backdrop-blur-lg lg:hidden">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <a
            href={businessInfo.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 rounded-xl bg-emerald-500/20 py-2.5 font-bold text-emerald-400 border border-emerald-500/30"
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>

          <a
            href={businessInfo.phoneHref}
            className="flex items-center justify-center gap-1 rounded-xl bg-white/10 py-2.5 font-bold text-white border border-white/10"
          >
            <Phone size={16} />
            <span>Call</span>
          </a>

          <a
            href="#lead-form-section"
            className="flex items-center justify-center gap-1 rounded-xl bg-cyan-400 py-2.5 font-bold text-black shadow-md shadow-cyan-500/20"
          >
            <Zap size={16} />
            <span>Start</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
