-- Fix for Supabase RLS 42501 error on public.offer_bookings
-- Run this script in your Supabase Dashboard SQL Editor: https://supabase.com/dashboard

-- 1. Ensure Row Level Security is enabled
alter table public.offer_bookings enable row level security;

-- 2. Drop and recreate policies for public access (INSERT, SELECT, UPDATE)
drop policy if exists "Public can create offer bookings" on public.offer_bookings;
create policy "Public can create offer bookings" on public.offer_bookings
for insert with check (true);

drop policy if exists "Public can read offer bookings" on public.offer_bookings;
create policy "Public can read offer bookings" on public.offer_bookings
for select using (true);

drop policy if exists "Public can update offer bookings" on public.offer_bookings;
create policy "Public can update offer bookings" on public.offer_bookings
for update using (true) with check (true);

drop policy if exists "Admins can manage offer bookings" on public.offer_bookings;
create policy "Admins can manage offer bookings" on public.offer_bookings
for all using (public.is_active_admin()) with check (public.is_active_admin());

-- 3. Grant schema permissions to anon and authenticated roles
grant select, insert, update on public.offer_bookings to anon;
grant select, insert, update, delete on public.offer_bookings to authenticated;
