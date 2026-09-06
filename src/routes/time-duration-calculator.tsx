import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateTimeDuration } from "@/lib/calc-engines/time-duration-calculator";

export const Route = createFileRoute("/time-duration-calculator")({
  head: () => calcRouteHead("time-duration-calculator"),
  component: TimeDurationCalculatorPage,
});

function TimeDurationCalculatorPage() {
  const calcMeta = getCalculatorBySlug("time-duration-calculator")!;
  const [startH, setStartH] = useState<number>(9);
  const [startM, setStartM] = useState<number>(0);
  const [startS, setStartS] = useState<number>(0);

  const [endH, setEndH] = useState<number>(17);
  const [endM, setEndM] = useState<number>(30);
  const [endS, setEndS] = useState<number>(0);

  const result = useMemo(() => {
    return calculateTimeDuration(startH, startM, startS, endH, endM, endS);
  }, [startH, startM, startS, endH, endM, endS]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const startTimeStr = `${pad(startH)}:${pad(startM)}:${pad(startS)}`;
  const endTimeStr = `${pad(endH)}:${pad(endM)}:${pad(endS)}`;

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Time Duration Calculator",
      { "Start Time": startTimeStr, "End Time": endTimeStr },
      result.formatted,
      {
        metrics: [
          { label: "Duration", value: result.formatted },
          { label: "Decimal Hours", value: `${result.decimalHours} hrs` },
          { label: "Total Minutes", value: `${result.totalMinutes} mins` },
          { label: "Total Seconds", value: `${result.totalSeconds} secs` },
        ],
        formula: "Duration = End Time - Start Time (accounting for overnight wraps)",
        explanation: `The elapsed time from ${startTimeStr} to ${endTimeStr} is ${result.formatted} (${result.decimalHours} decimal hours).`,
      },
    );
  }, [startTimeStr, endTimeStr, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-foreground">Time Inputs (24-Hour Format)</h2>

            {/* Start Time */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Start Time
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={startH}
                  onChange={(e) => setStartH(Math.min(23, Math.max(0, Number(e.target.value))))}
                  className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
                <span className="font-bold text-muted-foreground">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={startM}
                  onChange={(e) => setStartM(Math.min(59, Math.max(0, Number(e.target.value))))}
                  className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
                <span className="font-bold text-muted-foreground">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={startS}
                  onChange={(e) => setStartS(Math.min(59, Math.max(0, Number(e.target.value))))}
                  className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* End Time */}
            <div className="space-y-1.5 pt-3 border-t border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                End Time
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={endH}
                  onChange={(e) => setEndH(Math.min(23, Math.max(0, Number(e.target.value))))}
                  className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
                <span className="font-bold text-muted-foreground">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={endM}
                  onChange={(e) => setEndM(Math.min(59, Math.max(0, Number(e.target.value))))}
                  className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
                <span className="font-bold text-muted-foreground">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={endS}
                  onChange={(e) => setEndS(Math.min(59, Math.max(0, Number(e.target.value))))}
                  className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Shift Presets */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground self-center">Shift Presets:</span>
              {[
                { label: "Standard Work (9:00–17:00)", sh: 9, sm: 0, eh: 17, em: 0 },
                { label: "Morning Half (9:00–13:00)", sh: 9, sm: 0, eh: 13, em: 0 },
                { label: "Night Shift (22:00–06:00)", sh: 22, sm: 0, eh: 6, em: 0 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setStartH(p.sh);
                    setStartM(p.sm);
                    setStartS(0);
                    setEndH(p.eh);
                    setEndM(p.em);
                    setEndS(0);
                  }}
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
            <h2 className="text-base font-bold text-foreground">Elapsed Duration</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Total Elapsed Time
              </span>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-foreground">
                {result.hours}h {result.minutes}m {result.seconds}s
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {result.decimalHours} decimal hours
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border p-3 bg-surface/30">
                <span className="text-muted-foreground">Total Minutes</span>
                <p className="mt-1 text-base font-bold text-foreground">
                  {result.totalMinutes.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-border p-3 bg-surface/30">
                <span className="text-muted-foreground">Total Seconds</span>
                <p className="mt-1 text-base font-bold text-foreground">
                  {result.totalSeconds.toLocaleString()}
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
