import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { webhookUrl, payload } = await req.json();

    let targetWebhookUrl = webhookUrl;

    // If webhookUrl is not provided, fetch from app_settings in Supabase
    if (!targetWebhookUrl) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
          .from("app_settings")
          .select("slack_enabled, slack_webhook_url")
          .limit(1)
          .maybeSingle();

        if (data) {
          if (data.slack_enabled === false) {
            return new Response(
              JSON.stringify({ success: false, message: "Slack notifications are disabled in Admin Settings." }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
            );
          }
          targetWebhookUrl = data.slack_webhook_url;
        }
      }
    }

    if (!targetWebhookUrl || !targetWebhookUrl.startsWith("https://hooks.slack.com/")) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing or invalid Slack webhook URL." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Server-to-server POST directly to Slack API
    const slackRes = await fetch(targetWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await slackRes.text();

    if (!slackRes.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          status: slackRes.status,
          message: `Slack API returned error ${slackRes.status}: ${responseText}`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Slack notification sent successfully!", slackResponse: responseText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Slack webhook dispatch error:", error);
    return new Response(
      JSON.stringify({ success: false, message: `Slack dispatch error: ${error.message || error}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
