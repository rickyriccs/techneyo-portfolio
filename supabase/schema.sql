-- Techneyo Solutions Supabase Cloud schema
-- Run this in Supabase SQL Editor after creating your cloud project.

create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'admin' check (role in ('owner', 'admin', 'manager', 'viewer')),
  must_change_password boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  coverage_text text not null default 'We provide website development, digital presence setup, automation tools, and business growth solutions across India.',
  business_name text not null default 'Techneyo Solutions',
  business_email text not null default 'hello@techneyo.com',
  business_phone text not null default '+91 99887 73122',
  business_website text not null default 'https://techneyo.com',
  whatsapp_url text not null default 'https://wa.me/919988773122',
  service_area text not null default 'All India',
  city_targets text[] not null default '{}',
  state_targets text[] not null default '{}',
  location_based_offers_enabled boolean not null default false,
  updated_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_description text not null,
  detailed_description text,
  offer_type text not null check (offer_type in ('Website Presence', 'Business Tool', 'Automation', 'Digital Growth', 'Custom')),
  starting_price numeric(10,2),
  discount_price numeric(10,2),
  valid_from date,
  valid_till date,
  status text not null default 'Draft' check (status in ('Active', 'Inactive', 'Draft', 'Expired')),
  is_featured boolean not null default false,
  button_text text not null default 'Enquire Now',
  button_action text not null default 'Contact Form' check (button_action in ('Contact Form', 'WhatsApp', 'Call', 'Custom Link')),
  button_url text,
  display_order integer not null default 0,
  banner_image_url text,
  seo_title text,
  seo_description text,
  created_by uuid references public.admin_profiles(id),
  updated_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Starter Website', 'Business Website', 'Landing Page', 'Portfolio', 'Ecommerce', 'Booking Website', 'Custom Tool')),
  price numeric(10,2),
  offer_price numeric(10,2),
  features text[] not null default '{}',
  best_for text,
  delivery_timeline text,
  is_recommended boolean not null default false,
  status text not null default 'active' check (status in ('active', 'inactive')),
  display_order integer not null default 0,
  created_by uuid references public.admin_profiles(id),
  updated_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.digital_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  business_use_case text,
  starting_price numeric(10,2),
  status text not null default 'active' check (status in ('active', 'inactive')),
  cta_type text not null default 'Contact Form' check (cta_type in ('Contact Form', 'WhatsApp', 'Call', 'Custom Link')),
  cta_url text,
  display_order integer not null default 0,
  created_by uuid references public.admin_profiles(id),
  updated_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon_name text not null default 'Globe',
  features text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'inactive')),
  display_order integer not null default 0,
  created_by uuid references public.admin_profiles(id),
  updated_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  business_name text,
  city text,
  state text,
  service_required text,
  budget_range text,
  message text not null,
  source_page text,
  source_page_url text,
  landing_page_url text,
  initial_referrer text,
  referrer text,
  selected_offer_id uuid references public.offers(id),
  selected_package_id uuid references public.service_packages(id),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  device_type text,
  ip_address inet,
  user_agent text,
  lead_status text not null default 'new' check (lead_status in ('new', 'contacted', 'converted', 'lost', 'follow_up', 'rejected', 'closed')),
  admin_notes text,
  follow_up_date date,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admin_profiles(id),
  action_type text not null,
  module_name text not null,
  record_id uuid,
  old_value jsonb,
  new_value jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.log_contact_enquiry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.activity_logs (action_type, module_name, record_id, new_value, user_agent)
  values ('created', 'contact_enquiries', new.id, to_jsonb(new), new.user_agent);
  return new;
end;
$$;

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at before update on public.admin_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_app_settings_updated_at on public.app_settings;
create trigger set_app_settings_updated_at before update on public.app_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_offers_updated_at on public.offers;
create trigger set_offers_updated_at before update on public.offers
for each row execute function public.set_updated_at();

drop trigger if exists set_service_packages_updated_at on public.service_packages;
create trigger set_service_packages_updated_at before update on public.service_packages
for each row execute function public.set_updated_at();

