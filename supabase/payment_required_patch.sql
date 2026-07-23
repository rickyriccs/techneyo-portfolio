-- Add payment_required column to app_settings
-- Run this in your Supabase SQL Editor

alter table public.app_settings
  add column if not exists payment_required boolean not null default true;

-- true  = Razorpay advance payment required (existing behaviour)
-- false = Free booking, no payment, customer details only
