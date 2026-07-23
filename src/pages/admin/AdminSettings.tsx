import { FormEvent, useEffect, useState } from "react";
import { CreditCard, Save, Server, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "@/lib/admin-auth";

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
  smtp_enabled: boolean;
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass: string;
  smtp_from_email: string;
  smtp_from_name: string;
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
  smtp_enabled: true,
  smtp_host: "smtp.hostinger.com",
  smtp_port: "587",
  smtp_user: "hello@techneyo.com",
  smtp_pass: "",
  smtp_from_email: "hello@techneyo.com",
  smtp_from_name: "Techneyo Solutions",
};

export const AdminSettings = () => {
  const { user } = useAdminAuth();
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = async () => {
    if (!supabase) {
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
        smtp_enabled: data.smtp_enabled ?? true,
        smtp_host: data.smtp_host || defaultForm.smtp_host,
        smtp_port: data.smtp_port ? String(data.smtp_port) : defaultForm.smtp_port,
        smtp_user: data.smtp_user || "",
        smtp_pass: data.smtp_pass || "",
        smtp_from_email: data.smtp_from_email || "",
        smtp_from_name: data.smtp_from_name || defaultForm.smtp_from_name,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

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
      smtp_enabled: form.smtp_enabled,
      smtp_host: form.smtp_host.trim() || null,
      smtp_port: Number(form.smtp_port) || 587,
      smtp_user: form.smtp_user.trim() || null,
      smtp_pass: form.smtp_pass.trim() || null,
      smtp_from_email: form.smtp_from_email.trim() || null,
      smtp_from_name: form.smtp_from_name.trim() || null,
      updated_by: user?.id || null,
      updated_at: new Date().toISOString(),
    };

    const { error: saveError } = form.id
      ? await supabase.from("app_settings").update(payload).eq("id", form.id)
      : await supabase.from("app_settings").insert(payload);

    if (saveError) {
      setError(saveError.message);
    } else {
      setSuccess("App settings, Razorpay keys, and Custom SMTP credentials updated successfully!");
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
