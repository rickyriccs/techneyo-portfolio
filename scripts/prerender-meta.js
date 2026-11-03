import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");
const indexPath = path.join(distPath, "index.html");

const BASE_URL = "https://techneyo.com";
// If you have a registered Facebook App ID from developers.facebook.com/apps, specify it below. Leave null if only using standard Open Graph tags.
const FB_APP_ID = process.env.FB_APP_ID || null;

const pages = [
  {
    path: "privacy-policy",
    title: "Privacy Policy | Techneyo Solutions",
    description: "Read the Techneyo Solutions privacy policy to understand how we collect, use, and protect enquiry and contact information.",
    keywords: "techneyo privacy policy, data protection, privacy terms",
  },
  {
    path: "terms-and-conditions",
    title: "Terms & Conditions | Techneyo Solutions",
    description: "Read the terms and conditions for using the Techneyo Solutions website and services.",
    keywords: "techneyo terms of service, terms and conditions",
  },
  {
    path: "refund-cancellation-policy",
    title: "Refund & Cancellation Policy | Techneyo Solutions",
    description: "Understand the refund and cancellation policy for Techneyo Solutions website, software, CRM, and digital service projects.",
    keywords: "refund policy, cancellation policy, techneyo solutions",
  },
  {
    path: "support",
    title: "Customer Support & Service Desk | Techneyo Solutions",
    description: "Get 24/7 client support, technical assistance, and enquiry resolution from Techneyo Solutions.",
    keywords: "techneyo support, customer care, tech support",
  },
  {
    path: "about",
    title: "About Techneyo Solutions | India's Fast-Growing Tech Agency",
    description: "Learn about Techneyo Solutions, our mission, leadership, and how we help local and national businesses grow with modern web technologies.",
    keywords: "about techneyo, techneyo solutions team, web development company ludhiana india",
  },
  {
    path: "contact",
    title: "Contact Techneyo Solutions | Discuss Your Project Today",
    description: "Get in touch with Techneyo Solutions. Call or WhatsApp +91 99887 73122 or send your project enquiry for a free proposal and estimate.",
    keywords: "contact techneyo, hire website developer, whatsapp techneyo, web design enquiry india",
  },
  {
    path: "services",
    title: "Website, CRM & Automation Services in India | Techneyo Solutions",
    description: "Explore Techneyo Solutions: High-converting business websites, custom CRM development, WhatsApp lead automation, and local Google ranking.",
    keywords: "website development services india, crm software company, whatsapp automation agency, local seo services",
  },
  {
    path: "offers",
    title: "Special Business Website & Automation Offers | Techneyo Solutions",
    description: "Explore active promotional packages including the ₹999/month Business Website Subscription, free domain, cloud hosting, and WhatsApp lead setup.",
    keywords: "website offers india, 999 website subscription, affordable web design packages, business automation offers",
  },
  {
    path: "portfolio",
    title: "Client Portfolio & Live Case Studies | Techneyo Solutions",
    description: "Browse websites, CRM systems, and custom automation platforms built by Techneyo Solutions for businesses across India.",
    keywords: "techneyo portfolio, website development case studies, live client websites, crm software examples",
  },
  {
    path: "industries",
    title: "Industry-Specific Website & Digital Growth Solutions | Techneyo",
    description: "Tailored digital growth systems for healthcare, manufacturing, real estate, education, retail, restaurants, and professional consultants.",
    keywords: "industry website solutions, specialized b2b web design, clinic websites, manufacturing websites india",
  },
  {
    path: "tools",
    title: "Free Business & Digital ROI Tools | Techneyo Solutions",
    description: "Calculate your website ROI, estimate project costs, and check your digital presence score with Techneyo free business tools.",
    keywords: "website roi calculator, free seo tools, digital presence audit, web design cost estimator",
  },
  {
    path: "website-development-company-ludhiana",
    title: "Website Development Company in Ludhiana | Techneyo Solutions",
    description: "Looking for the best website development company in Ludhiana? Techneyo Solutions builds fast, lead-generating business websites, CRM, and WhatsApp automation.",
    keywords: "website development company ludhiana, web designer ludhiana, website design punjab, best it company ludhiana",
  },
];

function escapeHtml(string) {
  if (!string) return "";
  return String(string)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function runPrerender() {
  if (!fs.existsSync(indexPath)) {
    console.error("dist/index.html not found. Run vite build first.");
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexPath, "utf-8");
  console.log(`Starting pre-rendering of SEO/OG tags for ${pages.length} static routes...`);

  for (const page of pages) {
    const pageUrl = `${BASE_URL}/${page.path}`;
    const pageDir = path.join(distPath, page.path);

    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    let html = baseHtml;

    // Replace Title
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);

    // Replace Description
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(page.description)}" />`
    );

    // Replace Keywords
    if (page.keywords) {
      if (/<meta\s+name=["']keywords["']/i.test(html)) {
        html = html.replace(
          /<meta\s+name=["']keywords["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
          `<meta name="keywords" content="${escapeHtml(page.keywords)}" />`
        );
      }
    }

    // Replace Open Graph Tags
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(page.title)}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(page.description)}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`
    );

    // Replace Twitter Tags
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`
    );
    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`
    );

    // Replace Canonical Link
    html = html.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
      `<link rel="canonical" href="${escapeHtml(pageUrl)}" />`
    );

    // Clean up or inject fb:app_id
    if (FB_APP_ID) {
      if (html.includes('property="fb:app_id"')) {
        html = html.replace(/<meta\s+property=["']fb:app_id["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="fb:app_id" content="${FB_APP_ID}" />`);
      } else {
        html = html.replace('<meta property="og:site_name"', `<meta property="fb:app_id" content="${FB_APP_ID}" />\n    <meta property="og:site_name"`);
      }
    } else {
      html = html.replace(/<meta\s+property=["']fb:app_id["']\s+content=["'][^"']*["']\s*\/?>\s*/gi, "");
    }

    const targetFile = path.join(pageDir, "index.html");
    fs.writeFileSync(targetFile, html, "utf-8");
    console.log(`✅ Pre-rendered: ${page.path}/index.html (og:url: ${pageUrl})`);
  }

  // Also ensure root index.html is clean
  let rootHtml = baseHtml;
  if (FB_APP_ID) {
    if (!rootHtml.includes('property="fb:app_id"')) {
      rootHtml = rootHtml.replace('<meta property="og:site_name"', `<meta property="fb:app_id" content="${FB_APP_ID}" />\n    <meta property="og:site_name"`);
    }
  } else {
    rootHtml = rootHtml.replace(/<meta\s+property=["']fb:app_id["']\s+content=["'][^"']*["']\s*\/?>\s*/gi, "");
  }
  fs.writeFileSync(indexPath, rootHtml, "utf-8");

  console.log(`🎉 All ${pages.length} static routes successfully pre-rendered into dist/!`);
}

runPrerender();
