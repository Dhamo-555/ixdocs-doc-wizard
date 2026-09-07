export const CALCULATOR_SLUGS = [
  // 11 Original Calculators
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
  "bill-calculator",
  // 1 Product Barcode Generator
  "barcode-generator",
  // 19 New Calculators
  "percentage-calculator",
  "fraction-calculator",
  "ratio-calculator",
  "average-calculator",
  "statistics-calculator",
  "gpa-calculator",
  "loan-calculator",
  "mortgage-calculator",
  "emi-calculator",
  "discount-calculator",
  "tip-calculator",
  "sales-tax-calculator",
  "compound-interest-calculator",
  "time-duration-calculator",
  "time-calculator",
  "data-storage-calculator",
  "fuel-cost-calculator",
  "bmi-calculator",
  "calorie-calculator",
  // Scientific Calculator
  "scientific-calculator",
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

export function isCalculatorHostname(host: string): boolean {
  return (
    host.startsWith("calc.") ||
    host.startsWith("calculator.") ||
    host === "calc.ixdocs.com" ||
    host.includes("calc.ixdocs.com")
  );
}

export function isCalculatorHost(): boolean {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return isCalculatorHostname(host) || window.location.search.includes("calc=true");
  }
  return false;
}

export function isCalculatorRoute(pathname: string): boolean {
  if (isCalculatorPath(pathname)) return true;
  if (isCalculatorHost()) return true;
  return false;
}
