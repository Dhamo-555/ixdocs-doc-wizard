import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import {
  calculatePercentOf,
  calculateWhatPercent,
  calculatePercentChange,
  calculatePercentDifference,
} from "@/lib/calc-engines/percentage-calculator";

export const Route = createFileRoute("/percentage-calculator")({
  head: () => calcRouteHead("percentage-calculator"),
  component: PercentageCalculatorPage,
});

type PercentMode = "percentOf" | "whatPercent" | "percentChange" | "percentDiff";

function PercentageCalculatorPage() {
  const calcMeta = getCalculatorBySlug("percentage-calculator")!;
  const [mode, setMode] = useState<PercentMode>("percentOf");

  // Mode 1: What is X% of Y?
  const [m1Pct, setM1Pct] = useState<number>(15);
  const [m1Total, setM1Total] = useState<number>(200);

  // Mode 2: X is what % of Y?
  const [m2Part, setM2Part] = useState<number>(25);
  const [m2Whole, setM2Whole] = useState<number>(100);

  // Mode 3: Percent Increase / Decrease from X to Y
  const [m3From, setM3From] = useState<number>(50);
  const [m3To, setM3To] = useState<number>(75);

  // Mode 4: Percent Difference between X and Y
  const [m4Val1, setM4Val1] = useState<number>(80);
  const [m4Val2, setM4Val2] = useState<number>(100);

  const res1 = useMemo(() => calculatePercentOf(m1Pct, m1Total), [m1Pct, m1Total]);
  const res2 = useMemo(() => calculateWhatPercent(m2Part, m2Whole), [m2Part, m2Whole]);
  const res3 = useMemo(() => calculatePercentChange(m3From, m3To), [m3From, m3To]);
  const res4 = useMemo(() => calculatePercentDifference(m4Val1, m4Val2), [m4Val1, m4Val2]);

  const getReportInput = useCallback((): CalcReportInput => {
    let mainResult = "";
    let inputs: Record<string, string> = {};
    let metrics: { label: string; value: string }[] = [];
    let formula = "";
    let explanation = "";

    if (mode === "percentOf") {
      mainResult = `${res1}`;
      inputs = { "Percentage (%)": `${m1Pct}%`, "Base Value": `${m1Total}` };
      metrics = [{ label: "Result", value: `${res1}` }];
      formula = `Result = (${m1Pct} / 100) × ${m1Total} = ${res1}`;
      explanation = `Calculated ${m1Pct}% of ${m1Total}.`;
    } else if (mode === "whatPercent") {
      mainResult = `${res2}%`;
      inputs = { Part: `${m2Part}`, Whole: `${m2Whole}` };
      metrics = [{ label: "Percentage", value: `${res2}%` }];
      formula = `Percentage = (${m2Part} ÷ ${m2Whole}) × 100 = ${res2}%`;
      explanation = `${m2Part} is ${res2}% of ${m2Whole}.`;
    } else if (mode === "percentChange") {
      mainResult = `${res3.changePercent}% ${res3.isIncrease ? "Increase" : "Decrease"}`;
      inputs = { "Initial Value": `${m3From}`, "Final Value": `${m3To}` };
      metrics = [
        { label: "Change", value: `${res3.changePercent}%` },
        { label: "Absolute Difference", value: `${res3.difference}` },
      ];
      formula = `Change = ((${m3To} - ${m3From}) ÷ |${m3From}|) × 100 = ${res3.changePercent}%`;
      explanation = `Transition from ${m3From} to ${m3To} represents a ${res3.changePercent}% ${res3.isIncrease ? "increase" : "decrease"}.`;
    } else {
      mainResult = `${res4}% Difference`;
      inputs = { "Value 1": `${m4Val1}`, "Value 2": `${m4Val2}` };
      metrics = [{ label: "Percent Difference", value: `${res4}%` }];
      formula = `Diff = (|${m4Val1} - ${m4Val2}| ÷ ((${m4Val1} + ${m4Val2}) ÷ 2)) × 100 = ${res4}%`;
      explanation = `The relative difference between ${m4Val1} and ${m4Val2} is ${res4}%.`;
    }

    return buildCalcReportInput("Percentage Calculator", inputs, mainResult, {
      metrics,
      formula,
      explanation,
    });
  }, [mode, m1Pct, m1Total, m2Part, m2Whole, m3From, m3To, m4Val1, m4Val2, res1, res2, res3, res4]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-6">
        {/* Mode switcher tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-3">
          {[
            { id: "percentOf" as const, label: "What is X% of Y?" },
            { id: "whatPercent" as const, label: "X is what % of Y?" },
            { id: "percentChange" as const, label: "Percent Increase / Decrease" },
            { id: "percentDiff" as const, label: "Percent Difference" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                mode === tab.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Calculator Form */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
          {mode === "percentOf" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Percentage (%)
                </label>
                <input
                  type="number"
                  value={m1Pct}
                  onChange={(e) => setM1Pct(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Of Value (Y)
                </label>
                <input
                  type="number"
                  value={m1Total}
                  onChange={(e) => setM1Total(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === "whatPercent" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Part (X)
                </label>
                <input
                  type="number"
                  value={m2Part}
                  onChange={(e) => setM2Part(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Whole / Total (Y)
                </label>
                <input
                  type="number"
                  value={m2Whole}
                  onChange={(e) => setM2Whole(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === "percentChange" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Initial Value (From)
                </label>
                <input
                  type="number"
                  value={m3From}
                  onChange={(e) => setM3From(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Final Value (To)
                </label>
                <input
                  type="number"
                  value={m3To}
                  onChange={(e) => setM3To(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === "percentDiff" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  First Value (X)
                </label>
                <input
                  type="number"
                  value={m4Val1}
                  onChange={(e) => setM4Val1(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Second Value (Y)
                </label>
                <input
                  type="number"
                  value={m4Val2}
                  onChange={(e) => setM4Val2(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Result Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Calculated Result
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">
                {mode === "percentOf" && res1}
                {mode === "whatPercent" && `${res2}%`}
                {mode === "percentChange" && `${res3.changePercent}%`}
                {mode === "percentDiff" && `${res4}%`}
              </span>
              {mode === "percentChange" && (
                <span
                  className={`text-sm font-bold ${res3.isIncrease ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {res3.isIncrease ? "Increase" : "Decrease"} (
                  {res3.difference > 0 ? `+${res3.difference}` : res3.difference})
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-border flex justify-end">
            <CalcPdfReportButton getReportInput={getReportInput} />
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
