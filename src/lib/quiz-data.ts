import {
  QuizIndustry,
  QuizBottleneck,
  QuizDigitalStatus,
  QuizTimeline,
  UrgencyScore,
  UrgencyLevel,
} from "@/types/client-needs";
import type { Offer } from "@/types/offer";

export const QUIZ_INDUSTRIES: QuizIndustry[] = [
  {
    id: "healthcare",
    name: "Healthcare & Clinics",
    iconName: "Activity",
    description: "Hospitals, private practices, diagnostics, wellness & medical clinics",
    statHighlight: "77% of patients search Google before booking a consultation",
    benchmarkHint: "Healthcare businesses require instant trust, doctor credentials, and 1-click WhatsApp/direct booking.",
  },
  {
    id: "ecommerce",
    name: "E-Commerce & D2C",
    iconName: "ShoppingBag",
    description: "Online stores, direct-to-consumer brands, lifestyle & apparel",
    statHighlight: "Every 1s mobile lag drops e-commerce conversions by 26%",
    benchmarkHint: "E-commerce demands lightning-fast mobile checkouts, automated cart recovery, and high Google Shopping visibility.",
  },
  {
    id: "realestate",
    name: "Real Estate & Builders",
    iconName: "Building2",
    description: "Property brokers, real estate developers, commercial & residential leasing",
    statHighlight: "88% of homebuyers begin their property search online",
    benchmarkHint: "High-ticket real estate buyers judge credibility entirely by your project visuals, brochures, and immediate lead routing.",
  },
  {
    id: "manufacturing",
    name: "Manufacturing & B2B",
    iconName: "Factory",
    description: "Exporters, industrial parts, machinery, OEMs, wholesale & B2B suppliers",
    statHighlight: "73% of B2B procurement heads research industrial vendors digitally",
    benchmarkHint: "B2B manufacturing requires detailed product catalogs, instant RFQ (Request for Quote) flows, and international SEO.",
  },
  {
    id: "hospitality",
    name: "Restaurants & Hospitality",
    iconName: "Utensils",
    description: "Cafes, dine-in restaurants, cloud kitchens, luxury resorts & hotels",
    statHighlight: "92% of diners look up restaurant menus and reviews online first",
    benchmarkHint: "High footfall requires verified Google Maps ranking, digital menus, and zero-commission direct ordering/reservation channels.",
  },
  {
    id: "services",
    name: "Professional & Legal Services",
    iconName: "Briefcase",
    description: "Chartered Accountants, law firms, consultants, financial advisors & HR",
    statHighlight: "High-value clients research firm authority before picking up the phone",
    benchmarkHint: "Professional service firms need institutional authority, case studies, and automated appointment scheduling.",
  },
  {
    id: "education",
    name: "Education & EdTech",
    iconName: "GraduationCap",
    description: "Schools, colleges, coaching institutes, IELTS centers & online courses",
    statHighlight: "80% of parents and students compare admission portals on smartphones",
    benchmarkHint: "Educational institutes need high-converting admission inquiry funnels and automated parent follow-up sequences.",
  },
  {
    id: "tech_startup",
    name: "Tech, SaaS & Startups",
    iconName: "Cpu",
    description: "Software products, mobile apps, AI tools, fintech & modern ventures",
    statHighlight: "A modern product site is required to raise capital and attract high-tier users",
    benchmarkHint: "Startups need ultra-modern interactive UI, clean developer documentation, and seamless product demo funnels.",
  },
  {
    id: "local_retail",
    name: "Local Retail & Services",
    iconName: "Store",
    description: "Jewelry, salons, fitness gyms, auto dealerships & local storefronts",
    statHighlight: "46% of all Google searches have direct local purchase intent",
    benchmarkHint: "Local dominance requires Top 3 Google Map Pack placement, review acceleration, and WhatsApp quick connect.",
  },
];

