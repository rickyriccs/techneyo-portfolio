import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../../dist");
const rootIndexPath = path.resolve(__dirname, "../../index.html");

const BOT_USER_AGENTS = [
  "googlebot",
  "bingbot",
  "facebookexternalhit",
  "whatsapp",
  "twitterbot",
  "linkedinbot",
  "slackbot",
  "telegrambot",
  "applebot",
  "bytespider",
  "petalbot",
  "pinterestbot",
];

const industryMetadata = {
  "healthcare-clinics": {
    title: "Healthcare, Clinics & Doctor Website Solutions | Techneyo Solutions",
    description: "Get more patients and automated appointment bookings for your clinic with high-speed healthcare websites, Google Maps local dominance, and WhatsApp lead flow.",
    keywords: "clinic website designer india, doctor appointment website, healthcare web development, hospital website design ludhiana",
  },
  "manufacturing-industrial": {
    title: "Industrial & Manufacturing Business Websites | Techneyo Solutions",
    description: "B2B manufacturing websites and product catalog portals designed for generating high-ticket commercial inquiries, export leads, and distributor partnerships.",
    keywords: "manufacturing website design, b2b industrial website india, factory website developer, machinery catalog portal",
  },
  "real-estate-builders": {
    title: "Real Estate & Property Developer Websites | Techneyo Solutions",
    description: "High-converting property project landing pages, 3D floor plan showcases, and instant WhatsApp booking bots for real estate agents and developers.",
    keywords: "real estate website builder, property listing website india, builder project landing page, real estate crm",
  },
  "education-coaching-institutes": {
    title: "Education & Coaching Institute Website Design | Techneyo Solutions",
    description: "Attract more student admissions with high-converting coaching institute websites, course brochures, and automated WhatsApp inquiry pipelines.",
    keywords: "coaching institute website design, school college website developer, student admission landing page, education portal india",
  },
  "retail-ecommerce": {
    title: "Retail & Direct-to-Consumer (D2C) Store Solutions | Techneyo Solutions",
    description: "Fast, mobile-friendly online stores, WhatsApp shopping catalogs, and payment gateway setups for local retailers and growing D2C brands.",
    keywords: "ecommerce website design india, retail shop website, d2c store builder, whatsapp store catalog",
  },
  "restaurants-hospitality": {
    title: "Restaurant, Cafe & Hospitality Websites | Techneyo Solutions",
    description: "Interactive digital menus, direct online food ordering with zero commission, table reservation systems, and local Google Map dominance.",
    keywords: "restaurant website design, cafe digital menu, online table booking system, food ordering website ludhiana",
  },
  "professional-consultants": {
    title: "Consultant, CA & Legal Practice Websites | Techneyo Solutions",
    description: "Build authority and high-ticket client trust with professional corporate websites, client portals, and automated consultation scheduling.",
    keywords: "consultant website developer, ca lawyer website design, legal practice website india, appointment booking website",
  },
};

const staticPageMetadata = {
  "/services": {
    title: "Website, CRM & Automation Services in India | Techneyo Solutions",
    description: "Explore Techneyo Solutions: High-converting business websites, custom CRM development, WhatsApp lead automation, and local Google ranking.",
    keywords: "website development services india, crm software company, whatsapp automation agency, local seo services",
  },
  "/offers": {
    title: "Special Business Website & Automation Offers | Techneyo Solutions",
    description: "Explore active promotional packages including the ₹999/month Business Website Subscription, free domain, cloud hosting, and WhatsApp lead setup.",
    keywords: "website offers india, 999 website subscription, affordable web design packages, business automation offers",
  },
  "/portfolio": {
    title: "Client Portfolio & Live Case Studies | Techneyo Solutions",
    description: "Browse websites, CRM systems, and custom automation platforms built by Techneyo Solutions for businesses across India.",
    keywords: "techneyo portfolio, website development case studies, live client websites, crm software examples",
  },
  "/industries": {
    title: "Industry-Specific Website & Digital Growth Solutions | Techneyo",
    description: "Tailored digital growth systems for healthcare, manufacturing, real estate, education, retail, restaurants, and professional consultants.",
    keywords: "industry website solutions, specialized b2b web design, clinic websites, manufacturing websites india",
  },
  "/about": {
    title: "About Techneyo Solutions | India's Fast-Growing Tech Agency",
    description: "Learn about Techneyo Solutions, our mission, leadership, and how we help local and national businesses grow with modern web technologies.",
    keywords: "about techneyo, techneyo solutions team, web development company ludhiana india",
  },
  "/contact": {
    title: "Contact Techneyo Solutions | Discuss Your Project Today",
    description: "Get in touch with Techneyo Solutions. Call or WhatsApp +91 99887 73122 or send your project enquiry for a free proposal and estimate.",
    keywords: "contact techneyo, hire website developer, whatsapp techneyo, web design enquiry india",
  },
  "/tools": {
    title: "Free Business & Digital ROI Tools | Techneyo Solutions",
    description: "Calculate your website ROI, estimate project costs, and check your digital presence score with Techneyo free business tools.",
    keywords: "website roi calculator, free seo tools, digital presence audit, web design cost estimator",
  },
};

