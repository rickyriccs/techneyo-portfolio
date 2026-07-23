-- Backend Server-to-Server Resend Email Sender (Fixes CORS Errors)
-- Run this script in your Supabase SQL Editor

-- Enable pg_net extension for backend HTTP requests from PostgreSQL
create extension if not exists pg_net;

-- Create RPC function to send emails safely without CORS issues
create or replace function public.send_resend_email(
  p_to text,
  p_subject text,
  p_html text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_api_key text;
  v_sender text;
  v_enabled boolean;
  v_res_id bigint;
begin
  -- Fetch API key and sender email from app_settings
  select resend_api_key, notification_sender_email, email_notifications_enabled
  into v_api_key, v_sender, v_enabled
  from public.app_settings
  limit 1;

  if v_enabled = false then
    return jsonb_build_object('success', false, 'message', 'Email notifications are disabled in Admin Settings.');
  end if;

  if v_api_key is null or trim(v_api_key) = '' then
    return jsonb_build_object('success', false, 'message', 'Resend API Key is not configured in Admin Settings.');
  end if;

  if v_sender is null or trim(v_sender) = '' then
    v_sender := 'onboarding@resend.dev';
  end if;

  if position('<' in v_sender) = 0 then
    v_sender := 'Techneyo Solutions <' || v_sender || '>';
  end if;

  -- Use pg_net to make HTTP POST request directly from Supabase server to Resend API
  select net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || trim(v_api_key),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', v_sender,
      'to', jsonb_build_array(p_to),
      'subject', p_subject,
      'html', p_html
    )
  ) into v_res_id;

  return jsonb_build_object('success', true, 'message', 'Email sent successfully via Supabase backend (HTTP Request ID: ' || v_res_id || ').');
exception when others then
  return jsonb_build_object('success', false, 'message', 'Database error: ' || SQLERRM);
end;
$$;

-- Grant execution to anon and authenticated roles
grant execute on function public.send_resend_email(text, text, text) to anon, authenticated;
