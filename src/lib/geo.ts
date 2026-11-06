// Geo-IP and Country-Based Currency Detection Utility

export interface CountryInfo {
  countryCode: string;
  countryName: string;
  currency: "INR" | "USD";
  flagEmoji: string;
  currencySymbol: string;
}

let cachedCountryInfo: CountryInfo | null = null;

// Heuristic based on client timezone
function getTimezoneCountry(): { code: string; name: string; currency: "INR" | "USD"; flagEmoji: string } {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (
      timeZone.includes("Kolkata") ||
      timeZone.includes("Calcutta") ||
      timeZone.includes("Colombo")
    ) {
      return { code: "IN", name: "India", currency: "INR", flagEmoji: "🇮🇳" };
    }
    if (
      timeZone.includes("Toronto") ||
      timeZone.includes("Vancouver") ||
      timeZone.includes("Edmonton") ||
      timeZone.includes("Winnipeg") ||
      timeZone.includes("Halifax") ||
      timeZone.includes("St_Johns")
    ) {
      return { code: "CA", name: "Canada", currency: "USD", flagEmoji: "🇨🇦" };
    }
    if (timeZone.startsWith("America/")) {
      return { code: "US", name: "United States", currency: "USD", flagEmoji: "🇺🇸" };
    }
    if (timeZone.includes("London") || timeZone.startsWith("Europe/")) {
      return { code: "GB", name: "United Kingdom", currency: "USD", flagEmoji: "🇬🇧" };
    }
    if (timeZone.startsWith("Australia/")) {
      return { code: "AU", name: "Australia", currency: "USD", flagEmoji: "🇦🇺" };
    }
  } catch (err) {
    // ignore
  }

  // Global default: North America / USD
  return { code: "US", name: "United States", currency: "USD", flagEmoji: "🇺🇸" };
}

export async function getUserCountryInfo(): Promise<CountryInfo> {
  if (cachedCountryInfo) {
    return cachedCountryInfo;
  }

  // 1. Check if user has explicitly stored a preference
  try {
    const saved = localStorage.getItem("techneyo_country_info");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.countryCode && parsed.currency) {
        cachedCountryInfo = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // 2. High-speed client-side Geo-IP lookup via api.country.is
  try {
    const res = await fetch("https://api.country.is/", {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        const code = data.country.toUpperCase();
        const isIndia = code === "IN";
        cachedCountryInfo = {
          countryCode: code,
          countryName: isIndia ? "India" : code === "US" ? "United States" : code === "CA" ? "Canada" : code,
          currency: isIndia ? "INR" : "USD",
          flagEmoji: isIndia ? "🇮🇳" : code === "US" ? "🇺🇸" : code === "CA" ? "🇨🇦" : "🌐",
          currencySymbol: isIndia ? "₹" : "$",
        };
        return cachedCountryInfo;
      }
    }
  } catch {
    // Try fallback
  }

  // 3. Fallback Geo-IP lookup via ipwho.is
  try {
    const res = await fetch("https://ipwho.is/", {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.country_code) {
        const code = data.country_code.toUpperCase();
        const isIndia = code === "IN";
        cachedCountryInfo = {
          countryCode: code,
          countryName: data.country || code,
          currency: isIndia ? "INR" : "USD",
          flagEmoji: data.flag?.emoji || (isIndia ? "🇮🇳" : "🇺🇸"),
          currencySymbol: isIndia ? "₹" : "$",
        };
        return cachedCountryInfo;
      }
    }
  } catch {
    // Fallback to timezone
  }

  // 4. Reliable Timezone heuristic
  const tzFallback = getTimezoneCountry();
  cachedCountryInfo = {
    countryCode: tzFallback.code,
    countryName: tzFallback.name,
    currency: tzFallback.currency,
    flagEmoji: tzFallback.flagEmoji,
    currencySymbol: tzFallback.currency === "INR" ? "₹" : "$",
  };

  return cachedCountryInfo;
}

export async function getUserCountry(): Promise<string> {
  const info = await getUserCountryInfo();
  return info.countryCode;
}

export async function isIndiaUser(): Promise<boolean> {
  const info = await getUserCountryInfo();
  return info.currency === "INR";
}

export function saveUserCountryPreference(countryCode: string, currency: "INR" | "USD") {
  const isIndia = currency === "INR";
  const info: CountryInfo = {
    countryCode,
    countryName: isIndia ? "India" : "Global / US",
    currency,
    flagEmoji: isIndia ? "🇮🇳" : "🇺🇸",
    currencySymbol: isIndia ? "₹" : "$",
  };
  cachedCountryInfo = info;
  try {
    localStorage.setItem("techneyo_country_info", JSON.stringify(info));
    localStorage.setItem("techneyo_currency", currency);
  } catch {
    // ignore
  }
}
