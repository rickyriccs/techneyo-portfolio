import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type ResourceType = "offers" | "packages" | "tools";

type ResourceConfig = {
  title: string;
  description: string;
  table: string;
  columns: string;
  orderColumn: string;
  headers: string[];
  mapRow: (row: Record<string, unknown>) => string[];
};

const configs: Record<ResourceType, ResourceConfig> = {
  offers: {
    title: "Offers",
    description: "Website offers and promotional CTAs controlled from the admin panel.",
    table: "offers",
    columns: "id,title,offer_type,discount_price,status,is_featured,display_order",
    orderColumn: "display_order",
    headers: ["Title", "Type", "Price", "Status", "Featured", "Order"],
    mapRow: (row) => [
      String(row.title ?? ""),
      String(row.offer_type ?? ""),
      row.discount_price ? `Rs. ${row.discount_price}` : "-",
      String(row.status ?? ""),
      row.is_featured ? "Yes" : "No",
      String(row.display_order ?? "0"),
    ],
  },
  packages: {
    title: "Packages",
    description: "Website and digital presence packages available on the site.",
    table: "service_packages",
    columns: "id,name,category,offer_price,status,is_recommended,display_order",
    orderColumn: "display_order",
    headers: ["Name", "Category", "Offer price", "Status", "Recommended", "Order"],
    mapRow: (row) => [
      String(row.name ?? ""),
      String(row.category ?? ""),
      row.offer_price ? `Rs. ${row.offer_price}` : "-",
      String(row.status ?? ""),
      row.is_recommended ? "Yes" : "No",
      String(row.display_order ?? "0"),
    ],
  },
  tools: {
    title: "Tools",
    description: "Digital tools, automation services, and business workflow modules.",
    table: "digital_tools",
    columns: "id,name,business_use_case,starting_price,status,cta_type,display_order",
    orderColumn: "display_order",
    headers: ["Name", "Use case", "Starting price", "Status", "CTA", "Order"],
    mapRow: (row) => [
      String(row.name ?? ""),
      String(row.business_use_case ?? ""),
      row.starting_price ? `Rs. ${row.starting_price}` : "-",
      String(row.status ?? ""),
      String(row.cta_type ?? ""),
      String(row.display_order ?? "0"),
    ],
  },
};

const AdminResourceList = ({ type }: { type: ResourceType }) => {
  const config = useMemo(() => configs[type], [type]);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRows = async () => {
      if (!supabase) return;

      setIsLoading(true);
      setError("");
      const { data, error: loadError } = await supabase
        .from(config.table)
        .select(config.columns)
        .order(config.orderColumn, { ascending: true });

      if (loadError) {
        setError(loadError.message);
      } else {
        setRows((data ?? []) as Record<string, unknown>[]);
      }
      setIsLoading(false);
    };

    loadRows();
  }, [config]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{config.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-60" disabled>
          Add {config.title.slice(0, -1)}
        </button>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {config.headers.map((header) => (
                  <th key={header} className="px-4 py-3 font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={config.headers.length} className="px-4 py-6 text-muted-foreground">Loading...</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={config.headers.length} className="px-4 py-6 text-muted-foreground">No records found.</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={String(row.id)} className="align-top">
                    {config.mapRow(row).map((value, index) => (
                      <td key={`${row.id}-${index}`} className="px-4 py-3 text-foreground first:font-semibold">
                        {value}
                      </td>
                    ))}
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

export default AdminResourceList;
