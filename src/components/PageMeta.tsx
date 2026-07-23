import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { businessInfo } from "@/lib/business-info";

type PageMetaProps = {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  robots?: string;
  schema?: Record<string, unknown>;
};

const setMeta = (selector: string, attr: "content" | "href", value: string) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attr, value);
};

const PageMeta = ({ title, description, keywords, canonicalPath, ogImage = businessInfo.ogImage, robots = "index, follow", schema }: PageMetaProps) => {
  const location = useLocation();
  const canonicalUrl = `${businessInfo.website}${canonicalPath ?? location.pathname}`;

  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    if (keywords) {
      setMeta('meta[name="keywords"]', "content", keywords);
    }
    setMeta('meta[name="robots"]', "content", robots);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", ogImage);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", ogImage);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const existingSchema = document.getElementById("techneyo-page-schema");
    existingSchema?.remove();

    if (schema) {
      const script = document.createElement("script");
      script.id = "techneyo-page-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById("techneyo-page-schema")?.remove();
    };
  }, [canonicalUrl, description, keywords, ogImage, robots, schema, title]);

  return null;
};

export default PageMeta;
