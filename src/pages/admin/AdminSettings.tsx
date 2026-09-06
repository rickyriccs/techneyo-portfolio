import { FormEvent, useEffect, useState } from "react";
import { CreditCard, Save, Server, RefreshCw, Bell, Send, CheckCircle2, AlertCircle, Copy, Database } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "@/lib/admin-auth";
import { testSlackWebhook, getLocalSlackSettings, saveLocalSlackSettings } from "@/lib/slack";

type SettingsForm = {
  id?: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_website: string;
  whatsapp_url: string;
  service_area: string;
  coverage_text: string;
  razorpay_mode: "test" | "live";
  razorpay_test_key_id: string;
  razorpay_test_key_secret: string;
  razorpay_live_key_id: string;
  razorpay_live_key_secret: string;
  payment_required: boolean;
  smtp_enabled: boolean;
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass: string;
  smtp_from_email: string;
  smtp_from_name: string;
  slack_enabled: boolean;
  slack_webhook_url: string;
  slack_channel: string;
  slack_notify_enquiries: boolean;
  slack_notify_bookings: boolean;
  slack_notify_proposals: boolean;
  slack_notify_onboarding: boolean;
};

const defaultForm: SettingsForm = {
  business_name: "Techneyo Solutions",
  business_email: "hello@techneyo.com",
  business_phone: "+91 99887 73122",
  business_website: "https://techneyo.com",
  whatsapp_url: "https://wa.me/919988773122",
  service_area: "All India",
  coverage_text: "We provide website development, digital presence setup, automation tools, and business growth solutions across India.",
  razorpay_mode: "test",
  razorpay_test_key_id: "",
  razorpay_test_key_secret: "",
  razorpay_live_key_id: "",
  razorpay_live_key_secret: "",
  payment_required: true,
  smtp_enabled: true,
  smtp_host: "smtp.hostinger.com",
  smtp_port: "587",
  smtp_user: "hello@techneyo.com",
  smtp_pass: "",
  smtp_from_email: "hello@techneyo.com",
  smtp_from_name: "Techneyo Solutions",
  slack_enabled: false,
  slack_webhook_url: "",
  slack_channel: "#leads",
  slack_notify_enquiries: true,
  slack_notify_bookings: true,
  slack_notify_proposals: true,
  slack_notify_onboarding: true,
};

