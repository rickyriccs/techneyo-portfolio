import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { captureUtmData } from "@/lib/utm";
import { trackEvent, trackPageView } from "@/lib/analytics";

const isPublicPath = (path: string) => !path.startsWith("/admin");

const getAnchor = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return null;
  return target.closest("a");
};

const getButtonLabel = (anchor: HTMLAnchorElement) => anchor.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) || anchor.getAttribute("aria-label") || "Link";

const AnalyticsRouteTracker = () => {
  const location = useLocation();
  const lastTrackedPath = useRef("");
  const skippedInitialPageView = useRef(false);

  useEffect(() => {
    captureUtmData();
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isPublicPath(location.pathname)) return;

    const pageKey = `${location.pathname}${location.search}`;
    if (lastTrackedPath.current === pageKey) return;
    lastTrackedPath.current = pageKey;

    if (!skippedInitialPageView.current) {
      skippedInitialPageView.current = true;
      return;
    }

    window.setTimeout(() => trackPageView(), 0);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!isPublicPath(window.location.pathname)) return;

      const anchor = getAnchor(event.target);
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const buttonLabel = getButtonLabel(anchor);
      const ctaLocation = anchor.dataset.ctaLocation || anchor.closest("[data-cta-location]")?.getAttribute("data-cta-location") || "site";

      if (href.startsWith("https://wa.me/") || href.includes("wa.me/919988773122")) {
        trackEvent("whatsapp_click", { button_label: buttonLabel, cta_location: ctaLocation });
      }

      if (href.startsWith("tel:")) {
        trackEvent("call_click", { button_label: buttonLabel, cta_location: ctaLocation });
      }

      if (href.startsWith("mailto:")) {
        trackEvent("email_click", { button_label: buttonLabel, cta_location: ctaLocation });
      }

      const offerName = anchor.dataset.offerName || anchor.closest("[data-offer-name]")?.getAttribute("data-offer-name");
      if (offerName) {
        trackEvent("offer_click", { offer_name: offerName, button_label: buttonLabel, cta_location: ctaLocation });
      }

      const quoteSignals = ["quote", "consultation", "requirement", "project", "digital growth", "start website", "free audit"];
      if (href === "/contact" || quoteSignals.some((signal) => buttonLabel.toLowerCase().includes(signal))) {
        trackEvent("quote_request_click", { button_label: buttonLabel, cta_location: ctaLocation });
      }
    };

    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
};

export default AnalyticsRouteTracker;
