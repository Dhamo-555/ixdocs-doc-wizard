import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import {
  calculateGpa,
  calculateCumulativeGpa,
  GRADE_POINTS,
  type CourseEntry,
} from "@/lib/calc-engines/gpa-calculator";

export const Route = createFileRoute("/gpa-calculator")({
  head: () => calcRouteHead("gpa-calculator"),
  component: GpaCalculatorPage,
});

function GpaCalculatorPage() {
  const calcMeta = getCalculatorBySlug("gpa-calculator")!;
  const [courses, setCourses] = useState<CourseEntry[]>([
    { id: "1", name: "Calculus I", grade: "A", credits: 4 },
    { id: "2", name: "Physics Mechanics", grade: "B+", credits: 4 },
    { id: "3", name: "English Composition", grade: "A-", credits: 3 },
    { id: "4", name: "Computer Science I", grade: "A", credits: 3 },
  ]);

  const [priorGpa, setPriorGpa] = useState<string>("");
  const [priorCredits, setPriorCredits] = useState<string>("");

  const result = useMemo(() => calculateGpa(courses), [courses]);

  const cumulativeGpa = useMemo(() => {
    const pGpa = parseFloat(priorGpa);
    const pCreds = parseFloat(priorCredits);
    if (!isNaN(pGpa) && !isNaN(pCreds) && pCreds > 0) {
      return calculateCumulativeGpa(pGpa, pCreds, result.totalGradePoints, result.totalCredits);
    }
    return null;
  }, [priorGpa, priorCredits, result]);

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Course ${prev.length + 1}`, grade: "A", credits: 3 },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseEntry, val: string | number) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
  };

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "GPA Calculator",
      {
        "Total Courses": `${result.courseCount}`,
        "Total Credit Hours": `${result.totalCredits}`,
        ...(cumulativeGpa !== null ? { "Prior GPA": `${priorGpa} (${priorCredits} cr)` } : {}),
      },
      `${result.gpa.toFixed(2)} GPA`,
      {
        metrics: [
          { label: "Semester GPA", value: `${result.gpa.toFixed(2)}` },
          ...(cumulativeGpa !== null
            ? [{ label: "Cumulative GPA", value: `${cumulativeGpa.toFixed(2)}` }]
            : []),
          { label: "Total Grade Points", value: `${result.totalGradePoints}` },
          { label: "Total Credits", value: `${result.totalCredits}` },
        ],
        formula: "GPA = Σ(Grade Points × Credits) / Σ(Credits)",
        explanation: `Semester GPA is ${result.gpa.toFixed(2)} across ${result.totalCredits} credits.`,
      },
    );
  }, [result, cumulativeGpa, priorGpa, priorCredits]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Course Grades</h2>
              <button
                type="button"
                onClick={addCourse}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
              >
                <Plus className="size-3.5" />
                Add Course
              </button>
            </div>

            <div className="space-y-2">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                    placeholder="Course name"
                    className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-600 focus:outline-none"
                  />
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                    className="w-24 rounded-xl border border-border bg-background px-2.5 py-2 text-xs font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                  >
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS[g]?.toFixed(1)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, "credits", Number(e.target.value))}
                    placeholder="Credits"
                    className="w-16 text-center rounded-xl border border-border bg-background py-2 text-xs font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length <= 1}
                    className="p-2 text-muted-foreground hover:text-destructive disabled:opacity-30"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cumulative GPA Forecasting inputs */}
            <div className="pt-4 border-t border-border space-y-2">
              <span className="text-xs font-bold text-foreground block">
                Cumulative Forecast (Optional)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Prior Cumulative GPA (e.g. 3.45)"
                  value={priorGpa}
                  onChange={(e) => setPriorGpa(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-600 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Prior Total Credits (e.g. 45)"
                  value={priorCredits}
                  onChange={(e) => setPriorCredits(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">GPA Score</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Semester GPA
              </span>
              <div className="mt-1 text-5xl font-extrabold text-foreground">
                {result.gpa.toFixed(2)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">4.0 Grade Point Scale</p>
            </div>

            {cumulativeGpa !== null && (
              <div className="rounded-xl border border-border p-3.5 bg-surface/30 text-center">
                <span className="text-xs text-muted-foreground">Projected Cumulative GPA</span>
                <p className="mt-0.5 text-2xl font-bold text-emerald-600">
                  {cumulativeGpa.toFixed(2)}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-border p-2.5 bg-surface/20 text-center">
                <span className="text-muted-foreground block">Credits</span>
                <span className="font-bold text-foreground">{result.totalCredits}</span>
              </div>
              <div className="rounded-xl border border-border p-2.5 bg-surface/20 text-center">
                <span className="text-muted-foreground block">Total Points</span>
                <span className="font-bold text-foreground">{result.totalGradePoints}</span>
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
