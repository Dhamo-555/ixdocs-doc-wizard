import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { CurrencySelector } from "@/components/calc/currency-selector";
import { detectDefaultCurrency, type CurrencyOption } from "@/lib/calc-currency";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateTip } from "@/lib/calc-engines/tip-calculator";

export const Route = createFileRoute("/tip-calculator")({
  head: () => calcRouteHead("tip-calculator"),
  component: TipCalculatorPage,
});

function TipCalculatorPage() {
  const calcMeta = getCalculatorBySlug("tip-calculator")!;
  const [currency, setCurrency] = useState<CurrencyOption>(detectDefaultCurrency);
  const [billAmountStr, setBillAmountStr] = useState<string>("65");
  const [tipPercentStr, setTipPercentStr] = useState<string>("18");
  const [splitCount, setSplitCount] = useState<number>(2);

  const billAmount = parseFloat(billAmountStr) || 0;
  const tipPercent = parseFloat(tipPercentStr) || 0;

  const result = useMemo(
    () => calculateTip(billAmount, tipPercent, splitCount),
    [billAmount, tipPercent, splitCount],
  );

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Tip Calculator",
      {
        "Bill Amount": `${currency.symbol}${billAmount.toFixed(2)}`,
        "Tip Percentage": `${tipPercent}%`,
        "Number of People": `${splitCount}`,
      },
      `${currency.symbol}${result.totalBill.toFixed(2)}`,
      {
        metrics: [
          { label: "Tip Amount", value: `${currency.symbol}${result.tipAmount.toFixed(2)}` },
          {
            label: "Total per Person",
            value: `${currency.symbol}${result.totalPerPerson.toFixed(2)}`,
          },
          { label: "Tip per Person", value: `${currency.symbol}${result.tipPerPerson.toFixed(2)}` },
        ],
        formula: "Tip = Bill × (Tip% / 100); Total per Person = (Bill + Tip) / People",
        explanation: `On a bill of ${currency.symbol}${billAmount.toFixed(2)} with an ${tipPercent}% tip (${currency.symbol}${result.tipAmount.toFixed(2)}), split among ${splitCount} diners, each person pays ${currency.symbol}${result.totalPerPerson.toFixed(2)}.`,
      },
    );
  }, [currency.symbol, billAmount, tipPercent, splitCount, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground">Dining Details</h2>
              <CurrencySelector value={currency} onChange={setCurrency} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Bill Total ({currency.symbol})
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={billAmountStr}
                onChange={(e) => setBillAmountStr(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Select Tip Percentage ({tipPercent}%)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[10, 15, 18, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTipPercentStr(String(pct))}
                    className={`rounded-xl py-2.5 text-xs font-bold transition ${
                      tipPercent === pct
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Custom:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tipPercentStr}
                  onChange={(e) => setTipPercentStr(e.target.value)}
                  className="w-24 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Split Between People
              </label>
              <div className="flex items-center gap-3">
                <Users className="size-5 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSplitCount((c) => Math.max(1, c - 1))}
                    disabled={splitCount <= 1}
                    className="size-8 rounded-lg border border-border bg-surface text-foreground font-bold hover:bg-muted disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-foreground">
                    {splitCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSplitCount((c) => c + 1)}
                    className="size-8 rounded-lg border border-border bg-surface text-foreground font-bold hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Split Breakdown</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Total per Person
              </span>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-foreground break-all">
                {currency.symbol}
                {result.totalPerPerson.toFixed(2)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                (Includes {currency.symbol}
                {result.tipPerPerson.toFixed(2)} tip each)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Total Tip</span>
                <p className="mt-1 text-lg font-bold text-emerald-600">
                  {currency.symbol}
                  {result.tipAmount.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Grand Total</span>
                <p className="mt-1 text-lg font-bold text-foreground">
                  ${result.totalBill.toFixed(2)}
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
