import { Router } from "express";
import { query } from "../db.js";

const router = Router();
const BASE_URL = "https://techneyo.com";

const staticRoutes = [
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

const staticIndustrySlugs = [
  "healthcare-clinics",
  "manufacturing-industrial",
  "real-estate-builders",
  "education-coaching-institutes",
  "retail-ecommerce",
  "restaurants-hospitality",
  "professional-consultants",
];

router.get("/sitemap.xml", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 1. Fetch live active offers from MySQL
    let activeOffers = [];
    try {
      activeOffers = await query(
        "SELECT slug, DATE_FORMAT(COALESCE(updated_at, created_at), '%Y-%m-%d') as lastmod FROM offers WHERE status = 'Active' AND slug IS NOT NULL AND slug != ''"
      );
    } catch (e) {
      console.warn("Sitemap: Failed to query offers from MySQL:", e.message);
    }

    // 2. Fetch live active services from MySQL
    let activeServices = [];
    try {
      activeServices = await query(
        "SELECT slug, DATE_FORMAT(COALESCE(updated_at, created_at), '%Y-%m-%d') as lastmod FROM services WHERE status = 'active' AND slug IS NOT NULL AND slug != ''"
      );
    } catch (e) {
      console.warn("Sitemap: Failed to query services from MySQL:", e.message);
    }

    // Fallback core services if none in DB or not migrated yet
    const fallbackServiceSlugs = [
      "website-development",
      "business-website-design",
      "crm-development",
      "admin-dashboard-development",
      "business-automation",
      "whatsapp-automation",
      "seo-digital-presence",
      "custom-software-development",
    ];

    const serviceMap = new Map();
    activeServices.forEach((s) => {
      if (s.slug) serviceMap.set(s.slug, s.lastmod || today);
    });
    fallbackServiceSlugs.forEach((slug) => {
      if (!serviceMap.has(slug)) serviceMap.set(slug, today);
    });

    // 3. Fetch published blogs from MySQL
    let publishedBlogs = [];
    try {
      publishedBlogs = await query(
        "SELECT slug, DATE_FORMAT(COALESCE(updated_at, created_at), '%Y-%m-%d') as lastmod FROM blogs WHERE status = 'published' AND slug IS NOT NULL AND slug != ''"
      );
    } catch (e) {
      console.warn("Sitemap: Failed to query blogs from MySQL:", e.message);
    }

    const fallbackBlogSlugs = [
      "how-monthly-website-subscription-helps-small-businesses-grow",
      "top-7-local-seo-strategies-rank-business-higher-google-2026",
      "automating-customer-follow-ups-whatsapp-increase-sales",
    ];

    const blogMap = new Map();
    publishedBlogs.forEach((b) => {
      if (b.slug) blogMap.set(b.slug, b.lastmod || today);
    });
    fallbackBlogSlugs.forEach((slug) => {
      if (!blogMap.has(slug)) blogMap.set(slug, today);
    });

    const offerUrls = activeOffers.map((o) => ({
      loc: `${BASE_URL}/offers/${o.slug}`,
      lastmod: o.lastmod || today,
      priority: "0.9",
      changefreq: "daily",
    }));

    const serviceUrls = Array.from(serviceMap.entries()).map(([slug, lastmod]) => ({
      loc: `${BASE_URL}/services/${slug}`,
      lastmod: lastmod || today,
      priority: "0.9",
      changefreq: "weekly",
    }));

    const industryUrls = staticIndustrySlugs.map((slug) => ({
      loc: `${BASE_URL}/industries/${slug}`,
      lastmod: today,
      priority: "0.8",
      changefreq: "weekly",
    }));

    const blogUrls = Array.from(blogMap.entries()).map(([slug, lastmod]) => ({
      loc: `${BASE_URL}/blog/${slug}`,
      lastmod: lastmod || today,
      priority: "0.8",
      changefreq: "weekly",
    }));

    const allUrls = [
      ...staticRoutes.map((p) => ({
        loc: `${BASE_URL}${p.path}`,
        lastmod: today,
        priority: p.priority,
        changefreq: p.changefreq,
      })),
      ...offerUrls,
      ...serviceUrls,
      ...industryUrls,
      ...blogUrls,
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml; charset=utf-8");
    res.header("Cache-Control", "public, max-age=1800, s-maxage=3600");
    return res.send(xml);
  } catch (err) {
    console.error("Dynamic sitemap generation error:", err);
    return res.status(500).send("Error generating dynamic sitemap");
  }
});

export default router;
