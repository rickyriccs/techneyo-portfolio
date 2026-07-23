-- Fix Onboarding Permissions & Column Patch
-- Run this in your Supabase SQL Editor

-- 1. Add onboarding_details column if not exists
alter table public.offer_bookings
  add column if not exists onboarding_details jsonb;

-- 2. Add RLS policy allowing public customers to update their booking during onboarding
drop policy if exists "Public can update offer bookings" on public.offer_bookings;
create policy "Public can update offer bookings" on public.offer_bookings
for update using (true) with check (true);

-- 3. Grant UPDATE permission to anon and authenticated roles
grant update on public.offer_bookings to anon;
grant update on public.offer_bookings to authenticated;
