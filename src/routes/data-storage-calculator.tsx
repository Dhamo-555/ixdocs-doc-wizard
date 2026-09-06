import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import {
  convertStorage,
  estimateDownloadTime,
  type StorageUnit,
} from "@/lib/calc-engines/data-storage-calculator";

export const Route = createFileRoute("/data-storage-calculator")({
  head: () => calcRouteHead("data-storage-calculator"),
  component: DataStorageCalculatorPage,
});

function DataStorageCalculatorPage() {
  const calcMeta = getCalculatorBySlug("data-storage-calculator")!;
  const [value, setValue] = useState<number>(50);
  const [unit, setUnit] = useState<StorageUnit>("GB");
  const [base, setBase] = useState<1000 | 1024>(1024);
  const [speedMbps, setSpeedMbps] = useState<number>(100);

  const conversions = useMemo(() => convertStorage(value, unit, base), [value, unit, base]);
  const downloadEstimate = useMemo(
    () => estimateDownloadTime(value, unit, speedMbps),
    [value, unit, speedMbps],
  );

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Data Storage Calculator",
      {
        "Input Size": `${value} ${unit}`,
        "Standard Base": base === 1024 ? "Binary (1024 bytes/KB)" : "Decimal (1000 bytes/KB)",
        "Internet Speed": `${speedMbps} Mbps`,
      },
      `${conversions.MB.toLocaleString()} MB / ${conversions.GB.toLocaleString()} GB`,
      {
        metrics: [
          { label: "Bytes (B)", value: conversions.B.toLocaleString() },
          { label: "Megabytes (MB)", value: conversions.MB.toLocaleString() },
          { label: "Gigabytes (GB)", value: conversions.GB.toLocaleString() },
          { label: "Terabytes (TB)", value: conversions.TB.toLocaleString() },
          { label: "Est. Download Time", value: downloadEstimate.formatted },
        ],
        formula: "Bytes = Size × Base^Exponent; Download Time = Bits / Speed",
        explanation: `${value} ${unit} converted at base ${base} equals ${conversions.GB.toLocaleString()} GB. At ${speedMbps} Mbps, downloading takes approx ${downloadEstimate.formatted}.`,
      },
    );
  }, [value, unit, base, speedMbps, conversions, downloadEstimate]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Data Storage Parameters</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Size Value
                </label>
                <input
                  type="number"
                  min="0"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as StorageUnit)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                >
                  <option value="B">Bytes (B)</option>
                  <option value="KB">Kilobytes (KB)</option>
                  <option value="MB">Megabytes (MB)</option>
                  <option value="GB">Gigabytes (GB)</option>
                  <option value="TB">Terabytes (TB)</option>
                  <option value="PB">Petabytes (PB)</option>
                </select>
              </div>
            </div>

            {/* Base convention toggle */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setBase(1024)}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                  base === 1024
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-surface text-muted-foreground"
                }`}
              >
                Binary (1024 B/KB) · Windows / RAM
              </button>
              <button
                type="button"
                onClick={() => setBase(1000)}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                  base === 1000
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-surface text-muted-foreground"
                }`}
              >
                Decimal (1000 B/KB) · HDD / SSD / macOS
              </button>
            </div>

            {/* Download Speed Estimator */}
            <div className="pt-3 border-t border-border space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground">
                Internet Download Speed (Mbps)
              </label>
              <input
                type="number"
                min="1"
                value={speedMbps}
                onChange={(e) => setSpeedMbps(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {[25, 50, 100, 300, 1000].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeedMbps(s)}
                    className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold transition ${
                      speedMbps === s
                        ? "bg-emerald-600 text-white"
                        : "bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s >= 1000 ? `${s / 1000} Gbps` : `${s} Mbps`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Storage Conversions</h2>

            <div className="space-y-2 text-xs">
              {(["B", "KB", "MB", "GB", "TB", "PB"] as StorageUnit[]).map((u) => (
                <div
                  key={u}
                  className={`flex justify-between items-center p-2.5 rounded-xl border ${
                    unit === u
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30"
                      : "border-border/60 bg-surface/30"
                  }`}
                >
                  <span className="font-semibold text-muted-foreground">{u}</span>
                  <span className="font-mono font-bold text-foreground text-sm">
                    {conversions[u].toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Download time estimate */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 text-center">
              <span className="text-xs text-muted-foreground block">
                Estimated Download Time at {speedMbps} Mbps:
              </span>
              <p className="mt-0.5 text-xl font-extrabold text-emerald-600">
                {downloadEstimate.formatted}
              </p>
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
