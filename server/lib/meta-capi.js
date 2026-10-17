import crypto from "crypto";

function sha256(string) {
  if (!string) return null;
  return crypto.createHash("sha256").update(string.trim()).digest("hex");
}

export async function sendMetaCapiEvent({
  eventName = "Lead",
  email,
  phone,
  firstName,
  lastName,
  city,
  state,
  sourceUrl,
  clientIp,
  clientUserAgent,
  value = 0,
  currency = "INR",
  customData = {},
}) {
  const pixelId = process.env.META_PIXEL_ID || "1062712686089923";
  const accessToken = process.env.META_ACCESS_TOKEN || process.env.META_CAPI_TOKEN;

  if (!accessToken) {
    // CAPI token not yet added; client-side Meta Pixel continues to track
    return;
  }

  try {
    const userData = {
      client_ip_address: clientIp || null,
      client_user_agent: clientUserAgent || null,
    };

    if (email) {
      userData.em = [sha256(email.toLowerCase())];
    }
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      userData.ph = [sha256(cleanPhone)];
    }
    if (firstName) {
      userData.fn = [sha256(firstName.toLowerCase())];
    }
    if (city) {
      userData.ct = [sha256(city.toLowerCase())];
    }
    if (state) {
      userData.st = [sha256(state.toLowerCase())];
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: sourceUrl || "https://techneyo.com",
          user_data: userData,
          custom_data: {
            value: Number(value) || 0,
            currency: currency || "INR",
            ...customData,
          },
        },
      ],
    };

    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.warn("Meta CAPI dispatch error:", response.status, errBody);
    } else {
      console.log(`✅ Meta CAPI event '${eventName}' sent successfully`);
    }
  } catch (err) {
    console.warn("Failed to dispatch Meta CAPI event:", err.message);
  }
}