drop trigger if exists set_digital_tools_updated_at on public.digital_tools;
create trigger set_digital_tools_updated_at before update on public.digital_tools
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_contact_enquiries_updated_at on public.contact_enquiries;
create trigger set_contact_enquiries_updated_at before update on public.contact_enquiries
for each row execute function public.set_updated_at();

drop trigger if exists log_contact_enquiry_created on public.contact_enquiries;
create trigger log_contact_enquiry_created after insert on public.contact_enquiries
for each row execute function public.log_contact_enquiry();

alter table public.admin_profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.offers enable row level security;
alter table public.service_packages enable row level security;
alter table public.digital_tools enable row level security;
alter table public.services enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.activity_logs enable row level security;

create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and is_active = true
      and role in ('owner', 'admin', 'manager')
  );
$$;

revoke execute on function public.is_active_admin() from public;
revoke execute on function public.log_contact_enquiry() from public;
grant execute on function public.is_active_admin() to authenticated;

drop policy if exists "Admins can manage admin profiles" on public.admin_profiles;
create policy "Admins can manage admin profiles" on public.admin_profiles
for all using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "Public can read active settings" on public.app_settings;
create policy "Public can read active settings" on public.app_settings
for select using (true);

drop policy if exists "Admins can manage settings" on public.app_settings;
create policy "Admins can manage settings" on public.app_settings
for all using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "Public can read active offers" on public.offers;
create policy "Public can read active offers" on public.offers
for select using (status = 'Active');

drop policy if exists "Admins can manage offers" on public.offers;
create policy "Admins can manage offers" on public.offers
for all using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "Public can read active packages" on public.service_packages;
create policy "Public can read active packages" on public.service_packages
for select using (status = 'active');

drop policy if exists "Admins can manage packages" on public.service_packages;
create policy "Admins can manage packages" on public.service_packages
for all using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "Public can read active tools" on public.digital_tools;
create policy "Public can read active tools" on public.digital_tools
for select using (status = 'active');

drop policy if exists "Admins can manage tools" on public.digital_tools;
create policy "Admins can manage tools" on public.digital_tools
for all using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services" on public.services
for select using (status = 'active');

drop policy if exists "Admins can manage services" on public.services;
create policy "Admins can manage services" on public.services
for all using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "Public can create contact enquiries" on public.contact_enquiries;
create policy "Public can create contact enquiries" on public.contact_enquiries
for insert with check (true);

drop policy if exists "Admins can manage contact enquiries" on public.contact_enquiries;
create policy "Admins can manage contact enquiries" on public.contact_enquiries
for all using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "Admins can read activity logs" on public.activity_logs;
create policy "Admins can read activity logs" on public.activity_logs
for select using (public.is_active_admin());

drop policy if exists "Admins can create activity logs" on public.activity_logs;
create policy "Admins can create activity logs" on public.activity_logs
for insert with check (public.is_active_admin());

revoke all on public.admin_profiles from anon, authenticated;
revoke all on public.app_settings from anon, authenticated;
revoke all on public.offers from anon, authenticated;
revoke all on public.service_packages from anon, authenticated;
revoke all on public.digital_tools from anon, authenticated;
revoke all on public.services from anon, authenticated;
revoke all on public.contact_enquiries from anon, authenticated;
revoke all on public.activity_logs from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.app_settings to anon, authenticated;
grant select on public.offers to anon, authenticated;
grant select on public.service_packages to anon, authenticated;
grant select on public.digital_tools to anon, authenticated;
grant select on public.services to anon, authenticated;
grant insert on public.contact_enquiries to anon, authenticated;
grant select, insert, update, delete on public.admin_profiles to authenticated;
grant select, insert, update, delete on public.app_settings to authenticated;
grant select, insert, update, delete on public.offers to authenticated;
grant select, insert, update, delete on public.service_packages to authenticated;
grant select, insert, update, delete on public.digital_tools to authenticated;
grant select, insert, update, delete on public.services to authenticated;
grant select, insert, update, delete on public.contact_enquiries to authenticated;
grant select, insert on public.activity_logs to authenticated;

