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

export const singleOfferSchema = (offer: any) => {
  const price = offer.discount_price || offer.starting_price || undefined;
  const keywords = Array.isArray(offer.target_keywords)
    ? offer.target_keywords.join(", ")
    : typeof offer.target_keywords === "string"
    ? offer.target_keywords
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${businessInfo.website}/offers/${offer.slug}#service`,
    name: offer.title,
    serviceType: offer.offer_type || "Website Development & Digital Solutions",
    description: offer.seo_description || offer.short_description || offer.detailed_description,
    category: offer.offer_type,
    keywords: keywords,
    provider: {
      "@type": "Organization",
      name: businessInfo.name,
      url: businessInfo.website,
      email: businessInfo.email,
      telephone: businessInfo.phoneDisplay,
      image: `${businessInfo.website}/logo.png`,
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    audience: offer.target_audience?.length
      ? {
          "@type": "Audience",
          audienceType: offer.target_audience.join(", "),
        }
      : undefined,
    offers: {
      "@type": "Offer",
      "@id": `${businessInfo.website}/offers/${offer.slug}#offer`,
      url: `${businessInfo.website}/offers/${offer.slug}`,
      name: offer.title,
      description: offer.short_description,
      price: price,
      priceCurrency: "INR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: price,
        priceCurrency: "INR",
        unitText: offer.billing_period === "monthly" ? "MONTH" : "ONE-TIME",
      },
      availability: "https://schema.org/InStock",
      validFrom: offer.valid_from || undefined,
      priceValidUntil: offer.valid_till || undefined,
      seller: {
        "@type": "Organization",
        name: businessInfo.name,
        url: businessInfo.website,
      },
    },
  };
};

export const offerFaqSchema = (offer: any) => {
  const faqs: Array<{ question: string; answer: string }> = [];

  if (offer.whats_included && offer.whats_included.length > 0) {
    faqs.push({
      question: `What is included in the ${offer.title} package?`,
      answer: `The package includes: ${offer.whats_included.join("; ")}.`,
    });
  }

  if (offer.whats_not_included && offer.whats_not_included.length > 0) {
    faqs.push({
      question: `What is not included or billed separately in this offer?`,
      answer: `The following are not included or require separate add-on billing: ${offer.whats_not_included.join("; ")}.`,
    });
  }

  if (offer.update_policy) {
    faqs.push({
      question: `What is the website update and maintenance policy?`,
      answer: offer.update_policy,
    });
  }

  if (offer.ownership_policy) {
    faqs.push({
      question: `Who owns the website and domain under this plan?`,
      answer: offer.ownership_policy,
    });
  }

  if (offer.target_audience && offer.target_audience.length > 0) {
    faqs.push({
      question: `Who is this offer best suited for?`,
      answer: `This plan is specifically designed for: ${offer.target_audience.join(", ")}.`,
    });
  }

  if (offer.billing_period) {
    faqs.push({
      question: `How does the billing and advance booking work?`,
      answer: `The plan is billed ${offer.billing_period}. You can book your slot instantly with an advance setup payment of Rs. ${(offer.booking_amount || offer.setup_fee || offer.discount_price || 999).toLocaleString("en-IN")}.`,
    });
  }

  return {
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
  };
};


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
