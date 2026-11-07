import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Filter,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  User,
  UserCheck,
  Users,
  Wifi,
  Crown,
  FileSpreadsheet,
  MessageSquare,
  Quote,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type VisitorRecord = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  business_name: string | null;
  city: string | null;
  state: string | null;
  service_required: string | null;
  message: string;
  source_page: string | null;
  admin_notes: string | null;
  lead_status: string;
  created_at: string;
};

const OFFICES = [
  { id: "all", name: "All Offices", badge: null },
  { id: "ludhiana", name: "Ludhiana", fullName: "Ludhiana (Head Office)", isHeadOffice: true },
  { id: "chandigarh", name: "Chandigarh", fullName: "Chandigarh Branch", isHeadOffice: false },
  { id: "delhi", name: "Delhi NCR", fullName: "Delhi NCR Branch", isHeadOffice: false },
];

const VISITOR_STATUSES = [
  { id: "new", label: "Checked In", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { id: "in_meeting", label: "In Meeting", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { id: "converted", label: "Meeting Done", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { id: "follow_up", label: "Follow-up Needed", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  { id: "closed", label: "Completed / Left", color: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
];

export const extractVisitorDetails = (message: string | null) => {
  if (!message) return { host: "Ricky / Team", clientRemarks: null };

  const lines = message.split("\n");
  let host = "Ricky / Team";
  let clientRemarks: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith("host requested:")) {
      host = trimmed.replace(/host requested:/i, "").trim();
    } else if (trimmed.toLowerCase().startsWith("notes / agenda:") || trimmed.toLowerCase().startsWith("notes:")) {
      const remark = trimmed.replace(/notes(\s*\/\s*agenda)?:\s*/i, "").trim();
      if (remark) clientRemarks = remark;
    }
  }

  // Fallback: If no structured "Notes / Agenda:" prefix was found, extract non-system text
  if (!clientRemarks) {
    const customLines = lines
      .filter(
        (l) =>
          !l.includes("🏢") &&
          !l.toLowerCase().startsWith("office:") &&
          !l.toLowerCase().startsWith("host requested:") &&
          !l.toLowerCase().startsWith("purpose:") &&
          !l.toLowerCase().startsWith("organization:") &&
          !l.toLowerCase().startsWith("check-in time:")
      )
      .map((l) => l.trim())
      .filter(Boolean);

    if (customLines.length > 0) {
      clientRemarks = customLines.join(" ");
    }
  }

  return { host, clientRemarks };
};

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState("ludhiana"); // Default to Ludhiana Head Office
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  const loadVisitors = useCallback(async () => {
    if (!supabase) return;
    setIsLoading(true);

    try {
      // Query contact_enquiries where source_page is /checkin or service_required starts with Office Visitor Check-in
      const { data, error } = await supabase
        .from("contact_enquiries")
        .select("id, name, phone, email, business_name, city, state, service_required, message, source_page, admin_notes, lead_status, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(`Failed to load visitors: ${error.message}`);
      } else {
        // Filter in memory for check-in submissions
        const filtered = (data || []).filter(
          (item: VisitorRecord) =>
            item.source_page === "/checkin" ||
            item.source_page === "/visitor-checkin" ||
            (item.service_required && item.service_required.toLowerCase().includes("visitor check-in")) ||
            (item.message && item.message.toLowerCase().includes("visitor check-in"))
        );
        setVisitors(filtered);
      }
    } catch (err: any) {
      toast.error(err.message || "Error fetching visitor log");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisitors();
  }, [loadVisitors]);

  // Office filtering
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      // Office match
      if (selectedOffice === "ludhiana") {
        const isLudhiana =
          !v.city ||
          v.city.toLowerCase().includes("ludhiana") ||
          (v.message && v.message.toLowerCase().includes("ludhiana"));
        if (!isLudhiana) return false;
      } else if (selectedOffice !== "all") {
        const matchesBranch =
          (v.city && v.city.toLowerCase().includes(selectedOffice.toLowerCase())) ||
          (v.message && v.message.toLowerCase().includes(selectedOffice.toLowerCase()));
        if (!matchesBranch) return false;
      }

      // Status match
      if (statusFilter !== "all" && v.lead_status !== statusFilter) {
        return false;
      }

      // Date match
      if (dateFilter !== "all") {
        const createdDate = new Date(v.created_at);
        const now = new Date();
        if (dateFilter === "today") {
          const isToday =
            createdDate.getDate() === now.getDate() &&
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear();
          if (!isToday) return false;
        } else if (dateFilter === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          if (createdDate < weekAgo) return false;
        }
      }

      // Search match
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesQuery =
          v.name.toLowerCase().includes(q) ||
          v.phone.toLowerCase().includes(q) ||
          (v.business_name && v.business_name.toLowerCase().includes(q)) ||
          (v.message && v.message.toLowerCase().includes(q)) ||
          (v.service_required && v.service_required.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [visitors, selectedOffice, statusFilter, dateFilter, search]);

  // Counts
  const stats = useMemo(() => {
    const now = new Date();
    const todayVisitors = filteredVisitors.filter((v) => {
      const d = new Date(v.created_at);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });

    const inMeeting = filteredVisitors.filter((v) => v.lead_status === "in_meeting" || v.lead_status === "new");
    const followUps = filteredVisitors.filter((v) => v.lead_status === "follow_up");

    return {
      total: filteredVisitors.length,
      today: todayVisitors.length,
      active: inMeeting.length,
      followUps: followUps.length,
    };
  }, [filteredVisitors]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from("contact_enquiries").update({ lead_status: newStatus }).eq("id", id);
      if (error) throw error;
      setVisitors((prev) => prev.map((v) => (v.id === id ? { ...v, lead_status: newStatus } : v)));
      toast.success(`Visitor status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleSaveNotes = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from("contact_enquiries").update({ admin_notes: tempNotes }).eq("id", id);
      if (error) throw error;
      setVisitors((prev) => prev.map((v) => (v.id === id ? { ...v, admin_notes: tempNotes } : v)));
      setEditingNotesId(null);
      toast.success("Visitor notes saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save notes");
    }
  };

  const handleExportCSV = () => {
    if (filteredVisitors.length === 0) {
      toast.error("No visitors to export");
      return;
    }

    const headers = [
      "Date & Time",
      "Name",
      "Phone",
      "Email",
      "Company",
      "Office",
      "Purpose",
      "Host Requested",
      "Client Remarks",
      "Status",
      "Admin Notes",
    ];
    const rows = filteredVisitors.map((v) => {
      const { host, clientRemarks } = extractVisitorDetails(v.message);
      return [
        new Date(v.created_at).toLocaleString("en-IN"),
        v.name,
        v.phone,
        v.email || "",
        v.business_name || "",
        v.city || "Ludhiana (Head Office)",
        v.service_required ? v.service_required.replace("Office Visitor Check-in:", "").trim() : "General Visit",
        host,
        (clientRemarks || "").replace(/"/g, '""'),
        v.lead_status,
        (v.admin_notes || "").replace(/"/g, '""'),
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TechNeyo-Visitors-${selectedOffice}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success("Visitor log exported to CSV");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Office Visitors</h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
              <Crown className="h-3 w-3 text-cyan-400" />
              Ludhiana (Head Office)
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage physical studio check-ins, guest Wi-Fi logs, and in-person meetings office-wise.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/checkin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Launch Public Check-in Screen</span>
          </Link>

          <button
            type="button"
            onClick={loadVisitors}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Office Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
          <Building2 className="h-3.5 w-3.5" /> Office:
        </span>
        {OFFICES.map((office) => {
          const isActive = selectedOffice === office.id;
          return (
            <button
              key={office.id}
              onClick={() => setSelectedOffice(office.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }`}
            >
              <span>{office.name}</span>
              {office.isHeadOffice && (
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-cyan-500/15 text-cyan-400"
                  }`}
                >
                  Head Office
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Today's Visits</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{stats.today}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Checked in today at {selectedOffice === "ludhiana" ? "Ludhiana" : "selected office"}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active in Studio</span>
            <Users className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-400">{stats.active}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Checked in or in meeting right now</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Follow-up Required</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-400">{stats.followUps}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Proposal / call to be made</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Visitors</span>
            <UserCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">All-time recorded entries</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search visitor name, phone, company, or host..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder-muted-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none transition focus:border-primary"
          >
            <option value="all">All Statuses</option>
            {VISITOR_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none transition focus:border-primary"
          >
            <option value="all">All Dates</option>
            <option value="today">Today Only</option>
            <option value="week">Past 7 Days</option>
          </select>
        </div>
      </div>

      {/* Visitor Log Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-primary" />
            <p className="mt-2">Loading visitor records...</p>
          </div>
        ) : filteredVisitors.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-3 text-base font-semibold text-foreground">No visitors recorded yet</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Visitors who check in via <span className="font-mono text-cyan-400">techneyo.com/checkin</span> will appear here in real-time.
            </p>
            <Link
              to="/checkin"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Test Check-in Form
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Visitor & Contact</th>
                  <th className="px-4 py-3 font-semibold">Purpose & Host</th>
                  <th className="px-4 py-3 font-semibold">Client Remarks / Agenda</th>
                  <th className="px-4 py-3 font-semibold">Office Location</th>
                  <th className="px-4 py-3 font-semibold">Check-in Time</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Internal Staff Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVisitors.map((v) => {
                  const cleanedPhone = v.phone.replace(/[^0-9]/g, "");
                  const whatsappPhone = cleanedPhone.startsWith("91") ? cleanedPhone : `91${cleanedPhone}`;
                  const isEditingNotes = editingNotesId === v.id;
                  const { host, clientRemarks } = extractVisitorDetails(v.message);

                  return (
                    <tr key={v.id} className="transition-colors hover:bg-muted/30">
                      {/* Name & Contact */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-foreground">{v.name}</div>
                        {v.business_name && (
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" />
                            {v.business_name}
                          </div>
                        )}
                        <div className="mt-1.5 flex items-center gap-2">
                          <a
                            href={`tel:${v.phone}`}
                            className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground hover:bg-muted/80"
                          >
                            <Phone className="h-3 w-3 text-cyan-400" />
                            {v.phone}
                          </a>
                          <a
                            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                              `Hi ${v.name}, thank you for visiting TechNeyo Studio today!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/20"
                          >
                            <MessageCircle className="h-3 w-3" />
                            WhatsApp
                          </a>
                        </div>
                      </td>

                      {/* Purpose & Host */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
                          {v.service_required ? v.service_required.replace("Office Visitor Check-in:", "").trim() : "General Visit"}
                        </span>
                        <div className="mt-1.5 text-[11px] text-muted-foreground">
                          Host: <span className="font-medium text-foreground">{host}</span>
                        </div>
                      </td>

                      {/* Client-Side Remarks / Agenda */}
                      <td className="px-4 py-3.5 max-w-[260px]">
                        {clientRemarks ? (
                          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/40 p-2.5 text-xs shadow-sm">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                              <MessageSquare className="h-3 w-3 shrink-0" />
                              <span>Client Remark</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-100 font-medium leading-relaxed whitespace-pre-wrap">
                              "{clientRemarks}"
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/50 italic">
                            No remarks submitted
                          </span>
                        )}
                      </td>

                      {/* Office */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground">
                          <Building2 className="h-3 w-3 text-cyan-400" />
                          {v.city || "Ludhiana (Head Office)"}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>
                            {new Date(v.created_at).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground/70">
                          {new Date(v.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <select
                          value={v.lead_status || "new"}
                          onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground outline-none transition focus:border-primary"
                        >
                          {VISITOR_STATUSES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Internal Staff Notes */}
                      <td className="px-4 py-3.5 min-w-[200px]">
                        {isEditingNotes ? (
                          <div className="space-y-1.5">
                            <textarea
                              rows={2}
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              placeholder="Add discussion summary..."
                              className="w-full rounded border border-border bg-background p-1.5 text-xs text-foreground outline-none focus:border-primary"
                            />
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSaveNotes(v.id)}
                                className="rounded bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingNotesId(null)}
                                className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingNotesId(v.id);
                              setTempNotes(v.admin_notes || "");
                            }}
                            className="cursor-pointer group flex items-start gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <span className="line-clamp-2 text-[11px]">
                              {v.admin_notes || <span className="italic text-muted-foreground/60">+ Click to add staff notes</span>}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
