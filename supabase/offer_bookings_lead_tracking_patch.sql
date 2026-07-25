-- Lead Source Tracking Patch for public.offer_bookings
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard

alter table public.offer_bookings
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists source_page_url text,
  add column if not exists landing_page_url text,
  add column if not exists initial_referrer text,
  add column if not exists referrer text,
  add column if not exists device_type text;