insert into public.app_settings (coverage_text, business_name, business_email, business_phone, business_website, whatsapp_url, service_area)
select
  'We provide website development, digital presence setup, CRM, admin dashboards, WhatsApp automation consultation, and business growth solutions across India.',
  'Techneyo Solutions',
  'hello@techneyo.com',
  '+91 99887 73122',
  'https://techneyo.com',
  'https://wa.me/919988773122',
  'All India'
where not exists (select 1 from public.app_settings);

insert into public.offers (
  title,
  short_description,
  detailed_description,
  offer_type,
  starting_price,
  discount_price,
  status,
  is_featured,
  button_text,
  button_action,
  display_order,
  seo_title,
  seo_description
)
select
  'Website starts from Rs. 999',
  'Launch a clean, mobile-friendly business website at an affordable starter price.',
  'Best for small businesses that need a fast online presence with enquiry-ready sections.',
  'Website Presence',
  1999,
  999,
  'Active',
  true,
  'Start from Rs. 999',
  'Contact Form',
  1,
  'Affordable Website Offer Across India',
  'Start your business website with Techneyo Solutions from Rs. 999.'
where not exists (select 1 from public.offers where title = 'Website starts from Rs. 999');

insert into public.service_packages (
  name,
  category,
  price,
  offer_price,
  features,
  best_for,
  delivery_timeline,
  is_recommended,
  status,
  display_order
)
select
  'Starter Website',
  'Starter Website',
  2999,
  999,
  array['Single-page website', 'Mobile responsive layout', 'Contact and WhatsApp CTA', 'Basic SEO setup'],
  'New businesses that need a quick online presence',
  '3-5 working days',
  true,
  'active',
  1
where not exists (select 1 from public.service_packages where name = 'Starter Website');

insert into public.service_packages (
  name,
  category,
  price,
  offer_price,
  features,
  best_for,
  delivery_timeline,
  is_recommended,
  status,
  display_order
)
select
  'Business Website',
  'Business Website',
  14999,
  7999,
  array['Up to 5 pages', 'Service sections', 'Lead capture form', 'Google Business Profile support', 'Performance-ready setup'],
  'Growing businesses that need trust, service details, and enquiry flow',
  '7-10 working days',
  false,
  'active',
  2
where not exists (select 1 from public.service_packages where name = 'Business Website');

insert into public.service_packages (
  name,
  category,
  price,
  offer_price,
  features,
  best_for,
  delivery_timeline,
  is_recommended,
  status,
  display_order
)
select
  'Custom Tool Dashboard',
  'Custom Tool',
  49999,
  24999,
  array['Custom admin panel', 'Database-backed workflows', 'Lead or order tracking', 'Role-ready structure'],
  'Businesses that need internal tools, automation, or CRM-like workflows',
  '2-4 weeks',
  false,
  'active',
  3
where not exists (select 1 from public.service_packages where name = 'Custom Tool Dashboard');

insert into public.digital_tools (
  name,
  description,
  business_use_case,
  starting_price,
  status,
  cta_type,
  display_order
)
select
  'Lead Capture Form',
  'A website enquiry form connected to database tracking and follow-up status.',
  'Capture website visitors, qualify leads, and manage follow-ups from an admin panel.',
  1999,
  'active',
  'Contact Form',
  1
where not exists (select 1 from public.digital_tools where name = 'Lead Capture Form');

insert into public.digital_tools (
  name,
  description,
  business_use_case,
  starting_price,
  status,
  cta_type,
  display_order
)
select
  'WhatsApp Enquiry Button',
  'A quick WhatsApp contact CTA that works across mobile and desktop pages.',
  'Reduce friction for customer enquiries and route users to direct chat.',
  999,
  'active',
  'WhatsApp',
  2
where not exists (select 1 from public.digital_tools where name = 'WhatsApp Enquiry Button');

