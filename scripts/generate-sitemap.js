import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load environment
dotenv.config({ path: path.resolve(rootDir, ".env.local") });
dotenv.config({ path: path.resolve(rootDir, ".env") });

const BASE_URL = "https://techneyo.com";
const TODAY = new Date().toISOString().split("T")[0];

// Core Static Pages
const staticPages = [
  { path: "", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "weekly" },
  { path: "/offers", priority: "0.9", changefreq: "daily" },
  { path: "/blog", priority: "0.9", changefreq: "daily" },
  { path: "/portfolio", priority: "0.8", changefreq: "weekly" },
  { path: "/industries", priority: "0.8", changefreq: "weekly" },
  { path: "/tools", priority: "0.7", changefreq: "monthly" },
  { path: "/resources", priority: "0.8", changefreq: "weekly" },
  { path: "/company-profile", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.9", changefreq: "monthly" },
  { path: "/support", priority: "0.8", changefreq: "monthly" },
  { path: "/website-development-company-ludhiana", priority: "0.9", changefreq: "weekly" },
  { path: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
  { path: "/terms-and-conditions", priority: "0.5", changefreq: "yearly" },
  { path: "/refund-cancellation-policy", priority: "0.5", changefreq: "yearly" },
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

// Industries
const industrySlugs = [
  "healthcare-clinics",
  "manufacturing-industrial",
  "real-estate-builders",
  "education-coaching-institutes",
  "retail-ecommerce",
  "restaurants-hospitality",
  "professional-consultants",
];

// Blog Resources (Static Guides)
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

// Known Fallback Offers
const fallbackOffers = [
  "business-website-starting-999-month",
];

// Known Fallback Blogs
const fallbackBlogs = [
  "how-monthly-website-subscription-helps-small-businesses-grow",
  "top-7-local-seo-strategies-rank-business-higher-google-2026",
  "automating-customer-follow-ups-whatsapp-increase-sales",
];

async function fetchLiveDbContent() {
  let offerSlugs = [...fallbackOffers];
  let dynamicBlogSlugs = [...fallbackBlogs];
  let dynamicServices = [...serviceSlugs];

  try {
    const mysql = await import("mysql2/promise");
    const connection = await mysql.default.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "techneyo",
      port: Number(process.env.MYSQL_PORT) || 3306,
    });

    const [offerRows] = await connection.query(
      "SELECT slug FROM offers WHERE status = 'Active' AND slug IS NOT NULL AND slug != ''"
    );
    if (offerRows && offerRows.length > 0) {
      offerSlugs = Array.from(new Set([...offerSlugs, ...offerRows.map((r) => r.slug)]));
    }

    const [serviceRows] = await connection.query(
      "SELECT slug FROM services WHERE status = 'active' AND slug IS NOT NULL AND slug != ''"
    );
    if (serviceRows && serviceRows.length > 0) {
      dynamicServices = Array.from(new Set([...dynamicServices, ...serviceRows.map((r) => r.slug)]));
    }

    const [blogRows] = await connection.query(
      "SELECT slug FROM blogs WHERE status = 'published' AND slug IS NOT NULL AND slug != ''"
    );
    if (blogRows && blogRows.length > 0) {
      dynamicBlogSlugs = Array.from(new Set([...dynamicBlogSlugs, ...blogRows.map((r) => r.slug)]));
    }

    await connection.end();
  } catch (err) {
    console.warn("Could not query MySQL for sitemap generator, using fallbacks:", err.message);
  }

  return {
    offers: offerSlugs,
    services: dynamicServices,
    blogs: Array.from(new Set([...blogSlugs, ...dynamicBlogSlugs])),
  };
}

async function generate() {
  console.log("Generating build-time XML sitemap...");
  const dbData = await fetchLiveDbContent();

  const entries = [
    // Static core pages
    ...staticPages.map((p) => ({
      loc: `${BASE_URL}${p.path}`,
      lastmod: TODAY,
      changefreq: p.changefreq,
      priority: p.priority,
    })),
    // Services
    ...dbData.services.map((slug) => ({
      loc: `${BASE_URL}/services/${slug}`,
      lastmod: TODAY,
      changefreq: "weekly",
      priority: "0.9",
    })),
    // Industries
    ...industrySlugs.map((slug) => ({
      loc: `${BASE_URL}/industries/${slug}`,
      lastmod: TODAY,
      changefreq: "weekly",
      priority: "0.8",
    })),
    // Offers
    ...dbData.offers.map((slug) => ({
      loc: `${BASE_URL}/offers/${slug}`,
      lastmod: TODAY,
      changefreq: "daily",
      priority: "0.9",
    })),
    // Blog articles & guides
    ...dbData.blogs.map((slug) => ({
      loc: `${BASE_URL}/blog/${slug}`,
      lastmod: TODAY,
      changefreq: "weekly",
      priority: "0.8",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const publicSitemap = path.join(rootDir, "public", "sitemap.xml");
  fs.writeFileSync(publicSitemap, xml, "utf8");
  console.log(`✅ Sitemap successfully written to ${publicSitemap} with ${entries.length} URLs.`);
}

generate().catch((err) => {
  console.error("Fatal error generating sitemap:", err);
  process.exit(1);
});
