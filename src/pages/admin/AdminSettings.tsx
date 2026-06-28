import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type SettingsRow = {
  id: string;
  coverage_text: string;
  service_area: string;
  location_based_offers_enabled: boolean;
  updated_at: string;
};

const AdminSettings = () => {
  const [settings, setSettings] = useState<SettingsRow | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      if (!supabase) return;

      const { data, error: loadError } = await supabase
        .from("app_settings")
        .select("id,coverage_text,service_area,location_based_offers_enabled,updated_at")
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (loadError) setError(loadError.message);
      else setSettings(data as SettingsRow);
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">All India service coverage and future location-based offer controls.</p>
      </div>

      {error && <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <section className="rounded-lg border border-border bg-card p-5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : !settings ? (
          <p className="text-sm text-muted-foreground">No settings row found.</p>
        ) : (
          <div className="grid gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service area</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{settings.service_area}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Coverage text</p>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-foreground">{settings.coverage_text}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location-based offers</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{settings.location_based_offers_enabled ? "Enabled" : "Disabled"}</p>
            </div>
            <p className="text-xs text-muted-foreground">Last updated: {new Date(settings.updated_at).toLocaleString()}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminSettings;
