import { FormEvent, useEffect, useState, ChangeEvent } from "react";
import { Edit, Plus, Trash2, X, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Project = {
  project_name: string;
  project_status: "In Progress" | "Completed";
};

type ClientRow = {
  id: string;
  company_name: string;
  company_logo_url: string | null;
  company_description: string;
  company_website_url: string | null;
  projects: Project[];
  display_order: number;
};

type ClientForm = {
  id?: string;
  company_name: string;
  company_logo_url: string;
  company_description: string;
  company_website_url: string;
  projects: Project[];
  display_order: number;
};

const blankForm: ClientForm = {
  company_name: "",
  company_logo_url: "",
  company_description: "",
  company_website_url: "",
  projects: [],
  display_order: 0,
};

const AdminPortfolio = () => {
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [form, setForm] = useState<ClientForm>(blankForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sub-form state for adding a single project to the list
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState<"In Progress" | "Completed">("Completed");

  const loadClients = async () => {
    if (!supabase) return;

    setIsLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("portfolio_clients")
      .select("id,company_name,company_logo_url,company_description,company_website_url,projects,display_order")
      .order("display_order", { ascending: true });

    if (loadError) {
      setError(loadError.message);
    } else {
      // Cast the projects field to Project[] after fetching
      const formattedData = (data ?? []).map((row) => ({
        ...row,
        projects: Array.isArray(row.projects) ? (row.projects as Project[]) : [],
      }));
      setRows(formattedData as ClientRow[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const resetForm = () => {
    setForm(blankForm);
    setNewProjectName("");
    setNewProjectStatus("Completed");
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 500KB to keep base64 storage reasonable)
    if (file.size > 500 * 1024) {
      setError("Logo image file size should be less than 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target?.result as string;
      if (base64Url) {
        setForm((prev) => ({ ...prev, company_logo_url: base64Url }));
        setSuccess("Logo uploaded and converted successfully!");
        setError("");
      }
    };
    reader.onerror = () => {
      setError("Failed to read logo image file.");
    };
    reader.readAsDataURL(file);
  };

  const addProjectToForm = () => {
    if (!newProjectName.trim()) {
      setError("Project name cannot be empty.");
      return;
    }

    const project: Project = {
      project_name: newProjectName.trim(),
      project_status: newProjectStatus,
    };

    setForm((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));

    setNewProjectName("");
    setError("");
    setSuccess("Project added to list.");
  };

  const removeProjectFromForm = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== indexToRemove),
    }));
    setSuccess("Project removed from list.");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    if (!form.company_name.trim()) {
      setError("Company Name is required.");
      setIsSaving(false);
      return;
    }

    if (!form.company_description.trim()) {
      setError("Company Description is required.");
      setIsSaving(false);
      return;
    }

    const payload = {
      company_name: form.company_name.trim(),
      company_logo_url: form.company_logo_url.trim() || null,
      company_description: form.company_description.trim(),
      company_website_url: form.company_website_url.trim() || null,
      projects: form.projects,
      display_order: Number(form.display_order) || 0,
    };

    const { error: saveError } = form.id
      ? await supabase.from("portfolio_clients").update(payload).eq("id", form.id)
      : await supabase.from("portfolio_clients").insert(payload);

    if (saveError) {
      setError(saveError.message);
    } else {
      setSuccess(form.id ? "Client profile updated successfully!" : "Client profile created successfully!");
      setTimeout(() => {
        resetForm();
        loadClients();
      }, 1000);
    }
    setIsSaving(false);
  };

  const startEdit = (client: ClientRow) => {
    setForm({
      id: client.id,
      company_name: client.company_name,
      company_logo_url: client.company_logo_url ?? "",
      company_description: client.company_description,
      company_website_url: client.company_website_url ?? "",
      projects: [...client.projects],
      display_order: client.display_order,
    });
    setIsEditing(true);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteClient = async (client: ClientRow) => {
    if (!supabase) return;
    const shouldDelete = window.confirm(`Delete "${client.company_name}"?`);
    if (!shouldDelete) return;

    const { error: deleteError } = await supabase.from("portfolio_clients").delete().eq("id", client.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setSuccess(`Deleted "${client.company_name}"`);
    setRows((current) => current.filter((row) => row.id !== client.id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Clients & Portfolio</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage companies that have used Techneyo Solutions' services and their projects.</p>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">{success}</div>}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
        {/* CRUD Form */}
        <section className="rounded-lg border border-border bg-card p-5 h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">{isEditing ? "Edit client profile" : "Add client profile"}</h2>
            {isEditing && (
              <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
                <X size={16} /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Company Name *</span>
                <input
                  type="text"
                  required
                  value={form.company_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, company_name: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g. Acme Corporation"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Display Order</span>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="0"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Company Logo URL</span>
                <input
                  type="text"
                  value={form.company_logo_url}
                  onChange={(e) => setForm((prev) => ({ ...prev, company_logo_url: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="https://example.com/logo.png"
                />
              </label>

              <div className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Upload Logo Image (Base64 fallback)</span>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted">
                    <Upload size={16} /> Choose Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {form.company_logo_url && (
                    <div className="relative h-10 w-16 border rounded bg-white p-1 flex items-center justify-center">
                      <img src={form.company_logo_url} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, company_logo_url: "" }))}
                        className="absolute -right-2 -top-2 rounded-full bg-destructive p-0.5 text-white shadow hover:bg-destructive/80"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Company Website URL</span>
              <input
                type="url"
                value={form.company_website_url}
                onChange={(e) => setForm((prev) => ({ ...prev, company_website_url: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="https://example.com"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Company Description *</span>
              <textarea
                required
                rows={3}
                value={form.company_description}
                onChange={(e) => setForm((prev) => ({ ...prev, company_description: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Brief description of the client's business..."
              />
            </label>

            {/* Sub-form: Projects */}
            <div className="rounded-md border border-border bg-muted/30 p-4">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">Manage Works / Projects</h3>
              
              {/* Display existing projects in form */}
              {form.projects.length === 0 ? (
                <p className="text-xs text-muted-foreground mb-4">No projects listed yet. Added projects will show here.</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {form.projects.map((proj, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded border border-border bg-card p-2 text-sm">
                      <div>
                        <span className="font-medium text-foreground">{proj.project_name}</span>
                        <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          proj.project_status === "Completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}>
                          {proj.project_status}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProjectFromForm(idx)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add project controls */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <label className="flex-1">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Work/Project Name</span>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="e.g. E-Commerce Portal Upgrade"
                  />
                </label>

                <label className="w-full sm:w-[130px]">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Status</span>
                  <select
                    value={newProjectStatus}
                    onChange={(e) => setNewProjectStatus(e.target.value as "In Progress" | "Completed")}
                    className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={addProjectToForm}
                  className="inline-flex items-center justify-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-2 w-full rounded bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : isEditing ? "Update Client Profile" : "Create Client Profile"}
            </button>
          </form>
        </section>

        {/* Clients List */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Active Clients ({rows.length})</h2>
          
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading clients...</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No client profiles added yet.</p>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.id} className="rounded-lg border border-border bg-card p-4 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {row.company_logo_url ? (
                        <div className="h-10 w-16 border rounded bg-white p-1 flex items-center justify-center shrink-0">
                          <img src={row.company_logo_url} alt={row.company_name} className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-10 w-16 rounded bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground shrink-0 border">
                          {row.company_name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{row.company_name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Order: {row.display_order}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(row)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => deleteClient(row)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{row.company_description}</p>
                  
                  {row.projects.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {row.projects.slice(0, 3).map((proj, idx) => (
                        <span key={idx} className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {proj.project_name}
                        </span>
                      ))}
                      {row.projects.length > 3 && (
                        <span className="text-[10px] text-muted-foreground self-center">+{row.projects.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPortfolio;
