-- Blogs System Migration Patch for Supabase
-- Run this script in your Supabase SQL Editor to create the blogs table and sample data.

-- 1. Create table public.blogs
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  category text not null default 'Web Development',
  tags text[] default '{}',
  cover_image text,
  author_name text not null default 'Techneyo Team',
  author_role text not null default 'Technical Growth Specialist',
  reading_time text not null default '5 min read',
  status text not null default 'Published' check (status in ('Published', 'Draft', 'Archived')),
  is_featured boolean default false,
  seo_title text,
  seo_description text,
  view_count integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Indexes for fast search & filtering
create index if not exists blogs_slug_idx on public.blogs(slug);
create index if not exists blogs_status_idx on public.blogs(status);
create index if not exists blogs_category_idx on public.blogs(category);
create index if not exists blogs_created_at_idx on public.blogs(created_at desc);

-- 3. Trigger for updated_at
create or replace function public.set_blogs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_blogs_updated_at on public.blogs;
create trigger set_blogs_updated_at before update on public.blogs
for each row execute function public.set_blogs_updated_at();

-- 4. Enable Row Level Security (RLS)
alter table public.blogs enable row level security;

-- 5. RLS Policies
-- Public can read all published blogs
drop policy if exists "Public can read published blogs" on public.blogs;
create policy "Public can read published blogs" on public.blogs
for select using (status = 'Published' or public.is_active_admin());

-- Admins can insert, update, delete all blogs
drop policy if exists "Admins can manage all blogs" on public.blogs;
create policy "Admins can manage all blogs" on public.blogs
for all using (public.is_active_admin()) with check (public.is_active_admin());

-- 6. Permissions
grant select on public.blogs to anon;
grant select, insert, update, delete on public.blogs to authenticated;

-- 7. Seed Initial SEO Articles
insert into public.blogs (title, slug, excerpt, content, category, tags, cover_image, reading_time, is_featured, seo_title, seo_description)
values
(
  'How a Monthly Website Subscription Helps Small Businesses Grow Without Huge Upfront Costs',
  'how-monthly-website-subscription-helps-small-businesses-grow',
  'Discover why traditional high-cost website agency quotes are being replaced by modern monthly website subscription packages with hosting, maintenance, and instant support included.',
  '## Why Traditional Web Development Costs Hold Small Businesses Back

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

If you want your business to rank on Google and attract daily customer enquiries, explore our [Business Website Starting ₹999/Month Offer](/offers/business-website-starting-999-month) to get online in days.',
  'Web Development',
  ARRAY['website subscription', 'small business growth', 'affordable web design', 'low cost website'],
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  '4 min read',
  true,
  'Monthly Website Subscription for Small Business Growth | Techneyo',
  'Learn how monthly website subscriptions empower small businesses in India to launch fast with zero heavy upfront agency fees.'
),
(
  'Top 7 Local SEO Strategies to Rank Your Business Higher on Google in 2026',
  'top-7-local-seo-strategies-rank-business-higher-google-2026',
  'Actionable local search engine optimization tactics to dominate local search results, Google Maps 3-Pack, and attract high-intent local buyers.',
  '## Dominating Local Search in 2026

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
Structure your content around questions your customers ask out loud, such as "How much does a small business website cost?".',
  'SEO & Growth',
  ARRAY['local seo', 'google maps ranking', 'business growth', 'core web vitals'],
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop',
  '6 min read',
  false,
  'Top 7 Local SEO Strategies for 2026 | Techneyo Solutions',
  'Discover practical local SEO techniques to rank #1 on Google Maps and drive qualified local customer enquiries to your business.'
),
(
  'Automating Customer Follow-ups on WhatsApp: How Small Businesses 3x Their Sales',
  'automating-customer-follow-ups-whatsapp-increase-sales',
  'Why fast WhatsApp response times convert 70% more leads and how to set up automated business enquiry workflows without coding.',
  '## The Problem with Manual Enquiry Handling

In today''s fast-paced digital market, **50% of buyers purchase from the vendor that responds first**. When a potential customer fills out an enquiry form on your website or social media, waiting hours for a callback means they have already contacted your competitor.

### Why WhatsApp is the #1 Conversion Channel in India

- **98% Open Rates**: Compared to less than 20% for standard marketing emails.
- **Zero Friction**: Customers prefer chatting directly in the app they use daily.
- **Instant Media Sharing**: Send brochures, proposal PDFs, and payment links seamlessly.

### How to Automate Your Enquiry Pipeline

1. **Instant Welcome Trigger**: Automatically send a personalized greetings message the moment a lead enters their phone number on your landing page.
2. **Smart Follow-up Sequences**: Trigger automated reminder nudges at 24 hours and 48 hours if the customer hasn''t booked a call.
3. **Direct CRM Integration**: Sync all WhatsApp lead conversations into your central admin dashboard for 1-click team assignment.

Learn more about integrating automated messaging with our [WhatsApp Business Automation Service](/services/whatsapp-automation).',
  'Automation',
  ARRAY['whatsapp automation', 'lead conversion', 'sales follow up', 'crm tools'],
  'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1200&auto=format&fit=crop',
  '5 min read',
  false,
  'WhatsApp Follow-up Automation for Business Sales | Techneyo',
  'Learn how automated WhatsApp follow-ups can 3x your lead conversion rate and eliminate lost sales opportunities.'
)
on conflict (slug) do nothing;
