import { businessInfo } from "./business-info";
import type { BlogPost, FaqItem, ServicePage } from "./seo-content";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: businessInfo.name,
  url: businessInfo.website,
  email: businessInfo.email,
  telephone: businessInfo.phoneDisplay,
  areaServed: "India",
  location: {
    "@type": "Place",
    name: "Ludhiana, Punjab, India",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ludhiana",
      addressRegion: "Punjab",
      addressCountry: "IN",
    },
  },
  description:
    "Techneyo Solutions is based in Ludhiana and provides website development, CRM development, SEO and digital presence, WhatsApp automation, admin dashboard development, business automation, and custom web-based software solutions for businesses across India.",
  makesOffer: [
    "Website development",
    "CRM development",
    "Business automation",
    "WhatsApp automation",
    "SEO and digital presence",
    "Admin dashboard development",
    "Custom software development",
  ].map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service,
      areaServed: businessInfo.areaServed,
    },
  })),
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: businessInfo.phoneDisplay,
      email: businessInfo.email,
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["en", "hi", "pa"],
    },
  ],
};

export const localBusinessSchema = {
  ...organizationSchema,
  "@type": "LocalBusiness",
  areaServed: ["Ludhiana", "Punjab", "India"],
};

export const faqSchema = (faqs: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const serviceSchema = (service: ServicePage) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  serviceType: service.title,
  description: service.metaDescription,
  provider: {
    "@type": "Organization",
    name: businessInfo.name,
    url: businessInfo.website,
    email: businessInfo.email,
    telephone: businessInfo.phoneDisplay,
  },
  areaServed: ["Ludhiana", "Punjab", "India"],
});

export const articleSchema = (post: BlogPost) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.metaDescription,
  author: {
    "@type": "Organization",
    name: businessInfo.name,
  },
  publisher: {
    "@type": "Organization",
    name: businessInfo.name,
    logo: {
      "@type": "ImageObject",
      url: businessInfo.ogImage,
    },
  },
});

export const offersSchema = (offers: any[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  numberOfItems: offers.length,
  itemListElement: offers.map((offer, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: offer.title,
      description: offer.short_description || offer.detailed_description || "",
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: offer.discount_price || offer.starting_price || 0,
        availability: "https://schema.org/InStock",
        ...(offer.valid_from ? { validFrom: offer.valid_from } : {}),
        ...(offer.valid_till ? { priceValidUntil: offer.valid_till } : {}),
      },
    },
  })),
});

export const graphSchema = (...schemas: Record<string, unknown>[]) => ({
  "@context": "https://schema.org",
  "@graph": schemas,
});
