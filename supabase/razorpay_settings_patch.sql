-- Razorpay Settings Migration Patch
-- Run this script in the Supabase SQL Editor

alter table public.app_settings
  add column if not exists razorpay_mode text default 'test' check (razorpay_mode in ('test', 'live')),
  add column if not exists razorpay_test_key_id text,
  add column if not exists razorpay_test_key_secret text,
  add column if not exists razorpay_live_key_id text,
  add column if not exists razorpay_live_key_secret text;
