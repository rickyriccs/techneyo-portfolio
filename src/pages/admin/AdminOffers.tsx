import { FormEvent, useEffect, useState } from "react";
import { Edit, Plus, Trash2, X, Sparkles, ShieldAlert, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "@/lib/admin-auth";
import type { Offer } from "@/types/offer";

type OfferForm = {
  id?: string;
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  offer_type: "Website Presence" | "Business Tool" | "Automation" | "Digital Growth" | "Custom";
  starting_price: string;
  discount_price: string;
  billing_period: "monthly" | "one-time" | "yearly";
  setup_fee: string;
  booking_amount: string;
  target_audience: string;
  whats_included: string;
  whats_not_included: string;
  update_policy: string;
  ownership_policy: string;
  terms: string;
  target_keywords: string;
  valid_from: string;
  valid_till: string;
  status: "Active" | "Inactive" | "Draft" | "Expired";
  is_featured: boolean;
  button_text: string;
  button_action: "Contact Form" | "WhatsApp" | "Call" | "Custom Link";
  button_url: string;
  display_order: number;
  seo_title: string;
  seo_description: string;
};

const blankForm: OfferForm = {
  title: "",
  slug: "",
  short_description: "",
  detailed_description: "",
  offer_type: "Website Presence",
  starting_price: "",
  discount_price: "",
  billing_period: "monthly",
  setup_fee: "",
  booking_amount: "",
  target_audience: "",
  whats_included: "",
  whats_not_included: "",
  update_policy: "",
  ownership_policy: "",
  terms: "",
  target_keywords: "",
  valid_from: "",
  valid_till: "",
  status: "Draft",
  is_featured: false,
  button_text: "Enquire Now",
  button_action: "Contact Form",
  button_url: "",
  display_order: 0,
  seo_title: "",
  seo_description: "",
};

const toForm = (offer: Offer): OfferForm => ({
  id: offer.id,
  title: offer.title || "",
  slug: offer.slug || "",
  short_description: offer.short_description || "",
  detailed_description: offer.detailed_description || "",
  offer_type: offer.offer_type || "Website Presence",
  starting_price: offer.starting_price !== null && offer.starting_price !== undefined ? String(offer.starting_price) : "",
  discount_price: offer.discount_price !== null && offer.discount_price !== undefined ? String(offer.discount_price) : "",
  billing_period: offer.billing_period || "monthly",
  setup_fee: offer.setup_fee !== null && offer.setup_fee !== undefined ? String(offer.setup_fee) : "",
  booking_amount: offer.booking_amount !== null && offer.booking_amount !== undefined ? String(offer.booking_amount) : "999",
  target_audience: offer.target_audience ? offer.target_audience.join(", ") : "",
  whats_included: offer.whats_included ? offer.whats_included.join("\n") : "",
  whats_not_included: offer.whats_not_included ? offer.whats_not_included.join("\n") : "",
  update_policy: offer.update_policy || "",
  ownership_policy: offer.ownership_policy || "",
  terms: offer.terms ? offer.terms.join("\n") : "",
  target_keywords: offer.target_keywords ? offer.target_keywords.join(", ") : "",
  valid_from: offer.valid_from ?? "",
  valid_till: offer.valid_till ?? "",
  status: offer.status || "Draft",
  is_featured: offer.is_featured || false,
  button_text: offer.button_text || "Book with ₹999 Advance",
  button_action: offer.button_action || "Contact Form",
  button_url: offer.button_url ?? "",
  display_order: offer.display_order || 0,
  seo_title: offer.seo_title ?? "",
  seo_description: offer.seo_description ?? "",
});

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export const AdminOffers = () => {
  const { user } = useAdminAuth();
  const [rows, setRows] = useState<Offer[]>([]);
  const [form, setForm] = useState<OfferForm>(blankForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadOffers = async () => {
    if (!supabase) return;

    setIsLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("offers")
      .select("*")
      .order("display_order", { ascending: true });

    if (loadError) {
      setError(loadError.message);
    } else {
      setRows((data ?? []) as Offer[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const resetForm = () => {
    setForm(blankForm);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: !prev.id ? generateSlug(val) : prev.slug,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug.trim() || generateSlug(form.title),
      short_description: form.short_description.trim(),
      detailed_description: form.detailed_description.trim() || null,
      offer_type: form.offer_type,
      starting_price: form.starting_price.trim() ? Number(form.starting_price) : null,
      discount_price: form.discount_price.trim() ? Number(form.discount_price) : null,
      billing_period: form.billing_period,
      setup_fee: form.setup_fee.trim() ? Number(form.setup_fee) : null,
      booking_amount: form.booking_amount.trim() ? Number(form.booking_amount) : 999,
      target_audience: form.target_audience ? form.target_audience.split(",").map((s) => s.trim()).filter(Boolean) : [],
      whats_included: form.whats_included ? form.whats_included.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      whats_not_included: form.whats_not_included ? form.whats_not_included.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      update_policy: form.update_policy.trim() || null,
      ownership_policy: form.ownership_policy.trim() || null,
      terms: form.terms ? form.terms.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      target_keywords: form.target_keywords ? form.target_keywords.split(",").map((s) => s.trim()).filter(Boolean) : [],
      valid_from: form.valid_from.trim() || null,
      valid_till: form.valid_till.trim() || null,
      status: form.status,
      is_featured: form.is_featured,
      button_text: form.button_text.trim(),
      button_action: form.button_action,
      button_url: form.button_action === "Custom Link" ? form.button_url.trim() || null : null,
      display_order: Number(form.display_order) || 0,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (form.id) {
      payload.updated_by = user?.id || null;
    } else {
      payload.created_by = user?.id || null;
      payload.updated_by = user?.id || null;
    }

    const { error: saveError } = form.id
      ? await supabase.from("offers").update(payload).eq("id", form.id)
      : await supabase.from("offers").insert(payload);

    if (saveError) {
      setError(saveError.message);
    } else {
      setSuccess(form.id ? "Offer updated successfully!" : "Offer created successfully!");
      resetForm();
      await loadOffers();
    }
    setIsSaving(false);
  };

  const deleteOffer = async (offer: Offer) => {
    if (!supabase) return;
    const shouldDelete = window.confirm(`Delete "${offer.title}"?`);
    if (!shouldDelete) return;

    setError("");
    setSuccess("");
    const { error: deleteError } = await supabase.from("offers").delete().eq("id", offer.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setSuccess("Offer deleted successfully!");
    setRows((current) => current.filter((row) => row.id !== offer.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Offers & Promotions Manager</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage high-conversion SEO landing offers, Razorpay advance deposits, and explicit Update/Ownership disclaimers.
          </p>
        </div>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">{success}</div>}

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">{isEditing ? "Edit offer" : "Add new offer"}</h2>
          {isEditing && (
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Title & Slug */}
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Offer Title *</span>
              <input
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. ₹299/Month – Basic Business Website Plan"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">URL Slug (SEO landing page) *</span>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="299-basic-business-website-plan"
              />
            </label>
          </div>

          {/* Pricing & Billing */}
          <div className="grid gap-4 md:grid-cols-4 rounded-lg border border-border p-4 bg-muted/20">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Billing Frequency</span>
              <select
                value={form.billing_period}
                onChange={(e) => setForm({ ...form, billing_period: e.target.value as any })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              >
                <option value="monthly">Monthly Subscription (/mo)</option>
                <option value="one-time">One-time Flat Fee</option>
                <option value="yearly">Yearly Subscription (/yr)</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Discounted Price (Rs.)</span>
              <input
                type="number"
                value={form.discount_price}
                onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm font-semibold text-emerald-400 outline-none"
                placeholder="299"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">One-time Setup Fee (Rs.)</span>
              <input
                type="number"
                value={form.setup_fee}
                onChange={(e) => setForm({ ...form, setup_fee: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
                placeholder="999"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Razorpay Advance Deposit (Rs.) *</span>
              <input
                type="number"
                required
                value={form.booking_amount}
                onChange={(e) => setForm({ ...form, booking_amount: e.target.value })}
                className="h-10 w-full rounded-md border border-amber-500/40 bg-background px-3 text-sm font-bold text-amber-400 outline-none"
                placeholder="999"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Short Summary Description *</span>
            <input
              required
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Perfect for visiting card websites, portfolios, business profiles, and local shops across India."
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Target Audience Tags (comma separated)</span>
            <input
              value={form.target_audience}
              onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              placeholder="Visiting Card, Portfolio, Business Profile, Local Businesses, Startups"
            />
          </label>

          {/* Side-by-side Inclusions & Exclusions */}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                <CheckCircle2 size={16} /> What's INCLUDED (One item per line)
              </span>
              <textarea
                rows={6}
                value={form.whats_included}
                onChange={(e) => setForm({ ...form, whats_included: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Professional Website (up to 5 pages)&#10;Mobile Responsive&#10;Free Hosting&#10;Free SSL Certificate"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-red-400">
                <X size={16} /> What's NOT INCLUDED (One item per line)
              </span>
              <textarea
                rows={6}
                value={form.whats_not_included}
                onChange={(e) => setForm({ ...form, whats_not_included: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500/20"
                placeholder="No Admin Panel&#10;No Login System&#10;No Free Content Updates&#10;All modifications are chargeable"
              />
            </label>
          </div>

          {/* Policy Disclaimers */}
          <div className="grid gap-4 md:grid-cols-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-amber-400">Update Policy Disclaimer *</span>
              <textarea
                rows={3}
                value={form.update_policy}
                onChange={(e) => setForm({ ...form, update_policy: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-cyan-400">Ownership Policy Disclaimer *</span>
              <textarea
                rows={3}
                value={form.ownership_policy}
                onChange={(e) => setForm({ ...form, ownership_policy: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Suggested Terms & Conditions (One per line)</span>
            <textarea
              rows={3}
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
              placeholder="Minimum subscription: 12 months&#10;One-time setup fee: ₹999&#10;Advance payment only"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Target SEO Keywords (comma separated for SERP ranking)</span>
            <input
              value={form.target_keywords}
              onChange={(e) => setForm({ ...form, target_keywords: e.target.value })}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              placeholder="299 per month website plan, basic business website India, low cost website offer"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Draft">Draft</option>
                <option value="Expired">Expired</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Display Order</span>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Valid From</span>
              <input
                type="date"
                value={form.valid_from}
                onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Valid Till</span>
              <input
                type="date"
                value={form.valid_till}
                onChange={(e) => setForm({ ...form, valid_till: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="is_featured"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-foreground cursor-pointer select-none">
              Featured (Highlight on Homepage)
            </label>
          </div>

          <button type="submit" disabled={isSaving} className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            <Plus size={16} />
            {isSaving ? "Saving..." : isEditing ? "Update Offer" : "Add Offer"}
          </button>
        </form>
      </section>

      {/* Offers Table */}
      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Offer Details</th>
                <th className="px-4 py-3 font-semibold">Slug & URL</th>
                <th className="px-4 py-3 font-semibold">Prices</th>
                <th className="px-4 py-3 font-semibold">Razorpay Deposit</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">Loading offers...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">No offers found.</td></tr>
              ) : (
                rows.map((offer) => (
                  <tr key={offer.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{offer.title}</p>
                      <p className="mt-1 max-w-xs text-xs text-muted-foreground line-clamp-2">{offer.short_description}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-cyan-400">
                      /offers/{offer.slug || offer.id}
                    </td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">
                      <p className="font-semibold text-emerald-400">Rs. {offer.discount_price || offer.starting_price} {offer.billing_period === "monthly" ? "/mo" : ""}</p>
                      {offer.setup_fee && <p className="text-xs text-muted-foreground">+ Rs. {offer.setup_fee} setup</p>}
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-400 whitespace-nowrap">
                      Rs. {offer.booking_amount || offer.setup_fee || 999}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        offer.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"
                      }`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setForm(toForm(offer));
                            setIsEditing(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteOffer(offer)}
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

export default AdminOffers;
