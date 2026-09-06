-- Slack Notifications Settings Patch for Supabase
-- Run this script in your Supabase SQL Editor to enable Slack alert configuration.

-- 1. Add Slack configuration columns to public.app_settings if they do not exist
alter table public.app_settings add column if not exists slack_enabled boolean default false;
alter table public.app_settings add column if not exists slack_webhook_url text;
alter table public.app_settings add column if not exists slack_channel text default '#leads';
alter table public.app_settings add column if not exists slack_notify_enquiries boolean default true;
alter table public.app_settings add column if not exists slack_notify_bookings boolean default true;
alter table public.app_settings add column if not exists slack_notify_proposals boolean default true;
alter table public.app_settings add column if not exists slack_notify_onboarding boolean default true;
