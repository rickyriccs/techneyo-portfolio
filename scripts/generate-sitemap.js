import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const BASE_URL = "https://techneyo.com";
const TODAY = new Date().toISOString().split("T")[0];

// Core Static Pages
const staticPages = [
  { path: "", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "weekly" },
  { path: "/offers", priority: "0.9", changefreq: "daily" },
  { path: "/tools", priority: "0.7", changefreq: "monthly" },
  { path: "/resources", priority: "0.8", changefreq: "weekly" },
  { path: "/company-profile", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.9", changefreq: "monthly" },
  { path: "/support", priority: "0.8", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
  { path: "/terms-and-conditions", priority: "0.5", changefreq: "yearly" },
  { path: "/refund-cancellation-policy", priority: "0.5", changefreq: "yearly" },
  { path: "/website-development-company-ludhiana", priority: "0.9", changefreq: "weekly" },
];

// Core Services
const serviceSlugs = [
  "website-development",
  "business-website-design",
  "crm-development",
  "admin-dashboard-development",
  "business-automation",
  "whatsapp-automation",
  "seo-digital-presence",
  "custom-software-development",
];

// Blog Resources
const blogSlugs = [
  "why-local-business-ludhiana-needs-website",
  "website-vs-landing-page-small-business",
  "how-crm-helps-small-business-leads",
  "whatsapp-automation-customer-follow-up",
  "basic-seo-checklist-local-business",
  "how-to-get-more-enquiries-from-business-website",
  "why-google-business-profile-important-local-business",
  "website-features-every-small-business-needs",
  "admin-dashboard-business-owners",
  "website-development-cost-small-business-india",
];

// Known Active Promotional Offers (Fallback & Seed)
const fallbackOffers = [
  "business-website-starting-999-month",
];

async function fetchSupabaseOffers() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-ref")) {
    return fallbackOffers;
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/offers?select=slug,status,valid_from,valid_till&status=eq.Active`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!res.ok) {
      console.warn("Supabase fetch returned status:", res.status);
      return fallbackOffers;
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const activeSlugs = data
        .filter((o) => o.slug)
        .map((o) => o.slug);
      return Array.from(new Set([...fallbackOffers, ...activeSlugs]));
    }
  } catch (err) {
    console.warn("Could not query Supabase for live offers, using fallback list:", err.message);
  }

  return fallbackOffers;
}

async function generate() {
  console.log("Generating XML sitemap...");
  const offerSlugs = await fetchSupabaseOffers();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // Static Pages
  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Service Pages
  for (const slug of serviceSlugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/services/${slug}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  }

  // Blog Resource Pages
  for (const slug of blogSlugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/resources/${slug}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  // Promotional Offers Pages
  for (const slug of offerSlugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/offers/${slug}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  const publicSitemapPath = path.join(rootDir, "public", "sitemap.xml");
  fs.writeFileSync(publicSitemapPath, xml, "utf8");
  console.log(`Generated sitemap written to: ${publicSitemapPath}`);

  const distDir = path.join(rootDir, "dist");
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.join(distDir, "sitemap.xml");
    fs.writeFileSync(distSitemapPath, xml, "utf8");
    console.log(`Copied sitemap to: ${distSitemapPath}`);
  }

  console.log(`Total URLs indexed in sitemap: ${staticPages.length + serviceSlugs.length + blogSlugs.length + offerSlugs.length}`);
}

generate().catch((err) => {
  console.error("Error generating sitemap:", err);
  process.exit(1);
});
