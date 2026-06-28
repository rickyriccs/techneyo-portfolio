import { useEffect, useState } from "react";
import { ArrowRight, FileText, Gift, Package, Users, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type DashboardCounts = {
  enquiries: number;
  newLeads: number;
  followUps: number;
  converted: number;
  closed: number;
  offers: number;
  packages: number;
  tools: number;
};

type RecentEnquiry = {
  id: string;
  name: string;
  phone: string;
  service_required: string | null;
  lead_status: string;
  created_at: string;
};

type RecentLog = {
  id: string;
  action_type: string;
  module_name: string;
  created_at: string;
};

const statCards = [
  { key: "enquiries", label: "Total enquiries", icon: FileText },
  { key: "newLeads", label: "New leads", icon: Users },
  { key: "followUps", label: "Follow-up leads", icon: Users },
  { key: "converted", label: "Converted", icon: Users },
  { key: "closed", label: "Closed/rejected", icon: Users },
  { key: "offers", label: "Active offers", icon: Gift },
  { key: "packages", label: "Active packages", icon: Package },
  { key: "tools", label: "Active tools", icon: Wrench },
] as const;

const getCount = async (table: string, filter?: { column: string; value: string | string[] }) => {
  if (!supabase) return 0;

  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) {
    query = Array.isArray(filter.value) ? query.in(filter.column, filter.value) : query.eq(filter.column, filter.value);
  }

  const { count } = await query;
  return count ?? 0;
};

const AdminDashboard = () => {
  const [counts, setCounts] = useState<DashboardCounts>({
    enquiries: 0,
    newLeads: 0,
    followUps: 0,
    converted: 0,
    closed: 0,
    offers: 0,
    packages: 0,
    tools: 0,
  });
  const [enquiries, setEnquiries] = useState<RecentEnquiry[]>([]);
  const [logs, setLogs] = useState<RecentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!supabase) return;

      const [
        enquiriesCount,
        newLeads,
        followUps,
        converted,
        closed,
        offers,
        packages,
        tools,
        recentEnquiries,
        recentLogs,
      ] = await Promise.all([
        getCount("contact_enquiries"),
        getCount("contact_enquiries", { column: "lead_status", value: "New" }),
        getCount("contact_enquiries", { column: "lead_status", value: "Follow-up" }),
        getCount("contact_enquiries", { column: "lead_status", value: "Converted" }),
        getCount("contact_enquiries", { column: "lead_status", value: ["Rejected", "Closed"] }),
        getCount("offers", { column: "status", value: "Active" }),
        getCount("service_packages", { column: "status", value: "active" }),
        getCount("digital_tools", { column: "status", value: "active" }),
        supabase.from("contact_enquiries").select("id,name,phone,service_required,lead_status,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("activity_logs").select("id,action_type,module_name,created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      setCounts({ enquiries: enquiriesCount, newLeads, followUps, converted, closed, offers, packages, tools });
      setEnquiries((recentEnquiries.data ?? []) as RecentEnquiry[]);
      setLogs((recentLogs.data ?? []) as RecentLog[]);
      setIsLoading(false);
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track leads, offers, packages, and recent admin activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <card.icon size={18} className="text-primary" />
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{isLoading ? "-" : counts[card.key]}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent enquiries</h2>
            <Link to="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {enquiries.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No enquiries yet.</p>
            ) : (
              enquiries.map((enquiry) => (
                <div key={enquiry.id} className="grid gap-1 p-4 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{enquiry.name}</p>
                    <p className="text-xs text-muted-foreground">{enquiry.phone} · {enquiry.service_required || "General"}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary">{enquiry.lead_status}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent logs</h2>
            <Link to="/admin/logs" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {logs.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No activity logs yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-4">
                  <p className="text-sm font-semibold text-foreground">{log.action_type}</p>
                  <p className="text-xs text-muted-foreground">{log.module_name} · {new Date(log.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
