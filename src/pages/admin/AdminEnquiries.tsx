import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  business_name: string | null;
  city: string | null;
  state: string | null;
  service_required: string | null;
  budget_range: string | null;
  message: string;
  source_page: string | null;
  source_page_url: string | null;
  landing_page_url: string | null;
  initial_referrer: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  device_type: string | null;
  user_agent: string | null;
  admin_notes: string | null;
  lead_status: string;
  follow_up_date: string | null;
  created_at: string;
};

const statuses = ["new", "contacted", "follow_up", "converted", "lost", "rejected", "closed"];
const statusLabel = (status: string) => status.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const legacyColumns = "id,name,phone,email,business_name,city,state,service_required,budget_range,message,source_page,user_agent,admin_notes,lead_status,follow_up_date,created_at";
const utmColumns = "utm_source,utm_medium,utm_campaign";
const leadTrackingColumns = "source_page_url,landing_page_url,initial_referrer,referrer,utm_term,utm_content,device_type";
const missingOptionalColumnPattern = /column .*contact_enquiries\.(utm_source|utm_medium|utm_campaign|source_page_url|landing_page_url|initial_referrer|referrer|utm_term|utm_content|device_type).* does not exist|utm_source|utm_medium|utm_campaign|source_page_url|landing_page_url|initial_referrer|referrer|utm_term|utm_content|device_type/i;

const isMissingOptionalColumnError = (error: { code?: string; message?: string } | null) =>
  Boolean(error?.message && (error.code === "PGRST204" || /does not exist/i.test(error.message)) && missingOptionalColumnPattern.test(error.message));

const normalizeEnquiry = (row: Partial<Enquiry>): Enquiry => ({
  id: row.id ?? "",
  name: row.name ?? "",
  phone: row.phone ?? "",
  email: row.email ?? null,
  business_name: row.business_name ?? null,
  city: row.city ?? null,
  state: row.state ?? null,
  service_required: row.service_required ?? null,
  budget_range: row.budget_range ?? null,
  message: row.message ?? "",
  source_page: row.source_page ?? null,
  source_page_url: row.source_page_url ?? null,
  landing_page_url: row.landing_page_url ?? null,
  initial_referrer: row.initial_referrer ?? null,
  referrer: row.referrer ?? null,
  utm_source: row.utm_source ?? null,
  utm_medium: row.utm_medium ?? null,
  utm_campaign: row.utm_campaign ?? null,
  utm_term: row.utm_term ?? null,
  utm_content: row.utm_content ?? null,
  device_type: row.device_type ?? null,
  user_agent: row.user_agent ?? null,
  admin_notes: row.admin_notes ?? null,
  lead_status: row.lead_status ?? "new",
  follow_up_date: row.follow_up_date ?? null,
  created_at: row.created_at ?? new Date().toISOString(),
});