export const QUIZ_BOTTLENECKS: QuizBottleneck[] = [
  {
    id: "no_website",
    title: "No website or outdated, non-mobile website",
    description: "We either have no web presence or our current site looks dated and loses customers.",
    urgencyLevel: "Critical",
    urgencyWeight: 35,
    defaultHint: "🔴 High Urgency: 84% of consumers believe a modern website makes a business significantly more credible than competitors.",
    industryHints: {
      healthcare: "🔴 Critical: Patients immediately distrust clinics without a modern website. You are losing 30-50 patient consultations monthly to local competitors.",
      ecommerce: "🔴 Critical: Outdated or desktop-only sites suffer 85%+ bounce rates on smartphones where 75% of purchases occur.",
      realestate: "🔴 Critical: High-net-worth investors will not commit to property inquiries on an outdated or slow website.",
      manufacturing: "🔴 Critical: International and domestic buyers bypass industrial vendors who lack professional digital catalogs.",
      hospitality: "🔴 Critical: Diners who encounter a broken or missing website immediately pick another restaurant nearby.",
      services: "🔴 Critical: Corporate and high-ticket clients view an outdated site as a reflection of dated service quality.",
      education: "🔴 Critical: Parents evaluate institute reputation based on website sophistication before ever visiting the campus.",
      tech_startup: "🔴 Critical: Tech buyers and investors will not take a product seriously without high-craft modern design.",
      local_retail: "🔴 Critical: Local customers driving by search on Google Maps; no website drops your local trust rank by half.",
    },
    recommendedCategory: "Website Presence",
  },
  {
    id: "zero_leads_seo",
    title: "Zero Google visibility / Competitors steal our local leads",
    description: "When customers search for our services on Google, our competitors appear first.",
    urgencyLevel: "Critical",
    urgencyWeight: 30,
    defaultHint: "🔴 High Urgency: The top 3 Google search results capture over 68% of all client clicks; being unranked is leaving money on the table.",
    industryHints: {
      healthcare: "🔴 High Urgency: Over 70% of high-margin emergency and specialist clinic queries go to the top 3 ranked clinics.",
      ecommerce: "🔴 High Urgency: Without organic SEO and Google Shopping indexing, you are forced to pay exorbitant ad costs for every visitor.",
      realestate: "🔴 High Urgency: Local brokers ranking #1 on 'Properties in [City]' dominate 80% of inbound buyer enquiries.",
      manufacturing: "🔴 High Urgency: Procurement officers search 'B2B suppliers in India'; if unranked, overseas buyers won't find you.",
      hospitality: "🔴 High Urgency: 'Best dining near me' queries drive 60%+ weekend covers directly to Google Map top 3 listings.",
      services: "🔴 High Urgency: Clients looking for specialized tax, audit, or legal counsel exclusively contact top search listings.",
      education: "🔴 High Urgency: Admission season runs on Google search. Being unranked means paying 3x more for sponsored lead lists.",
      tech_startup: "🔴 High Urgency: Niche B2B SaaS buyers evaluate category leaders ranking for high-intent comparison queries.",
      local_retail: "🔴 High Urgency: Map pack searches drive immediate same-day foot traffic directly into competitor stores.",
    },
    recommendedCategory: "Digital Growth",
  },
  {
    id: "low_conversions",
    title: "Traffic comes, but visitors don't call or buy",
    description: "People visit our website or social media, but they leave without contacting us.",
    urgencyLevel: "Moderate",
    urgencyWeight: 20,
    defaultHint: "🟡 Moderate Urgency: Your marketing is working to bring traffic, but high friction or unclear value is leaking up to 90% of prospective buyers.",
    industryHints: {
      healthcare: "🟡 Moderate Urgency: Visitors need simple WhatsApp booking buttons, doctor credentials, and clear pricing FAQs to convert.",
      ecommerce: "🟡 Moderate Urgency: Friction in checkout steps and lack of instant WhatsApp order tracking increases abandoned carts.",
      realestate: "🟡 Moderate Urgency: Buyers want 1-click floor plan downloads and instant brochure delivery via WhatsApp.",
      manufacturing: "🟡 Moderate Urgency: Long contact forms kill B2B RFQs. Instant RFQ popups boost lead capture by 3x.",
      hospitality: "🟡 Moderate Urgency: Missing direct table booking or PDF menu links causes diners to bounce back to Google.",
      services: "🟡 Moderate Urgency: Clear packages, social proof, and seamless calendar booking turn passive readers into clients.",
      education: "🟡 Moderate Urgency: An interactive fee calculator or course syllabus download converts 4x more prospective students.",
      tech_startup: "🟡 Moderate Urgency: Clear value proposition, interactive demos, and self-serve onboarding prevent churn.",
      local_retail: "🟡 Moderate Urgency: Direct 'Directions' & WhatsApp click-to-chat triggers prompt instant store visits.",
    },
    recommendedCategory: "Website Presence",
  },
  {
    id: "manual_tasks",
    title: "Drowning in manual tasks / No WhatsApp or CRM automation",
    description: "We manually respond to inquiries, chase customer follow-ups, and copy-paste lead details.",
    urgencyLevel: "Moderate",
    urgencyWeight: 20,
    defaultHint: "🟡 Moderate Urgency: Businesses that respond to a lead within 5 minutes are 21x more likely to qualify them than those who wait 30 minutes.",
    industryHints: {
      healthcare: "🟡 Moderate Urgency: Automated appointment confirmations and reminder messages reduce missed consultations by 65%.",
      ecommerce: "🟡 Moderate Urgency: Automated order notifications and abandoned cart WhatsApp sequences recover 15-25% of lost sales.",
      realestate: "🟡 Moderate Urgency: Instant WhatsApp lead assignment to sales agents increases site visit bookings by over 40%.",
      manufacturing: "🟡 Moderate Urgency: Automated quote generators and CRM pipelines keep your sales reps focused on closing deals.",
      hospitality: "🟡 Moderate Urgency: Automated WhatsApp reservation confirmations and review collection boost repeat diners.",
      services: "🟡 Moderate Urgency: Automated onboarding intake forms and invoice reminders save your team 15+ hours weekly.",
      education: "🟡 Moderate Urgency: Automated lead nurturing via WhatsApp drip campaigns increases admission conversion by 35%.",
      tech_startup: "🟡 Moderate Urgency: Automated user onboarding, billing webhooks, and Slack notifications are essential to scale.",
      local_retail: "🟡 Moderate Urgency: Automated customer loyalty messages and seasonal promo broadcasts keep customers returning.",
    },
    recommendedCategory: "Automation",
  },
  {
    id: "high_ad_spend",
    title: "High advertising spend with low lead quality or ROI",
    description: "We run Meta/Google Ads, but leads are either junk or our cost-per-acquisition is too high.",
    urgencyLevel: "Critical",
    urgencyWeight: 30,
    defaultHint: "🔴 High Urgency: Sending paid ad traffic to generic pages burns up to 60% of your ad spend without qualified conversions.",
    industryHints: {
      healthcare: "🔴 Critical: Untargeted ads generate unqualified inquiries. Hyper-targeted landing pages double appointment show-up rates.",
      ecommerce: "🔴 Critical: Rising Meta CPMs require high-AOV bundles and fast loading landing pages to achieve profitable ROAS.",
      realestate: "🔴 Critical: Generic real estate lead forms attract brokers rather than genuine homebuyers, wasting your sales team's time.",
      manufacturing: "🔴 Critical: B2B industrial ads must filter out retail consumers to focus budget strictly on procurement decision-makers.",
      hospitality: "🔴 Critical: Ads without geo-fencing and clear promo offers burn budget on out-of-area browsers.",
      services: "🔴 Critical: High-CPC search ads need dedicated high-trust landing pages to convert premium clients.",
      education: "🔴 Critical: Educational ads without qualification steps deliver junk numbers that never answer counselor calls.",
      tech_startup: "🔴 Critical: High CAC will drain runway quickly unless conversion funnels and product-led onboarding are dialed in.",
      local_retail: "🔴 Critical: Hyper-local geo-targeted ads with click-to-WhatsApp convert at 3x the rate of standard banner ads.",
    },
    recommendedCategory: "Digital Growth",
  },
  {
    id: "new_business_launch",
    title: "Launching a new brand / Need a complete digital foundation",
    description: "We are starting fresh and need domain, brand identity, modern website, and launch strategy.",
    urgencyLevel: "Optimization",
    urgencyWeight: 10,
    defaultHint: "🟢 High Growth Opportunity: Establishing your digital infrastructure right from day one prevents costly rebuilds and accelerates initial revenue.",
    industryHints: {
      healthcare: "🟢 Opportunity: A brand-new clinic launch with pre-opening SEO ensures a full patient appointment book from week one.",
      ecommerce: "🟢 Opportunity: Modern D2C launch setup with Shopify/Next.js and automated marketing gives you instant competitive advantage.",
      realestate: "🟢 Opportunity: Launching a new residential or commercial project with a luxury microsite drives early bird investor deposits.",
      manufacturing: "🟢 Opportunity: Launching your manufacturing facility with an international export catalog opens global B2B contracts immediately.",
      hospitality: "🟢 Opportunity: Pre-launch buzz, food influencer previews, and Google Maps optimization guarantee packed tables on opening day.",
      services: "🟢 Opportunity: Professional brand positioning from day one commands higher retainers and premium client respect.",
      education: "🟢 Opportunity: Launching a modern institute platform establishes instant academic authority in your region.",
      tech_startup: "🟢 Opportunity: An exceptional launchpad site attracts early adopters, beta testers, and angel investors.",
      local_retail: "🟢 Opportunity: Grand opening local promotion and WhatsApp VIP list create immediate foot traffic.",
    },
    recommendedCategory: "Website Presence",
  },
];

