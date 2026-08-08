import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid size-8 shrink-0 place-items-center rounded-[0.6rem] bg-primary text-primary-foreground",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M7 4h6.5L18 8.5V20H7z" strokeLinejoin="round" />
        <path d="M13 4v5h5" strokeLinejoin="round" />
        <path d="M9.8 12.4l4.4 4.4M14.2 12.4l-4.4 4.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Wordmark({ className, showTagline = false }: { className?: string; showTagline?: boolean }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label="IXDocs home">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-extrabold tracking-tight text-foreground">IXDocs</span>
        {showTagline ? (
          <span className="mt-1 text-[0.7rem] font-medium text-muted-foreground">Documents. Simplified.</span>
        ) : null}
      </span>
    </Link>
  );
}
