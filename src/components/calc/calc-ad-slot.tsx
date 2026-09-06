import { useEffect, useRef } from "react";
import { loadMonetagInPagePush } from "@/lib/monetag";
import { cn } from "@/lib/utils";

/**
 * Isolated Monetag In-Page Push ad slot exclusively for the IXDocs Calculator Homepage.
 * Renders exactly ONE ad slot on calc.ixdocs.com/.
 * Never imported or rendered on individual calculator pages (ZERO ads policy).
 */
export function CalcAdSlot({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load if client-side
    if (typeof window === "undefined") return;

    loadMonetagInPagePush();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "ixdocs-calc-ad-container empty:hidden empty:m-0 empty:p-0 my-8 mx-auto w-full max-w-4xl min-h-0 overflow-hidden",
        className,
      )}
      aria-label="Sponsored"
    />
  );
}
