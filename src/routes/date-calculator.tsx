import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, Plus, Minus, ArrowRight, Briefcase, Sun } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateDateDifference, addOrSubtractFromDate } from "@/lib/calc-engines/date-calculator";

export const Route = createFileRoute("/date-calculator")({
  head: () => calcRouteHead("date-calculator"),
  component: DateCalculatorPage,
});

function getTodayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

function DateCalculatorPage() {
  const calcMeta = getCalculatorBySlug("date-calculator")!;
  const [tab, setTab] = useState<"diff" | "add">("diff");

  // Difference inputs
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return format(nextMonth, "yyyy-MM-dd");
  });

  // Add / Subtract inputs
  const [baseDate, setBaseDate] = useState(getTodayString());
  const [amount, setAmount] = useState(30);
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const diffResult = useMemo(() => {
    try {
      const d1 = new Date(startDate + "T00:00:00");
      const d2 = new Date(endDate + "T00:00:00");
      return calculateDateDifference(d1, d2);
    } catch {
      return null;
    }
  }, [startDate, endDate]);

  const addResult = useMemo(() => {
    try {
      const d = new Date(baseDate + "T00:00:00");
      return addOrSubtractFromDate(d, amount, unit, operation);
    } catch {
      return null;
    }
  }, [baseDate, amount, unit, operation]);

  const getReportInput = useCallback((): CalcReportInput => {
    if (tab === "diff") {
      if (!diffResult) {
        return buildCalcReportInput("Date Difference Calculator", {}, "Invalid Date Range");
      }

      const pctBusiness = Math.round(
        ((diffResult.businessDays || 0) / (diffResult.totalDays || 1)) * 100,
      );

      const insight = `The interval between ${startDate} and ${endDate} spans ${diffResult.totalDays} calendar days (${diffResult.businessDays} business days and ${diffResult.weekendDays} weekend days). Working days represent ${pctBusiness}% of the total elapsed duration.`;

      return buildCalcReportInput(
        "Date Duration Calculator",
        {
          "Start Date": startDate,
          "End Date": endDate,
          "Calendar Summary": diffResult.formattedSummary,
        },
        `${diffResult.totalDays} Total Days`,
        {
          metrics: [
            { label: "Business Days", value: `${diffResult.businessDays} days` },
            { label: "Weekend Days", value: `${diffResult.weekendDays} days` },
            { label: "Total Weeks", value: `${diffResult.totalWeeks} weeks` },
          ],
          formula: "Duration = EndDate - StartDate (excluding or categorizing weekends)",
          explanation:
            "Evaluates elapsed duration between two calendar dates, segmenting standard weekdays from weekends.",
          aiAnalysis: insight,
        },
      );
    } else {
      if (!addResult) {
        return buildCalcReportInput("Date Offset Calculator", {}, "Invalid Date");
      }

      const insight = `${operation === "add" ? "Adding" : "Subtracting"} ${amount} ${unit} to/from ${baseDate} yields ${addResult.formattedDate}, which falls on a ${addResult.dayOfWeek}.`;

      return buildCalcReportInput(
        "Date Offset Calculator",
        {
          "Base Date": baseDate,
          Operation: operation === "add" ? "Add (+)" : "Subtract (-)",
          Amount: `${amount} ${unit}`,
        },
        addResult.formattedDate,
        {
          metrics: [
            { label: "Day of Week", value: addResult.dayOfWeek },
            { label: "Target Date", value: addResult.formattedDate },
          ],
          formula: `TargetDate = BaseDate ${operation === "add" ? "+" : "-"} Offset`,
          explanation:
            "Adjusts a base date forward or backward by a specified duration in days, weeks, months, or years.",
          aiAnalysis: insight,
        },
      );
    }
  }, [tab, diffResult, addResult, startDate, endDate, baseDate, amount, unit, operation]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex rounded-xl border border-border bg-surface p-1 max-w-md">
          <button
            type="button"
            onClick={() => setTab("diff")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              tab === "diff"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Duration Between Dates
          </button>
          <button
            type="button"
            onClick={() => setTab("add")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              tab === "add"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Add / Subtract Days
          </button>
        </div>

        {tab === "diff" ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            {diffResult ? (
              <div className="space-y-4">
                {/* Highlight banner */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-6">
                  <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                    Total Duration
                  </div>
                  <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {diffResult.totalDays} Days
                  </div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">
                    Equals {diffResult.formattedSummary} ({diffResult.totalWeeks} weeks and{" "}
                    {diffResult.remainingDays} days)
                  </div>
                </div>

                {/* Breakdown cards */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <Briefcase className="size-5" />
                    </span>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Business / Workdays
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {diffResult.businessDays} days
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      <Sun className="size-5" />
                    </span>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Weekend Days</div>
                      <div className="text-lg font-bold text-foreground">
                        {diffResult.weekendDays} days
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Base Date
                </label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Action & Quantity
                </label>
                <div className="flex gap-2">
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value as "add" | "subtract")}
                    className="h-11 rounded-xl border border-border bg-background px-2.5 text-sm font-semibold text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="add">+ Add</option>
                    <option value="subtract">− Subtract</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-mono font-bold text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "days" | "weeks" | "months" | "years")}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>

            {addResult ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-6">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  Resulting Date
                </div>
                <div className="mt-1 text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {addResult.formattedDate}
                </div>
                <div className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Falls on a {addResult.dayOfWeek}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Action Bar: Download PDF Report */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-border bg-surface/60 p-4">
          <div>
            <div className="text-xs font-bold text-foreground">
              Official PDF Date & Timeline Report
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Download a complete summary of date spans, business days, or shifted target dates.
            </div>
          </div>
          <CalcPdfReportButton
            getInput={getReportInput}
            filename={`Date-Calculation-${tab}`}
            label="Download PDF Report"
            variant="primary"
          />
        </div>
      </div>
    </CalcPageLayout>
  );
}
