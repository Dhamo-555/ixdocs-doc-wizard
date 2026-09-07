import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { simplifyRatio, solveProportion } from "@/lib/calc-engines/ratio-calculator";

export const Route = createFileRoute("/ratio-calculator")({
  head: () => calcRouteHead("ratio-calculator"),
  component: RatioCalculatorPage,
});

function RatioCalculatorPage() {
  const calcMeta = getCalculatorBySlug("ratio-calculator")!;
  const [tab, setTab] = useState<"simplify" | "solve">("simplify");

  // Tab 1: Simplify
  const [simpAStr, setSimpAStr] = useState("1920");
  const [simpBStr, setSimpBStr] = useState("1080");

  const simpA = parseFloat(simpAStr) || 0;
  const simpB = parseFloat(simpBStr) || 0;

  // Tab 2: Solve A:B = C:D (one is null)
  const [propA, setPropA] = useState<string>("4");
  const [propB, setPropB] = useState<string>("3");
  const [propC, setPropC] = useState<string>("800");
  const [propD, setPropD] = useState<string>("");

  const simpResult = useMemo(() => {
    try {
      return simplifyRatio(simpA, simpB);
    } catch {
      return null;
    }
  }, [simpA, simpB]);

  const propResult = useMemo(() => {
    const a = propA.trim() === "" ? null : Number(propA);
    const b = propB.trim() === "" ? null : Number(propB);
    const c = propC.trim() === "" ? null : Number(propC);
    const d = propD.trim() === "" ? null : Number(propD);

    const nullCount = [a, b, c, d].filter((v) => v === null || isNaN(v)).length;
    if (nullCount !== 1) return null;

    try {
      return solveProportion(a, b, c, d);
    } catch {
      return null;
    }
  }, [propA, propB, propC, propD]);

  const getReportInput = useCallback((): CalcReportInput => {
    if (tab === "simplify" && simpResult) {
      return buildCalcReportInput(
        "Ratio Calculator",
        { "Original Ratio": `${simpA} : ${simpB}` },
        `${simpResult.a} : ${simpResult.b}`,
        {
          metrics: [
            { label: "Decimal Ratio", value: `${simpResult.decimalRatio}` },
            {
              label: "Proportions",
              value: `${simpResult.percentageA}% / ${simpResult.percentageB}%`,
            },
          ],
          formula: `${simpA} : ${simpB} = ${simpResult.a} : ${simpResult.b}`,
          explanation: `Dividing both terms by their GCD simplifies the ratio to ${simpResult.a} : ${simpResult.b}.`,
        },
      );
    }

    if (tab === "solve" && propResult) {
      return buildCalcReportInput(
        "Ratio Calculator",
        {
          "Known Values": `A=${propA || "?"}, B=${propB || "?"}, C=${propC || "?"}, D=${propD || "?"}`,
        },
        `${propResult.missing} = ${propResult.value}`,
        {
          metrics: [{ label: "Solved Variable", value: propResult.missing }],
          formula: "A / B = C / D ⟹ Cross-multiplication",
          explanation: propResult.explanation,
        },
      );
    }

    return buildCalcReportInput("Ratio Calculator", {}, "Calculated");
  }, [tab, simpA, simpB, simpResult, propA, propB, propC, propD, propResult]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-6">
        <div className="flex gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setTab("simplify")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === "simplify"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            Simplify Ratio (A : B)
          </button>
          <button
            type="button"
            onClick={() => setTab("solve")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === "solve"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            Solve Proportion (A : B = C : D)
          </button>
        </div>

        {tab === "simplify" && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6 max-w-xl mx-auto">
            <h2 className="text-base font-bold text-foreground text-center">Simplify a Ratio</h2>

            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                value={simpAStr}
                onChange={(e) => setSimpAStr(e.target.value)}
                className="w-28 text-center rounded-xl border border-border bg-background py-2 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
              <span className="text-2xl font-extrabold text-muted-foreground">:</span>
              <input
                type="number"
                value={simpBStr}
                onChange={(e) => setSimpBStr(e.target.value)}
                className="w-28 text-center rounded-xl border border-border bg-background py-2 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Quick aspect ratio presets */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "16:9", a: 16, b: 9 },
                { label: "4:3", a: 4, b: 3 },
                { label: "21:9", a: 21, b: 9 },
                { label: "1:1", a: 1, b: 1 },
                { label: "3:2", a: 3, b: 2 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setSimpAStr(String(p.a));
                    setSimpBStr(String(p.b));
                  }}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {simpResult && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Reduced Ratio
                </span>
                <div className="text-4xl font-extrabold text-foreground">
                  {simpResult.a} : {simpResult.b}
                </div>
                <p className="text-xs text-muted-foreground">
                  Decimal: {simpResult.decimalRatio} · Proportions: {simpResult.percentageA}% and{" "}
                  {simpResult.percentageB}%
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-border">
              <CalcPdfReportButton getReportInput={getReportInput} />
            </div>
          </div>
        )}

        {tab === "solve" && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6 max-w-xl mx-auto">
            <h2 className="text-base font-bold text-foreground text-center">Solve Proportion</h2>
            <p className="text-xs text-muted-foreground text-center">
              Leave exactly one field blank to solve for it.
            </p>

            <div className="flex items-center justify-center gap-3">
              <input
                type="number"
                placeholder="A"
                value={propA}
                onChange={(e) => setPropA(e.target.value)}
                className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
              <span className="font-bold text-muted-foreground">:</span>
              <input
                type="number"
                placeholder="B"
                value={propB}
                onChange={(e) => setPropB(e.target.value)}
                className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
              <span className="font-extrabold text-foreground text-lg">=</span>
              <input
                type="number"
                placeholder="C"
                value={propC}
                onChange={(e) => setPropC(e.target.value)}
                className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
              <span className="font-bold text-muted-foreground">:</span>
              <input
                type="number"
                placeholder="D"
                value={propD}
                onChange={(e) => setPropD(e.target.value)}
                className="w-20 text-center rounded-xl border border-border bg-background py-2 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {propResult && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Solved Unknown ({propResult.missing})
                </span>
                <div className="text-3xl font-extrabold text-foreground">
                  {propResult.missing} = {propResult.value}
                </div>
                <p className="text-xs text-muted-foreground">{propResult.explanation}</p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-border">
              <CalcPdfReportButton getReportInput={getReportInput} />
            </div>
          </div>
        )}
      </div>
    </CalcPageLayout>
  );
}
