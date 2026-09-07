import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { addOrSubtractTime } from "@/lib/calc-engines/time-calculator";

export const Route = createFileRoute("/time-calculator")({
  head: () => calcRouteHead("time-calculator"),
  component: TimeCalculatorPage,
});

function TimeCalculatorPage() {
  const calcMeta = getCalculatorBySlug("time-calculator")!;
  const [baseHStr, setBaseHStr] = useState("8");
  const [baseMStr, setBaseMStr] = useState("30");
  const [baseSStr, setBaseSStr] = useState("0");
  const [op, setOp] = useState<"add" | "subtract">("add");
  const [deltaHStr, setDeltaHStr] = useState("2");
  const [deltaMStr, setDeltaMStr] = useState("45");
  const [deltaSStr, setDeltaSStr] = useState("0");

  const baseH = Math.min(23, Math.max(0, parseInt(baseHStr, 10) || 0));
  const baseM = Math.min(59, Math.max(0, parseInt(baseMStr, 10) || 0));
  const baseS = Math.min(59, Math.max(0, parseInt(baseSStr, 10) || 0));
  const deltaH = Math.max(0, parseInt(deltaHStr, 10) || 0);
  const deltaM = Math.max(0, parseInt(deltaMStr, 10) || 0);
  const deltaS = Math.max(0, parseInt(deltaSStr, 10) || 0);

  const result = useMemo(() => {
    return addOrSubtractTime(baseH, baseM, baseS, deltaH, deltaM, deltaS, op);
  }, [baseH, baseM, baseS, deltaH, deltaM, deltaS, op]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const baseTimeStr = `${pad(baseH)}:${pad(baseM)}:${pad(baseS)}`;
  const deltaStr = `${deltaH}h ${deltaM}m ${deltaS}s`;

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Time Calculator",
      {
        "Starting Time": baseTimeStr,
        Operation: op === "add" ? `Add (+ ${deltaStr})` : `Subtract (- ${deltaStr})`,
      },
      `${result.formatted12} (${result.formatted24})`,
      {
        metrics: [
          { label: "12-Hour Format", value: result.formatted12 },
          { label: "24-Hour Format", value: result.formatted24 },
          ...(result.days !== 0
            ? [
                {
                  label: "Day Offset",
                  value: `${result.days > 0 ? `+${result.days}` : result.days} day(s)`,
                },
              ]
            : []),
        ],
        formula: `New Time = ${baseTimeStr} ${op === "add" ? "+" : "-"} ${deltaStr}`,
        explanation: `${op === "add" ? "Adding" : "Subtracting"} ${deltaStr} to/from ${baseTimeStr} yields ${result.formatted12} (${result.formatted24}).`,
      },
    );
  }, [baseTimeStr, deltaStr, op, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Time Math</h2>

            {/* Base Time */}
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Starting Time (24h)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={baseHStr}
                  onChange={(e) => setBaseHStr(e.target.value)}
                  className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
                <span className="font-bold text-muted-foreground">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={baseMStr}
                  onChange={(e) => setBaseMStr(e.target.value)}
                  className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
                <span className="font-bold text-muted-foreground">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={baseSStr}
                  onChange={(e) => setBaseSStr(e.target.value)}
                  className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Add / Subtract Toggle */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setOp("add")}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                  op === "add"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-surface text-muted-foreground"
                }`}
              >
                + Add Time
              </button>
              <button
                type="button"
                onClick={() => setOp("subtract")}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                  op === "subtract"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-surface text-muted-foreground"
                }`}
              >
                − Subtract Time
              </button>
            </div>

            {/* Time to add/subtract */}
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Adjustment (Hours, Minutes, Seconds)
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[0.65rem] text-muted-foreground mb-1">Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={deltaHStr}
                    onChange={(e) => setDeltaHStr(e.target.value)}
                    className="w-full text-center rounded-xl border border-border bg-background py-2 text-sm font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] text-muted-foreground mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    value={deltaMStr}
                    onChange={(e) => setDeltaMStr(e.target.value)}
                    className="w-full text-center rounded-xl border border-border bg-background py-2 text-sm font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] text-muted-foreground mb-1">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    value={deltaSStr}
                    onChange={(e) => setDeltaSStr(e.target.value)}
                    className="w-full text-center rounded-xl border border-border bg-background py-2 text-sm font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Resulting Clock Time</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Calculated Time
              </span>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-foreground">
                {result.formatted12}
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                {result.formatted24} (24-Hour)
              </p>
              {result.days !== 0 && (
                <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                  {result.days > 0 ? `+${result.days} Next Day` : `${result.days} Previous Day`}
                </span>
              )}
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
