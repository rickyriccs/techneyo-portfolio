import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface AppSettings {
  payment_required: boolean; // true = Razorpay enabled, false = free/no-payment booking
  razorpay_mode: "test" | "live";
}

const defaultSettings: AppSettings = {
  payment_required: true,
  razorpay_mode: "test",
};

/**
 * Fetches global app settings (payment toggle, razorpay mode, etc.) from Supabase.
 * Returns sensible defaults while loading.
 */
export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      const { data } = await supabase
        .from("app_settings")
        .select("payment_required, razorpay_mode")
        .limit(1)
        .maybeSingle();

      if (data) {
        setSettings({
          payment_required: data.payment_required ?? true,
          razorpay_mode: data.razorpay_mode || "test",
        });
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  return { settings, isLoading };
};
