-- Add Email Notification Settings to app_settings
-- Run this script in the Supabase SQL Editor

alter table public.app_settings
  add column if not exists resend_api_key text,
  add column if not exists notification_sender_email text default 'hello@techneyo.com',
  add column if not exists email_notifications_enabled boolean default true;