export const QUIZ_DIGITAL_STATUS: QuizDigitalStatus[] = [
  {
    id: "starting_from_scratch",
    title: "Starting from scratch",
    description: "No website, no verified Google presence, brand new digital footprint.",
    urgencyWeight: 20,
    hint: "Every day without an indexed domain allows competitors to cement their search rankings.",
  },
  {
    id: "social_media_only",
    title: "Active on Instagram / WhatsApp only",
    description: "We post on social media or chat on WhatsApp, but have no official website.",
    urgencyWeight: 15,
    hint: "Social media algorithms can cut reach overnight; owning your website guarantees high buyer trust.",
  },
  {
    id: "old_dated_site",
    title: "Have an older, outdated website",
    description: "Built 3+ years ago, slow on smartphones, or difficult for our team to update.",
    urgencyWeight: 25,
    hint: "Google demotes non-responsive sites, and 94% of first impressions relate to visual design.",
  },
  {
    id: "active_site_low_results",
    title: "Active website, but sluggish growth",
    description: "Website exists, but it doesn't rank on Google or generate predictable client inquiries.",
    urgencyWeight: 10,
    hint: "A technical audit and targeted CRO / SEO overhaul can unlock rapid organic revenue.",
  },
];

export const QUIZ_TIMELINES: QuizTimeline[] = [
  {
    id: "urgent_7_days",
    title: "Emergency / Immediate",
    timeframe: "Launch within 7–14 days",
    urgencyWeight: 25,
    badge: "Urgent Priority",
  },
  {
    id: "fast_30_days",
    title: "Fast Growth",
    timeframe: "Scale leads in 30 days",
    urgencyWeight: 15,
    badge: "High Growth",
  },
  {
    id: "strategic_quarter",
    title: "Strategic Rollout",
    timeframe: "Over the next 1–3 months",
    urgencyWeight: 5,
    badge: "Planned Expansion",
  },
];

