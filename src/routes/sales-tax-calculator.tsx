import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { CurrencySelector } from "@/components/calc/currency-selector";
import { detectDefaultCurrency, type CurrencyOption } from "@/lib/calc-currency";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import {
  calculateForwardSalesTax,
  calculateReverseSalesTax,
} from "@/lib/calc-engines/sales-tax-calculator";

export const Route = createFileRoute("/sales-tax-calculator")({
  head: () => calcRouteHead("sales-tax-calculator"),
  component: SalesTaxCalculatorPage,
});

function SalesTaxCalculatorPage() {
  const calcMeta = getCalculatorBySlug("sales-tax-calculator")!;
  const [currency, setCurrency] = useState<CurrencyOption>(detectDefaultCurrency);
  const [direction, setDirection] = useState<"forward" | "reverse">("forward");
  const [priceInputStr, setPriceInputStr] = useState("100");
  const [taxRateStr, setTaxRateStr] = useState("8.25");

  const priceInput = parseFloat(priceInputStr) || 0;
  const taxRate = parseFloat(taxRateStr) || 0;

  const result = useMemo(() => {
    if (direction === "forward") {
      return calculateForwardSalesTax(priceInput, taxRate);
    }
    return calculateReverseSalesTax(priceInput, taxRate);
  }, [direction, priceInput, taxRate]);

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Sales Tax Calculator",
      {
        "Calculation Direction":
          direction === "forward" ? "Add Sales Tax" : "Reverse Calculate Pre-Tax",
        "Input Amount": `${currency.symbol}${priceInput.toFixed(2)}`,
        "Tax Rate": `${taxRate}%`,
      },
      `${currency.symbol}${result.totalPrice.toFixed(2)}`,
      {
        metrics: [
          {
            label: "Net Price (Pre-Tax)",
            value: `${currency.symbol}${result.netPrice.toFixed(2)}`,
          },
          { label: "Sales Tax Amount", value: `${currency.symbol}${result.taxAmount.toFixed(2)}` },
          {
            label: "Gross Total (With Tax)",
            value: `${currency.symbol}${result.totalPrice.toFixed(2)}`,
          },
        ],
        formula:
          direction === "forward"
            ? "Tax = Net × (Rate / 100); Gross = Net + Tax"
            : "Net = Gross ÷ (1 + Rate / 100); Tax = Gross - Net",
        explanation: `At a ${taxRate}% tax rate, a net amount of ${currency.symbol}${result.netPrice.toFixed(2)} incurs ${currency.symbol}${result.taxAmount.toFixed(2)} in tax, resulting in a total price of ${currency.symbol}${result.totalPrice.toFixed(2)}.`,
      },
    );
  }, [currency.symbol, direction, priceInput, taxRate, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-6">
        {/* Toggle Mode */}
        <div className="flex gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setDirection("forward")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              direction === "forward"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            Add Tax (Pre-tax → Total)
          </button>
          <button
            type="button"
            onClick={() => setDirection("reverse")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              direction === "reverse"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            Reverse Tax (Total → Pre-tax)
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground">Tax Parameters</h2>
                <CurrencySelector value={currency} onChange={setCurrency} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {direction === "forward"
                    ? `Net Price Before Tax (${currency.symbol})`
                    : `Total Receipt Amount Including Tax (${currency.symbol})`}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceInputStr}
                  onChange={(e) => setPriceInputStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={taxRateStr}
                  onChange={(e) => setTaxRateStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {[5, 7, 8.25, 10, 18, 20].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTaxRateStr(String(r))}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        taxRate === r
                          ? "bg-emerald-600 text-white"
                          : "bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-foreground">Tax Breakdown</h2>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  {direction === "forward" ? "Gross Total" : "Net Before Tax"}
                </span>
                <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-foreground break-all">
                  {currency.symbol}
                  {(direction === "forward" ? result.totalPrice : result.netPrice).toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                  <span className="text-muted-foreground">Pre-Tax Net</span>
                  <p className="mt-1 text-lg font-bold text-foreground">
                    {currency.symbol}
                    {result.netPrice.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                  <span className="text-muted-foreground">
                    Sales Tax ({result.taxRatePercent}%)
                  </span>
                  <p className="mt-1 text-lg font-bold text-emerald-600">
                    {currency.symbol}
                    {result.taxAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <CalcPdfReportButton getReportInput={getReportInput} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
