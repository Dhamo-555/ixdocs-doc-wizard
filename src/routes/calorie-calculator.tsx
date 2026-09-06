import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateCalories, type ActivityLevel } from "@/lib/calc-engines/calorie-calculator";

export const Route = createFileRoute("/calorie-calculator")({
  head: () => calcRouteHead("calorie-calculator"),
  component: CalorieCalculatorPage,
});

function CalorieCalculatorPage() {
  const calcMeta = getCalculatorBySlug("calorie-calculator")!;
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<number>(28);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  const result = useMemo(() => {
    return calculateCalories(gender, age, weightKg, heightCm, activity);
  }, [gender, age, weightKg, heightCm, activity]);

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Calorie Calculator",
      {
        Gender: gender === "male" ? "Male" : "Female",
        Age: `${age} years`,
        Weight: `${weightKg} kg`,
        Height: `${heightCm} cm`,
        Activity: activity,
      },
      `${result.maintenance.toLocaleString()} kcal / day`,
      {
        metrics: [
          { label: "BMR (Basal Rate)", value: `${result.bmr} kcal` },
          { label: "Maintenance (TDEE)", value: `${result.maintenance} kcal` },
          { label: "Weight Loss (-1 lb/wk)", value: `${result.weightLoss} kcal` },
          { label: "Mild Weight Loss", value: `${result.mildLoss} kcal` },
          { label: "Muscle Gain (+1 lb/wk)", value: `${result.weightGain} kcal` },
        ],
        formula: "BMR (Mifflin-St Jeor) × Physical Activity Multiplier",
        explanation: `Your estimated Basal Metabolic Rate is ${result.bmr} kcal/day. Factoring in your ${activity} physical activity, your daily maintenance energy expenditure is ${result.maintenance} kcal.`,
      },
    );
  }, [gender, age, weightKg, heightCm, activity, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Personal Metrics</h2>

            {/* Gender Switch */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                  gender === "male"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-surface text-muted-foreground"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                  gender === "female"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-surface text-muted-foreground"
                }`}
              >
                Female
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Age (years)
                </label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="20"
                  max="250"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Physical Activity Level
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
              >
                <option value="sedentary">Sedentary (Little or no exercise, desk job)</option>
                <option value="light">Lightly Active (Exercise 1–3 days/week)</option>
                <option value="moderate">Moderately Active (Exercise 3–5 days/week)</option>
                <option value="active">Active (Heavy exercise 6–7 days/week)</option>
                <option value="veryActive">
                  Very Active (Twice-daily training or physical job)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Calorie Targets</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Maintenance (TDEE)
              </span>
              <div className="mt-1 text-4xl font-extrabold text-foreground">
                {result.maintenance.toLocaleString()}{" "}
                <span className="text-lg font-bold text-muted-foreground">kcal/day</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">BMR: {result.bmr} kcal/day</p>
            </div>

            {/* Target goals */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl border border-border bg-surface/30">
                <div>
                  <span className="font-bold text-foreground block">Weight Loss (-0.5 kg/wk)</span>
                  <span className="text-[0.65rem] text-muted-foreground">-500 kcal deficit</span>
                </div>
                <span className="text-base font-extrabold text-emerald-600">
                  {result.weightLoss} kcal
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl border border-border bg-surface/30">
                <div>
                  <span className="font-bold text-foreground block">
                    Mild Weight Loss (-0.25 kg/wk)
                  </span>
                  <span className="text-[0.65rem] text-muted-foreground">-250 kcal deficit</span>
                </div>
                <span className="text-base font-extrabold text-foreground">
                  {result.mildLoss} kcal
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl border border-border bg-surface/30">
                <div>
                  <span className="font-bold text-foreground block">Weight Gain (+0.5 kg/wk)</span>
                  <span className="text-[0.65rem] text-muted-foreground">+500 kcal surplus</span>
                </div>
                <span className="text-base font-extrabold text-amber-600">
                  {result.weightGain} kcal
                </span>
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
