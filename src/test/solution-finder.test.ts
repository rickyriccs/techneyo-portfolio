import { describe, it, expect } from "vitest";
import {
  calculateQuizUrgency,
  matchRecommendedOffer,
  QUIZ_INDUSTRIES,
  QUIZ_BOTTLENECKS,
} from "../lib/quiz-data";
import type { Offer } from "../types/offer";

describe("Solution Finder Diagnostic Engine", () => {
  it("calculates critical urgency for high-risk inputs", () => {
    const result = calculateQuizUrgency(
      "healthcare",
      "no_website",
      "old_dated_site",
      "urgent_7_days"
    );

    expect(result.level).toBe("Critical");
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.badgeText).toContain("Critical");
  });

  it("calculates optimization/growth urgency for new business with relaxed timeline", () => {
    const result = calculateQuizUrgency(
      "ecommerce",
      "new_business_launch",
      "active_site_low_results",
      "strategic_quarter"
    );

    expect(result.level).toBe("Optimization");
    expect(result.score).toBeLessThan(70);
    expect(result.badgeText).toContain("Growth");
  });

  it("intelligently matches active offers to specific bottlenecks", () => {
    const mockOffers: Offer[] = [
      {
        id: "audit-1",
        title: "360° Digital Health & Growth Audit",
        slug: "360-digital-health-growth-audit",
        offer_type: "Digital Growth",
        status: "Active",
      } as Offer,
      {
        id: "web-1",
        title: "High-Converting Business Website",
        slug: "business-website",
        offer_type: "Website Presence",
        status: "Active",
      } as Offer,
    ];

    // SEO / Ads should match the 360 audit
    const matchedSeo = matchRecommendedOffer("zero_leads_seo", "Critical", mockOffers);
    expect(matchedSeo?.slug).toBe("360-digital-health-growth-audit");

    // No website should match the flagship website
    const matchedWeb = matchRecommendedOffer("no_website", "Critical", mockOffers);
    expect(matchedWeb?.slug).toBe("business-website");
  });

  it("provides tailored industry benchmark hints", () => {
    const noWebsiteBottleneck = QUIZ_BOTTLENECKS.find((b) => b.id === "no_website");
    expect(noWebsiteBottleneck).toBeDefined();
    expect(noWebsiteBottleneck?.industryHints?.healthcare).toContain("patient consultations");
    expect(noWebsiteBottleneck?.industryHints?.ecommerce).toContain("bounce rates");
  });
});
