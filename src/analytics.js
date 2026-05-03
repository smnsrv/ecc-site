/**
 * События в GA4 (gtag) — только если в сборке задан VITE_GA_MEASUREMENT_ID (см. ga4.js).
 * Имена событий: латиница, snake_case по соглашению GA.
 */
export function trackGaEvent(eventName, eventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, eventParams);
}