insert into public.digital_tools (
  name,
  description,
  business_use_case,
  starting_price,
  status,
  cta_type,
  display_order
)
select
  'Appointment Booking Flow',
  'A booking-ready workflow for collecting customer requests and preferred dates.',
  'Useful for clinics, salons, consultants, service providers, and local businesses.',
  4999,
  'active',
  'Contact Form',
  3
where not exists (select 1 from public.digital_tools where name = 'Appointment Booking Flow');

insert into public.services (title, description, icon_name, features, status, display_order)
select
  'Website & Landing Page Development',
  'Professional, mobile-friendly websites and landing pages that explain your services clearly and convert visitors into inquiries.',
  'Globe',
  array['Business Website', 'Landing Page', 'Service Pages', 'Portfolio/Gallery'],
  'active',
  1
where not exists (select 1 from public.services where title = 'Website & Landing Page Development');

insert into public.services (title, description, icon_name, features, status, display_order)
select
  'Google Business & Local SEO',
  'Improve local search visibility so nearby customers can find your business on Google and trust your online presence.',
  'MapPin',
  array['Google Business Profile', 'Local Keywords', 'Review Strategy', 'Location SEO'],
  'active',
  2
where not exists (select 1 from public.services where title = 'Google Business & Local SEO');

insert into public.services (title, description, icon_name, features, status, display_order)
select
  'WhatsApp Inquiry & Follow-up System',
  'Convert website visitors into WhatsApp leads and manage inquiry conversations more professionally.',
  'MessageCircle',
  array['WhatsApp Button', 'Form to WhatsApp', 'Auto-reply Flow', 'Follow-up Templates'],
  'active',
  3
where not exists (select 1 from public.services where title = 'WhatsApp Inquiry & Follow-up System');

insert into public.services (title, description, icon_name, features, status, display_order)
select
  'Lead Management CRM',
  'Track inquiries, follow-ups, customer notes, status, source, and conversion in one simple lead management system.',
  'Users',
  array['Lead Capture', 'Status Tracking', 'Follow-up Reminders', 'Admin Dashboard'],
  'active',
  4
where not exists (select 1 from public.services where title = 'Lead Management CRM');

insert into public.services (title, description, icon_name, features, status, display_order)
select
  'Custom Software & Business Automation',
  'Custom dashboards, booking systems, reports, billing tools, portals, and workflow automation for growing businesses.',
  'Server',
  array['Admin Dashboards', 'Booking Systems', 'Report Systems', 'Customer Portals'],
  'active',
  5
where not exists (select 1 from public.services where title = 'Custom Software & Business Automation');

insert into public.services (title, description, icon_name, features, status, display_order)
select
  'Digital Marketing & Ad-Ready Setup',
  'Prepare your business for Google, Facebook, Instagram, and WhatsApp campaigns with landing pages and tracking.',
  'Megaphone',
  array['Campaign Creatives', 'Offer Pages', 'Lead Forms', 'Tracking Setup'],
  'active',
  6
where not exists (select 1 from public.services where title = 'Digital Marketing & Ad-Ready Setup');

insert into public.services (title, description, icon_name, features, status, display_order)
select
  'AI-Powered Business Tools',
  'Use AI for customer support, reports, content, lead qualification, internal automation, and business insights.',
  'Brain',
  array['AI Chatbot', 'AI FAQ Assistant', 'AI Reports', 'AI Lead Qualification'],
  'active',
  7
where not exists (select 1 from public.services where title = 'AI-Powered Business Tools');

insert into public.services (title, description, icon_name, features, status, display_order)
select
  'Branding & Creative Design',
  'Professional visual identity and marketing creatives that make your business look trustworthy online and offline.',
  'Palette',
  array['Logo Design', 'Social Creatives', 'Posters', 'Offer Banners'],
  'active',
  8
where not exists (select 1 from public.services where title = 'Branding & Creative Design');

-- Admin setup note:
-- Create admin@techneyo.com in Supabase Auth, then run:
-- insert into public.admin_profiles (id, email, full_name, role)
-- select id, email, 'Techneyo Admin', 'owner' from auth.users where email = 'admin@techneyo.com'
-- on conflict (id) do nothing;
