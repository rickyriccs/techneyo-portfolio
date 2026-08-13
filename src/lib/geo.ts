// Geo-IP utility for location-based feature access

let cachedCountryCode: string | null = null;

export async function getUserCountry(): Promise<string> {
  if (cachedCountryCode) {
    return cachedCountryCode;
  }

  try {
    // Try fast client-side IP lookup API
    const response = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(3000),
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.country_code) {
        cachedCountryCode = data.country_code.toUpperCase();
        return cachedCountryCode;
      }
    }
  } catch (error) {
    console.warn("Geo-IP lookup failed, using timezone fallback", error);
  }

  // Fallback to Browser Timezone heuristic
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && (timeZone.includes("Kolkata") || timeZone.includes("Calcutta") || timeZone === "Asia/Colombo")) {
      cachedCountryCode = "IN";
      return cachedCountryCode;
    }
  } catch (err) {
    // ignore
  }

  // Default fallback
  cachedCountryCode = "IN";
  return cachedCountryCode;
}

export async function isIndiaUser(): Promise<boolean> {
  const country = await getUserCountry();
  return country === "IN";
}
