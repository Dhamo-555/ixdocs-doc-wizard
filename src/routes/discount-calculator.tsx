import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateDiscount } from "@/lib/calc-engines/discount-calculator";

export const Route = createFileRoute("/discount-calculator")({
  head: () => calcRouteHead("discount-calculator"),
  component: DiscountCalculatorPage,
});

function DiscountCalculatorPage() {
  const calcMeta = getCalculatorBySlug("discount-calculator")!;
  const [originalPrice, setOriginalPrice] = useState<number>(100);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [extraDiscount, setExtraDiscount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);

  const result = useMemo(
    () => calculateDiscount(originalPrice, discountPercent, extraDiscount, taxPercent),
    [originalPrice, discountPercent, extraDiscount, taxPercent],
  );

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Discount Calculator",
      {
        "Original Price": `$${originalPrice.toFixed(2)}`,
        "Primary Discount": `${discountPercent}%`,
        ...(extraDiscount > 0 ? { "Extra Coupon Discount": `${extraDiscount}%` } : {}),
        ...(taxPercent > 0 ? { "Sales Tax Rate": `${taxPercent}%` } : {}),
      },
      `$${result.finalPriceWithTax.toFixed(2)}`,
      {
        metrics: [
          { label: "You Save", value: `$${result.youSave.toFixed(2)}` },
          { label: "Effective Discount", value: `${result.effectiveDiscountPct}%` },
          ...(taxPercent > 0
            ? [{ label: "Tax Amount", value: `$${result.taxAmount.toFixed(2)}` }]
            : []),
        ],
        formula: "Final Price = Original × (1 - D1/100) × (1 - D2/100) + Tax",
        explanation: `Original price of $${originalPrice.toFixed(2)} discounted by ${discountPercent}% yields a sale price of $${result.finalPrice.toFixed(2)}, saving you $${result.youSave.toFixed(2)}.`,
      },
    );
  }, [originalPrice, discountPercent, extraDiscount, taxPercent, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Discount Parameters</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Original Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick-pick discount pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[10, 15, 20, 25, 30, 40, 50, 70].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDiscountPercent(pct)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    discountPercent === pct
                      ? "bg-emerald-600 text-white"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pct}% OFF
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-border">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Extra Coupon / Stacked Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={extraDiscount}
                  onChange={(e) => setExtraDiscount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Sales Tax (%){" "}
                  <span className="text-muted-foreground/60 font-normal">Optional</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  placeholder="0"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Sale Summary</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Final Sale Price
              </span>
              <div className="mt-1 text-4xl font-extrabold text-foreground">
                ${result.finalPriceWithTax.toFixed(2)}
              </div>
              {taxPercent > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  (Includes ${result.taxAmount.toFixed(2)} sales tax)
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">You Save</span>
                <p className="mt-1 text-lg font-bold text-emerald-600">
                  ${result.youSave.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Total Discount</span>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {result.effectiveDiscountPct}%
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <CalcPdfReportButton getReportInput={getReportInput} />
            </div>
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
