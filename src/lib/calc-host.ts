export const CALCULATOR_SLUGS = [
  "basic-calculator",
  "unit-converter",
  "password-generator",
  "word-counter",
  "qr-generator",
  "timezone-converter",
  "date-calculator",
  "interest-calculator",
  "age-calculator",
  "random-password-generator",
] as const;

export const CALCULATOR_PATHS: readonly string[] = [
  "/calculators",
  ...CALCULATOR_SLUGS.map((slug) => `/${slug}`),
];

export function isCalculatorPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/calculators") return true;
  return CALCULATOR_PATHS.some((p) => p === normalized);
}

export function isCalculatorHost(): boolean {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return host.startsWith("calculator.") || window.location.search.includes("calc=true");
  }
  return false;
}

export function isCalculatorRoute(pathname: string): boolean {
  if (isCalculatorPath(pathname)) return true;
  if (isCalculatorHost()) return true;
  return false;
}
