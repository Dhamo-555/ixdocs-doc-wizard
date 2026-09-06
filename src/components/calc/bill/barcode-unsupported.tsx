import { Keyboard } from "lucide-react";

interface BarcodeUnsupportedProps {
  /** Called when user clicks "Switch to Basic Bill" */
  onSwitchToBasic: () => void;
}

/**
 * Shown when the browser does not support the BarcodeDetector API.
 * Provides a clear, friendly message and guides the user to Basic Bill mode.
 *
 * Triggered for: Firefox, Safari, older Chrome versions.
 */
export function BarcodeUnsupported({ onSwitchToBasic }: BarcodeUnsupportedProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/30">
        <Keyboard className="size-7" />
      </span>

      <div className="max-w-xs">
        <h3 className="text-base font-bold text-foreground">
          Barcode scanning is not supported by this browser
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Your browser does not support the{" "}
          <code className="rounded bg-surface px-1 py-0.5 text-xs font-mono">BarcodeDetector</code>{" "}
          API. Try Chrome or Edge for barcode scanning.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          You can still create bills by entering products manually.
        </p>
      </div>

      <button
        type="button"
        onClick={onSwitchToBasic}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
      >
        Switch to Basic Bill
      </button>

      <p className="text-xs text-muted-foreground">
        Supported browsers for barcode scanning: Chrome 83+, Edge 83+, Samsung Internet
      </p>
    </div>
  );
}
