import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { isIndiaUser } from "@/lib/geo";

export type Currency = "INR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  currencySymbol: string;
  formatPrice: (
    inrAmount: number | null | undefined,
    customUsdAmount?: number | null | undefined,
    options?: { showPeriod?: boolean; billingPeriod?: string; fallback?: string }
  ) => string;
  getRawPrice: (
    inrAmount: number | null | undefined,
    customUsdAmount?: number | null | undefined
  ) => { amount: number; currency: Currency; symbol: string };
}

// Curated International Agency Tier Mapping (INR -> USD)
const CURATED_TIER_MAP: Record<number, number> = {
  499: 19,
  999: 29,
  1499: 45,
  1999: 59,
  2499: 75,
  2999: 89,
  3999: 119,
  4999: 149,
  6999: 199,
  9999: 299,
  14999: 399,
  19999: 549,
  24999: 699,
  29999: 849,
  39999: 1199,
  49999: 1499,
  74999: 2199,
  99999: 2999,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = "techneyo_currency";

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>("INR");

  useEffect(() => {
    // Clear any past manual toggle stored in localStorage from testing
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }

    // 1. Instant heuristic via Browser Timezone
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const isIndiaTimezone =
        timeZone.includes("Calcutta") ||
        timeZone.includes("Kolkata") ||
        timeZone.includes("Colombo");

      if (isIndiaTimezone) {
        setCurrencyState("INR");
      } else {
        setCurrencyState("USD");
      }
    } catch {
      setCurrencyState("INR");
    }

    // 2. High-precision async Geo-IP country verification
    isIndiaUser()
      .then((isIndia) => {
        setCurrencyState(isIndia ? "INR" : "USD");
      })
      .catch(() => {
        // Fallback remains timezone heuristic
      });
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
  };

  const toggleCurrency = () => {
    const next: Currency = currency === "INR" ? "USD" : "INR";
    setCurrencyState(next);
  };

  const getRawPrice = (
    inrAmount: number | null | undefined,
    customUsdAmount?: number | null | undefined
  ): { amount: number; currency: Currency; symbol: string } => {
    if (currency === "USD") {
      // Priority 1: User explicitly configured a custom USD price in admin
      if (customUsdAmount !== undefined && customUsdAmount !== null && Number(customUsdAmount) > 0) {
        return { amount: Number(customUsdAmount), currency: "USD", symbol: "$" };
      }
      // Priority 2: Curated Agency Tier mapping
      if (inrAmount !== undefined && inrAmount !== null) {
        const roundedInr = Math.round(Number(inrAmount));
        if (CURATED_TIER_MAP[roundedInr]) {
          return { amount: CURATED_TIER_MAP[roundedInr], currency: "USD", symbol: "$" };
        }
        // Priority 3: Conversion with clean rounding
        const rawConverted = Math.max(15, Math.round(roundedInr / 85 / 5) * 5);
        return { amount: rawConverted, currency: "USD", symbol: "$" };
      }
      return { amount: 0, currency: "USD", symbol: "$" };
    }

    // Default INR
    return {
      amount: inrAmount ? Number(inrAmount) : 0,
      currency: "INR",
      symbol: "Rs. ",
    };
  };

  const formatPrice = (
    inrAmount: number | null | undefined,
    customUsdAmount?: number | null | undefined,
    options?: { showPeriod?: boolean; billingPeriod?: string; fallback?: string }
  ): string => {
    const hasInr = inrAmount !== null && inrAmount !== undefined && Number(inrAmount) > 0;
    const hasUsd = customUsdAmount !== null && customUsdAmount !== undefined && Number(customUsdAmount) > 0;

    if (!hasInr && !hasUsd) {
      if (options && options.fallback !== undefined) {
        return options.fallback;
      }
      return "Custom";
    }

    const raw = getRawPrice(inrAmount, customUsdAmount);
    let formatted = "";

    if (raw.currency === "USD") {
      formatted = `$${raw.amount.toLocaleString("en-US")}`;
    } else {
      formatted = `Rs. ${raw.amount.toLocaleString("en-IN")}`;
    }

    if (options?.showPeriod && options?.billingPeriod === "monthly") {
      formatted += "/mo";
    }

    return formatted;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        currencySymbol: currency === "USD" ? "$" : "Rs.",
        formatPrice,
        getRawPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
