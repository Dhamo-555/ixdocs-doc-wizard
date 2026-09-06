import { useState } from "react";
import { Sparkles, Zap, ShieldCheck, CheckCircle2, Layers } from "lucide-react";
import { CALCULATORS, POPULAR_CALCULATORS, type CalculatorCategory } from "@/lib/calculators";
import { CalcCard } from "./calc-card";
import { CalcSearch } from "./calc-search";
import { CalcAdSlot } from "./calc-ad-slot";

const CATEGORIES: { id: CalculatorCategory | "all"; label: string }[] = [
  { id: "all", label: "All Calculators" },
  { id: "everyday", label: "Everyday" },
  { id: "finance", label: "Finance" },
  { id: "math", label: "Math" },
  { id: "health", label: "Health & Fitness" },
  { id: "datetime", label: "Time & Date" },
  { id: "conversion", label: "Converters" },
  { id: "productivity", label: "Productivity" },
  { id: "security", label: "Security" },
  { id: "qr-barcode", label: "QR & Barcode" },
  { id: "billing", label: "Billing" },
];

export function CalcHome() {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | "all">("all");

  const displayedCalculators =
    selectedCategory === "all"
      ? CALCULATORS
      : CALCULATORS.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-dvh bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-surface/60 py-16 sm:py-24">
        <div className="container-page relative text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-xs">
            <span className="size-2 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
            <span>Suite of 31 Fast In-Browser Calculators</span>
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Free Online Calculators.{" "}
            <span className="text-emerald-600">Fast, Accurate & Private.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-5 sm:text-lg text-pretty">
            Perform everyday math, financial planning, BMI, health, unit conversions, date
            arithmetic, barcodes, and billing receipts — all computed 100% in your browser.
          </p>

          {/* Search bar */}
          <div className="mt-8">
            <CalcSearch />
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>No sign-up required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="size-4 text-emerald-600 shrink-0" />
              <span>Zero server latency</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Calculators Grid */}
      <section className="container-page py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-extrabold text-foreground sm:text-2xl flex items-center gap-2">
              <Sparkles className="size-5 text-emerald-600" />
              <span>Popular Calculators</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Most frequently used calculation and conversion tools.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_CALCULATORS.map((calc) => (
            <CalcCard key={calc.slug} calc={calc} />
          ))}
        </div>
      </section>

      {/* Category Filter & All Calculators */}
      <section className="border-t border-border bg-surface/30 py-12 sm:py-16">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-xl font-extrabold text-foreground sm:text-2xl flex items-center gap-2">
                <Layers className="size-5 text-emerald-600" />
                <span>All Calculators ({CALCULATORS.length})</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Browse our complete suite of browser-based calculation engines.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-surface"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedCalculators.map((calc) => (
              <CalcCard key={calc.slug} calc={calc} />
            ))}
          </div>
        </div>
      </section>

      {/* Crawlable SEO & Platform Information Section */}
      <section className="container-page py-12 sm:py-16">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10">
          <div className="max-w-3xl">
            <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">
              About IXDocs Calculator Platform
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              IXDocs Calculator provides a comprehensive, browser-based suite of 31 free
              calculation, conversion, and generation utilities. Every tool runs 100% client-side
              using modern Web APIs, WebAssembly, and native hardware acceleration. Your numbers,
              financial figures, camera scans, and personal inputs are processed locally on your
              device and are never transmitted to or stored on external servers.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface/50 p-5">
              <h3 className="text-sm font-bold text-foreground">Finance & Loans</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Compute loan payments, compound interest growth, mortgage amortization, and equated
                monthly installments (EMI) with visual schedules and browser-generated PDF
                summaries.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface/50 p-5">
              <h3 className="text-sm font-bold text-foreground">Math & Everyday Math</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Solve percentage change and differences, sales taxes, tips, fractions, ratios,
                averages, standard deviations, and cumulative GPAs with instant real-time results.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface/50 p-5">
              <h3 className="text-sm font-bold text-foreground">Health & Fitness</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Calculate Body Mass Index (BMI) across adult and youth percentiles, ideal healthy
                weight ranges, and Total Daily Energy Expenditure (TDEE) with goal-based calorie
                targets.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface/50 p-5">
              <h3 className="text-sm font-bold text-foreground">Time, Date & Converters</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Measure precise durations between timestamps, add or subtract calendar days, convert
                across global timezones, and transform units for length, weight, volume, and data
                storage.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface/50 p-5">
              <h3 className="text-sm font-bold text-foreground">QR & Barcode Utilities</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Generate standard retail and logistics barcodes (Code 128, EAN-13, UPC-A, Code 39)
                and high-density QR codes with SVG, PNG downloads and 1-click printable label
                sheets.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface/50 p-5">
              <h3 className="text-sm font-bold text-foreground">Billing & POS Receipts</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Create point-of-sale invoices using your device camera as a live barcode scanner,
                calculate customizable GST slabs, and export professional A4 or 80mm thermal
                receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXACTLY ONE Monetag AdSlot on the Calculator Homepage */}
      <section className="container-page py-6">
        <CalcAdSlot />
      </section>
    </div>
  );
}
