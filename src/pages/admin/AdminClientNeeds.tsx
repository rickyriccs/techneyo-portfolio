import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  Flame,
  Search,
  Filter,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
  Building2,
  Calendar,
  X,
  FileText,
  CreditCard,
  Copy,
  DollarSign,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchClientNeedsAssessments,
  updateClientNeedsStatus,
  buildAdminReplyWhatsAppUrl,
} from "@/lib/client-needs";
import { ClientNeedsAssessment, UrgencyLevel } from "@/types/client-needs";
import { supabase } from "@/lib/supabase";
import type { Offer } from "@/types/offer";

export default function AdminClientNeeds() {
  const [assessments, setAssessments] = useState<ClientNeedsAssessment[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Selected assessment for detail modal
  const [activeModalItem, setActiveModalItem] = useState<ClientNeedsAssessment | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);

  // Instant Invoice / Payment Link Generator State
  const [invoiceModalItem, setInvoiceModalItem] = useState<ClientNeedsAssessment | null>(null);
  const [invoiceAmount, setInvoiceAmount] = useState<string>("8999");
  const [invoiceCurrency, setInvoiceCurrency] = useState<"INR" | "USD">("INR");
  const [invoiceTitle, setInvoiceTitle] = useState<string>("");
  const [invoiceNotes, setInvoiceNotes] = useState<string>("");

  const openInvoiceModal = (item: ClientNeedsAssessment) => {
    const matched = offers.find((o) => o.id === item.recommended_offer_id);
    setInvoiceModalItem(item);
    setInvoiceTitle(matched?.title || `${item.industry_name || item.industry} Solution Package`);
    setInvoiceAmount(matched?.discount_price ? String(matched.discount_price) : "8999");
    setInvoiceCurrency("INR");
    setInvoiceNotes(`Target Timeline: ${item.timeline}. Core priority: ${item.bottleneck_title}`);
  };

  const getGeneratedPaymentUrl = () => {
    if (!invoiceModalItem) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://techneyo.com";
    const ref = `INV-${invoiceModalItem.id.slice(0, 8).toUpperCase()}`;
    const params = new URLSearchParams({
      title: invoiceTitle,
      amount: invoiceAmount,
      currency: invoiceCurrency,
      ref,
      name: invoiceModalItem.customer_name || "",
      phone: invoiceModalItem.customer_phone || "",
      email: invoiceModalItem.customer_email || "",
    });
    if (invoiceNotes) params.set("notes", invoiceNotes);
    return `${origin}/pay?${params.toString()}`;
  };

  const copyPaymentUrl = () => {
    const url = getGeneratedPaymentUrl();
    if (!url) return;
    navigator.clipboard.writeText(url);
    toast.success("Payment link copied to clipboard!");
  };

  const getInvoiceWhatsAppUrl = () => {
    if (!invoiceModalItem) return "";
    const phone = invoiceModalItem.customer_phone?.replace(/[^0-9]/g, "") || "";
    const name = invoiceModalItem.customer_name || "there";
    const url = getGeneratedPaymentUrl();
    const symbol = invoiceCurrency === "USD" ? "$" : "₹";

    const text = `Hello ${name}! 👋

Here is your customized digital solution invoice from *Techneyo Solutions*:

• *Package:* ${invoiceTitle}
• *Amount:* ${symbol}${invoiceAmount} (${invoiceCurrency})
• *Reference ID:* INV-${invoiceModalItem.id.slice(0, 8).toUpperCase()}

You can complete your secure online booking payment via UPI, Cards, or NetBanking directly using this link:
${url}

Our senior engineering team will begin your project onboarding immediately upon confirmation. Let us know if you have any questions!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [assessmentsData, offersRes] = await Promise.all([
        fetchClientNeedsAssessments(),
        supabase?.from("offers").select("id, title, starting_price, discount_price, slug") || { data: [] },
      ]);
      setAssessments(assessmentsData);
      if (offersRes?.data) {
        setOffers(offersRes.data as Offer[]);
      }
    } catch (err) {
      console.error("Error loading client needs data:", err);
      toast.error("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered assessments
  const filtered = useMemo(() => {
    return assessments.filter((item) => {
      // Urgency filter
      if (selectedUrgency !== "all" && item.urgency_level !== selectedUrgency) {
        return false;
      }
      // Status filter
      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false;
      }
      // Text search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = item.customer_name?.toLowerCase().includes(query);
        const matchBusiness = item.business_name?.toLowerCase().includes(query);
        const matchPhone = item.customer_phone?.toLowerCase().includes(query);
        const matchIndustry = item.industry_name?.toLowerCase().includes(query) || item.industry.toLowerCase().includes(query);
        const matchBottleneck = item.bottleneck_title?.toLowerCase().includes(query);
        return matchName || matchBusiness || matchPhone || matchIndustry || matchBottleneck;
      }
      return true;
    });
  }, [assessments, search, selectedUrgency, selectedStatus]);

  // Status update handler
  const handleStatusChange = async (id: string, newStatus: ClientNeedsAssessment["status"]) => {
    const ok = await updateClientNeedsStatus(id, newStatus);
    if (ok) {
      setAssessments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (activeModalItem?.id === id) {
        setActiveModalItem({ ...activeModalItem, status: newStatus });
      }
      toast.success(`Status updated to ${newStatus}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  // Notes save handler
  const handleSaveNotes = async () => {
    if (!activeModalItem) return;
    setIsUpdatingNotes(true);
    const ok = await updateClientNeedsStatus(activeModalItem.id, activeModalItem.status, adminNotes);
    if (ok) {
      setAssessments((prev) =>
        prev.map((item) => (item.id === activeModalItem.id ? { ...item, notes: adminNotes } : item))
      );
      setActiveModalItem({ ...activeModalItem, notes: adminNotes });
      toast.success("Admin notes saved");
    } else {
      toast.error("Failed to save notes");
    }
    setIsUpdatingNotes(false);
  };

  const openDetailModal = (item: ClientNeedsAssessment) => {
    setActiveModalItem(item);
    setAdminNotes(item.notes || "");
  };

  // Stats calculation
  const totalCount = assessments.length;
  const criticalCount = assessments.filter((a) => a.urgency_level === "Critical").length;
  const convertedCount = assessments.filter((a) => a.status === "Converted").length;
  const newCount = assessments.filter((a) => a.status === "New").length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Client Needs & Quiz Leads
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Diagnostic quiz submissions identifying exact client needs, urgency levels, and matched solutions.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Total Assessments</div>
          <div className="text-2xl font-bold text-foreground mt-1">{totalCount}</div>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 shadow-sm">
          <div className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" />
            Critical Urgency
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{criticalCount}</div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm">
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400">New Leads</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{newCount}</div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-sm">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Converted Clients</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{convertedCount}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, phone, business, industry, or bottleneck..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Urgency:</span>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="Critical">🔴 Critical</option>
              <option value="Moderate">🟡 Moderate</option>
              <option value="Optimization">🟢 Optimization</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assessments Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No quiz assessments match your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-3.5 font-semibold">Client & Business</th>
                  <th className="p-3.5 font-semibold">Industry & Need</th>
                  <th className="p-3.5 font-semibold">Urgency & Score</th>
                  <th className="p-3.5 font-semibold">Timeline</th>
                  <th className="p-3.5 font-semibold">Recommended Offer</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => {
                  const matchedOffer = offers.find((o) => o.id === item.recommended_offer_id);
                  const isCritical = item.urgency_level === "Critical";
                  const isModerate = item.urgency_level === "Moderate";

                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      {/* Client Info */}
                      <td className="p-3.5">
                        <div className="font-semibold text-foreground text-sm">
                          {item.customer_name || "Anonymous Lead"}
                        </div>
                        {item.business_name && (
                          <div className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" />
                            {item.business_name}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          {item.customer_phone ? (
                            <a
                              href={`tel:${item.customer_phone}`}
                              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                            >
                              <Phone className="h-3 w-3" />
                              {item.customer_phone}
                            </a>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">No phone</span>
                          )}
                          {item.customer_email && (
                            <a
                              href={`mailto:${item.customer_email}`}
                              className="text-[11px] text-muted-foreground hover:text-foreground"
                            >
                              <Mail className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Industry & Need */}
                      <td className="p-3.5 max-w-xs">
                        <span className="inline-block rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-semibold mb-1">
                          {item.industry_name || item.industry}
                        </span>
                        <div className="font-medium text-foreground line-clamp-2">
                          {item.bottleneck_title || item.bottleneck}
                        </div>
                      </td>

                      {/* Urgency */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isCritical
                              ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                              : isModerate
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          <Flame className="h-3 w-3" />
                          {item.urgency_level} ({item.urgency_score}/100)
                        </span>
                      </td>

                      {/* Timeline */}
                      <td className="p-3.5 text-muted-foreground">
                        <div className="font-medium text-foreground">{item.timeline}</div>
                        <div className="text-[11px] mt-0.5">{item.digital_status}</div>
                      </td>

                      {/* Matched Offer */}
                      <td className="p-3.5 max-w-xs">
                        {matchedOffer ? (
                          <div className="font-medium text-foreground line-clamp-1">
                            {matchedOffer.title}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Standard Consultation</span>
                        )}
                      </td>

                      {/* Status Selector */}
                      <td className="p-3.5">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value as ClientNeedsAssessment["status"])
                          }
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Converted">Converted</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => openInvoiceModal(item)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                          title="Generate Instant Payment Link / Invoice"
                        >
                          <CreditCard className="h-4 w-4" />
                        </button>

                        {item.customer_phone && (
                          <a
                            href={buildAdminReplyWhatsAppUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="Reply on WhatsApp with tailored diagnosis"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        )}

                        <button
                          onClick={() => openDetailModal(item)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                          title="View complete diagnostic breakdown"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              <div>
                <span className="inline-block rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2">
                  Diagnostic Breakdown
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {activeModalItem.business_name || activeModalItem.customer_name || "Client"} Assessment
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Submitted on {new Date(activeModalItem.created_at || Date.now()).toLocaleString()}
                </p>
              </div>

              {/* Urgency Badge Alert */}
              <div
                className={`rounded-xl border p-4 ${
                  activeModalItem.urgency_level === "Critical"
                    ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-300"
                    : activeModalItem.urgency_level === "Moderate"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Urgency Rating: {activeModalItem.urgency_level}</span>
                  <span>{activeModalItem.urgency_score} / 100</span>
                </div>
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="text-muted-foreground uppercase text-[10px] font-semibold">Industry</div>
                  <div className="font-semibold text-foreground text-sm mt-0.5">
                    {activeModalItem.industry_name || activeModalItem.industry}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="text-muted-foreground uppercase text-[10px] font-semibold">Required Timeline</div>
                  <div className="font-semibold text-foreground text-sm mt-0.5">{activeModalItem.timeline}</div>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
                  <div className="text-muted-foreground uppercase text-[10px] font-semibold">Core Bottleneck</div>
                  <div className="font-semibold text-foreground text-sm mt-0.5">
                    {activeModalItem.bottleneck_title || activeModalItem.bottleneck}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
                  <div className="text-muted-foreground uppercase text-[10px] font-semibold">Digital Baseline Status</div>
                  <div className="font-semibold text-foreground text-sm mt-0.5">{activeModalItem.digital_status}</div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                <div className="text-xs font-semibold text-foreground">Contact Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="font-medium text-foreground">{activeModalItem.customer_name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>{" "}
                    <span className="font-medium text-foreground">{activeModalItem.customer_phone || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium text-foreground">{activeModalItem.customer_email || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Admin Notes Section */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Internal Admin Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record follow-up notes, package discussed, or custom quote details..."
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isUpdatingNotes}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Lead Status:</span>
                  <select
                    value={activeModalItem.status}
                    onChange={(e) =>
                      handleStatusChange(activeModalItem.id, e.target.value as ClientNeedsAssessment["status"])
                    }
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const item = activeModalItem;
                      setActiveModalItem(null);
                      openInvoiceModal(item);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700 transition-colors"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Create Payment Link
                  </button>
                  {activeModalItem.customer_phone && (
                    <a
                      href={buildAdminReplyWhatsAppUrl(activeModalItem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Reply on WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instant Payment Link & Invoice Generator Modal */}
      {invoiceModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setInvoiceModalItem(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-5">
              <div>
                <span className="inline-block rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2">
                  Instant Payment Link Generator
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  Create Invoice for {invoiceModalItem.customer_name || invoiceModalItem.business_name || "Client"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Generate a custom Razorpay payment link to dispatch directly via WhatsApp or email.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Invoice / Package Title</label>
                  <input
                    type="text"
                    value={invoiceTitle}
                    onChange={(e) => setInvoiceTitle(e.target.value)}
                    placeholder="e.g. High-Converting Website Sprint (50% Deposit)"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Currency</label>
                    <select
                      value={invoiceCurrency}
                      onChange={(e) => setInvoiceCurrency(e.target.value as "INR" | "USD")}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    >
                      <option value="INR">INR (₹ Rupees)</option>
                      <option value="USD">USD ($ US Dollar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Amount</label>
                    <input
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                      placeholder="8999"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Internal Notes / Scope Summary</label>
                  <textarea
                    rows={2}
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                    placeholder="e.g. Launch within 10 days, includes domain + hosting"
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none"
                  />
                </div>

                {/* Generated URL Box */}
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 space-y-2">
                  <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
                    <span>Generated Payment URL</span>
                    <button
                      onClick={copyPaymentUrl}
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-bold"
                    >
                      <Copy className="h-3 w-3" />
                      Copy Link
                    </button>
                  </div>
                  <div className="break-all font-mono text-[11px] text-muted-foreground bg-background/80 p-2 rounded border border-border">
                    {getGeneratedPaymentUrl()}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <button
                  onClick={copyPaymentUrl}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Link
                </button>

                <div className="flex items-center gap-2">
                  {invoiceModalItem.customer_phone ? (
                    <a
                      href={getInvoiceWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Send Invoice on WhatsApp
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Add phone to WhatsApp</span>
                  )}
                  <button
                    onClick={() => setInvoiceModalItem(null)}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