export async function seoMetaMiddleware(req, res, next) {
  if (req.method !== "GET" || req.path.startsWith("/api") || req.path.includes(".")) {
    return next();
  }

  const userAgent = (req.headers["user-agent"] || "").toLowerCase();
  const isBot = BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));

  const offerMatch = req.path.match(/^\/offers\/([a-zA-Z0-9_-]+)/);
  const serviceMatch = req.path.match(/^\/services\/([a-zA-Z0-9_-]+)/);
  const industryMatch = req.path.match(/^\/industries\/([a-zA-Z0-9_-]+)/);
  const blogMatch = req.path.match(/^\/blog\/([a-zA-Z0-9_-]+)/);
  const isLudhiana = req.path === "/website-development-company-ludhiana";
  const staticMatch = staticPageMetadata[req.path];

  // If not a bot and not an SEO-critical content route, let Express static handle it normally
  if (!isBot && !offerMatch && !serviceMatch && !industryMatch && !blogMatch && !isLudhiana && !staticMatch) {
    return next();
  }

  try {
    let seoData = null;

    if (offerMatch) {
      const slug = offerMatch[1];
      const rows = await query(
        "SELECT title, seo_title, seo_description, short_description, target_keywords, banner_image_url, discount_price, starting_price, discount_price_usd, starting_price_usd, billing_period FROM offers WHERE slug = ? LIMIT 1",
        [slug]
      );
      if (rows && rows.length > 0) {
        const item = rows[0];
        const priceInr = item.discount_price || item.starting_price;
        const priceUsd = item.discount_price_usd || item.starting_price_usd;
        let priceText = "";
        if (priceUsd && priceInr) {
          priceText = ` from $${Number(priceUsd)} / Rs. ${Number(priceInr).toLocaleString("en-IN")}`;
        } else if (priceUsd) {
          priceText = ` from $${Number(priceUsd)}`;
        } else if (priceInr) {
          priceText = ` starting at Rs. ${Number(priceInr).toLocaleString("en-IN")}`;
        }
        seoData = {
          title: item.seo_title || `${item.title}${priceText} | Techneyo Solutions`,
          description: item.seo_description || item.short_description || `Exclusive promotional offer: ${item.title} by Techneyo Solutions.`,
          keywords: Array.isArray(item.target_keywords)
            ? item.target_keywords.join(", ")
            : item.target_keywords || "business website offer, techneyo package, web development worldwide",
          image: item.banner_image_url || "https://techneyo.com/banner.jpeg",
          url: `https://techneyo.com/offers/${slug}`,
        };
      }
    } else if (serviceMatch) {
      const slug = serviceMatch[1];
      const rows = await query(
        "SELECT title, seo_title, seo_description, description, target_keywords, starting_price, starting_price_usd FROM services WHERE slug = ? LIMIT 1",
        [slug]
      );
      if (rows && rows.length > 0) {
        const item = rows[0];
        const sUsd = item.starting_price_usd ? ` from $${Number(item.starting_price_usd)}` : "";
        seoData = {
          title: item.seo_title || `${item.title} Services${sUsd} | Techneyo Solutions`,
          description: item.seo_description || item.description || `Professional ${item.title} solutions by Techneyo Solutions for growing businesses worldwide.`,
          keywords: item.target_keywords || `${item.title}, custom software development, business automation worldwide`,
          image: "https://techneyo.com/banner.jpeg",
          url: `https://techneyo.com/services/${slug}`,
        };
      }
    } else if (industryMatch) {
      const slug = industryMatch[1];
      const ind = industryMetadata[slug];
      if (ind) {
        seoData = {
          title: ind.title,
          description: ind.description,
          keywords: ind.keywords,
          image: "https://techneyo.com/banner.jpeg",
          url: `https://techneyo.com/industries/${slug}`,
        };
      }
    } else if (blogMatch) {
      const slug = blogMatch[1];
      const rows = await query(
        "SELECT title, seo_title, seo_description, excerpt, cover_image FROM blogs WHERE slug = ? LIMIT 1",
        [slug]
      );
      if (rows && rows.length > 0) {
        const item = rows[0];
        seoData = {
          title: item.seo_title || `${item.title} | Techneyo Solutions`,
          description: item.seo_description || item.excerpt || `Read article: ${item.title} on Techneyo Solutions.`,
          keywords: "business technology blog, website growth tips, automation india",
          image: item.cover_image || "https://techneyo.com/banner.jpeg",
          url: `https://techneyo.com/blog/${slug}`,
        };
      }
    } else if (isLudhiana) {
      seoData = {
        title: "Website Development Company in Ludhiana | Techneyo Solutions",
        description: "Looking for the best website development company in Ludhiana? Techneyo Solutions builds fast, lead-generating business websites, CRM, and WhatsApp automation.",
        keywords: "website development company ludhiana, web designer ludhiana, website design punjab, best it company ludhiana",
        image: "https://techneyo.com/banner.jpeg",
        url: "https://techneyo.com/website-development-company-ludhiana",
      };
    } else if (staticMatch) {
      seoData = {
        title: staticMatch.title,
        description: staticMatch.description,
        keywords: staticMatch.keywords,
        image: "https://techneyo.com/banner.jpeg",
        url: `https://techneyo.com${req.path}`,
      };
    }

    if (!seoData) {
      return next();
    }

    // Determine target index.html file
    const targetFile = fs.existsSync(path.join(distPath, "index.html"))
      ? path.join(distPath, "index.html")
      : rootIndexPath;

    if (!fs.existsSync(targetFile)) {
      return next();
    }

    let html = fs.readFileSync(targetFile, "utf-8");

    // Dynamic Title Replacement
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seoData.title)}</title>`);

    // Dynamic Description Replacement
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(seoData.description)}" />`
    );

    // Dynamic Keywords Replacement (or insertion)
    if (seoData.keywords) {
      if (/<meta\s+name=["']keywords["']/i.test(html)) {
        html = html.replace(
          /<meta\s+name=["']keywords["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
          `<meta name="keywords" content="${escapeHtml(seoData.keywords)}" />`
        );
      } else {
        html = html.replace("</head>", `  <meta name="keywords" content="${escapeHtml(seoData.keywords)}" />\n</head>`);
      }
    }

    // Dynamic Open Graph Tags
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(seoData.title)}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(seoData.description)}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:url" content="${escapeHtml(seoData.url)}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:image" content="${escapeHtml(seoData.image)}" />`
    );

    // Dynamic Twitter Tags
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(seoData.title)}" />`
    );
    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(seoData.description)}" />`
    );
    html = html.replace(
      /<meta\s+name=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="twitter:image" content="${escapeHtml(seoData.image)}" />`
    );

    // Dynamic Canonical Tag
    html = html.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
      `<link rel="canonical" href="${escapeHtml(seoData.url)}" />`
    );

    res.header("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
  } catch (err) {
    console.error("SEO Meta Middleware error:", err);
    return next();
  }
}

function escapeHtml(string) {
  if (!string) return "";
  return String(string)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
