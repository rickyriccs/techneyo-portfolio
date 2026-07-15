import { FormEvent, useEffect, useState } from "react";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "@/lib/admin-auth";

type OfferRow = {
  id: string;
  title: string;
  short_description: string;
  detailed_description: string | null;
  offer_type: "Website Presence" | "Business Tool" | "Automation" | "Digital Growth" | "Custom";
  starting_price: number | null;
  discount_price: number | null;
  valid_from: string | null;
  valid_till: string | null;
  status: "Active" | "Inactive" | "Draft" | "Expired";
  is_featured: boolean;
  button_text: string;
  button_action: "Contact Form" | "WhatsApp" | "Call" | "Custom Link";
  button_url: string | null;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
};

type OfferForm = {
  id?: string;
  title: string;
  short_description: string;
  detailed_description: string;
  offer_type: "Website Presence" | "Business Tool" | "Automation" | "Digital Growth" | "Custom";
  starting_price: string;
  discount_price: string;
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
  short_description: "",
  detailed_description: "",
  offer_type: "Website Presence",
  starting_price: "",
  discount_price: "",
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

const toForm = (offer: OfferRow): OfferForm => ({
  id: offer.id,
  title: offer.title,
  short_description: offer.short_description,
  detailed_description: offer.detailed_description ?? "",
  offer_type: offer.offer_type,
  starting_price: offer.starting_price !== null ? String(offer.starting_price) : "",
  discount_price: offer.discount_price !== null ? String(offer.discount_price) : "",
  valid_from: offer.valid_from ?? "",
  valid_till: offer.valid_till ?? "",
  status: offer.status,
  is_featured: offer.is_featured,
  button_text: offer.button_text,
  button_action: offer.button_action,
  button_url: offer.button_url ?? "",
  display_order: offer.display_order,
  seo_title: offer.seo_title ?? "",
  seo_description: offer.seo_description ?? "",
});

const AdminOffers = () => {
  const { user } = useAdminAuth();
  const [rows, setRows] = useState<OfferRow[]>([]);
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
      setRows((data ?? []) as OfferRow[]);
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      short_description: form.short_description.trim(),
      detailed_description: form.detailed_description.trim() || null,
      offer_type: form.offer_type,
      starting_price: form.starting_price.trim() ? Number(form.starting_price) : null,
      discount_price: form.discount_price.trim() ? Number(form.discount_price) : null,
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

  const deleteOffer = async (offer: OfferRow) => {
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
          <h1 className="font-display text-3xl font-bold text-foreground">Offers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage dynamic website offers and promotional campaign CTAs.</p>
        </div>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">{success}</div>}

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">{isEditing ? "Edit offer" : "Add offer"}</h2>
          {isEditing && (
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Offer Title *</span>
              <input
                required
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Website starts from Rs. 999"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Offer Type *</span>
              <select
                value={form.offer_type}
                onChange={(event) => setForm({ ...form, offer_type: event.target.value as OfferForm["offer_type"] })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Website Presence">Website Presence</option>
                <option value="Business Tool">Business Tool</option>
                <option value="Automation">Automation</option>
                <option value="Digital Growth">Digital Growth</option>
                <option value="Custom">Custom</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Starting Price (Rs.)</span>
              <input
                type="number"
                value={form.starting_price}
                onChange={(event) => setForm({ ...form, starting_price: event.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. 1999"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Discounted/Offer Price (Rs.)</span>
              <input
                type="number"
                value={form.discount_price}
                onChange={(event) => setForm({ ...form, discount_price: event.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. 999"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Short Description *</span>
            <input
              required
              value={form.short_description}
              onChange={(event) => setForm({ ...form, short_description: event.target.value })}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Launch a clean, mobile-friendly business website at an affordable starter price."
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Detailed Features / Description (One feature per line, shown as checklist bullets)</span>
            <textarea
              rows={4}
              value={form.detailed_description}
              onChange={(event) => setForm({ ...form, detailed_description: event.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g.&#10;One-page launch&#10;Mobile responsive&#10;WhatsApp CTA&#10;Basic SEO"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Button Text</span>
              <input
                value={form.button_text}
                onChange={(event) => setForm({ ...form, button_text: event.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Button Action</span>
              <select
                value={form.button_action}
                onChange={(event) => setForm({ ...form, button_action: event.target.value as OfferForm["button_action"] })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Contact Form">Contact Form</option>
                <option value="WhatsApp">WhatsApp Link</option>
                <option value="Call">Call Now</option>
                <option value="Custom Link">Custom URL Link</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Button URL (only for Custom Link)</span>
              <input
                value={form.button_url}
                disabled={form.button_action !== "Custom Link"}
                onChange={(event) => setForm({ ...form, button_url: event.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:bg-muted/30"
                placeholder="https://example.com/custom-promo"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as OfferForm["status"] })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
                onChange={(event) => setForm({ ...form, display_order: Number(event.target.value) })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Valid From</span>
              <input
                type="date"
                value={form.valid_from}
                onChange={(event) => setForm({ ...form, valid_from: event.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Valid Till</span>
              <input
                type="date"
                value={form.valid_till}
                onChange={(event) => setForm({ ...form, valid_till: event.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={form.is_featured}
              onChange={(event) => setForm({ ...form, is_featured: event.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-foreground cursor-pointer select-none">
              Featured (Show prominently on the homepage Offers Section)
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2 border-t border-border pt-4 mt-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">SEO Title Override</span>
              <input
                value={form.seo_title}
                onChange={(event) => setForm({ ...form, seo_title: event.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Special Discount on Custom Web Applications"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">SEO Description Override</span>
              <input
                value={form.seo_description}
                onChange={(event) => setForm({ ...form, seo_description: event.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Save 20% on custom admin panel or ecommerce setup today."
              />
            </label>
          </div>

          <button type="submit" disabled={isSaving} className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            <Plus size={16} />
            {isSaving ? "Saving..." : isEditing ? "Update Offer" : "Add Offer"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Offer Details</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Prices</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-6 text-muted-foreground">Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-6 text-muted-foreground">No offers found.</td></tr>
              ) : (
                rows.map((offer) => (
                  <tr key={offer.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{offer.title}</p>
                      <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">{offer.short_description}</p>
                      {offer.detailed_description && (
                        <div className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded max-h-20 overflow-y-auto">
                          <p className="font-medium mb-1">Features Checklist:</p>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {offer.detailed_description.split("\n").map((f, i) => <li key={i}>{f.trim()}</li>)}
                          </ul>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{offer.offer_type}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">
                      {offer.discount_price ? (
                        <div>
                          <p className="font-semibold text-emerald-400">Rs. {offer.discount_price}</p>
                          {offer.starting_price && <p className="text-xs text-muted-foreground line-through">Rs. {offer.starting_price}</p>}
                        </div>
                      ) : offer.starting_price ? (
                        <p>Rs. {offer.starting_price}</p>
                      ) : (
                        <span className="text-xs text-muted-foreground">Custom</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        offer.status === "Active" ? "bg-emerald-500/10 text-emerald-400" :
                        offer.status === "Draft" ? "bg-amber-500/10 text-amber-400" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{offer.display_order}</td>
                    <td className="px-4 py-3 text-foreground">{offer.is_featured ? "⭐ Yes" : "No"}</td>
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
