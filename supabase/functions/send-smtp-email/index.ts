import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import nodemailer from "npm:nodemailer@6.9.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, subject, html, smtpHost, smtpPort, smtpUser, smtpPass, smtpFromEmail, smtpFromName } = await req.json();

    let host = smtpHost;
    let port = Number(smtpPort) || 587;
    let user = smtpUser;
    let pass = smtpPass;
    let fromEmail = smtpFromEmail;
    let fromName = smtpFromName || "Techneyo Solutions";

    // If SMTP details are omitted, fetch from app_settings table in Supabase
    if (!host || !user || !pass) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
          .from("app_settings")
          .select("smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from_email, smtp_from_name, smtp_enabled")
          .limit(1)
          .maybeSingle();

        if (data) {
          if (data.smtp_enabled === false) {
            return new Response(
              JSON.stringify({ success: false, message: "SMTP notifications are disabled in Admin Settings." }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
            );
          }
          host = host || data.smtp_host;
          port = port || Number(data.smtp_port) || 587;
          user = user || data.smtp_user;
          pass = pass || data.smtp_pass;
          fromEmail = fromEmail || data.smtp_from_email || data.smtp_user;
          fromName = fromName || data.smtp_from_name || "Techneyo Solutions";
        }
      }
    }

    if (!host || !user || !pass) {
      return new Response(
        JSON.stringify({ success: false, message: "SMTP credentials missing. Please enter Host, Username, and Password in Admin Settings." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Direct Nodemailer TCP/TLS Connection to Custom SMTP Server
    const transporter = nodemailer.createTransport({
      host: host.trim(),
      port: port,
      secure: port === 465, // true for port 465, false for 587/25
      auth: {
        user: user.trim(),
        pass: pass.trim(),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const senderAddress = fromEmail ? `"${fromName}" <${fromEmail.trim()}>` : `"${fromName}" <${user.trim()}>`;

    const info = await transporter.sendMail({
      from: senderAddress,
      to: to.trim(),
      subject: subject,
      html: html,
    });

    return new Response(
      JSON.stringify({ success: true, message: `Email sent successfully via ${host}! (Message ID: ${info.messageId})` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Nodemailer SMTP error:", error);
    return new Response(
      JSON.stringify({ success: false, message: `SMTP Server Error: ${error.message || error}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }
});
