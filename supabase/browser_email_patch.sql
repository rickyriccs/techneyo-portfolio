-- Browser Email Provider Migration Patch (Brevo / EmailJS / ElasticEmail)
-- No Supabase Edge Functions or Resend required!
-- Run this in your Supabase SQL Editor

alter table public.app_settings
  add column if not exists email_provider text default 'brevo' check (email_provider in ('brevo', 'emailjs', 'elasticemail')),
  add column if not exists email_api_key text,
  add column if not exists emailjs_service_id text,
  add column if not exists emailjs_template_id text,
  add column if not exists emailjs_public_key text,
  add column if not exists smtp_from_email text default 'hello@techneyo.com',
  add column if not exists smtp_from_name text default 'Techneyo Solutions',
  add column if not exists email_notifications_enabled boolean default true;
