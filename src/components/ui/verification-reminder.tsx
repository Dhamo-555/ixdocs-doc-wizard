import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VerificationReminderProps {
  /**
   * The context of the verification notice:
   * - "pdf": standard document/PDF processing output
   * - "calc": standard calculator output
   * - "special": tools requiring extra verification (OCR, signing, passport photo, etc.)
   */
  variant?: "pdf" | "calc" | "special";
  /** Optional custom text override */
  text?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

const DEFAULT_MESSAGES: Record<"pdf" | "calc" | "special", string> = {
  pdf: "Please verify your output before using it.",
  calc: "Please verify your result before relying on it.",
  special: "Please verify the output carefully before using or submitting it.",
};

export function VerificationReminder({
  variant = "pdf",
  text,
  className,
  align = "left",
}: VerificationReminderProps) {
  const message = text || DEFAULT_MESSAGES[variant];

  return (
    <div
      role="note"
      aria-label="Output verification notice"
      className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground select-none",
        align === "center" && "justify-center text-center",
        align === "right" && "justify-end text-right",
        className,
      )}
    >
      <AlertCircle className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
