import { useState, useEffect, useRef, useCallback } from "react";
import { Camera, CameraOff, ZapOff, ScanLine } from "lucide-react";
import { BarcodeUnsupported } from "./barcode-unsupported";

// ─── BarcodeDetector type declaration (not in lib.dom.d.ts for all targets) ──

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
  interface BarcodeDetectorConstructor {
    new (options?: { formats?: string[] }): BarcodeDetectorInstance;
    getSupportedFormats(): Promise<string[]>;
  }
  interface BarcodeDetectorInstance {
    detect(source: HTMLVideoElement | HTMLImageElement | ImageBitmap): Promise<DetectedBarcode[]>;
  }
  interface DetectedBarcode {
    rawValue: string;
    format: string;
  }
}

// ─── Barcode formats to detect ────────────────────────────────────────────────

const BARCODE_FORMATS = [
  "ean_13",
  "ean_8",
  "upc_a",
  "upc_e",
  "code_39",
  "code_128",
  "qr_code",
  "itf",
  "codabar",
  "data_matrix",
];

// ─── Component ────────────────────────────────────────────────────────────────

interface BarcodeScannerProps {
  /** Called whenever a barcode is successfully detected. Raw barcode value is passed. */
  onBarcodeDetected: (barcodeValue: string) => void;
  /** Called when user clicks "Switch to Basic Bill" in the unsupported fallback */
  onSwitchToBasic: () => void;
}

type ScannerState =
  "checking" | "unsupported" | "idle" | "requesting" | "scanning" | "denied" | "error";

/**
 * Camera-based barcode scanner using the native BarcodeDetector API.
 *
 * Privacy guarantees:
 * - Camera stream never uploaded to any server
 * - No images captured or stored
 * - Only the decoded barcode string value is passed to the parent
 * - Camera stream is stopped on component unmount
 */
export function BarcodeScanner({ onBarcodeDetected, onSwitchToBasic }: BarcodeScannerProps) {
  const [state, setState] = useState<ScannerState>("checking");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetectorInstance | null>(null);
  const rafRef = useRef<number | null>(null);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Check BarcodeDetector support ─────────────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.BarcodeDetector === "undefined") {
      setState("unsupported");
      return;
    }
    setState("idle");
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stopCamera();
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Camera helpers ────────────────────────────────────────────────────────

  const cooldownRef = useRef(false);

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // ── Detection loop (requestAnimationFrame) ────────────────────────────────

  const startDetectionLoop = useCallback(() => {
    const detect = async () => {
      if (!videoRef.current || !detectorRef.current) return;
      const video = videoRef.current;

      if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA && !cooldownRef.current) {
        try {
          const barcodes = await detectorRef.current.detect(video);
          if (barcodes.length > 0 && barcodes[0]) {
            const value = barcodes[0].rawValue.trim();
            if (value) {
              setLastScanned(value);
              setCooldown(true);
              cooldownRef.current = true;
              onBarcodeDetected(value);

              // Brief cooldown to prevent duplicate scans of the same barcode
              cooldownTimer.current = setTimeout(() => {
                setCooldown(false);
                cooldownRef.current = false;
              }, 1500);
            }
          }
        } catch {
          // Silently ignore detection errors on individual frames
        }
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
  }, [onBarcodeDetected]);

  const startCamera = useCallback(async () => {
    setState("requesting");

    try {
      // Use environment-facing camera (rear camera on mobile)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Instantiate BarcodeDetector with common barcode formats
      detectorRef.current = new window.BarcodeDetector!({ formats: BARCODE_FORMATS });

      setState("scanning");
      startDetectionLoop();
    } catch (err) {
      stopCamera();
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setState("denied");
      } else {
        setState("error");
      }
    }
  }, [stopCamera, startDetectionLoop]);

  const handleStop = useCallback(() => {
    stopCamera();
    setState("idle");
    setLastScanned(null);
    setCooldown(false);
    cooldownRef.current = false;
  }, [stopCamera]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (state === "checking") {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        Checking camera support…
      </div>
    );
  }

  if (state === "unsupported") {
    return <BarcodeUnsupported onSwitchToBasic={onSwitchToBasic} />;
  }

  return (
    <div className="space-y-4">
      {/* Camera viewfinder */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-black aspect-video w-full">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
          aria-label="Camera viewfinder for barcode scanning"
        />

        {/* Scanning overlay */}
        {state === "scanning" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            {/* Scan frame corners */}
            <div className="relative size-48">
              <span className="absolute left-0 top-0 h-8 w-8 border-l-3 border-t-3 border-emerald-400 rounded-tl-sm" />
              <span className="absolute right-0 top-0 h-8 w-8 border-r-3 border-t-3 border-emerald-400 rounded-tr-sm" />
              <span className="absolute bottom-0 left-0 h-8 w-8 border-b-3 border-l-3 border-emerald-400 rounded-bl-sm" />
              <span className="absolute bottom-0 right-0 h-8 w-8 border-b-3 border-r-3 border-emerald-400 rounded-br-sm" />
              {/* Animated scan line */}
              <span className="absolute inset-x-2 top-1/2 h-0.5 animate-bounce bg-emerald-400/80 shadow-[0_0_8px_theme(colors.emerald.400)]" />
            </div>
            <p className="mt-3 rounded-full bg-black/50 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              {cooldown ? "✓ Barcode detected!" : "Point camera at barcode"}
            </p>
          </div>
        )}

        {/* Idle/requesting overlay */}
        {(state === "idle" || state === "requesting") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
            <Camera className="size-12 text-white/40" />
            <p className="text-sm text-white/60">
              {state === "requesting" ? "Requesting camera access…" : "Camera stopped"}
            </p>
          </div>
        )}
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        {state === "idle" || state === "denied" || state === "error" ? (
          <button
            type="button"
            onClick={startCamera}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
          >
            <Camera className="size-4" />
            {state === "denied" || state === "error" ? "Retry Camera" : "Start Camera"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-xs transition-colors hover:bg-surface"
          >
            <CameraOff className="size-4" />
            Stop Camera
          </button>
        )}

        {/* Status messages */}
        {state === "scanning" && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ScanLine className="size-3.5 animate-pulse" />
            Scanning…
          </span>
        )}
        {state === "denied" && (
          <span className="flex items-center gap-1.5 text-xs text-destructive font-medium">
            <ZapOff className="size-3.5" />
            Camera permission denied. Allow access in your browser settings and retry.
          </span>
        )}
        {state === "error" && (
          <span className="flex items-center gap-1.5 text-xs text-destructive font-medium">
            <ZapOff className="size-3.5" />
            Could not access camera. Check that no other app is using it.
          </span>
        )}
      </div>

      {/* Last scanned value */}
      {lastScanned && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 px-4 py-2.5">
          <span className="text-xs text-muted-foreground">Last scanned: </span>
          <span className="text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-300">
            {lastScanned}
          </span>
        </div>
      )}

      {/* Privacy notice */}
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <span className="inline-block size-2 rounded-full bg-emerald-600 shrink-0" />
        Camera footage is never uploaded. Barcodes are decoded locally in your browser.
      </p>
    </div>
  );
}
