import { FormEvent, useEffect, useState } from "react";
import { Edit, Plus, Trash2, X, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ServiceRow = {
  id: string;
  title: string;
  slug?: string;
  description: string;
  icon_name: string;
  features: string[];
  status: "active" | "inactive";
  display_order: number;
  starting_price?: number | null;
  starting_price_usd?: number | null;
  seo_title?: string;
  seo_description?: string;
  target_keywords?: string;
};

type ServiceForm = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  icon_name: string;
  featuresText: string;
  status: "active" | "inactive";
  display_order: number;
  starting_price: string;
  starting_price_usd: string;
  seo_title: string;
  seo_description: string;
  target_keywords: string;
};

const blankForm: ServiceForm = {
  title: "",
  slug: "",
  description: "",
  icon_name: "Globe",
  featuresText: "",
  status: "active",
  display_order: 0,
  starting_price: "",
  starting_price_usd: "",
  seo_title: "",
  seo_description: "",
  target_keywords: "",
};

const iconOptions = ["Globe", "MapPin", "MessageCircle", "Users", "Server", "Megaphone", "Brain", "Palette"];

const toForm = (service: ServiceRow): ServiceForm => ({
  id: service.id,
  title: service.title,
  slug: service.slug || "",
  description: service.description,
  icon_name: service.icon_name,
  featuresText: Array.isArray(service.features) ? service.features.join("\n") : "",
  status: service.status,
  display_order: service.display_order,
  starting_price: service.starting_price !== null && service.starting_price !== undefined ? String(service.starting_price) : "",
  starting_price_usd: service.starting_price_usd !== null && service.starting_price_usd !== undefined ? String(service.starting_price_usd) : "",
  seo_title: service.seo_title || "",
  seo_description: service.seo_description || "",
  target_keywords: service.target_keywords || "",
});

