import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUserCountryInfo, saveUserCountryPreference, type CountryInfo } from "@/lib/geo";

export type Currency = "INR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  currencySymbol: string;
  countryInfo: CountryInfo | null;
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

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>("INR");
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);

  useEffect(() => {
    // 1. Instant check from localStorage
    try {
      const savedCurrency = localStorage.getItem("techneyo_currency");
      if (savedCurrency === "USD" || savedCurrency === "INR") {
        setCurrencyState(savedCurrency);
      }
    } catch {
      // ignore
    }

    // 2. High-precision country detection
    getUserCountryInfo().then((info) => {
      setCountryInfo(info);
      // Only set currency if user hasn't explicitly saved a preference in localStorage
      try {
        const saved = localStorage.getItem("techneyo_currency");
        if (!saved) {
          setCurrencyState(info.currency);
        }
      } catch {
        setCurrencyState(info.currency);
      }
    });
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    const countryCode = c === "INR" ? "IN" : (countryInfo?.countryCode === "IN" ? "US" : countryInfo?.countryCode || "US");
    saveUserCountryPreference(countryCode, c);
  };

  const toggleCurrency = () => {
    const next: Currency = currency === "INR" ? "USD" : "INR";
    setCurrency(next);
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
      symbol: "₹",
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
      formatted = `₹${raw.amount.toLocaleString("en-IN")}`;
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
        currencySymbol: currency === "USD" ? "$" : "₹",
        countryInfo,
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
