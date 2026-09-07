import { useState, useCallback } from "react";
import { Download, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import {
  generateCalcPdfReport,
  buildCalcReportInput,
  type CalcReportInput,
  type CalcReportOptions,
} from "@/lib/calc-pdf-report";
import { cn } from "@/lib/utils";

export interface CalcPdfReportButtonProps {
  /** Function returning the report payload at the moment of click */
  getInput?: () => CalcReportInput;
  /** Alias for getInput */
  getReportInput?: () => CalcReportInput;
  /** Calculator name if passing inputs/results directly */
  calcName?: string;
  inputs?: Record<string, string> | { label: string; value: string }[];
  results?: string | { label: string; value: string }[];
  /** Optional custom filename without extension */
  filename?: string;
  /** Button text override, defaults to "Download PDF Report" */
  label?: string;
  /** Visual variant */
  variant?: "primary" | "secondary" | "outline";
  /** Optional extra classes */
  className?: string;
  /** Whether the button should be disabled (e.g. invalid inputs) */
  disabled?: boolean;
}

type Status = "idle" | "generating" | "redirecting" | "error";

/**
 * Reusable action button that generates a browser-side PDF calculation report
 * and subsequently redirects to calc.ixdocs.com for product discovery.
 */
export function CalcPdfReportButton({
  getInput,
  getReportInput,
  calcName,
  inputs,
  results,
  filename,
  label = "Download PDF Report",
  variant = "outline",
  className,
  disabled = false,
}: CalcPdfReportButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resolveReportInput = useCallback((): CalcReportInput => {
    if (getInput) return getInput();
    if (getReportInput) return getReportInput();

    // Fallback: build from calcName, inputs, results
    const name = calcName || "Calculation";
    const inputsRecord: Record<string, string> = {};
    if (Array.isArray(inputs)) {
      inputs.forEach((i) => {
        inputsRecord[i.label] = i.value;
      });
    } else if (inputs) {
      Object.assign(inputsRecord, inputs);
    }

    let mainResult = "Completed";
    const metrics: { label: string; value: string }[] = [];

    if (typeof results === "string") {
      mainResult = results;
    } else if (Array.isArray(results)) {
      if (results.length > 0 && results[0]) {
        mainResult = results[0].value;
      }
      results.forEach((r) => metrics.push({ label: r.label, value: r.value }));
    }

    return buildCalcReportInput(name, inputsRecord, mainResult, {
      metrics,
      explanation: `Generated via IXDocs Calculator at ${name}.`,
    });
  }, [getInput, getReportInput, calcName, inputs, results]);

  const handleDownload = useCallback(async () => {
    if (status !== "idle" || disabled) return;

    setStatus("generating");
    setErrorMsg(null);

    try {
      const input = resolveReportInput();
      const options: CalcReportOptions = {
        filename: filename || `${input.calculatorName}-Report`,
        redirectAfterDownload: true,
        redirectUrl: "https://calc.ixdocs.com/",
        onRedirectStarting: () => {
          setStatus("redirecting");
        },
      };

      await generateCalcPdfReport(input, options);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to generate report");
      setTimeout(() => {
        setStatus("idle");
        setErrorMsg(null);
      }, 4000);
    }
  }, [status, disabled, resolveReportInput, filename]);

  return (
    <div className="flex flex-col w-full sm:w-auto items-stretch sm:items-end gap-1.5">
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || status === "generating" || status === "redirecting"}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto",
          variant === "primary" &&
            "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] px-4 py-2.5",
          variant === "secondary" &&
            "bg-surface text-foreground hover:bg-muted active:scale-[0.98] px-4 py-2.5",
          variant === "outline" &&
            "border border-border bg-background text-foreground shadow-xs hover:bg-surface hover:border-border active:scale-[0.98] px-3.5 py-2",
          className,
        )}
      >
        {status === "generating" && <Loader2 className="size-3.5 animate-spin text-emerald-600" />}
        {status === "redirecting" && <CheckCircle2 className="size-3.5 text-emerald-600" />}
        {status === "idle" && <Download className="size-3.5 text-emerald-600" />}
        {status === "error" && <Sparkles className="size-3.5 text-destructive" />}

        <span>
          {status === "generating" && "Generating PDF…"}
          {status === "redirecting" && "Report downloaded! Redirecting…"}
          {status === "error" && "Error generating"}
          {status === "idle" && label}
        </span>
      </button>

      {status === "redirecting" && (
        <a
          href="https://calc.ixdocs.com/"
          className="text-[0.68rem] text-emerald-600 hover:underline font-medium"
        >
          Click here if not redirected automatically →
        </a>
      )}

      {errorMsg && <p className="text-[0.68rem] text-destructive font-medium">{errorMsg}</p>}
    </div>
  );
}
