-- Run this once in the Supabase SQL Editor for the live project.
-- It adds lead source tracking columns used by the Techneyo Solutions contact form.

alter table public.contact_enquiries
  add column if not exists source_page_url text,
  add column if not exists landing_page_url text,
  add column if not exists initial_referrer text,
  add column if not exists referrer text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists device_type text;

alter table public.contact_enquiries
  alter column lead_status set default 'new';

do $$
declare
  status_constraint_name text;
begin
  for status_constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.contact_enquiries'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%lead_status%'
  loop
    execute format('alter table public.contact_enquiries drop constraint %I', status_constraint_name);
  end loop;
end $$;

update public.contact_enquiries
set lead_status = case lead_status
  when 'New' then 'new'
  when 'Contacted' then 'contacted'
  when 'Follow-up' then 'follow_up'
  when 'Converted' then 'converted'
  when 'Rejected' then 'rejected'
  when 'Closed' then 'closed'
  else lead_status
end
where lead_status in ('New', 'Contacted', 'Follow-up', 'Converted', 'Rejected', 'Closed');

alter table public.contact_enquiries
  add constraint contact_enquiries_lead_status_check
  check (lead_status in ('new', 'contacted', 'converted', 'lost', 'follow_up', 'rejected', 'closed'));

notify pgrst, 'reload schema';
