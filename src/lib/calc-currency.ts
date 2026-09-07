/**
 * IXDocs Calculator — Locale-Aware Currency System
 *
 * Automatically detects user's locale/region to set a sensible default currency.
 * Provides consistent formatting and manual override options across all
 * monetary calculators.
 */

export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", symbol: "$", label: "US Dollar ($)" },
  { code: "EUR", symbol: "€", label: "Euro (€)" },
  { code: "GBP", symbol: "£", label: "British Pound (£)" },
  { code: "INR", symbol: "₹", label: "Indian Rupee (₹)" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen (¥)" },
  { code: "CNY", symbol: "¥", label: "Chinese Yuan (CNY ¥)" },
  { code: "CAD", symbol: "$", label: "Canadian Dollar (C$)" },
  { code: "AUD", symbol: "$", label: "Australian Dollar (A$)" },
];

/** Default fallback currency if locale cannot be resolved */
export const DEFAULT_FALLBACK_CURRENCY = CURRENCY_OPTIONS[0]!; // USD

/** Eurozone country codes */
const EUROZONE_REGIONS = new Set([
  "DE",
  "FR",
  "IT",
  "ES",
  "NL",
  "BE",
  "AT",
  "IE",
  "PT",
  "FI",
  "GR",
  "LU",
  "EE",
  "SK",
  "SI",
  "CY",
  "MT",
  "LV",
  "LT",
  "HR",
]);

/**
 * Detects the most appropriate default currency based on a locale string
 * or browser environment.
 */
export function detectDefaultCurrency(userLocale?: string): CurrencyOption {
  let locale = userLocale;

  if (!locale && typeof window !== "undefined" && typeof navigator !== "undefined") {
    locale = navigator.language || (navigator.languages && navigator.languages[0]) || "";
  }

  if (!locale) return DEFAULT_FALLBACK_CURRENCY;

  const upperLocale = locale.toUpperCase();
  const parts = upperLocale.split("-");
  const region = parts.length > 1 ? parts[parts.length - 1] : "";
  const lang = parts[0]?.toLowerCase() || "";

  // India
  if (
    region === "IN" ||
    lang === "hi" ||
    lang === "ta" ||
    lang === "te" ||
    lang === "mr" ||
    lang === "gu"
  ) {
    return CURRENCY_OPTIONS.find((c) => c.code === "INR") || DEFAULT_FALLBACK_CURRENCY;
  }

  // United Kingdom
  if (region === "GB" || region === "UK") {
    return CURRENCY_OPTIONS.find((c) => c.code === "GBP") || DEFAULT_FALLBACK_CURRENCY;
  }

  // Japan
  if (region === "JP" || lang === "ja") {
    return CURRENCY_OPTIONS.find((c) => c.code === "JPY") || DEFAULT_FALLBACK_CURRENCY;
  }

  // China
  if (region === "CN" || lang === "zh") {
    return CURRENCY_OPTIONS.find((c) => c.code === "CNY") || DEFAULT_FALLBACK_CURRENCY;
  }

  // Canada
  if (region === "CA") {
    return CURRENCY_OPTIONS.find((c) => c.code === "CAD") || DEFAULT_FALLBACK_CURRENCY;
  }

  // Australia
  if (region === "AU") {
    return CURRENCY_OPTIONS.find((c) => c.code === "AUD") || DEFAULT_FALLBACK_CURRENCY;
  }

  // Eurozone
  if (region && EUROZONE_REGIONS.has(region)) {
    return CURRENCY_OPTIONS.find((c) => c.code === "EUR") || DEFAULT_FALLBACK_CURRENCY;
  }

  // General language heuristics for Euro
  if (
    ["de", "fr", "it", "es", "nl", "el", "pt", "fi"].includes(lang) &&
    !["US", "CA", "MX", "BR"].includes(region || "")
  ) {
    return CURRENCY_OPTIONS.find((c) => c.code === "EUR") || DEFAULT_FALLBACK_CURRENCY;
  }

  // Default to USD
  return DEFAULT_FALLBACK_CURRENCY;
}

/**
 * Format a number using the specified currency symbol and locale standards.
 */
export function formatCurrencyAmount(
  amount: number,
  currency: CurrencyOption | string,
  options?: {
    decimals?: number;
    showCode?: boolean;
  },
): string {
  const resolvedCurrency: CurrencyOption =
    typeof currency === "string"
      ? CURRENCY_OPTIONS.find((c) => c.code === currency) || {
          code: currency,
          symbol: currency,
          label: currency,
        }
      : currency;

  const decimals = options?.decimals ?? (resolvedCurrency.code === "JPY" ? 0 : 2);
  const formattedNumber = amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (options?.showCode) {
    return `${resolvedCurrency.symbol}${formattedNumber} ${resolvedCurrency.code}`;
  }

  return `${resolvedCurrency.symbol}${formattedNumber}`;
}
