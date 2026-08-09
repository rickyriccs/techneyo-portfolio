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
    name: "India",
    address: {
      "@type": "PostalAddress",
      addressLocality: "India",
      addressRegion: "India",
      addressCountry: "IN",
    },
  },
  description:
    "Techneyo Solutions is based in India and provides website development, mobile apps, social media marketing, local SEO, WhatsApp automation, and custom web software for businesses across India.",
  makesOffer: [
    "Website development",
    "Mobile app development",
    "Social media marketing",
    "WhatsApp automation",
    "SEO and digital presence",
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
  areaServed: ["India"],
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
  areaServed: ["India"],
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
      url: `${businessInfo.website}/logo.png`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${businessInfo.website}/resources/${post.slug}`,
  },
});

export const singleOfferSchema = (offer: any) => ({
  "@context": "https://schema.org",
  "@type": "Offer",
  name: offer.title,
  description: offer.short_description || offer.long_description,
  price: offer.discount_price || offer.starting_price || undefined,
  priceCurrency: "INR",
  url: `${businessInfo.website}/offers/${offer.slug}`,
  seller: {
    "@type": "Organization",
    name: businessInfo.name,
  },
});

export const offersSchema = (offers: any[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: offers.map((offer, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Offer",
      name: offer.title,
      description: offer.short_description,
      price: offer.discount_price || offer.starting_price || undefined,
      priceCurrency: "INR",
      url: `${businessInfo.website}/offers`,
      seller: {
        "@type": "Organization",
        name: businessInfo.name,
      },
    },
  })),
});

export const graphSchema = (...schemas: any[]) => ({
  "@context": "https://schema.org",
  "@graph": schemas,
});