const AdminServices = () => {
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [form, setForm] = useState<ServiceForm>(blankForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadServices = async () => {
    if (!supabase) return;

    setIsLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("services")
      .select("id,title,slug,description,icon_name,features,status,display_order,starting_price,starting_price_usd,seo_title,seo_description,target_keywords")
      .order("display_order", { ascending: true });

    if (loadError) {
      setError(loadError.message);
    } else {
      setRows((data ?? []) as ServiceRow[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const resetForm = () => {
    setForm(blankForm);
    setIsEditing(false);
    setError("");
  };

  const handleTitleBlur = () => {
    if (!form.slug && form.title) {
      const generatedSlug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setForm((prev) => ({
        ...prev,
        slug: generatedSlug,
        seo_title: prev.seo_title || `${prev.title} Services in India | Techneyo Solutions`,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    setIsSaving(true);
    setError("");

    const finalSlug = (form.slug || form.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const payload = {
      title: form.title.trim(),
      slug: finalSlug,
      description: form.description.trim(),
      icon_name: form.icon_name,
      features: form.featuresText
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean),
      status: form.status,
      display_order: Number(form.display_order) || 0,
      starting_price: form.starting_price.trim() ? Number(form.starting_price) : null,
      starting_price_usd: form.starting_price_usd.trim() ? Number(form.starting_price_usd) : null,
      seo_title: form.seo_title.trim() || `${form.title} Services | Techneyo Solutions`,
      seo_description: form.seo_description.trim() || form.description.slice(0, 160),
      target_keywords: form.target_keywords.trim(),
    };

    const { error: saveError } = form.id
      ? await supabase.from("services").update(payload).eq("id", form.id)
      : await supabase.from("services").insert(payload);

    if (saveError) {
      setError(saveError.message);
    } else {
      resetForm();
      await loadServices();
    }
    setIsSaving(false);
  };

  const deleteService = async (service: ServiceRow) => {
    if (!supabase) return;
    const shouldDelete = window.confirm(`Delete "${service.title}"?`);
    if (!shouldDelete) return;

    const { error: deleteError } = await supabase.from("services").delete().eq("id", service.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setRows((current) => current.filter((row) => row.id !== service.id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Services & Dynamic SEO</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage dynamic services, URL slugs, and search keywords. Any changes update your dynamic sitemap and Google/Meta search previews immediately.
        </p>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            {isEditing ? "Edit Service & SEO Keywords" : "Add New Service & SEO Keywords"}
          </h2>
          {isEditing && (
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold">
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Service Title</span>
              <input
                required
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                onBlur={handleTitleBlur}
                placeholder="e.g. WhatsApp Automation for Business"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Icon</span>
              <select
                value={form.icon_name}
                onChange={(event) => setForm({ ...form, icon_name: event.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">URL Slug (Dynamic Path)</span>
              <input
                required
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="e.g. whatsapp-automation"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="mt-1 block text-xs text-muted-foreground">Will be accessible at: /services/{form.slug || "slug"}</span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Target SEO Keywords (Comma separated)</span>
              <input
                value={form.target_keywords}
                onChange={(event) => setForm({ ...form, target_keywords: event.target.value })}
                placeholder="e.g. whatsapp automation india, lead follow up chatbot, crm whatsapp"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="mt-1 block text-xs text-muted-foreground">Used for Google search matching & Meta scrapers</span>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Dynamic SEO Title</span>
              <input
                value={form.seo_title}
                onChange={(event) => setForm({ ...form, seo_title: event.target.value })}
                placeholder="Search result headline (50-60 chars)"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Dynamic SEO Meta Description</span>
              <input
                value={form.seo_description}
                onChange={(event) => setForm({ ...form, seo_description: event.target.value })}
                placeholder="Search result snippet (140-160 chars)"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>

          {/* Dual-Currency Starting Prices */}
          <div className="grid gap-4 md:grid-cols-2 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Starting Price (INR ₹)</span>
              <input
                type="number"
                value={form.starting_price}
                onChange={(event) => setForm({ ...form, starting_price: event.target.value })}
                placeholder="e.g. 14999"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="mt-1 block text-xs text-muted-foreground">Domestic INR display for India</span>
            </label>
            <label className="block">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-cyan-300">Starting Price (USD $)</span>
                <span className="text-[10px] text-cyan-400 font-semibold uppercase bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">Global Priority</span>
              </div>
              <input
                type="number"
                value={form.starting_price_usd}
                onChange={(event) => setForm({ ...form, starting_price_usd: event.target.value })}
                placeholder="e.g. 399"
                className="h-10 w-full rounded-md border border-cyan-500/40 bg-background px-3 text-sm font-bold text-cyan-300 outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
              <span className="mt-1 block text-xs text-slate-400">Takes priority for visitors outside India & AI search bots</span>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Public Description</span>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Features (One per line)</span>
            <textarea
              required
              rows={4}
              value={form.featuresText}
              onChange={(event) => setForm({ ...form, featuresText: event.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Instant Click-to-Chat&#10;CRM Lead Capture&#10;Auto Follow-up sequence"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Status (Controls Sitemap & Indexing)</span>
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as ServiceForm["status"] })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="active">Active (Indexed in Sitemap)</option>
                <option value="inactive">Inactive (Hidden from Sitemap)</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Display Order</span>
              <input
                type="number"
                value={form.display_order}
                onChange={(event) => setForm({ ...form, display_order: Number(event.target.value) })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>

          <button type="submit" disabled={isSaving} className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            <Plus size={16} />
            {isSaving ? "Saving..." : isEditing ? "Update Service & SEO" : "Add Service & SEO"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Slug & Keywords</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-6 text-muted-foreground">Loading services...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-muted-foreground">No services found.</td></tr>
              ) : (
                rows.map((service) => (
                  <tr key={service.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{service.title}</p>
                      <p className="mt-1 max-w-sm text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">
                        /services/{service.slug || "none"}
                      </code>
                      {service.target_keywords && (
                        <p className="mt-1 max-w-xs text-xs text-muted-foreground line-clamp-2">
                          🎯 {service.target_keywords}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        service.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{service.display_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setForm(toForm(service));
                            setIsEditing(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteService(service)}
                          className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminServices;
