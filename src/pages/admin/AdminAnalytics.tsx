import { useEffect, useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Calendar,
  Filter,
  ArrowUpRight,
  ExternalLink,
  Search,
  Sparkles,
  Zap,
  RefreshCw,
  Gift,
  BookOpen,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { supabase } from "@/lib/supabase";

export type AnalyticsEvent = {
  id: string;
  event_name: string;
  page_path: string;
  page_title?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  referrer?: string | null;
  device_type?: string | null;
  event_properties?: Record<string, unknown> | null;
  created_at: string;
};

// Fallback sample data if database table is newly initialized
const sampleEvents: AnalyticsEvent[] = [
  {
    id: "s1",
    event_name: "page_view",
    page_path: "/",
    page_title: "Techneyo Solutions | Modern Web Development",
    utm_source: "google",
    utm_medium: "organic",
    device_type: "mobile",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "s2",
    event_name: "page_view",
    page_path: "/offers/business-website-starting-999-month",
    page_title: "Business Website Starting ₹999/Month",
    utm_source: "instagram",
    utm_medium: "social",
    device_type: "mobile",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "s3",
    event_name: "whatsapp_click",
    page_path: "/offers/business-website-starting-999-month",
    page_title: "Business Website Starting ₹999/Month",
    utm_source: "instagram",
    utm_medium: "social",
    device_type: "mobile",
    created_at: new Date(Date.now() - 6800000).toISOString(),
  },
  {
    id: "s4",
    event_name: "page_view",
    page_path: "/blog/how-monthly-website-subscription-helps-small-businesses-grow",
    page_title: "How Monthly Website Subscriptions Help Small Businesses",
    utm_source: "google",
    utm_medium: "organic",
    device_type: "desktop",
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "s5",
    event_name: "proposal_modal_open",
    page_path: "/",
    page_title: "Techneyo Solutions",
    utm_source: "direct",
    device_type: "desktop",
    created_at: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: "s6",
    event_name: "page_view",
    page_path: "/services/website-development",
    page_title: "Website Development Services",
    utm_source: "google",
    utm_medium: "organic",
    device_type: "desktop",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "s7",
    event_name: "whatsapp_click",
    page_path: "/services/website-development",
    page_title: "Website Development Services",
    utm_source: "google",
    utm_medium: "organic",
    device_type: "mobile",
    created_at: new Date(Date.now() - 90000000).toISOString(),
  },
];

const COLORS = ["#06b6d4", "#f97316", "#10b981", "#8b5cf6", "#ec4899", "#64748b"];

export const AdminAnalytics = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [dateRange, setDateRange] = useState<"today" | "7d" | "30d" | "all">("7d");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedDevice, setSelectedDevice] = useState("all");
  const [pathSearch, setPathSearch] = useState("");

  const loadEvents = async () => {
    setIsLoading(true);
    if (!supabase) {
      setEvents(sampleEvents);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        setEvents(sampleEvents);
      } else {
        setEvents(data as AnalyticsEvent[]);
      }
    } catch {
      setEvents(sampleEvents);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    let now = Date.now();
    let cutoff = 0;

    if (dateRange === "today") cutoff = now - 86400000;
    else if (dateRange === "7d") cutoff = now - 7 * 86400000;
    else if (dateRange === "30d") cutoff = now - 30 * 86400000;

    return events.filter((e) => {
      const eventTime = new Date(e.created_at).getTime();
      if (cutoff > 0 && eventTime < cutoff) return false;

      if (selectedEventType !== "all" && e.event_name !== selectedEventType) return false;

      if (selectedSource !== "all") {
        const src = (e.utm_source || "direct").toLowerCase();
        if (!src.includes(selectedSource.toLowerCase())) return false;
      }

      if (selectedDevice !== "all") {
        const dev = (e.device_type || "desktop").toLowerCase();
        if (dev !== selectedDevice.toLowerCase()) return false;
      }

      if (pathSearch.trim()) {
        const q = pathSearch.toLowerCase();
        if (!e.page_path.toLowerCase().includes(q)) return false;
      }

      return true;
    });
  }, [events, dateRange, selectedEventType, selectedSource, selectedDevice, pathSearch]);

  // KPI Calculations
  const totalEvents = filteredEvents.length;
  const pageViews = filteredEvents.filter((e) => e.event_name === "page_view").length;
  const whatsappClicks = filteredEvents.filter((e) => e.event_name === "whatsapp_click").length;
  const proposalOpens = filteredEvents.filter((e) => e.event_name === "proposal_modal_open").length;
  const totalConversions = whatsappClicks + proposalOpens;
  const conversionRate = totalEvents > 0 ? ((totalConversions / totalEvents) * 100).toFixed(1) : "0";

  // Trend Chart Data (Group by Date)
  const trendData = useMemo(() => {
    const map: Record<string, { date: string; pageViews: number; conversions: number }> = {};

    filteredEvents.forEach((e) => {
      const dateStr = new Date(e.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!map[dateStr]) {
        map[dateStr] = { date: dateStr, pageViews: 0, conversions: 0 };
      }
      if (e.event_name === "page_view") {
        map[dateStr].pageViews += 1;
      } else if (e.event_name === "whatsapp_click" || e.event_name === "proposal_modal_open") {
        map[dateStr].conversions += 1;
      }
    });

    const result = Object.values(map);
    return result.length ? result.reverse() : [{ date: "Today", pageViews: 0, conversions: 0 }];
  }, [filteredEvents]);

  // Traffic Source Distribution Data
  const sourceData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEvents.forEach((e) => {
      let src = (e.utm_source || "direct").toLowerCase();
      if (src.includes("google")) src = "Google Organic";
      else if (src.includes("instagram")) src = "Instagram";
      else if (src.includes("whatsapp")) src = "WhatsApp";
      else if (src === "direct" || !src) src = "Direct";
      else src = "Other / Referral";

      map[src] = (map[src] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredEvents]);

  // Device Breakdown Data
  const deviceData = useMemo(() => {
    const map: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0 };
    filteredEvents.forEach((e) => {
      const dev = (e.device_type || "desktop").toLowerCase();
      if (dev === "mobile") map.Mobile += 1;
      else if (dev === "tablet") map.Tablet += 1;
      else map.Desktop += 1;
    });

    return [
      { name: "Mobile", count: map.Mobile },
      { name: "Desktop", count: map.Desktop },
      { name: "Tablet", count: map.Tablet },
    ];
  }, [filteredEvents]);

  // Top Pages Data
  const topPagesData = useMemo(() => {
    const map: Record<string, { path: string; views: number; conversions: number }> = {};
    filteredEvents.forEach((e) => {
      if (!map[e.page_path]) {
        map[e.page_path] = { path: e.page_path, views: 0, conversions: 0 };
      }
      if (e.event_name === "page_view") {
        map[e.page_path].views += 1;
      } else {
        map[e.page_path].conversions += 1;
      }
    });

    return Object.values(map)
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Analytics & Activity Intelligence
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor real-time visitor interactions, UTM campaign attribution, and conversion funnels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadEvents}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Page Views */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Pageviews
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
              <Eye size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground">{pageViews}</span>
            <span className="text-xs text-muted-foreground">views</span>
          </div>
        </div>

        {/* Total Conversions */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              High-Intent Actions
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Zap size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-emerald-600">
              {totalConversions}
            </span>
            <span className="text-xs text-muted-foreground">clicks & leads</span>
          </div>
        </div>

        {/* WhatsApp Enquiries */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              WhatsApp CTA Clicks
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <MessageCircle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground">
              {whatsappClicks}
            </span>
            <span className="text-xs text-muted-foreground">inquiries</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Action Conversion Rate
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-purple-600">{conversionRate}%</span>
            <span className="text-xs text-muted-foreground">of active sessions</span>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Date Range */}
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            {(["today", "7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`rounded-md px-3 py-1 text-xs font-semibold uppercase transition-all ${
                  dateRange === r
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "all" ? "All" : r}
              </button>
            ))}
          </div>

          {/* Event Type Filter */}
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Event: All Activity</option>
            <option value="page_view">Page Views Only</option>
            <option value="whatsapp_click">WhatsApp Clicks</option>
            <option value="proposal_modal_open">Proposal Opens</option>
            <option value="offer_view">Offer Views</option>
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Source: All Channels</option>
            <option value="google">Google Search</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp Direct</option>
            <option value="direct">Direct Traffic</option>
          </select>

          {/* Device Filter */}
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Device: All Devices</option>
            <option value="mobile">Mobile Phones</option>
            <option value="desktop">Desktop / Laptops</option>
            <option value="tablet">Tablets</option>
          </select>

          {/* Page Path Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by URL path (e.g. /offers)..."
              value={pathSearch}
              onChange={(e) => setPathSearch(e.target.value)}
              className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <strong>{filteredEvents.length}</strong> events
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Trend Area Chart (8 Columns) */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Activity & Trend Timeline</h3>
              <p className="text-xs text-muted-foreground">Daily pageviews and conversion actions</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> Page Views
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Conversions
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#090d16",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="pageViews" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                <Area type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorConv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Donut (4 Columns) */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-4 shadow-sm">
          <h3 className="font-display text-base font-bold text-foreground">Traffic Channels</h3>
          <p className="text-xs text-muted-foreground mb-2">Acquisition by UTM source & referrer</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#090d16",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 justify-center text-[11px]">
            {sourceData.map((s, idx) => (
              <span key={s.name} className="flex items-center gap-1 text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                {s.name}: <strong>{s.value}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Pages & Live Activity Stream */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Top Visited Content Table (7 Columns) */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-7 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Top Visited Pages & Offers</h3>
              <p className="text-xs text-muted-foreground">Ranked by pageviews and conversion intent</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="pb-2">Page URL</th>
                  <th className="pb-2 text-right">Views</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topPagesData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-muted-foreground">
                      No page activity recorded yet.
                    </td>
                  </tr>
                ) : (
                  topPagesData.map((p) => (
                    <tr key={p.path} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 font-mono text-foreground font-medium flex items-center gap-1.5 max-w-[260px] truncate">
                        <a href={p.path} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                          {p.path} <ExternalLink size={11} className="text-muted-foreground" />
                        </a>
                      </td>
                      <td className="py-2.5 text-right font-semibold text-foreground">{p.views}</td>
                      <td className="py-2.5 text-right font-semibold text-emerald-600">{p.conversions}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Real-time Activity Feed (5 Columns) */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Activity Feed
              </h3>
              <span className="text-[11px] text-muted-foreground">Latest 6 events</span>
            </div>

            <div className="space-y-2.5">
              {filteredEvents.slice(0, 6).map((e) => (
                <div key={e.id} className="rounded-lg border border-border bg-background p-2.5 text-xs flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          e.event_name === "whatsapp_click"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : e.event_name === "proposal_modal_open"
                            ? "bg-purple-500/15 text-purple-600"
                            : "bg-cyan-500/15 text-cyan-600"
                        }`}
                      >
                        {e.event_name.replace(/_/g, " ")}
                      </span>
                      <span className="text-muted-foreground text-[11px] font-mono truncate max-w-[140px]">
                        {e.page_path}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-2">
                      <span>Source: {e.utm_source || "direct"}</span>
                      <span>•</span>
                      <span>Device: {e.device_type || "desktop"}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                    {new Date(e.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
