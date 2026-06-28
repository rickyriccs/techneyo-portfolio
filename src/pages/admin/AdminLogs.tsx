import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type LogRow = {
  id: string;
  action_type: string;
  module_name: string;
  record_id: string | null;
  created_at: string;
};

const AdminLogs = () => {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRows = async () => {
      if (!supabase) return;

      const { data, error: loadError } = await supabase
        .from("activity_logs")
        .select("id,action_type,module_name,record_id,created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (loadError) setError(loadError.message);
      else setRows((data ?? []) as LogRow[]);
      setIsLoading(false);
    };

    loadRows();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Activity logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Recent admin and system activity from Supabase.</p>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">Module</th>
                <th className="px-4 py-3 font-semibold">Record</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">No logs found.</td></tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 font-semibold text-foreground">{row.action_type}</td>
                    <td className="px-4 py-3 text-foreground">{row.module_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.record_id || "-"}</td>
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

export default AdminLogs;
