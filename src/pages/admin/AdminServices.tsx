import { FormEvent, useEffect, useState } from "react";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ServiceRow = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  features: string[];
  status: "active" | "inactive";
  display_order: number;
};

type ServiceForm = {
  id?: string;
  title: string;
  description: string;
  icon_name: string;
  featuresText: string;
  status: "active" | "inactive";
  display_order: number;
};

const blankForm: ServiceForm = {
  title: "",
  description: "",
  icon_name: "Globe",
  featuresText: "",
  status: "active",
  display_order: 0,
};

const iconOptions = ["Globe", "MapPin", "MessageCircle", "Users", "Server", "Megaphone", "Brain", "Palette"];

const toForm = (service: ServiceRow): ServiceForm => ({
  id: service.id,
  title: service.title,
  description: service.description,
  icon_name: service.icon_name,
  featuresText: service.features.join("\n"),
  status: service.status,
  display_order: service.display_order,
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
      .select("id,title,description,icon_name,features,status,display_order")
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    setIsSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      icon_name: form.icon_name,
      features: form.featuresText
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean),
      status: form.status,
      display_order: Number(form.display_order) || 0,
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
        <h1 className="font-display text-3xl font-bold text-foreground">Services</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage the dynamic services shown on the public `/services` page.</p>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">{isEditing ? "Edit service" : "Add service"}</h2>
          {isEditing && (
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold">
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Title</span>
              <input
                required
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
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

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Description</span>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Features</span>
            <textarea
              required
              rows={4}
              value={form.featuresText}
              onChange={(event) => setForm({ ...form, featuresText: event.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="One feature per line"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as ServiceForm["status"] })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Display order</span>
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
            {isSaving ? "Saving..." : isEditing ? "Update service" : "Add service"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Icon</th>
                <th className="px-4 py-3 font-semibold">Features</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">No services found.</td></tr>
              ) : (
                rows.map((service) => (
                  <tr key={service.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{service.title}</p>
                      <p className="mt-1 max-w-lg text-xs leading-5 text-muted-foreground">{service.description}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{service.icon_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{service.features.join(", ")}</td>
                    <td className="px-4 py-3 text-foreground">{service.status}</td>
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
