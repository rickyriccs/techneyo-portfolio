import { useEffect, useState } from "react";
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
  lead_status: string;
  follow_up_date: string | null;
  created_at: string;
};

const statuses = ["New", "Contacted", "Follow-up", "Converted", "Rejected", "Closed"];

const AdminEnquiries = () => {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRows = async () => {
    if (!supabase) return;

    setIsLoading(true);
    setError("");
    let query = supabase
      .from("contact_enquiries")
      .select("id,name,phone,email,business_name,city,state,service_required,budget_range,lead_status,follow_up_date,created_at")
      .order("created_at", { ascending: false });

    if (statusFilter) {
      query = query.eq("lead_status", statusFilter);
    }

    const { data, error: loadError } = await query;
    if (loadError) {
      setError(loadError.message);
    } else {
      setRows((data ?? []) as Enquiry[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadRows();
  }, [statusFilter]);

  const updateStatus = async (id: string, leadStatus: string) => {
    if (!supabase) return;

    const { error: updateError } = await supabase.from("contact_enquiries").update({ lead_status: leadStatus }).eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setRows((current) => current.map((row) => (row.id === id ? { ...row, lead_status: leadStatus } : row)));
  };

  const filteredRows = rows.filter((row) => {
    const value = `${row.name} ${row.phone} ${row.email ?? ""} ${row.business_name ?? ""} ${row.city ?? ""} ${row.state ?? ""} ${row.service_required ?? ""}`.toLowerCase();
    return value.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Enquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">Search leads, filter by status, and update follow-up progress.</p>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_220px]">
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
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
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
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">Loading...</td></tr>
              ) : filteredRows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">No enquiries found.</td></tr>
              ) : (
                filteredRows.map((row) => (
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
                      <select
                        value={row.lead_status}
                        onChange={(event) => updateStatus(row.id, event.target.value)}
                        className="h-9 rounded-md border border-border bg-background px-2 text-sm outline-none"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
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
