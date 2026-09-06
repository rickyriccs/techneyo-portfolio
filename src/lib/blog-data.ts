import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/types/blog";

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "f1-blog-sub",
    title: "How a Monthly Website Subscription Helps Small Businesses Grow Without Huge Upfront Costs",
    slug: "how-monthly-website-subscription-helps-small-businesses-grow",
    excerpt: "Discover why traditional high-cost website agency quotes are being replaced by modern monthly website subscription packages with hosting, maintenance, and instant support included.",
    content: `## Why Traditional Web Development Costs Hold Small Businesses Back

Building a modern business website historically required paying Rs. 30,000 to Rs. 1,00,000 upfront to an agency or freelancer. For a local retail store, startup, doctor, or consultant, this creates a major barrier to entry.

Moreover, after paying that lump sum, business owners were often left alone to handle:
- Domain renewal and high-speed cloud hosting fees
- SSL certificate setup and security monitoring
- Content updates, image tweaks, and phone number changes
- Ongoing SEO and speed optimization

### The Shift to Monthly Managed Website Subscriptions

With a managed monthly model starting at just **Rs. 999/month**, businesses get enterprise-grade digital infrastructure without the capital risk:

1. **Zero Financial Strain**: Pay a low setup fee or advance, followed by predictable monthly billing.
2. **Managed Cloud Infrastructure**: High-speed CDN hosting, 99.9% uptime, and SSL encryption included.
3. **Continuous Support**: Direct WhatsApp support channel for ongoing peace of mind.
4. **Instant Conversion Features**: Pre-configured WhatsApp click-to-chat, mobile responsive design, and local SEO schema built-in.

### How to Get Started

If you want your business to rank on Google and attract daily customer enquiries, explore our [Business Website Starting ₹999/Month Offer](/offers/business-website-starting-999-month) to get online in days.`,
    category: "Web Development",
    tags: ["website subscription", "small business growth", "affordable web design", "low cost website"],
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    author_name: "Techneyo Team",
    author_role: "Technical Growth Specialist",
    reading_time: "4 min read",
    status: "Published",
    is_featured: true,
    seo_title: "Monthly Website Subscription for Small Business Growth | Techneyo",
    seo_description: "Learn how monthly website subscriptions empower small businesses in India to launch fast with zero heavy upfront agency fees.",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "f2-blog-seo",
    title: "Top 7 Local SEO Strategies to Rank Your Business Higher on Google in 2026",
    slug: "top-7-local-seo-strategies-rank-business-higher-google-2026",
    excerpt: "Actionable local search engine optimization tactics to dominate local search results, Google Maps 3-Pack, and attract high-intent local buyers.",
    content: `## Dominating Local Search in 2026

When potential customers search for "best service near me" or "website developer in Ludhiana", search engines prioritize localized relevance, speed, and trust signals.

### 1. Optimize Google Business Profile (GBP)
Ensure 100% profile completeness, precise primary and secondary categories, weekly photo updates, and consistent business operating hours.

### 2. Implement Local Business Schema (JSON-LD)
Structured data tells Google exactly where your business operates, your service areas, phone numbers, and customer review aggregates.

### 3. Build Location-Specific Landing Pages
Create dedicated landing pages for your core target cities with localized case studies, client testimonials, and geo-targeted keywords.

### 4. Encourage Genuine Customer Reviews
Automate post-service review collection via WhatsApp follow-up workflows. Reply to every review within 24 hours.

### 5. Mobile-First Page Speed & Core Web Vitals
Over 75% of local business searches happen on smartphones. Fast Largest Contentful Paint (LCP) and zero Cumulative Layout Shift (CLS) are essential for ranking.

### 6. Local Backlinks & Citations
List your business consistently on trusted industry directories with uniform NAP (Name, Address, Phone) details.

### 7. Conversational Search & Voice Optimization
Structure your content around questions your customers ask out loud, such as "How much does a small business website cost?".`,
    category: "SEO & Growth",
    tags: ["local seo", "google maps ranking", "business growth", "core web vitals"],
    cover_image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop",
    author_name: "Techneyo Team",
    author_role: "SEO Strategist",
    reading_time: "6 min read",
    status: "Published",
    is_featured: false,
    seo_title: "Top 7 Local SEO Strategies for 2026 | Techneyo Solutions",
    seo_description: "Discover practical local SEO techniques to rank #1 on Google Maps and drive qualified local customer enquiries to your business.",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "f3-blog-wa",
    title: "Automating Customer Follow-ups on WhatsApp: How Small Businesses 3x Their Sales",
    slug: "automating-customer-follow-ups-whatsapp-increase-sales",
    excerpt: "Why fast WhatsApp response times convert 70% more leads and how to set up automated business enquiry workflows without coding.",
    content: `## The Problem with Manual Enquiry Handling

In today's fast-paced digital market, **50% of buyers purchase from the vendor that responds first**. When a potential customer fills out an enquiry form on your website or social media, waiting hours for a callback means they have already contacted your competitor.

### Why WhatsApp is the #1 Conversion Channel in India

- **98% Open Rates**: Compared to less than 20% for standard marketing emails.
- **Zero Friction**: Customers prefer chatting directly in the app they use daily.
- **Instant Media Sharing**: Send brochures, proposal PDFs, and payment links seamlessly.

### How to Automate Your Enquiry Pipeline

1. **Instant Welcome Trigger**: Automatically send a personalized greetings message the moment a lead enters their phone number on your landing page.
2. **Smart Follow-up Sequences**: Trigger automated reminder nudges at 24 hours and 48 hours if the customer hasn't booked a call.
3. **Direct CRM Integration**: Sync all WhatsApp lead conversations into your central admin dashboard for 1-click team assignment.

Learn more about integrating automated messaging with our [WhatsApp Business Automation Service](/services/whatsapp-automation).`,
    category: "Automation",
    tags: ["whatsapp automation", "lead conversion", "sales follow up", "crm tools"],
    cover_image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1200&auto=format&fit=crop",
    author_name: "Techneyo Team",
    author_role: "Automation Engineer",
    reading_time: "5 min read",
    status: "Published",
    is_featured: false,
    seo_title: "WhatsApp Follow-up Automation for Business Sales | Techneyo",
    seo_description: "Learn how automated WhatsApp follow-ups can 3x your lead conversion rate and eliminate lost sales opportunities.",
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
];

export async function fetchPublishedBlogs(): Promise<BlogPost[]> {
  if (!supabase) return fallbackBlogPosts;

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("status", "Published")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackBlogPosts;
    }

    return data as BlogPost[];
  } catch {
    return fallbackBlogPosts;
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  if (!supabase) {
    return fallbackBlogPosts.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return fallbackBlogPosts.find((p) => p.slug === slug) || null;
    }

    return data as BlogPost;
  } catch {
    return fallbackBlogPosts.find((p) => p.slug === slug) || null;
  }
}
