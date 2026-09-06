import { useState, useEffect, useRef, useCallback } from "react";
import { Camera, CameraOff, ZapOff, ScanLine } from "lucide-react";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { BarcodeUnsupported } from "./barcode-unsupported";

// ─── Native BarcodeDetector type declaration ──────────────────────────────────

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

const NATIVE_BARCODE_FORMATS = [
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
 * Camera-based barcode scanner with dual-engine support:
 * 1. Native BarcodeDetector API (fast hardware acceleration in Chrome/Edge/Android)
 * 2. ZXing BrowserMultiFormatReader fallback (cross-browser support in Safari/Firefox/Desktop)
 *
 * Privacy guarantees:
 * - Camera stream never uploaded to any server
 * - No images captured or stored remotely
 * - Only the decoded barcode string value is passed to the parent
 * - Camera stream and decode loop are stopped immediately on component unmount
 */
export function BarcodeScanner({ onBarcodeDetected, onSwitchToBasic }: BarcodeScannerProps) {
  const [state, setState] = useState<ScannerState>("checking");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeDetectorRef = useRef<BarcodeDetectorInstance | null>(null);
  const zxingControlsRef = useRef<IScannerControls | null>(null);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const rafRef = useRef<number | null>(null);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownRef = useRef(false);

  // ── Check camera & mediaDevices support ───────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasMediaDevices =
      typeof navigator !== "undefined" &&
      Boolean(navigator.mediaDevices) &&
      typeof navigator.mediaDevices.getUserMedia === "function";

    if (!hasMediaDevices) {
      setState("unsupported");
      return;
    }

    setState("idle");
  }, []);

  // ── Camera cleanup helper ─────────────────────────────────────────────────

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (zxingControlsRef.current) {
      try {
        zxingControlsRef.current.stop();
      } catch {
        // ignore errors during stop
      }
      zxingControlsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stopCamera();
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, [stopCamera]);

  // ── Detection success handler with debouncing ─────────────────────────────

  const handleDetected = useCallback(
    (value: string) => {
      if (cooldownRef.current) return;
      const trimmed = value.trim();
      if (!trimmed) return;

      setLastScanned(trimmed);
      setCooldown(true);
      cooldownRef.current = true;
      onBarcodeDetected(trimmed);

      // Brief cooldown to prevent multiple rapid scans of the same barcode
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      cooldownTimer.current = setTimeout(() => {
        setCooldown(false);
        cooldownRef.current = false;
      }, 1500);
    },
    [onBarcodeDetected],
  );

  // ── Native BarcodeDetector loop ───────────────────────────────────────────

  const startNativeDetectionLoop = useCallback(() => {
    const detect = async () => {
      if (!videoRef.current || !nativeDetectorRef.current) return;
      const video = videoRef.current;

      if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA && !cooldownRef.current) {
        try {
          const barcodes = await nativeDetectorRef.current.detect(video);
          if (barcodes.length > 0 && barcodes[0]) {
            const raw = barcodes[0].rawValue;
            if (raw) handleDetected(raw);
          }
        } catch {
          // Silently ignore detection errors on individual video frames
        }
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
  }, [handleDetected]);

  // ── Start camera and select best available engine ─────────────────────────

  const startCamera = useCallback(async () => {
    setState("requesting");

    try {
      // Use environment-facing camera (rear camera on mobile devices)
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

      // Check if native BarcodeDetector is available
      if (typeof window.BarcodeDetector !== "undefined") {
        try {
          nativeDetectorRef.current = new window.BarcodeDetector({
            formats: NATIVE_BARCODE_FORMATS,
          });
          setState("scanning");
          startNativeDetectionLoop();
          return;
        } catch {
          // Fall back to ZXing if native constructor fails
          nativeDetectorRef.current = null;
        }
      }

      // Fallback: ZXing BrowserMultiFormatReader (works on Safari, Firefox, Desktop)
      if (!zxingReaderRef.current) {
        zxingReaderRef.current = new BrowserMultiFormatReader();
      }

      if (videoRef.current) {
        setState("scanning");
        const controls = await zxingReaderRef.current.decodeFromVideoElement(
          videoRef.current,
          (result, error) => {
            if (result && !cooldownRef.current) {
              const text = result.getText();
              if (text) handleDetected(text);
            }
            if (error) {
              // Standard ZXing frame-level decode misses are expected while moving
            }
          },
        );
        zxingControlsRef.current = controls;
      }
    } catch (err) {
      stopCamera();
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setState("denied");
      } else {
        setState("error");
      }
    }
  }, [stopCamera, startNativeDetectionLoop, handleDetected]);

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