export const AdminSettings = () => {
  const { user } = useAdminAuth();
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingSlack, setIsTestingSlack] = useState(false);
  const [isSavingSlack, setIsSavingSlack] = useState(false);
  const [slackTestResult, setSlackTestResult] = useState<{ status: "success" | "error"; message: string } | null>(null);
  const [slackSaveMessage, setSlackSaveMessage] = useState<{ type: "success" | "warning" | "error"; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = async () => {
    const localSlack = getLocalSlackSettings();

    if (!supabase) {
      if (localSlack) {
        setForm((prev) => ({
          ...prev,
          slack_enabled: localSlack.slack_enabled ?? prev.slack_enabled,
          slack_webhook_url: localSlack.slack_webhook_url || prev.slack_webhook_url,
          slack_channel: localSlack.slack_channel || prev.slack_channel,
          slack_notify_enquiries: localSlack.slack_notify_enquiries ?? prev.slack_notify_enquiries,
          slack_notify_bookings: localSlack.slack_notify_bookings ?? prev.slack_notify_bookings,
          slack_notify_proposals: localSlack.slack_notify_proposals ?? prev.slack_notify_proposals,
          slack_notify_onboarding: localSlack.slack_notify_onboarding ?? prev.slack_notify_onboarding,
        }));
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("app_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (loadError) {
      setError(loadError.message);
    } else if (data) {
      setForm({
        id: data.id,
        business_name: data.business_name || defaultForm.business_name,
        business_email: data.business_email || defaultForm.business_email,
        business_phone: data.business_phone || defaultForm.business_phone,
        business_website: data.business_website || defaultForm.business_website,
        whatsapp_url: data.whatsapp_url || defaultForm.whatsapp_url,
        service_area: data.service_area || defaultForm.service_area,
        coverage_text: data.coverage_text || defaultForm.coverage_text,
        razorpay_mode: data.razorpay_mode || "test",
        razorpay_test_key_id: data.razorpay_test_key_id || "",
        razorpay_test_key_secret: data.razorpay_test_key_secret || "",
        razorpay_live_key_id: data.razorpay_live_key_id || "",
        razorpay_live_key_secret: data.razorpay_live_key_secret || "",
        payment_required: data.payment_required ?? true,
        smtp_enabled: data.smtp_enabled ?? true,
        smtp_host: data.smtp_host || defaultForm.smtp_host,
        smtp_port: data.smtp_port ? String(data.smtp_port) : defaultForm.smtp_port,
        smtp_user: data.smtp_user || "",
        smtp_pass: data.smtp_pass || "",
        smtp_from_email: data.smtp_from_email || "",
        smtp_from_name: data.smtp_from_name || defaultForm.smtp_from_name,
        slack_enabled: data.slack_enabled ?? localSlack?.slack_enabled ?? defaultForm.slack_enabled,
        slack_webhook_url: data.slack_webhook_url || localSlack?.slack_webhook_url || "",
        slack_channel: data.slack_channel || localSlack?.slack_channel || defaultForm.slack_channel,
        slack_notify_enquiries: data.slack_notify_enquiries ?? localSlack?.slack_notify_enquiries ?? true,
        slack_notify_bookings: data.slack_notify_bookings ?? localSlack?.slack_notify_bookings ?? true,
        slack_notify_proposals: data.slack_notify_proposals ?? localSlack?.slack_notify_proposals ?? true,
        slack_notify_onboarding: data.slack_notify_onboarding ?? localSlack?.slack_notify_onboarding ?? true,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleCopySql = () => {
    const sql = `-- Run this in your Supabase SQL Editor to enable Slack persistence in app_settings
alter table public.app_settings add column if not exists slack_enabled boolean default false;
alter table public.app_settings add column if not exists slack_webhook_url text;
alter table public.app_settings add column if not exists slack_channel text default '#leads';
alter table public.app_settings add column if not exists slack_notify_enquiries boolean default true;
alter table public.app_settings add column if not exists slack_notify_bookings boolean default true;
alter table public.app_settings add column if not exists slack_notify_proposals boolean default true;
alter table public.app_settings add column if not exists slack_notify_onboarding boolean default true;`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSaveSlackOnly = async () => {
    setIsSavingSlack(true);
    setSlackSaveMessage(null);

    // 1. Immediately persist to localStorage
    saveLocalSlackSettings({
      slack_enabled: form.slack_enabled,
      slack_webhook_url: form.slack_webhook_url.trim(),
      slack_channel: form.slack_channel.trim(),
      slack_notify_enquiries: form.slack_notify_enquiries,
      slack_notify_bookings: form.slack_notify_bookings,
      slack_notify_proposals: form.slack_notify_proposals,
      slack_notify_onboarding: form.slack_notify_onboarding,
    });

    if (!supabase) {
      setIsSavingSlack(false);
      setSlackSaveMessage({
        type: "success",
        text: "Slack settings saved locally in browser memory!",
      });
      return;
    }

    try {
      const slackPayload = {
        slack_enabled: form.slack_enabled,
        slack_webhook_url: form.slack_webhook_url.trim() || null,
        slack_channel: form.slack_channel.trim() || null,
        slack_notify_enquiries: form.slack_notify_enquiries,
        slack_notify_bookings: form.slack_notify_bookings,
        slack_notify_proposals: form.slack_notify_proposals,
        slack_notify_onboarding: form.slack_notify_onboarding,
        updated_by: user?.id || null,
        updated_at: new Date().toISOString(),
      };

      let saveErr = null;
      if (form.id) {
        const { error } = await supabase.from("app_settings").update(slackPayload).eq("id", form.id);
        saveErr = error;
      } else {
        const { error } = await supabase.from("app_settings").insert({
          business_name: form.business_name,
          ...slackPayload,
        });
        saveErr = error;
      }

      if (saveErr) {
        if (
          saveErr.code === "PGRST204" ||
          /slack_enabled|slack_webhook_url|slack_channel|slack_notify/i.test(saveErr.message)
        ) {
          setSlackSaveMessage({
            type: "warning",
            text: "Saved locally! ⚠️ To sync with Supabase cloud DB, click 'Copy Supabase SQL Patch' and run it in Supabase SQL editor.",
          });
        } else {
          setSlackSaveMessage({
            type: "error",
            text: `Database Error: ${saveErr.message}`,
          });
        }
      } else {
        setSlackSaveMessage({
          type: "success",
          text: "Slack alert settings saved to Supabase database successfully! 🎉",
        });
      }
    } catch (err: any) {
      setSlackSaveMessage({
        type: "error",
        text: err.message || "Failed to update database.",
      });
    } finally {
      setIsSavingSlack(false);
    }
  };

  const handleTestSlack = async () => {
    if (!form.slack_webhook_url || !form.slack_webhook_url.startsWith("https://hooks.slack.com/")) {
      setSlackTestResult({
        status: "error",
        message: "Please enter a valid Slack incoming webhook URL starting with https://hooks.slack.com/",
      });
      return;
    }

    setIsTestingSlack(true);
    setSlackTestResult(null);

    try {
      const ok = await testSlackWebhook(form.slack_webhook_url.trim());
      if (ok) {
        setSlackTestResult({
          status: "success",
          message: "Test message sent to Slack successfully! Check your channel.",
        });
      } else {
        setSlackTestResult({
          status: "error",
          message: "Failed to dispatch test message. Please verify your webhook URL.",
        });
      }
    } catch (err: any) {
      setSlackTestResult({
        status: "error",
        message: err.message || "Failed to dispatch test message to Slack.",
      });
    } finally {
      setIsTestingSlack(false);
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Always save Slack settings to localStorage so they are immediately active & never lost
    saveLocalSlackSettings({
      slack_enabled: form.slack_enabled,
      slack_webhook_url: form.slack_webhook_url.trim(),
      slack_channel: form.slack_channel.trim(),
      slack_notify_enquiries: form.slack_notify_enquiries,
      slack_notify_bookings: form.slack_notify_bookings,
      slack_notify_proposals: form.slack_notify_proposals,
      slack_notify_onboarding: form.slack_notify_onboarding,
    });

    if (!supabase) {
      setSuccess("Settings and Slack alert credentials saved locally!");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      business_name: form.business_name.trim(),
      business_email: form.business_email.trim(),
      business_phone: form.business_phone.trim(),
      business_website: form.business_website.trim(),
      whatsapp_url: form.whatsapp_url.trim(),
      service_area: form.service_area.trim(),
      coverage_text: form.coverage_text.trim(),
      razorpay_mode: form.razorpay_mode,
      razorpay_test_key_id: form.razorpay_test_key_id.trim() || null,
      razorpay_test_key_secret: form.razorpay_test_key_secret.trim() || null,
      razorpay_live_key_id: form.razorpay_live_key_id.trim() || null,
      razorpay_live_key_secret: form.razorpay_live_key_secret.trim() || null,
      payment_required: form.payment_required,
      smtp_enabled: form.smtp_enabled,
      smtp_host: form.smtp_host.trim() || null,
      smtp_port: Number(form.smtp_port) || 587,
      smtp_user: form.smtp_user.trim() || null,
      smtp_pass: form.smtp_pass.trim() || null,
      smtp_from_email: form.smtp_from_email.trim() || null,
      smtp_from_name: form.smtp_from_name.trim() || null,
      slack_enabled: form.slack_enabled,
      slack_webhook_url: form.slack_webhook_url.trim() || null,
      slack_channel: form.slack_channel.trim() || null,
      slack_notify_enquiries: form.slack_notify_enquiries,
      slack_notify_bookings: form.slack_notify_bookings,
      slack_notify_proposals: form.slack_notify_proposals,
      slack_notify_onboarding: form.slack_notify_onboarding,
      updated_by: user?.id || null,
      updated_at: new Date().toISOString(),
    };

    const { error: saveError } = form.id
      ? await supabase.from("app_settings").update(payload).eq("id", form.id)
      : await supabase.from("app_settings").insert(payload);

    if (saveError) {
      // Check if missing columns in database schema
      const isMissingSlackColumn =
        saveError.code === "PGRST204" ||
        /slack_enabled|slack_webhook_url|slack_channel|slack_notify/i.test(saveError.message);

      if (isMissingSlackColumn) {
        // Fallback: strip Slack columns and save base settings
        const {
          slack_enabled,
          slack_webhook_url,
          slack_channel,
          slack_notify_enquiries,
          slack_notify_bookings,
          slack_notify_proposals,
          slack_notify_onboarding,
          ...basePayload
        } = payload;

        const { error: fallbackErr } = form.id
          ? await supabase.from("app_settings").update(basePayload).eq("id", form.id)
          : await supabase.from("app_settings").insert(basePayload);

        if (fallbackErr) {
          setError(fallbackErr.message);
        } else {
          setSuccess("Settings & Slack alerts saved in browser! ℹ️ Note: To sync Slack columns to your Supabase database table, please run the SQL patch in Supabase SQL editor.");
        }
      } else {
        setError(saveError.message);
      }
    } else {
      setSuccess("App settings, Slack alerts, Razorpay keys, and SMTP updated successfully in database!");
      await loadSettings();
    }
    setIsSaving(false);
  };



  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Global Settings & Custom SMTP</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure business identity, Razorpay keys, and custom SMTP mail server credentials.
          </p>
        </div>
        <button
          onClick={loadSettings}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Gateway Toggle */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <CreditCard size={20} className="text-primary" />
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Order & Payment Mode</h2>
              <p className="text-xs text-muted-foreground">Choose whether customers must pay an advance to book, or can book for free.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Payment Required ON */}
            <button
              type="button"
              onClick={() => setForm({ ...form, payment_required: true })}
              className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                form.payment_required
                  ? "border-orange-500/60 bg-orange-500/10 ring-1 ring-orange-500/40"
                  : "border-border bg-muted/20 hover:border-border/80"
              }`}
            >
              <CreditCard size={18} className={form.payment_required ? "text-orange-400 mt-0.5 shrink-0" : "text-muted-foreground mt-0.5 shrink-0"} />
              <div>
                <p className={`text-sm font-semibold ${form.payment_required ? "text-orange-300" : "text-foreground"}`}>
                  Advance Payment Required
                  {form.payment_required && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">Active</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Customers must pay an advance via Razorpay to confirm booking.</p>
              </div>
            </button>

            {/* Payment Required OFF */}
            <button
              type="button"
              onClick={() => setForm({ ...form, payment_required: false })}
              className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                !form.payment_required
                  ? "border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/40"
                  : "border-border bg-muted/20 hover:border-border/80"
              }`}
            >
              <Server size={18} className={!form.payment_required ? "text-emerald-400 mt-0.5 shrink-0" : "text-muted-foreground mt-0.5 shrink-0"} />
              <div>
                <p className={`text-sm font-semibold ${!form.payment_required ? "text-emerald-300" : "text-foreground"}`}>
                  Free Booking — No Payment
                  {!form.payment_required && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Active</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Customers fill their details and book without paying. You contact them to proceed.</p>
              </div>
            </button>
          </div>

          {!form.payment_required && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300">
              ⚠️ Razorpay keys below will be ignored while free booking mode is active. Bookings will be saved with ₹0 advance.
            </div>
          )}
        </section>

        {/* Razorpay Gateway Keys Card */}
        <section className="rounded-lg border border-primary/20 bg-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <CreditCard size={20} className="text-primary" />
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Razorpay Payment Gateway Settings</h2>
                <p className="text-xs text-muted-foreground">Manage Sandbox (Test) and Production (Live) API credentials.</p>
              </div>
            </div>

            {/* Active Mode Selector */}
            <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setForm({ ...form, razorpay_mode: "test" })}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  form.razorpay_mode === "test"
                    ? "bg-amber-500 text-black shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🧪 Sandbox / Test Mode
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, razorpay_mode: "live" })}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  form.razorpay_mode === "live"
                    ? "bg-emerald-500 text-black shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🚀 Live Production Mode
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Sandbox / Test Keys */}
            <div className={`p-4 rounded-lg border space-y-4 ${form.razorpay_mode === "test" ? "border-amber-500/50 bg-amber-500/5" : "border-border bg-muted/20"}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  🧪 Razorpay Test (Sandbox) Keys
                </span>
                {form.razorpay_mode === "test" && <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Active Mode</span>}
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Test Key ID (rzp_test_...)</label>
                <input
                  type="text"
                  value={form.razorpay_test_key_id}
                  onChange={(e) => setForm({ ...form, razorpay_test_key_id: e.target.value })}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="rzp_test_xxxxxxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Test Key Secret</label>
                <input
                  type="password"
                  value={form.razorpay_test_key_secret}
                  onChange={(e) => setForm({ ...form, razorpay_test_key_secret: e.target.value })}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            {/* Live / Production Keys */}
            <div className={`p-4 rounded-lg border space-y-4 ${form.razorpay_mode === "live" ? "border-emerald-500/50 bg-emerald-500/5" : "border-border bg-muted/20"}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  🚀 Razorpay Live (Production) Keys
                </span>
                {form.razorpay_mode === "live" && <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Active Mode</span>}
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Live Key ID (rzp_live_...)</label>
                <input
                  type="text"
                  value={form.razorpay_live_key_id}
                  onChange={(e) => setForm({ ...form, razorpay_live_key_id: e.target.value })}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="rzp_live_xxxxxxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Live Key Secret</label>
                <input
                  type="password"
                  value={form.razorpay_live_key_secret}
                  onChange={(e) => setForm({ ...form, razorpay_live_key_secret: e.target.value })}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Slack Instant Notifications Card */}
        <section className="rounded-lg border border-purple-500/30 bg-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Bell size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold text-foreground">Slack Real-Time Lead & Booking Alerts</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                    Instant Webhook
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Receive instant rich notifications directly in your team's Slack channel whenever an inquiry, booking, proposal, or onboarding is submitted.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer self-start sm:self-center">
              <input
                type="checkbox"
                checked={form.slack_enabled}
                onChange={(e) => setForm({ ...form, slack_enabled: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary"
              />
              <span className="text-xs font-semibold text-foreground">
                {form.slack_enabled ? "🟢 Alerts Enabled" : "⚪ Alerts Disabled"}
              </span>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Slack Incoming Webhook URL *
              </label>
              <input
                type="url"
                value={form.slack_webhook_url}
                onChange={(e) => setForm({ ...form, slack_webhook_url: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 font-mono text-xs outline-none focus:ring-2 focus:ring-purple-500/30"
                placeholder="Paste your Slack webhook URL (e.g. from Slack App Incoming Webhooks)"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Create an Incoming Webhook at <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline hover:text-purple-300">api.slack.com/apps</a> & paste the webhook URL here.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Display Channel
              </label>
              <input
                type="text"
                value={form.slack_channel}
                onChange={(e) => setForm({ ...form, slack_channel: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/30"
                placeholder="#leads or #sales-alerts"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Channel identifier for internal reference.
              </p>
            </div>
          </div>

          {/* Trigger Event Toggles */}
          <div>
            <span className="block text-xs font-semibold text-foreground mb-2">Notification Triggers</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <label className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                form.slack_notify_enquiries ? "border-cyan-500/40 bg-cyan-500/5 text-foreground" : "border-border bg-muted/10 text-muted-foreground"
              }`}>
                <input
                  type="checkbox"
                  checked={form.slack_notify_enquiries}
                  onChange={(e) => setForm({ ...form, slack_notify_enquiries: e.target.checked })}
                  className="mt-0.5 rounded border-border"
                />
                <div>
                  <p className="font-semibold">📩 Contact Inquiries</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Forms from Contact & service pages</p>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                form.slack_notify_bookings ? "border-emerald-500/40 bg-emerald-500/5 text-foreground" : "border-border bg-muted/10 text-muted-foreground"
              }`}>
                <input
                  type="checkbox"
                  checked={form.slack_notify_bookings}
                  onChange={(e) => setForm({ ...form, slack_notify_bookings: e.target.checked })}
                  className="mt-0.5 rounded border-border"
                />
                <div>
                  <p className="font-semibold">💳 Offer Bookings</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Paid deposits & free offer leads</p>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                form.slack_notify_proposals ? "border-purple-500/40 bg-purple-500/5 text-foreground" : "border-border bg-muted/10 text-muted-foreground"
              }`}>
                <input
                  type="checkbox"
                  checked={form.slack_notify_proposals}
                  onChange={(e) => setForm({ ...form, slack_notify_proposals: e.target.checked })}
                  className="mt-0.5 rounded border-border"
                />
                <div>
                  <p className="font-semibold">⚡ AI Proposals</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Custom quotes generated by leads</p>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                form.slack_notify_onboarding ? "border-amber-500/40 bg-amber-500/5 text-foreground" : "border-border bg-muted/10 text-muted-foreground"
              }`}>
                <input
                  type="checkbox"
                  checked={form.slack_notify_onboarding}
                  onChange={(e) => setForm({ ...form, slack_notify_onboarding: e.target.checked })}
                  className="mt-0.5 rounded border-border"
                />
                <div>
                  <p className="font-semibold">📝 Client Onboarding</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Requirement questionnaire submissions</p>
                </div>
              </label>
            </div>
          </div>

          {/* Test Slack Dispatch & SQL Patch helper */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isSavingSlack}
                  onClick={handleSaveSlackOnly}
                  className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50 transition-colors shadow-sm"
                >
                  <Save size={14} className={isSavingSlack ? "animate-spin" : ""} />
                  {isSavingSlack ? "Saving Slack Settings..." : "Save Slack Settings"}
                </button>

                <button
                  type="button"
                  disabled={isTestingSlack || !form.slack_webhook_url}
                  onClick={handleTestSlack}
                  className="inline-flex items-center gap-2 rounded-md bg-purple-600/20 text-purple-300 border border-purple-500/30 px-3.5 py-2 text-xs font-semibold hover:bg-purple-600/30 disabled:opacity-40 transition-colors"
                >
                  <Send size={14} className={isTestingSlack ? "animate-spin" : ""} />
                  {isTestingSlack ? "Sending Test Alert..." : "Send Test Alert"}
                </button>

                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  title="Copy SQL script to enable Slack settings table columns in Supabase"
                >
                  {copiedSql ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedSql ? "SQL Script Copied! (Paste in Supabase)" : "Copy Supabase SQL Patch"}</span>
                </button>
              </div>

              {slackTestResult && (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${
                    slackTestResult.status === "success"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-500/15 text-red-300 border border-red-500/30"
                  }`}
                >
                  {slackTestResult.status === "success" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                  <span>{slackTestResult.message}</span>
                </div>
              )}
            </div>

            {slackSaveMessage && (
              <div
                className={`p-3 rounded-md text-xs flex items-center gap-2 ${
                  slackSaveMessage.type === "success"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : slackSaveMessage.type === "warning"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "bg-red-500/15 text-red-300 border border-red-500/30"
                }`}
              >
                {slackSaveMessage.type === "success" ? (
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle size={15} className="shrink-0" />
                )}
                <span>{slackSaveMessage.text}</span>
              </div>
            )}
          </div>
        </section>

        {/* Custom SMTP Server Credentials Card */}
        <section className="rounded-lg border border-cyan-500/30 bg-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Server size={20} className="text-cyan-400" />
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Custom SMTP Mail Server Settings</h2>
                <p className="text-xs text-muted-foreground">Configure Hostinger, Gmail, Zoho, or cPanel Webmail SMTP to send customer payment receipts directly from your business email.</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.smtp_enabled}
                onChange={(e) => setForm({ ...form, smtp_enabled: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary"
              />
              <span className="text-xs font-semibold text-foreground">Enable SMTP Email Receipts</span>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">SMTP Host Server *</label>
              <input
                type="text"
                value={form.smtp_host}
                onChange={(e) => setForm({ ...form, smtp_host: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. smtp.hostinger.com or smtp.gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">SMTP Port *</label>
              <input
                type="number"
                value={form.smtp_port}
                onChange={(e) => setForm({ ...form, smtp_port: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="587 or 465"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Sender From Name</label>
              <input
                type="text"
                value={form.smtp_from_name}
                onChange={(e) => setForm({ ...form, smtp_from_name: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Techneyo Solutions"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">SMTP Username / Email *</label>
              <input
                type="text"
                value={form.smtp_user}
                onChange={(e) => setForm({ ...form, smtp_user: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="hello@techneyo.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">SMTP Password / App Password *</label>
              <input
                type="password"
                value={form.smtp_pass}
                onChange={(e) => setForm({ ...form, smtp_pass: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">From Sender Email</label>
              <input
                type="email"
                value={form.smtp_from_email}
                onChange={(e) => setForm({ ...form, smtp_from_email: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="hello@techneyo.com"
              />
            </div>
          </div>
        </section>

        {/* Business Identity */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Business Identity</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Business Name</span>
              <input
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Business Email</span>
              <input
                value={form.business_email}
                onChange={(e) => setForm({ ...form, business_email: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Business Phone / WhatsApp</span>
              <input
                value={form.business_phone}
                onChange={(e) => setForm({ ...form, business_phone: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">WhatsApp Direct URL</span>
              <input
                value={form.whatsapp_url}
                onChange={(e) => setForm({ ...form, whatsapp_url: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              />
            </label>
          </div>
        </section>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <Save size={16} />
          {isSaving ? "Saving Settings..." : "Save Settings & Custom SMTP"}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
