import { businessInfo } from "./business-info";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: businessInfo.name,
  url: businessInfo.website,
  email: businessInfo.email,
  telephone: businessInfo.phoneDisplay,
  areaServed: businessInfo.areaServed,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ludhiana",
    addressRegion: "Punjab",
    addressCountry: "IN",
  },
  description:
    "Techneyo Solutions provides website development, CRM, admin dashboards, business automation, SEO, WhatsApp automation consultation, and custom web-based software services.",
  makesOffer: businessInfo.services.map((service) => ({
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