/**
 * Dynamic Urgency Calculator
 */
export function calculateQuizUrgency(
  industryId: string,
  bottleneckId: string,
  digitalStatusId: string,
  timelineId: string
): UrgencyScore {
  const bottleneck = QUIZ_BOTTLENECKS.find((b) => b.id === bottleneckId);
  const digitalStatus = QUIZ_DIGITAL_STATUS.find((d) => d.id === digitalStatusId);
  const timeline = QUIZ_TIMELINES.find((t) => t.id === timelineId);

  let rawScore = 10; // base score

  if (bottleneck) rawScore += bottleneck.urgencyWeight;
  if (digitalStatus) rawScore += digitalStatus.urgencyWeight;
  if (timeline) rawScore += timeline.urgencyWeight;

  // Cap between 20 and 98
  const score = Math.min(98, Math.max(20, rawScore));

  let level: UrgencyLevel = "Moderate";
  let badgeText = "Moderate Growth Need";
  let badgeColor = "#f59e0b"; // amber
  let summary = "Your business has solid fundamentals, but digital bottlenecks are limiting revenue expansion.";

  if (score >= 65) {
    level = "Critical";
    badgeText = "Critical Digital Urgency";
    badgeColor = "#ef4444"; // red
    summary = "High revenue risk. Prospective clients in your sector are choosing faster, better-ranked competitors right now.";
  } else if (score < 45) {
    level = "Optimization";
    badgeText = "High Growth Opportunity";
    badgeColor = "#10b981"; // green
    summary = "Excellent timing. Modernizing your tech stack will give you a first-mover advantage and outpace competitors.";
  }

  return { score, level, badgeText, badgeColor, summary };
}

/**
 * Intelligent Solution Offer Matcher
 */
export function matchRecommendedOffer(
  bottleneckId: string,
  urgencyLevel: UrgencyLevel,
  availableOffers: Offer[]
): Offer | null {
  if (!availableOffers || availableOffers.length === 0) return null;

  const bottleneck = QUIZ_BOTTLENECKS.find((b) => b.id === bottleneckId);
  const category = bottleneck?.recommendedCategory || "Website Presence";

  // 1. Try matching by slug / specific need
  if (bottleneckId === "zero_leads_seo" || bottleneckId === "high_ad_spend") {
    const auditOffer = availableOffers.find(
      (o) => o.slug === "360-digital-health-growth-audit" || o.id === "360-digital-audit-offer"
    );
    if (auditOffer) return auditOffer;
  }

  if (bottleneckId === "manual_tasks") {
    const toolOffer = availableOffers.find(
      (o) => o.offer_type === "Business Tool" || o.slug === "custom-business-tool"
    );
    if (toolOffer) return toolOffer;
  }

  if (bottleneckId === "new_business_launch" || bottleneckId === "no_website") {
    // If urgent or low budget, match starting 999 or flagship website
    const flagship = availableOffers.find((o) => o.slug === "business-website");
    if (flagship) return flagship;

    const budgetWebsite = availableOffers.find((o) => o.slug === "business-website-starting-999-month");
    if (budgetWebsite) return budgetWebsite;
  }

  // 2. Try matching by category
  const categoryMatch = availableOffers.find((o) => o.offer_type === category);
  if (categoryMatch) return categoryMatch;

  // 3. Fallback to featured or first active offer
  const featured = availableOffers.find((o) => o.is_featured);
  return featured || availableOffers[0];
}