const AdminEnquiries = () => {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRows = useCallback(async () => {
    if (!supabase) return;

    setIsLoading(true);
    setError("");
    const buildQuery = (columns: string) => {
      let query = supabase
        .from("contact_enquiries")
        .select(columns)
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("lead_status", statusFilter);
      }

      return query;
    };

    let { data, error: loadError } = await buildQuery(`${legacyColumns},${utmColumns},${leadTrackingColumns}`);

    if (isMissingOptionalColumnError(loadError)) {
      const fallback = await buildQuery(`${legacyColumns},${utmColumns}`);
      data = fallback.data;
      loadError = fallback.error;
    }

    if (isMissingOptionalColumnError(loadError)) {
      const fallback = await buildQuery(legacyColumns);
      data = fallback.data;
      loadError = fallback.error;
    }

    if (loadError) {
      setError(loadError.message);
    } else {
      setRows((data ?? []).map((row) => normalizeEnquiry(row as Partial<Enquiry>)));
    }
    setIsLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const updateStatus = async (id: string, leadStatus: string) => {
    if (!supabase) return;

    const { error: updateError } = await supabase.from("contact_enquiries").update({ lead_status: leadStatus }).eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setRows((current) => current.map((row) => (row.id === id ? { ...row, lead_status: leadStatus } : row)));
  };

  const updateNotes = async (id: string, adminNotes: string) => {
    if (!supabase) return;

    setRows((current) => current.map((row) => (row.id === id ? { ...row, admin_notes: adminNotes } : row)));
    const { error: updateError } = await supabase.from("contact_enquiries").update({ admin_notes: adminNotes }).eq("id", id);
    if (updateError) {
      setError(updateError.message);
    }
  };

  const filteredRows = rows.filter((row) => {
    const value = `${row.name} ${row.phone} ${row.email ?? ""} ${row.business_name ?? ""} ${row.city ?? ""} ${row.state ?? ""} ${row.service_required ?? ""} ${row.message ?? ""} ${row.utm_source ?? ""}`.toLowerCase();
    return value.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Enquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">Search leads, filter by status, and update follow-up progress.</p>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_180px_180px]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Search name, phone, email, city, service..."
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{statusLabel(status)}</option>
          ))}
        </select>
        <input
          value={sourceFilter}
          onChange={(event) => setSourceFilter(event.target.value)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Filter source/UTM"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Lead</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Budget</th>
                <th className="px-4 py-3 font-semibold">Message & notes</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={8} className="px-4 py-6 text-muted-foreground">Loading...</td></tr>
              ) : filteredRows.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-6 text-muted-foreground">No enquiries found.</td></tr>
              ) : (
                filteredRows
                  .filter((row) => {
                    if (!sourceFilter) return true;
                    const value = `${row.source_page ?? ""} ${row.source_page_url ?? ""} ${row.utm_source ?? ""} ${row.utm_medium ?? ""} ${row.utm_campaign ?? ""} ${row.referrer ?? ""}`.toLowerCase();
                    return value.includes(sourceFilter.toLowerCase());
                  })
                  .map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.phone}</p>
                      <p className="text-xs text-muted-foreground">{row.email || "No email"}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{[row.city, row.state].filter(Boolean).join(", ") || "-"}</td>
                    <td className="px-4 py-3 text-foreground">{row.service_required || "-"}</td>
                    <td className="px-4 py-3 text-foreground">{row.budget_range || "-"}</td>
                    <td className="px-4 py-3">
                      <p className="mb-2 max-w-[260px] whitespace-pre-line text-xs leading-5 text-muted-foreground">{row.message}</p>
                      <textarea
                        value={row.admin_notes || ""}
                        onChange={(event) => updateNotes(row.id, event.target.value)}
                        className="min-h-16 w-full rounded-md border border-border bg-background px-2 py-2 text-xs text-foreground outline-none"
                        placeholder="Admin notes"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={row.lead_status}
                        onChange={(event) => updateStatus(row.id, event.target.value)}
                        className="h-9 rounded-md border border-border bg-background px-2 text-sm outline-none"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{statusLabel(status)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p className="font-medium text-foreground">{row.source_page || "-"}</p>
                      <p className="mt-1 max-w-[220px] truncate text-xs">{row.source_page_url || "No source URL"}</p>
                      <p className="mt-1 text-xs">UTM: {[row.utm_source, row.utm_medium, row.utm_campaign].filter(Boolean).join(" / ") || "-"}</p>
                      <p className="mt-1 text-xs">Term/content: {[row.utm_term, row.utm_content].filter(Boolean).join(" / ") || "-"}</p>
                      <p className="mt-1 text-xs">Device: {row.device_type || "-"}</p>
                      <p className="mt-1 max-w-[220px] truncate text-xs">Landing: {row.landing_page_url || "-"}</p>
                      <p className="mt-1 max-w-[220px] truncate text-xs">Referrer: {row.referrer || row.initial_referrer || "-"}</p>
                      <p className="mt-1 max-w-[220px] truncate text-xs">{row.user_agent || "No user agent"}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(row.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;
