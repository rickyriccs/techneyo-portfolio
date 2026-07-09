-- Run this once in the Supabase SQL Editor for the live project.
-- It adds missing business identity columns to the app_settings table.

alter table public.app_settings
  add column if not exists business_name text not null default 'Techneyo Solutions',
  add column if not exists business_email text not null default 'hello@techneyo.com',
  add column if not exists business_phone text not null default '+91 99887 73122',
  add column if not exists business_website text not null default 'https://techneyo.com',
  add column if not exists whatsapp_url text not null default 'https://wa.me/919988773122';

notify pgrst, 'reload schema';
