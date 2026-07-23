-- Offers & Bookings System Migration Patch (Bulletproof for Supabase SQL Editor)
-- Run this script in your Supabase SQL Editor.

-- Step 1: Add all new columns individually to public.offers if they do not exist
alter table public.offers add column if not exists slug text;
alter table public.offers add column if not exists billing_period text default 'monthly';
alter table public.offers add column if not exists setup_fee numeric(10,2);
alter table public.offers add column if not exists booking_amount_type text default 'fixed';
alter table public.offers add column if not exists booking_amount numeric(10,2);
alter table public.offers add column if not exists target_audience text[] default '{}';
alter table public.offers add column if not exists whats_included text[] default '{}';
alter table public.offers add column if not exists whats_not_included text[] default '{}';
alter table public.offers add column if not exists update_policy text;
alter table public.offers add column if not exists ownership_policy text;
alter table public.offers add column if not exists terms text[] default '{}';
alter table public.offers add column if not exists target_keywords text[] default '{}';

-- Step 2: Backfill missing slugs for existing rows and set default fallback
do $$
begin
  -- Fill null or empty slugs using title
  execute '
    update public.offers
    set slug = lower(regexp_replace(regexp_replace(title, ''[^a-zA-Z0-9\s-]'', '''', ''g''), ''\s+'', ''-'', ''g''))
    where slug is null or slug = ''''
  ';
end $$;

-- Create unique index on slug
create unique index if not exists offers_slug_idx on public.offers(slug);

-- Step 3: Create offer_bookings table for Razorpay payment bookings
create table if not exists public.offer_bookings (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references public.offers(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  business_name text,
  total_plan_price numeric(10,2),
  advance_amount_paid numeric(10,2) not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  payment_status text not null default 'paid' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  onboarding_status text not null default 'pending' check (onboarding_status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger for updated_at on offer_bookings
drop trigger if exists set_offer_bookings_updated_at on public.offer_bookings;
create trigger set_offer_bookings_updated_at before update on public.offer_bookings
for each row execute function public.set_updated_at();

-- Enable Row Level Security (RLS)
alter table public.offer_bookings enable row level security;

-- RLS Policies
drop policy if exists "Public can create offer bookings" on public.offer_bookings;
create policy "Public can create offer bookings" on public.offer_bookings
for insert with check (true);

drop policy if exists "Admins can manage offer bookings" on public.offer_bookings;
create policy "Admins can manage offer bookings" on public.offer_bookings
for all using (public.is_active_admin()) with check (public.is_active_admin());

-- Permissions
grant select, insert on public.offer_bookings to anon;
grant select, insert, update, delete on public.offer_bookings to authenticated;

-- Step 4: Safely Insert the default ₹299/Month Business Website Plan offer via dynamic execution
do $$
begin
  execute $sql$
    insert into public.offers (
      title,
      slug,
      short_description,
      detailed_description,
      offer_type,
      starting_price,
      discount_price,
      billing_period,
      setup_fee,
      booking_amount_type,
      booking_amount,
      target_audience,
      whats_included,
      whats_not_included,
      update_policy,
      ownership_policy,
      terms,
      target_keywords,
      status,
      is_featured,
      button_text,
      button_action,
      display_order,
      seo_title,
      seo_description
    )
    select
      '₹299/Month – Basic Business Website Plan',
      '299-basic-business-website-plan',
      'Perfect for visiting cards, portfolios, business profiles, and local startups across India.',
      'Get a professional 5-page mobile-responsive website with free hosting and SSL certificate.',
      'Website Presence',
      599,
      299,
      'monthly',
      999,
      'fixed',
      999,
      array['Visiting Card Website', 'Portfolio Website', 'Business Profile Website', 'Catalogue Website', 'Local Businesses', 'Shops & Startups'],
      array['Professional Website (up to 5 pages)', 'Mobile Responsive', 'Free Hosting', 'Free SSL Certificate', 'WhatsApp Chat Button', 'Contact Form', 'Google Map Integration', 'Social Media Links', 'Basic On-Page SEO', 'Fast Loading Website'],
      array['No Admin Panel', 'No Login System', 'No E-commerce', 'No Payment Gateway', 'No Blog', 'No Dynamic Features', 'No Custom Development', 'No Email Accounts', 'No Source Code Access', 'No Hosting Access', 'No cPanel Access', 'No FTP Access', 'No Free Content Updates', 'All modifications are chargeable'],
      'Important: The ₹299/month plan includes website hosting and availability only. Any content updates, image changes, text changes, design modifications, feature additions, or other changes are billed separately according to our support charges.',
      'Website remains hosted and managed by Techneyo Solutions. Subscription covers hosting and availability only. Source code and hosting credentials are not included. If cancelled, website will be suspended after grace period. Buyout option available separately.',
      array['Minimum subscription: 12 months', 'One-time setup fee: ₹999', 'Monthly subscription: ₹299', 'Advance payment only', 'No refunds', 'No free revisions after website approval'],
      array['299 per month website plan', 'basic business website India', 'affordable website subscription', 'visiting card website offer', 'low cost website development'],
      'Active',
      true,
      'Book Now with ₹999 Setup Fee',
      'Contact Form',
      0,
      '₹299/Month Business Website Plan | Techneyo Solutions',
      'Launch a professional business website for ₹299/month with free hosting and SSL. Includes mobile layout, WhatsApp integration, and local SEO setup.'
    where not exists (select 1 from public.offers where title = '₹299/Month – Basic Business Website Plan');
  $sql$;
end $$;
