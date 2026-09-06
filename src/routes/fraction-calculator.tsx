import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateFractions } from "@/lib/calc-engines/fraction-calculator";

export const Route = createFileRoute("/fraction-calculator")({
  head: () => calcRouteHead("fraction-calculator"),
  component: FractionCalculatorPage,
});

type FractionOp = "+" | "-" | "×" | "÷";

function FractionCalculatorPage() {
  const calcMeta = getCalculatorBySlug("fraction-calculator")!;
  const [n1, setN1] = useState<number>(3);
  const [d1, setD1] = useState<number>(4);
  const [op, setOp] = useState<FractionOp>("+");
  const [n2, setN2] = useState<number>(2);
  const [d2, setD2] = useState<number>(5);

  const result = useMemo(() => {
    try {
      return calculateFractions(n1, d1, op, n2, d2);
    } catch {
      return null;
    }
  }, [n1, d1, op, n2, d2]);

  const getReportInput = useCallback((): CalcReportInput => {
    if (!result) return buildCalcReportInput("Fraction Calculator", {}, "Error");

    const answerFraction = `${result.numerator}/${result.denominator}`;
    const mixed =
      result.whole !== undefined && result.mixedRemainder
        ? `${result.whole} ${result.mixedRemainder}/${result.denominator}`
        : undefined;

    return buildCalcReportInput(
      "Fraction Calculator",
      {
        "First Fraction": `${n1}/${d1}`,
        Operation: op,
        "Second Fraction": `${n2}/${d2}`,
      },
      answerFraction,
      {
        metrics: [
          { label: "Decimal Value", value: `${result.decimal}` },
          ...(mixed ? [{ label: "Mixed Number", value: mixed }] : []),
        ],
        formula: `${n1}/${d1} ${op} ${n2}/${d2} = ${answerFraction}`,
        explanation: result.steps.join("\n"),
      },
    );
  }, [n1, d1, op, n2, d2, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6 max-w-2xl mx-auto">
          <h2 className="text-base font-bold text-foreground text-center">Enter Fractions</h2>

          {/* Fraction Input Expression Row */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Fraction 1 */}
            <div className="flex flex-col items-center gap-1.5 w-24 sm:w-28">
              <input
                type="number"
                value={n1}
                onChange={(e) => setN1(Number(e.target.value))}
                aria-label="Numerator 1"
                className="w-full text-center rounded-xl border border-border bg-background py-2 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
              <div className="h-0.5 w-full bg-foreground/40 rounded-full" />
              <input
                type="number"
                value={d1}
                onChange={(e) => setD1(Number(e.target.value))}
                aria-label="Denominator 1"
                className="w-full text-center rounded-xl border border-border bg-background py-2 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Operator Buttons */}
            <div className="flex flex-col gap-1">
              {(["+", "-", "×", "÷"] as FractionOp[]).map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOp(o)}
                  className={`size-9 rounded-xl text-base font-extrabold transition ${
                    op === o
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>

            {/* Fraction 2 */}
            <div className="flex flex-col items-center gap-1.5 w-24 sm:w-28">
              <input
                type="number"
                value={n2}
                onChange={(e) => setN2(Number(e.target.value))}
                aria-label="Numerator 2"
                className="w-full text-center rounded-xl border border-border bg-background py-2 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
              <div className="h-0.5 w-full bg-foreground/40 rounded-full" />
              <input
                type="number"
                value={d2}
                onChange={(e) => setD2(Number(e.target.value))}
                aria-label="Denominator 2"
                className="w-full text-center rounded-xl border border-border bg-background py-2 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Solution & Result */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Simplified Result
                </span>
                <div className="mt-2 flex items-center justify-center gap-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    {result.numerator} / {result.denominator}
                  </span>
                  {result.whole !== undefined && result.mixedRemainder ? (
                    <span className="text-xl font-bold text-muted-foreground">
                      (= {result.whole} {result.mixedRemainder}/{result.denominator})
                    </span>
                  ) : null}
                  <span className="text-base text-muted-foreground">≈ {result.decimal}</span>
                </div>
              </div>

              {/* Step by step */}
              <div className="rounded-2xl border border-border p-4 bg-surface/30 space-y-2 text-xs">
                <span className="font-bold text-foreground block mb-1">Step-by-Step Solution:</span>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  {result.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="flex justify-end pt-2">
                <CalcPdfReportButton getReportInput={getReportInput} />
              </div>
            </div>
          )}
        </div>
      </div>
    </CalcPageLayout>
  );
}
