import { ScanLine, CameraOff } from "lucide-react";

interface BarcodeUnsupportedProps {
  /** Reason why scanning is unavailable */
  reason?: "unsupported-browser" | "no-camera";
  /** Called when user clicks "Switch to Basic Bill" */
  onSwitchToBasic: () => void;
}

/**
 * Shown when native BarcodeDetector is unavailable or camera access cannot be acquired.
 * Informs the user accurately without falsely blaming camera hardware when the browser lacks support.
 */
export function BarcodeUnsupported({
  reason = "unsupported-browser",
  onSwitchToBasic,
}: BarcodeUnsupportedProps) {
  const isBrowserUnsupported = reason === "unsupported-browser";

  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/30">
        {isBrowserUnsupported ? <ScanLine className="size-7" /> : <CameraOff className="size-7" />}
      </span>

      <div className="max-w-md">
        <h3 className="text-base font-bold text-foreground">
          {isBrowserUnsupported
            ? "Barcode scanning is not supported by this browser"
            : "Camera not detected or supported"}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {isBrowserUnsupported
            ? "This browser does not support the native BarcodeDetector API required for in-browser barcode scanning."
            : "Camera scanning requires a connected camera and a secure HTTPS connection."}
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {isBrowserUnsupported
            ? "You can use a supported browser (such as Google Chrome, Microsoft Edge, or Chrome on Android) or enter items manually below."
            : "You can create bills anytime by entering products manually using Basic Bill mode."}
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
        Manual bill entry is 100% functional on all modern desktop and mobile browsers.
      </p>
    </div>
  );
}
