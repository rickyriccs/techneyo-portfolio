-- Custom SMTP Server Credentials Migration Patch
-- Run this script in your Supabase SQL Editor

alter table public.app_settings
  add column if not exists smtp_enabled boolean default true,
  add column if not exists smtp_host text,
  add column if not exists smtp_port integer default 587,
  add column if not exists smtp_user text,
  add column if not exists smtp_pass text,
  add column if not exists smtp_from_email text,
  add column if not exists smtp_from_name text default 'Techneyo Solutions';
