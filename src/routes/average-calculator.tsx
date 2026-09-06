import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { parseNumberList, calculateAverages } from "@/lib/calc-engines/average-calculator";

export const Route = createFileRoute("/average-calculator")({
  head: () => calcRouteHead("average-calculator"),
  component: AverageCalculatorPage,
});

function AverageCalculatorPage() {
  const calcMeta = getCalculatorBySlug("average-calculator")!;
  const [rawInput, setRawInput] = useState<string>("12, 19, 24, 30, 38, 45, 52, 60");

  const numbers = useMemo(() => parseNumberList(rawInput), [rawInput]);
  const result = useMemo(() => calculateAverages(numbers), [numbers]);

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Average Calculator",
      {
        "Input Data": rawInput,
        "Total Count": `${result.count} values`,
      },
      `${result.mean}`,
      {
        metrics: [
          { label: "Arithmetic Mean", value: `${result.mean}` },
          { label: "Median", value: `${result.median}` },
          {
            label: "Mode(s)",
            value: result.modes.length > 0 ? result.modes.join(", ") : "No mode",
          },
          { label: "Range", value: `${result.range} (${result.min} to ${result.max})` },
          { label: "Sum", value: `${result.sum}` },
          ...(result.geometricMean
            ? [{ label: "Geometric Mean", value: `${result.geometricMean}` }]
            : []),
        ],
        formula: "Mean = Sum / Count; Median = Middle Value in Sorted Sequence",
        explanation: `Evaluated a dataset of ${result.count} values. The sum of all elements is ${result.sum}, giving an arithmetic mean of ${result.mean} and a median of ${result.median}.`,
      },
    );
  }, [rawInput, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground">Enter Numbers</h2>
            <p className="text-xs text-muted-foreground">
              Separate numbers with commas, spaces, semicolons, or line breaks.
            </p>

            <textarea
              rows={5}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="e.g. 10, 20, 30, 40, 50"
              className="w-full rounded-xl border border-border bg-background p-3 text-sm font-mono text-foreground focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
            />

            {/* Quick sample sets */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground self-center">Presets:</span>
              {[
                { label: "Test Scores", val: "88, 92, 79, 95, 85, 91, 74" },
                { label: "Weekly Sales", val: "1200, 1450, 980, 2100, 1800, 2400" },
                { label: "Temperatures", val: "22, 24, 21, 26, 25, 22, 27" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setRawInput(p.val)}
                  className="rounded-lg bg-surface px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Statistical Measures</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Arithmetic Mean (Average)
              </span>
              <div className="mt-1 text-4xl font-extrabold text-foreground">{result.mean}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Count: {result.count} numbers · Sum: {result.sum}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Median</span>
                <p className="mt-1 text-lg font-bold text-foreground">{result.median}</p>
              </div>
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Range</span>
                <p className="mt-1 text-lg font-bold text-foreground">{result.range}</p>
              </div>
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Minimum</span>
                <p className="mt-1 text-base font-bold text-foreground">{result.min}</p>
              </div>
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Maximum</span>
                <p className="mt-1 text-base font-bold text-foreground">{result.max}</p>
              </div>
            </div>

            {result.modes.length > 0 && (
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Mode:</span>{" "}
                {result.modes.join(", ")}
              </p>
            )}

            <div className="pt-2 border-t border-border">
              <CalcPdfReportButton getReportInput={getReportInput} />
            </div>
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
