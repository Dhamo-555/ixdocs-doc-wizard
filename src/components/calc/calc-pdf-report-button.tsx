import { useState, useCallback } from "react";
import { Download, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import {
  generateCalcPdfReport,
  type CalcReportInput,
  type CalcReportOptions,
} from "@/lib/calc-pdf-report";
import { cn } from "@/lib/utils";

export interface CalcPdfReportButtonProps {
  /** Function returning the report payload at the moment of click */
  getInput: () => CalcReportInput;
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
  filename,
  label = "Download PDF Report",
  variant = "outline",
  className,
  disabled = false,
}: CalcPdfReportButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    if (status !== "idle" || disabled) return;

    setStatus("generating");
    setErrorMsg(null);

    try {
      const input = getInput();
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
      console.error("Failed to generate calculator PDF report:", err);
      setErrorMsg("Failed to generate PDF report. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3500);
    }
  }, [getInput, filename, status, disabled]);

  const variantStyles = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs border-transparent active:scale-[0.98]",
    secondary:
      "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100 border-emerald-500/20 active:scale-[0.98]",
    outline:
      "border-border bg-surface text-foreground hover:bg-muted/60 hover:border-emerald-500/40 active:scale-[0.98]",
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || status === "generating" || status === "redirecting"}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          className,
        )}
      >
        {status === "idle" && (
          <>
            <Download className="size-3.5 text-emerald-600" />
            <span>{label}</span>
            <span className="hidden sm:inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[0.65rem] font-medium text-emerald-700 dark:text-emerald-300">
              <Sparkles className="size-2.5" />
              <span>Insights</span>
            </span>
          </>
        )}

        {status === "generating" && (
          <>
            <Loader2 className="size-3.5 animate-spin text-emerald-600" />
            <span>Generating PDF Report…</span>
          </>
        )}

        {status === "redirecting" && (
          <>
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            <span>Report downloaded! Redirecting to Calculator Home…</span>
          </>
        )}

        {status === "error" && (
          <>
            <Download className="size-3.5 text-red-500" />
            <span className="text-red-600">Error Generating</span>
          </>
        )}
      </button>

      {errorMsg && <span className="text-[0.7rem] text-red-600 font-medium">{errorMsg}</span>}
    </div>
  );
}
