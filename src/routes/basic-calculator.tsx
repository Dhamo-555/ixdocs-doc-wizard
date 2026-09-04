import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check, RotateCcw, Delete } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { getCalculatorBySlug } from "@/lib/calculators";
import { evaluateExpression } from "@/lib/calc-engines/basic-calculator";

const calcMeta = getCalculatorBySlug("basic-calculator")!;

export const Route = createFileRoute("/basic-calculator")({
  head: () => ({
    meta: [
      { title: `${calcMeta.name} — Free Online Calculator | IXDocs Calculator` },
      { name: "description", content: calcMeta.metaDescription },
      { property: "og:title", content: `${calcMeta.name} — IXDocs Calculator` },
      { property: "og:description", content: calcMeta.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `https://calculator.ixdocs.com/${calcMeta.slug}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://calculator.ixdocs.com/${calcMeta.slug}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: calcMeta.name,
          url: `https://calculator.ixdocs.com/${calcMeta.slug}`,
          description: calcMeta.metaDescription,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "All",
        }),
      },
    ],
  }),
  component: BasicCalculatorPage,
});

function BasicCalculatorPage() {
  const [expression, setExpression] = useState("");
  const [displayValue, setDisplayValue] = useState("0");
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleInput = useCallback((val: string) => {
    setExpression((prev) => {
      // Prevent double decimal in current number segment
      if (val === ".") {
        const parts = prev.split(/[-+*/%^()]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.includes(".")) return prev;
      }
      const next = prev + val;
      setDisplayValue(next);
      return next;
    });
  }, []);

  const handleClear = useCallback(() => {
    setExpression("");
    setDisplayValue("0");
  }, []);

  const handleBackspace = useCallback(() => {
    setExpression((prev) => {
      const next = prev.slice(0, -1);
      setDisplayValue(next || "0");
      return next;
    });
  }, []);

  const handleCalculate = useCallback(() => {
    setExpression((currentExpr) => {
      if (!currentExpr) return currentExpr;
      const res = evaluateExpression(currentExpr);
      if (res.error) {
        setDisplayValue(res.display);
        return currentExpr;
      } else if (res.result !== null) {
        setDisplayValue(res.display);
        setHistory((prev) => [`${currentExpr} = ${res.display}`, ...prev.slice(0, 4)]);
        return res.display;
      }
      return currentExpr;
    });
  }, []);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(displayValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Keyboard listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (/[0-9]/.test(e.key)) {
        handleInput(e.key);
      } else if (["+", "-", "*", "/", "%", "^", "(", ")", "."].includes(e.key)) {
        handleInput(e.key);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleInput, handleCalculate, handleBackspace, handleClear]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="mx-auto max-w-md">
        {/* Calculator Display */}
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-inner">
          <div className="flex items-center justify-between text-xs text-muted-foreground min-h-[1.5rem]">
            <span className="truncate max-w-[240px] font-mono">{expression || "Ready"}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-muted-foreground hover:bg-background hover:text-foreground"
              title="Copy result"
            >
              {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <div className="mt-2 text-right font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground truncate select-all">
            {displayValue}
          </div>
        </div>

        {/* Calculator Keypad */}
        <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
          {/* Row 1 */}
          <button
            type="button"
            onClick={handleClear}
            className="min-h-12 sm:min-h-14 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold text-sm sm:text-base transition-colors"
          >
            C
          </button>
          <button
            type="button"
            onClick={() => handleInput("(")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-surface hover:bg-surface/80 font-bold text-sm sm:text-base transition-colors"
          >
            (
          </button>
          <button
            type="button"
            onClick={() => handleInput(")")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-surface hover:bg-surface/80 font-bold text-sm sm:text-base transition-colors"
          >
            )
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-surface hover:bg-surface/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Backspace"
          >
            <Delete className="size-5" />
          </button>

          {/* Row 2 */}
          <button
            type="button"
            onClick={() => handleInput("7")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            7
          </button>
          <button
            type="button"
            onClick={() => handleInput("8")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            8
          </button>
          <button
            type="button"
            onClick={() => handleInput("9")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            9
          </button>
          <button
            type="button"
            onClick={() => handleInput("/")}
            className="min-h-12 sm:min-h-14 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xl transition-colors"
          >
            ÷
          </button>

          {/* Row 3 */}
          <button
            type="button"
            onClick={() => handleInput("4")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            4
          </button>
          <button
            type="button"
            onClick={() => handleInput("5")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            5
          </button>
          <button
            type="button"
            onClick={() => handleInput("6")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            6
          </button>
          <button
            type="button"
            onClick={() => handleInput("*")}
            className="min-h-12 sm:min-h-14 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xl transition-colors"
          >
            ×
          </button>

          {/* Row 4 */}
          <button
            type="button"
            onClick={() => handleInput("1")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            1
          </button>
          <button
            type="button"
            onClick={() => handleInput("2")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => handleInput("3")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => handleInput("-")}
            className="min-h-12 sm:min-h-14 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xl transition-colors"
          >
            −
          </button>

          {/* Row 5 */}
          <button
            type="button"
            onClick={() => handleInput("0")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleInput(".")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-card hover:bg-surface font-semibold text-lg transition-colors"
          >
            .
          </button>
          <button
            type="button"
            onClick={() => handleInput("%")}
            className="min-h-12 sm:min-h-14 rounded-xl border border-border bg-surface hover:bg-surface/80 font-bold text-base transition-colors"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => handleInput("+")}
            className="min-h-12 sm:min-h-14 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xl transition-colors"
          >
            +
          </button>

          {/* Row 6: Equals button spanning all 4 columns */}
          <button
            type="button"
            onClick={handleCalculate}
            className="col-span-4 min-h-12 sm:min-h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>=</span>
            <span className="text-xs font-normal opacity-80">(Calculate)</span>
          </button>
        </div>

        {/* History Log */}
        {history.length > 0 ? (
          <div className="mt-6 rounded-xl border border-border bg-surface/40 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <RotateCcw className="size-3.5" />
                <span>Recent History</span>
              </span>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="hover:text-foreground text-[0.7rem]"
              >
                Clear
              </button>
            </div>
            <ul className="mt-2.5 space-y-1 font-mono text-xs text-foreground">
              {history.map((item, idx) => (
                <li key={idx} className="truncate py-0.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </CalcPageLayout>
  );
}
