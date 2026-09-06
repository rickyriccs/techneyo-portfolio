-- Analytics Events & Visitor Activity Telemetry Migration Patch for Supabase
-- Run this script in your Supabase SQL Editor to enable real-time visitor activity tracking.

-- 1. Create table public.analytics_events
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text not null,
  page_title text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  device_type text,
  session_id text,
  event_properties jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 2. Performance Indexes for Fast Multi-Dimensional Analytics Filtering
create index if not exists analytics_events_name_idx on public.analytics_events(event_name);
create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_utm_source_idx on public.analytics_events(utm_source);
create index if not exists analytics_events_device_type_idx on public.analytics_events(device_type);
create index if not exists analytics_events_page_path_idx on public.analytics_events(page_path);

-- 3. Enable Row Level Security (RLS)
alter table public.analytics_events enable row level security;

-- 4. RLS Policies
-- Public / Anonymous website visitors can insert events
drop policy if exists "Public can insert analytics events" on public.analytics_events;
create policy "Public can insert analytics events" on public.analytics_events
for insert with check (true);

-- Only authenticated admins can read / analyze events
drop policy if exists "Admins can read analytics events" on public.analytics_events;
create policy "Admins can read analytics events" on public.analytics_events
for select using (public.is_active_admin());

-- 5. Permissions
grant insert on public.analytics_events to anon;
grant select, insert, delete on public.analytics_events to authenticated;

-- 6. Seed sample activity records for immediate dashboard preview
insert into public.analytics_events (event_name, page_path, page_title, utm_source, utm_medium, utm_campaign, referrer, device_type, created_at)
values
  ('page_view', '/', 'Techneyo Solutions | Modern Web Development', 'google', 'organic', null, 'https://www.google.com', 'mobile', now() - interval '2 hours'),
  ('page_view', '/offers/business-website-starting-999-month', 'Business Website Starting ₹999/Month | Techneyo', 'instagram', 'social', 'summer_offer', 'https://l.instagram.com', 'mobile', now() - interval '1 hour 45 minutes'),
  ('whatsapp_click', '/offers/business-website-starting-999-month', 'Business Website Starting ₹999/Month | Techneyo', 'instagram', 'social', 'summer_offer', 'https://l.instagram.com', 'mobile', now() - interval '1 hour 40 minutes'),
  ('page_view', '/blog/how-monthly-website-subscription-helps-small-businesses-grow', 'How a Monthly Website Subscription Helps Small Businesses Grow', 'google', 'organic', null, 'https://www.google.com', 'desktop', now() - interval '1 hour'),
  ('page_view', '/services/website-development', 'Website Development Services | Techneyo', 'direct', null, null, null, 'desktop', now() - interval '45 minutes'),
  ('proposal_modal_open', '/', 'Techneyo Solutions | Modern Web Development', 'google', 'cpc', 'brand_search', 'https://www.google.com', 'desktop', now() - interval '30 minutes'),
  ('page_view', '/offers', 'Website Offers & Packages | Techneyo', 'whatsapp', 'chat', 'direct_share', 'https://api.whatsapp.com', 'mobile', now() - interval '15 minutes'),
  ('page_view', '/offers/business-website-starting-999-month', 'Business Website Starting ₹999/Month | Techneyo', 'google', 'organic', null, 'https://www.google.com', 'mobile', now() - interval '5 minutes')
on conflict do nothing;
