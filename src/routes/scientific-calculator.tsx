import { useState, useCallback, useId } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { History, RotateCcw, Delete } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { evaluateExpression, type AngleMode } from "@/lib/calc-engines/scientific-calculator";

export const Route = createFileRoute("/scientific-calculator")({
  head: () => calcRouteHead("scientific-calculator"),
  component: ScientificCalculatorPage,
});

interface CalcHistoryItem {
  id: string;
  expression: string;
  result: string;
}

function ScientificCalculatorPage() {
  const calcMeta = getCalculatorBySlug("scientific-calculator")!;
  const [expression, setExpression] = useState<string>("");
  const [displayResult, setDisplayResult] = useState<string>("0");
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");
  const [memory, setMemory] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);
  const [history, setHistory] = useState<CalcHistoryItem[]>([]);
  const [isSecond, setIsSecond] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputId = useId();

  // ── Append character or function to expression ──────────────────────────────
  const append = useCallback((val: string) => {
    setErrorMessage(null);
    setExpression((prev) => prev + val);
  }, []);

  const appendFunction = useCallback((fn: string) => {
    setErrorMessage(null);
    setExpression((prev) => prev + fn + "(");
  }, []);

  // ── Clear all ───────────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    setExpression("");
    setDisplayResult("0");
    setErrorMessage(null);
  }, []);

  // ── Backspace ───────────────────────────────────────────────────────────────
  const handleBackspace = useCallback(() => {
    setErrorMessage(null);
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  // ── Calculate ───────────────────────────────────────────────────────────────
  const handleCalculate = useCallback(() => {
    if (!expression.trim()) return;
    const res = evaluateExpression(expression, angleMode);
    if (res.success && res.value !== undefined) {
      const formatted = res.value.toString();
      setDisplayResult(formatted);
      setErrorMessage(null);
      setHistory((prev) => [
        { id: Date.now().toString(), expression, result: formatted },
        ...prev.slice(0, 19),
      ]);
    } else {
      setErrorMessage(res.error || "Syntax error");
    }
  }, [expression, angleMode]);

  // ── Memory actions ──────────────────────────────────────────────────────────
  const handleMemoryClear = useCallback(() => {
    setMemory(0);
    setHasMemory(false);
  }, []);

  const handleMemoryRecall = useCallback(() => {
    if (hasMemory) {
      append(memory.toString());
    }
  }, [hasMemory, memory, append]);

  const handleMemoryAdd = useCallback(() => {
    const current = parseFloat(displayResult);
    if (!isNaN(current)) {
      setMemory((prev) => prev + current);
      setHasMemory(true);
    }
  }, [displayResult]);

  const handleMemorySubtract = useCallback(() => {
    const current = parseFloat(displayResult);
    if (!isNaN(current)) {
      setMemory((prev) => prev - current);
      setHasMemory(true);
    }
  }, [displayResult]);

  // ── Negate current value ───────────────────────────────────────────────────
  const handleNegate = useCallback(() => {
    setExpression((prev) => {
      if (!prev) return "-";
      if (prev.endsWith("-")) return prev.slice(0, -1);
      return prev + "-";
    });
  }, []);

  // ── Report input ────────────────────────────────────────────────────────────
  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Scientific Calculator",
      {
        Expression: expression || "0",
        "Angle Mode": angleMode.toUpperCase(),
        "Calculation Time": new Date().toLocaleTimeString(),
      },
      displayResult,
      {
        metrics: [
          { label: "Result", value: displayResult },
          { label: "Angle Unit", value: angleMode.toUpperCase() },
          { label: "Memory Stored", value: hasMemory ? memory.toString() : "0" },
        ],
        formula: expression ? `${expression} = ${displayResult}` : "Standard Scientific Notation",
        explanation: `Evaluated ${expression || "0"} in ${angleMode.toUpperCase()} mode resulting in ${displayResult}.`,
      },
    );
  }, [expression, angleMode, displayResult, hasMemory, memory]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Display Screen */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-3">
          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAngleMode(angleMode === "deg" ? "rad" : "deg")}
                className="rounded-lg bg-surface border border-border px-2.5 py-1 font-bold text-foreground hover:bg-muted transition-colors"
                title="Toggle Angle Mode"
              >
                {angleMode.toUpperCase()}
              </button>
              {hasMemory && (
                <span className="rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 text-[0.65rem] font-bold">
                  M
                </span>
              )}
            </div>
            {errorMessage && (
              <span className="text-xs font-semibold text-destructive animate-pulse">
                {errorMessage}
              </span>
            )}
          </div>

          {/* Expression Input / Display */}
          <div className="space-y-1">
            <label htmlFor={inputId} className="sr-only">
              Scientific Calculator Expression
            </label>
            <input
              id={inputId}
              type="text"
              value={expression}
              onChange={(e) => {
                setErrorMessage(null);
                setExpression(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCalculate();
              }}
              placeholder="0"
              className="w-full bg-transparent text-right font-mono text-xl sm:text-2xl font-semibold text-muted-foreground focus:outline-none placeholder:text-muted-foreground/50"
            />
            {/* Primary Result Display */}
            <div className="text-right font-mono text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight overflow-x-auto select-all">
              {displayResult}
            </div>
          </div>
        </div>

        {/* Keypad */}
        <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3">
          {/* Memory & Function Header Row */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-xs">
            <button
              type="button"
              onClick={handleMemoryClear}
              disabled={!hasMemory}
              className="rounded-xl border border-border bg-surface/50 py-2 font-bold text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-40"
            >
              MC
            </button>
            <button
              type="button"
              onClick={handleMemoryRecall}
              disabled={!hasMemory}
              className="rounded-xl border border-border bg-surface/50 py-2 font-bold text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-40"
            >
              MR
            </button>
            <button
              type="button"
              onClick={handleMemoryAdd}
              className="rounded-xl border border-border bg-surface/50 py-2 font-bold text-muted-foreground hover:text-foreground hover:bg-surface"
            >
              M+
            </button>
            <button
              type="button"
              onClick={handleMemorySubtract}
              className="rounded-xl border border-border bg-surface/50 py-2 font-bold text-muted-foreground hover:text-foreground hover:bg-surface"
            >
              M-
            </button>
            <button
              type="button"
              onClick={() => setIsSecond(!isSecond)}
              className={`rounded-xl border border-border py-2 font-bold transition-colors ${
                isSecond
                  ? "bg-emerald-600 text-white"
                  : "bg-surface/50 text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              2nd
            </button>
          </div>

          {/* Scientific Keypad Grid */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold">
            {/* Row 1 */}
            <button
              type="button"
              onClick={() => appendFunction(isSecond ? "asin" : "sin")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              {isSecond ? "sin⁻¹" : "sin"}
            </button>
            <button
              type="button"
              onClick={() => appendFunction(isSecond ? "acos" : "cos")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              {isSecond ? "cos⁻¹" : "cos"}
            </button>
            <button
              type="button"
              onClick={() => appendFunction(isSecond ? "atan" : "tan")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              {isSecond ? "tan⁻¹" : "tan"}
            </button>
            <button
              type="button"
              onClick={() => append("(")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              (
            </button>
            <button
              type="button"
              onClick={() => append(")")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              )
            </button>

            {/* Row 2 */}
            <button
              type="button"
              onClick={() => (isSecond ? appendFunction("cbrt") : appendFunction("sqrt"))}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              {isSecond ? "∛x" : "√x"}
            </button>
            <button
              type="button"
              onClick={() => append("^")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              xʸ
            </button>
            <button
              type="button"
              onClick={() => append("^2")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              x²
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-border bg-destructive/10 text-destructive font-bold py-2.5 hover:bg-destructive/20"
            >
              C
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="flex items-center justify-center rounded-xl border border-border bg-surface/80 py-2.5 text-foreground hover:bg-surface"
              title="Backspace"
            >
              <Delete className="size-4" />
            </button>

            {/* Row 3 */}
            <button
              type="button"
              onClick={() => (isSecond ? append("10^") : appendFunction("log"))}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              {isSecond ? "10ˣ" : "log"}
            </button>
            <button
              type="button"
              onClick={() => (isSecond ? append("e^") : appendFunction("ln"))}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              {isSecond ? "eˣ" : "ln"}
            </button>
            <button
              type="button"
              onClick={() => append("!")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              n!
            </button>
            <button
              type="button"
              onClick={() => append("%")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              %
            </button>
            <button
              type="button"
              onClick={() => append("/")}
              className="rounded-xl border border-emerald-600/20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold py-2.5 hover:bg-emerald-100"
            >
              ÷
            </button>

            {/* Row 4: 7, 8, 9, *, π */}
            <button
              type="button"
              onClick={() => append("π")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              π
            </button>
            <button
              type="button"
              onClick={() => append("7")}
              className="rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              7
            </button>
            <button
              type="button"
              onClick={() => append("8")}
              className="rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              8
            </button>
            <button
              type="button"
              onClick={() => append("9")}
              className="rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              9
            </button>
            <button
              type="button"
              onClick={() => append("*")}
              className="rounded-xl border border-emerald-600/20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold py-2.5 hover:bg-emerald-100"
            >
              ×
            </button>

            {/* Row 5: 4, 5, 6, -, e */}
            <button
              type="button"
              onClick={() => append("e")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              e
            </button>
            <button
              type="button"
              onClick={() => append("4")}
              className="rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              4
            </button>
            <button
              type="button"
              onClick={() => append("5")}
              className="rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              5
            </button>
            <button
              type="button"
              onClick={() => append("6")}
              className="rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              6
            </button>
            <button
              type="button"
              onClick={() => append("-")}
              className="rounded-xl border border-emerald-600/20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold py-2.5 hover:bg-emerald-100"
            >
              −
            </button>

            {/* Row 6: 1, 2, 3, +, +/- */}
            <button
              type="button"
              onClick={handleNegate}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              ±
            </button>
            <button
              type="button"
              onClick={() => append("1")}
              className="rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              1
            </button>
            <button
              type="button"
              onClick={() => append("2")}
              className="rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              2
            </button>
            <button
              type="button"
              onClick={() => append("3")}
              className="rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              3
            </button>
            <button
              type="button"
              onClick={() => append("+")}
              className="rounded-xl border border-emerald-600/20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold py-2.5 hover:bg-emerald-100"
            >
              +
            </button>

            {/* Row 7: 0, ., = */}
            <button
              type="button"
              onClick={() => appendFunction("abs")}
              className="rounded-xl border border-border bg-surface/60 py-2.5 text-foreground hover:bg-surface"
            >
              |x|
            </button>
            <button
              type="button"
              onClick={() => append("0")}
              className="col-span-2 rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => append(".")}
              className="rounded-xl border border-border bg-background py-2.5 text-foreground font-bold text-base hover:bg-surface"
            >
              .
            </button>
            <button
              type="button"
              onClick={handleCalculate}
              className="rounded-xl bg-emerald-600 font-extrabold text-white text-base py-2.5 shadow-xs hover:bg-emerald-700 transition-colors"
            >
              =
            </button>
          </div>

          {/* Action Row: PDF Report */}
          <div className="pt-3 border-t border-border flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">
              Supports standard mathematical notation & order of operations
            </span>
            <CalcPdfReportButton getReportInput={getReportInput} />
          </div>
        </div>

        {/* Calculation History */}
        {history.length > 0 && (
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <History className="size-4 text-emerald-600" />
                Session History
              </h3>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                Clear History
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-border/60 text-xs font-mono">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setExpression(item.expression);
                    setDisplayResult(item.result);
                  }}
                  className="py-2 px-1 flex items-center justify-between hover:bg-surface/50 rounded-lg cursor-pointer transition-colors"
                  title="Click to restore calculation"
                >
                  <span className="text-muted-foreground truncate max-w-[65%]">
                    {item.expression}
                  </span>
                  <span className="font-bold text-foreground">{item.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalcPageLayout>
  );
}
