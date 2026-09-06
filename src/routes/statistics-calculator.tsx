import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { parseNumberList } from "@/lib/calc-engines/average-calculator";
import { calculateStatistics } from "@/lib/calc-engines/statistics-calculator";

export const Route = createFileRoute("/statistics-calculator")({
  head: () => calcRouteHead("statistics-calculator"),
  component: StatisticsCalculatorPage,
});

function StatisticsCalculatorPage() {
  const calcMeta = getCalculatorBySlug("statistics-calculator")!;
  const [rawInput, setRawInput] = useState<string>("4, 8, 6, 5, 3, 2, 8, 9, 2, 5");

  const numbers = useMemo(() => parseNumberList(rawInput), [rawInput]);
  const stats = useMemo(() => calculateStatistics(numbers), [numbers]);

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Statistics Calculator",
      {
        "Dataset Count (n)": `${stats.count}`,
        "Data Preview": rawInput.slice(0, 80),
      },
      `s = ${stats.sampleStdDev}`,
      {
        metrics: [
          { label: "Sample Std Dev (s)", value: `${stats.sampleStdDev}` },
          { label: "Population Std Dev (σ)", value: `${stats.populationStdDev}` },
          { label: "Sample Variance (s²)", value: `${stats.sampleVariance}` },
          { label: "Population Variance (σ²)", value: `${stats.populationVariance}` },
          { label: "Mean (x̄)", value: `${stats.mean}` },
          { label: "Median (Q2)", value: `${stats.median}` },
          { label: "Quartile 1 (Q1)", value: `${stats.q1}` },
          { label: "Quartile 3 (Q3)", value: `${stats.q3}` },
          { label: "IQR", value: `${stats.iqr}` },
          { label: "Standard Error", value: `${stats.stdError}` },
        ],
        formula: "s = √[Σ(x - x̄)² / (n - 1)]; σ = √[Σ(x - μ)² / N]",
        explanation: `Evaluated ${stats.count} observations. Sample standard deviation is ${stats.sampleStdDev} (variance ${stats.sampleVariance}) and population standard deviation is ${stats.populationStdDev} (variance ${stats.populationVariance}).`,
      },
    );
  }, [rawInput, stats]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground">Dataset Input</h2>
            <p className="text-xs text-muted-foreground">
              Enter numbers separated by commas, spaces, or tabs.
            </p>

            <textarea
              rows={6}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="e.g. 15, 22, 34, 18, 29, 31, 24"
              className="w-full rounded-xl border border-border bg-background p-3 text-sm font-mono text-foreground focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
            />
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Statistical Results</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Sample Std Dev (s)
                </span>
                <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground">
                  {stats.sampleStdDev}
                </div>
                <p className="text-[0.65rem] text-muted-foreground mt-0.5">n - 1 denominator</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface/30 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Population Std Dev (σ)
                </span>
                <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground">
                  {stats.populationStdDev}
                </div>
                <p className="text-[0.65rem] text-muted-foreground mt-0.5">N denominator</p>
              </div>
            </div>

            {/* Grid of stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="rounded-xl border border-border p-2.5 bg-surface/20">
                <span className="text-muted-foreground block">Mean</span>
                <span className="font-bold text-foreground text-sm">{stats.mean}</span>
              </div>
              <div className="rounded-xl border border-border p-2.5 bg-surface/20">
                <span className="text-muted-foreground block">Median (Q2)</span>
                <span className="font-bold text-foreground text-sm">{stats.median}</span>
              </div>
              <div className="rounded-xl border border-border p-2.5 bg-surface/20">
                <span className="text-muted-foreground block">Sample Var (s²)</span>
                <span className="font-bold text-foreground text-sm">{stats.sampleVariance}</span>
              </div>
              <div className="rounded-xl border border-border p-2.5 bg-surface/20">
                <span className="text-muted-foreground block">Quartile 1 (Q1)</span>
                <span className="font-bold text-foreground text-sm">{stats.q1}</span>
              </div>
              <div className="rounded-xl border border-border p-2.5 bg-surface/20">
                <span className="text-muted-foreground block">Quartile 3 (Q3)</span>
                <span className="font-bold text-foreground text-sm">{stats.q3}</span>
              </div>
              <div className="rounded-xl border border-border p-2.5 bg-surface/20">
                <span className="text-muted-foreground block">IQR (Q3 - Q1)</span>
                <span className="font-bold text-foreground text-sm">{stats.iqr}</span>
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
