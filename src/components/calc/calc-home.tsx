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

      {/* EXACTLY ONE Monetag AdSlot on the Calculator Homepage */}
      <section className="container-page py-6">
        <CalcAdSlot />
      </section>
    </div>
  );
}
