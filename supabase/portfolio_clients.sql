-- Create portfolio_clients table
create table if not exists public.portfolio_clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  company_logo_url text, -- supports direct URL or base64 data URL
  company_description text not null,
  company_website_url text, -- optional link to client website
  projects jsonb not null default '[]'::jsonb, -- array of {project_name, project_status}
  display_order integer not null default 0,
  created_by uuid references public.admin_profiles(id),
  updated_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger for updated_at
drop trigger if exists set_portfolio_clients_updated_at on public.portfolio_clients;
create trigger set_portfolio_clients_updated_at before update on public.portfolio_clients
for each row execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.portfolio_clients enable row level security;

-- RLS Policies
drop policy if exists "Public can read portfolio clients" on public.portfolio_clients;
create policy "Public can read portfolio clients" on public.portfolio_clients
for select using (true);

drop policy if exists "Admins can manage portfolio clients" on public.portfolio_clients;
create policy "Admins can manage portfolio clients" on public.portfolio_clients
for all using (public.is_active_admin()) with check (public.is_active_admin());

-- Permissions
revoke all on public.portfolio_clients from anon, authenticated;
grant select on public.portfolio_clients to anon, authenticated;
grant select, insert, update, delete on public.portfolio_clients to authenticated;
