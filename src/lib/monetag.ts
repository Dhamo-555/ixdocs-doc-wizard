/**
 * Monetag In-Page Push Configuration & Loader
 * Zone ID: 11719165
 * Script URL: https://nap5k.com/tag.min.js
 */

export const MONETAG_CONFIG = {
  enabled: false, // Temporarily disabled due to inappropriate/18+ ads
  zoneId: "11719165",
  scriptSrc: "https://nap5k.com/tag.min.js",
} as const;

let scriptInjected = false;

/**
 * Safely load Monetag In-Page Push script once on the client side.
 * Preserves strict idempotency and runs only in browser environments.
 */
export function loadMonetagInPagePush(): void {
  // Global disable guard
  if (!MONETAG_CONFIG.enabled) {
    return;
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  // Prevent duplicate script injection
  if (scriptInjected) {
    return;
  }

  const existing = document.querySelector(`script[data-zone="${MONETAG_CONFIG.zoneId}"]`);
  if (existing) {
    scriptInjected = true;
    return;
  }

  try {
    const s = document.createElement("script");
    s.dataset["zone"] = MONETAG_CONFIG.zoneId;
    s.src = MONETAG_CONFIG.scriptSrc;
    s.async = true;

    // Use exact Monetag recommended injection anchor target
    const target = [document.documentElement, document.body].filter(Boolean).pop();
    if (target) {
      target.appendChild(s);
      scriptInjected = true;
    }
  } catch (err) {
    console.warn("Failed to initialize Monetag In-Page Push:", err);
  }
}
