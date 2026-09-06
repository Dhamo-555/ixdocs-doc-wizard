import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateBmiMetric, calculateBmiImperial } from "@/lib/calc-engines/bmi-calculator";

export const Route = createFileRoute("/bmi-calculator")({
  head: () => calcRouteHead("bmi-calculator"),
  component: BmiCalculatorPage,
});

function BmiCalculatorPage() {
  const calcMeta = getCalculatorBySlug("bmi-calculator")!;
  const [unitMode, setUnitMode] = useState<"metric" | "imperial">("metric");

  // Metric
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);

  // Imperial
  const [weightLbs, setWeightLbs] = useState<number>(155);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);

  const result = useMemo(() => {
    if (unitMode === "metric") {
      return calculateBmiMetric(weightKg, heightCm);
    }
    return calculateBmiImperial(weightLbs, heightFeet, heightInches);
  }, [unitMode, weightKg, heightCm, weightLbs, heightFeet, heightInches]);

  const getReportInput = useCallback((): CalcReportInput => {
    const inputs =
      unitMode === "metric"
        ? { Weight: `${weightKg} kg`, Height: `${heightCm} cm` }
        : { Weight: `${weightLbs} lbs`, Height: `${heightFeet}'${heightInches}"` };

    return buildCalcReportInput(
      "BMI Calculator",
      inputs,
      `${result.bmi} BMI (${result.category})`,
      {
        metrics: [
          { label: "BMI Score", value: `${result.bmi}` },
          { label: "Category", value: result.category },
          {
            label: "Healthy Weight Range",
            value:
              unitMode === "metric"
                ? `${result.healthyWeightMin} - ${result.healthyWeightMax} kg`
                : `${Math.round(result.healthyWeightMin * 2.20462)} - ${Math.round(result.healthyWeightMax * 2.20462)} lbs`,
          },
          { label: "BMI Prime", value: `${result.prime}` },
        ],
        formula: "BMI = Weight (kg) / [Height (m)]²",
        explanation: `A BMI of ${result.bmi} places you in the "${result.category}" classification. The WHO healthy weight recommendation for your height is ${result.healthyWeightMin} to ${result.healthyWeightMax} kg.`,
      },
    );
  }, [unitMode, weightKg, heightCm, weightLbs, heightFeet, heightInches, result]);

  const categoryColor = useMemo(() => {
    if (result.category === "Normal weight") return "text-emerald-600 dark:text-emerald-400";
    if (result.category === "Overweight") return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  }, [result.category]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Body Measurements</h2>
              <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
                <button
                  type="button"
                  onClick={() => setUnitMode("metric")}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    unitMode === "metric"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-muted-foreground"
                  }`}
                >
                  Metric (kg, cm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitMode("imperial")}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    unitMode === "imperial"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-muted-foreground"
                  }`}
                >
                  Imperial (lbs, ft)
                </button>
              </div>
            </div>

            {unitMode === "metric" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="260"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Height (feet & inches)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(Number(e.target.value))}
                      placeholder="ft"
                      className="w-1/2 rounded-xl border border-border bg-background px-3 py-2.5 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightInches}
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                      placeholder="in"
                      className="w-1/2 rounded-xl border border-border bg-background px-3 py-2.5 text-base font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">BMI Result</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Body Mass Index
              </span>
              <div className="mt-1 text-5xl font-extrabold text-foreground">{result.bmi}</div>
              <p className={`mt-2 text-base font-extrabold ${categoryColor}`}>{result.category}</p>
            </div>

            <div className="rounded-xl border border-border p-3.5 bg-surface/30 space-y-1 text-xs">
              <span className="text-muted-foreground block">Healthy Weight For Your Height:</span>
              <p className="font-bold text-foreground text-sm">
                {unitMode === "metric"
                  ? `${result.healthyWeightMin} – ${result.healthyWeightMax} kg`
                  : `${Math.round(result.healthyWeightMin * 2.20462)} – ${Math.round(result.healthyWeightMax * 2.20462)} lbs`}
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
