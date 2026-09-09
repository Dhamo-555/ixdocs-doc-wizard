import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, GraduationCap, Calculator } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import {
  calculateGpa,
  calculateCumulativeGpa,
  calculateCgpaFromSemesters,
  GRADE_POINTS,
  GRADE_DESCRIPTIONS,
  type CourseEntry,
  type SemesterEntry,
} from "@/lib/calc-engines/gpa-calculator";

export const Route = createFileRoute("/gpa-calculator")({
  head: () => calcRouteHead("gpa-calculator"),
  component: GpaCalculatorPage,
});

type CalculatorMode = "sgpa" | "cgpa";

function GpaCalculatorPage() {
  const calcMeta = getCalculatorBySlug("gpa-calculator")!;
  const [mode, setMode] = useState<CalculatorMode>("sgpa");

  // --- SGPA State ---
  const [courses, setCourses] = useState<CourseEntry[]>([
    { id: "1", name: "Engineering Mathematics", grade: "O", credits: 4 },
    { id: "2", name: "Data Structures & Algorithms", grade: "A+", credits: 4 },
    { id: "3", name: "Operating Systems", grade: "A", credits: 3 },
    { id: "4", name: "Object Oriented Programming", grade: "A+", credits: 3 },
    { id: "5", name: "Database Management Lab", grade: "O", credits: 2 },
  ]);

  const [priorCgpa, setPriorCgpa] = useState<string>("");
  const [priorCredits, setPriorCredits] = useState<string>("");

  // --- CGPA Multi-Semester State ---
  const [semesters, setSemesters] = useState<SemesterEntry[]>([
    { id: "s1", name: "Semester 1", sgpa: 8.8, credits: 22 },
    { id: "s2", name: "Semester 2", sgpa: 9.1, credits: 24 },
    { id: "s3", name: "Semester 3", sgpa: 8.6, credits: 20 },
    { id: "s4", name: "Semester 4", sgpa: 9.0, credits: 22 },
  ]);

  // Calculations
  const sgpaResult = useMemo(() => calculateGpa(courses), [courses]);

  const cumulativeFromPrior = useMemo(() => {
    const pGpa = parseFloat(priorCgpa);
    const pCreds = parseFloat(priorCredits);
    if (!isNaN(pGpa) && !isNaN(pCreds) && pCreds > 0) {
      return calculateCumulativeGpa(
        pGpa,
        pCreds,
        sgpaResult.totalGradePoints,
        sgpaResult.totalCredits,
      );
    }
    return null;
  }, [priorCgpa, priorCredits, sgpaResult]);

  const cgpaResult = useMemo(() => calculateCgpaFromSemesters(semesters), [semesters]);

  // Course handlers
  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Subject ${prev.length + 1}`, grade: "A", credits: 3 },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));
  };

  const updateCourse = (id: string, field: keyof CourseEntry, val: string | number) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
  };

  // Semester handlers
  const addSemester = () => {
    setSemesters((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Semester ${prev.length + 1}`, sgpa: 8.5, credits: 20 },
    ]);
  };

  const removeSemester = (id: string) => {
    setSemesters((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  };

  const updateSemester = (id: string, field: keyof SemesterEntry, val: string | number) => {
    setSemesters((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };

  const getReportInput = useCallback((): CalcReportInput => {
    if (mode === "sgpa") {
      return buildCalcReportInput(
        "GPA / SGPA Calculator (10-Point Scale)",
        {
          "Subjects Evaluated": `${sgpaResult.courseCount}`,
          "Total Credit Hours": `${sgpaResult.totalCredits}`,
          ...(cumulativeFromPrior !== null
            ? { "Prior Standing": `CGPA ${priorCgpa} (${priorCredits} credits)` }
            : {}),
        },
        `${sgpaResult.gpa.toFixed(2)} SGPA`,
        {
          metrics: [
            { label: "Semester SGPA", value: `${sgpaResult.gpa.toFixed(2)} / 10.0` },
            { label: "Approx. Percentage", value: `${sgpaResult.percentageEquivalent}%` },
            ...(cumulativeFromPrior !== null
              ? [
                  {
                    label: "Forecast Cumulative CGPA",
                    value: `${cumulativeFromPrior.toFixed(2)} / 10.0`,
                  },
                ]
              : []),
            { label: "Total Grade Points", value: `${sgpaResult.totalGradePoints}` },
            { label: "Total Credits", value: `${sgpaResult.totalCredits}` },
          ],
          formula: "SGPA = Σ(Grade Points × Credits) / Σ(Credits) [10-Point Scale]",
          explanation: `SGPA is ${sgpaResult.gpa.toFixed(2)} based on ${sgpaResult.totalCredits} credits. Percentage equivalent is approx ${sgpaResult.percentageEquivalent}%.`,
        },
      );
    }

    return buildCalcReportInput(
      "CGPA Calculator (10-Point Scale)",
      {
        "Semesters Count": `${semesters.length}`,
        "Total Academic Credits": `${cgpaResult.totalCredits}`,
      },
      `${cgpaResult.cgpa.toFixed(2)} CGPA`,
      {
        metrics: [
          { label: "Cumulative CGPA", value: `${cgpaResult.cgpa.toFixed(2)} / 10.0` },
          { label: "Approx. Percentage", value: `${cgpaResult.percentageEquivalent}%` },
          { label: "Total Grade Points", value: `${cgpaResult.totalPoints}` },
          { label: "Total Credits", value: `${cgpaResult.totalCredits}` },
        ],
        formula: "CGPA = Σ(Semester SGPA × Semester Credits) / Σ(Total Credits)",
        explanation: `Overall CGPA is ${cgpaResult.cgpa.toFixed(2)} across ${cgpaResult.totalCredits} credits. Percentage equivalent is approx ${cgpaResult.percentageEquivalent}%.`,
      },
    );
  }, [mode, sgpaResult, cumulativeFromPrior, priorCgpa, priorCredits, semesters, cgpaResult]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex rounded-2xl bg-surface/50 p-1.5 border border-border/80 max-w-md">
          <button
            type="button"
            onClick={() => setMode("sgpa")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
              mode === "sgpa"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="size-4" />
            Semester SGPA
          </button>
          <button
            type="button"
            onClick={() => setMode("cgpa")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
              mode === "cgpa"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calculator className="size-4" />
            Cumulative CGPA
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Input Form */}
          <div className="space-y-6 lg:col-span-8">
            {mode === "sgpa" ? (
              <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-foreground">
                      Semester Subjects
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Standard 10-Point Indian University Grading System
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addCourse}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-transform"
                  >
                    <Plus className="size-3.5" />
                    Add Subject
                  </button>
                </div>

                <div className="space-y-2.5">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl border border-border/70 bg-surface/30 p-2.5 sm:border-0 sm:bg-transparent sm:p-0"
                    >
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                        placeholder="Subject name"
                        className="w-full sm:flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-600 focus:outline-none"
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                          className="flex-1 sm:w-36 rounded-xl border border-border bg-background px-2.5 py-2 text-xs font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                        >
                          {Object.keys(GRADE_POINTS).map((g) => (
                            <option key={g} value={g}>
                              {g} — {GRADE_DESCRIPTIONS[g] || `${GRADE_POINTS[g]} pts`}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={course.credits === 0 ? "" : course.credits}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCourse(
                                course.id,
                                "credits",
                                val === "" ? 0 : Math.max(0, Number(val)),
                              );
                            }}
                            placeholder="Credits"
                            className="w-16 text-center rounded-xl border border-border bg-background py-2 text-xs font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                          />
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            Cr
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCourse(course.id)}
                          disabled={courses.length <= 1}
                          className="p-2 text-muted-foreground hover:text-destructive disabled:opacity-30 shrink-0"
                          title="Remove subject"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cumulative Forecast */}
                <div className="pt-4 border-t border-border space-y-2">
                  <span className="text-xs font-bold text-foreground block">
                    Forecast Overall CGPA (Optional)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="Prior CGPA (e.g. 8.45)"
                      value={priorCgpa}
                      onChange={(e) => setPriorCgpa(e.target.value)}
                      className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-600 focus:outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Prior Total Credits (e.g. 60)"
                      value={priorCredits}
                      onChange={(e) => setPriorCredits(e.target.value)}
                      className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Cumulative CGPA Multi-Semester Input */
              <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-foreground">
                      Semester Breakdown
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Calculate Cumulative GPA from semester SGPAs and credit loads
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addSemester}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-transform"
                  >
                    <Plus className="size-3.5" />
                    Add Semester
                  </button>
                </div>

                <div className="space-y-2.5">
                  {semesters.map((sem) => (
                    <div
                      key={sem.id}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl border border-border/70 bg-surface/30 p-2.5 sm:border-0 sm:bg-transparent sm:p-0"
                    >
                      <input
                        type="text"
                        value={sem.name}
                        onChange={(e) => updateSemester(sem.id, "name", e.target.value)}
                        placeholder="Semester name"
                        className="w-full sm:flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-600 focus:outline-none"
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex-1 sm:w-28 flex items-center gap-1">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={sem.sgpa === 0 ? "" : sem.sgpa}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateSemester(sem.id, "sgpa", val === "" ? 0 : Number(val));
                            }}
                            placeholder="SGPA"
                            className="w-full text-center rounded-xl border border-border bg-background py-2 text-xs font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                          />
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            SGPA
                          </span>
                        </div>
                        <div className="flex-1 sm:w-24 flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={sem.credits === 0 ? "" : sem.credits}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateSemester(
                                sem.id,
                                "credits",
                                val === "" ? 0 : Math.max(0, Number(val)),
                              );
                            }}
                            placeholder="Credits"
                            className="w-full text-center rounded-xl border border-border bg-background py-2 text-xs font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                          />
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            Cr
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSemester(sem.id)}
                          disabled={semesters.length <= 1}
                          className="p-2 text-muted-foreground hover:text-destructive disabled:opacity-30 shrink-0"
                          title="Remove semester"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grading Scale Reference Table */}
            <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                Standard 10-Point Grading Scale Reference
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-muted-foreground">
                  <thead className="border-b border-border text-[11px] font-bold uppercase text-foreground">
                    <tr>
                      <th className="py-2 pr-4">Letter Grade</th>
                      <th className="py-2 px-4">Performance</th>
                      <th className="py-2 px-4">Grade Point</th>
                      <th className="py-2 pl-4">Standard Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-1.5 pr-4 font-bold text-foreground">O</td>
                      <td className="py-1.5 px-4">Outstanding</td>
                      <td className="py-1.5 px-4 font-bold text-emerald-600">10</td>
                      <td className="py-1.5 pl-4">90 - 100%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-4 font-bold text-foreground">A+</td>
                      <td className="py-1.5 px-4">Excellent</td>
                      <td className="py-1.5 px-4 font-bold text-emerald-600">9</td>
                      <td className="py-1.5 pl-4">80 - 89%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-4 font-bold text-foreground">A</td>
                      <td className="py-1.5 px-4">Very Good</td>
                      <td className="py-1.5 px-4 font-bold text-emerald-600">8</td>
                      <td className="py-1.5 pl-4">70 - 79%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-4 font-bold text-foreground">B+</td>
                      <td className="py-1.5 px-4">Good</td>
                      <td className="py-1.5 px-4 font-bold text-emerald-600">7</td>
                      <td className="py-1.5 pl-4">60 - 69%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-4 font-bold text-foreground">B</td>
                      <td className="py-1.5 px-4">Above Average</td>
                      <td className="py-1.5 px-4 font-bold text-emerald-600">6</td>
                      <td className="py-1.5 pl-4">55 - 59%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-4 font-bold text-foreground">C</td>
                      <td className="py-1.5 px-4">Pass</td>
                      <td className="py-1.5 px-4 font-bold text-emerald-600">5</td>
                      <td className="py-1.5 pl-4">50 - 54%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-4 font-bold text-destructive">F / RA</td>
                      <td className="py-1.5 px-4">Reappear / Fail</td>
                      <td className="py-1.5 px-4 font-bold text-destructive">0</td>
                      <td className="py-1.5 pl-4">&lt; 50%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="space-y-6 lg:col-span-4">
            <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-foreground">Academic Standing</h2>

              {mode === "sgpa" ? (
                <>
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Semester SGPA
                    </span>
                    <div className="mt-1 text-5xl font-extrabold text-foreground">
                      {sgpaResult.gpa.toFixed(2)}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Out of 10.0 Scale</p>
                    <div className="mt-2 inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ≈ {sgpaResult.percentageEquivalent}% Marks
                    </div>
                  </div>

                  {cumulativeFromPrior !== null && (
                    <div className="rounded-xl border border-border p-3.5 bg-surface/30 text-center">
                      <span className="text-xs text-muted-foreground">
                        Forecast Cumulative CGPA
                      </span>
                      <p className="mt-0.5 text-2xl font-bold text-emerald-600">
                        {cumulativeFromPrior.toFixed(2)} / 10.0
                      </p>
                      <span className="text-[11px] text-muted-foreground">
                        ≈ {(cumulativeFromPrior * 9.5).toFixed(1)}% Marks
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-border p-2.5 bg-surface/20 text-center">
                      <span className="text-muted-foreground block">Credits</span>
                      <span className="font-bold text-foreground">{sgpaResult.totalCredits}</span>
                    </div>
                    <div className="rounded-xl border border-border p-2.5 bg-surface/20 text-center">
                      <span className="text-muted-foreground block">Grade Points</span>
                      <span className="font-bold text-foreground">
                        {sgpaResult.totalGradePoints}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Cumulative CGPA
                    </span>
                    <div className="mt-1 text-5xl font-extrabold text-foreground">
                      {cgpaResult.cgpa.toFixed(2)}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Out of 10.0 Scale</p>
                    <div className="mt-2 inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ≈ {cgpaResult.percentageEquivalent}% Marks
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-border p-2.5 bg-surface/20 text-center">
                      <span className="text-muted-foreground block">Total Credits</span>
                      <span className="font-bold text-foreground">{cgpaResult.totalCredits}</span>
                    </div>
                    <div className="rounded-xl border border-border p-2.5 bg-surface/20 text-center">
                      <span className="text-muted-foreground block">Total Points</span>
                      <span className="font-bold text-foreground">{cgpaResult.totalPoints}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-border">
                <CalcPdfReportButton getReportInput={getReportInput} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
