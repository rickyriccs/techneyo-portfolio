-- Optional: Postgres Server-Side Slack Trigger via pg_net (Zero Browser Dependency)
-- If your Supabase instance has pg_net enabled, this trigger automatically dispatches Slack alerts directly from the database server whenever an inquiry or booking is created.

create extension if not exists pg_net with schema extensions;

-- Helper function to dispatch Slack alert from Postgres
create or replace function public.dispatch_slack_lead_alert()
returns trigger
language plpgsql
security definer
as $$
declare
  _settings record;
  _slack_url text;
  _slack_enabled boolean;
  _payload jsonb;
  _text_content text;
begin
  -- Fetch Slack settings from app_settings
  select slack_enabled, slack_webhook_url into _settings from public.app_settings limit 1;

  if not found or _settings.slack_enabled is not true or _settings.slack_webhook_url is null or _settings.slack_webhook_url = '' then
    return new;
  end if;

  _slack_url := _settings.slack_webhook_url;

  -- Build payload based on table
  if TG_TABLE_NAME = 'contact_enquiries' then
    _text_content := '🚀 *New Website Contact Enquiry Received*' || chr(10) ||
                     '👤 *Name:* ' || coalesce(new.name, 'N/A') || chr(10) ||
                     '📞 *Phone:* ' || coalesce(new.phone, 'N/A') || chr(10) ||
                     '✉️ *Email:* ' || coalesce(new.email, 'N/A') || chr(10) ||
                     '🛠️ *Service:* ' || coalesce(new.service_required, 'N/A') || chr(10) ||
                     '💰 *Budget:* ' || coalesce(new.budget_range, 'N/A') || chr(10) ||
                     '💬 *Message:* ' || coalesce(new.message, 'N/A');

    _payload := jsonb_build_object(
      'text', _text_content,
      'attachments', jsonb_build_array(
        jsonb_build_object(
          'color', '#06b6d4',
          'title', 'New Contact Lead Details',
          'fields', jsonb_build_array(
            jsonb_build_object('title', 'Customer', 'value', coalesce(new.name, 'N/A'), 'short', true),
            jsonb_build_object('title', 'Phone', 'value', coalesce(new.phone, 'N/A'), 'short', true),
            jsonb_build_object('title', 'Service', 'value', coalesce(new.service_required, 'General Inquiry'), 'short', true),
            jsonb_build_object('title', 'Traffic Source', 'value', coalesce(new.utm_source, 'Organic/Direct'), 'short', true)
          )
        )
      )
    );

    perform extensions.http_post(
      url := _slack_url,
      body := _payload::text,
      headers := '{"Content-Type": "application/json"}'::jsonb
    );

  elsif TG_TABLE_NAME = 'offer_bookings' then
    _text_content := '🎉 *New Offer Booking Received!*' || chr(10) ||
                     '👤 *Customer:* ' || coalesce(new.customer_name, 'N/A') || chr(10) ||
                     '📞 *Phone:* ' || coalesce(new.customer_phone, 'N/A') || chr(10) ||
                     '💵 *Advance Paid:* Rs. ' || coalesce(new.advance_amount_paid::text, '0') || chr(10) ||
                     '💳 *Status:* ' || coalesce(new.payment_status, 'pending');

    _payload := jsonb_build_object(
      'text', _text_content,
      'attachments', jsonb_build_array(
        jsonb_build_object(
          'color', '#10b981',
          'title', 'Booking Lead Details',
          'fields', jsonb_build_array(
            jsonb_build_object('title', 'Customer', 'value', coalesce(new.customer_name, 'N/A'), 'short', true),
            jsonb_build_object('title', 'Phone', 'value', coalesce(new.customer_phone, 'N/A'), 'short', true),
            jsonb_build_object('title', 'Payment Status', 'value', coalesce(new.payment_status, 'pending'), 'short', true),
            jsonb_build_object('title', 'Advance Paid', 'value', 'Rs. ' || coalesce(new.advance_amount_paid::text, '0'), 'short', true)
          )
        )
      )
    );

    perform extensions.http_post(
      url := _slack_url,
      body := _payload::text,
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  end if;

  return new;
exception
  when others then
    -- Fail-safe: do not block record insertion if Slack fails
    return new;
end;
$$;

-- Create database triggers
drop trigger if exists trigger_slack_contact_enquiries on public.contact_enquiries;
create trigger trigger_slack_contact_enquiries
after insert on public.contact_enquiries
for each row execute function public.dispatch_slack_lead_alert();

drop trigger if exists trigger_slack_offer_bookings on public.offer_bookings;
create trigger trigger_slack_offer_bookings
after insert on public.offer_bookings
for each row execute function public.dispatch_slack_lead_alert();
