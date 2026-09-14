import { useCallback, useRef, useState } from "react";
import { Download, QrCode, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerificationReminder } from "@/components/ui/verification-reminder";
import { triggerBrowserDownload } from "@/lib/download";

/**
 * QR Code Generator workspace.
 *
 * Generates a QR code from text / URL entirely in-browser using the
 * `qrcode` package (canvas-based renderer). No input is sent to any server.
 */

export function QrCodeWorkspace() {
  const [text, setText] = useState("");
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please enter some text or a URL to generate a QR code.");
      return;
    }
    setError(null);
    setGenerating(true);
    try {
      // Dynamic import keeps the bundle lean for pages that don't use this tool
      const QRCode = await import("qrcode");
      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCode.toCanvas(canvas, trimmed, {
        width: 400,
        margin: 4,
        color: {
          dark: "#111827", // Near-black modules
          light: "#ffffff", // White background
        },
        errorCorrectionLevel: "M", // Medium – good for normal URLs
      });

      setGenerated(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate QR code.";
      // qrcode throws when data is too long for the error correction level
      if (msg.toLowerCase().includes("too long") || msg.toLowerCase().includes("overflow")) {
        setError(
          "The text is too long to encode. Try shortening the URL or text and generate again.",
        );
      } else {
        setError(`Could not generate QR code: ${msg}`);
      }
      setGenerated(false);
    } finally {
      setGenerating(false);
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") generate();
  };

  const downloadPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !generated) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      triggerBrowserDownload({
        filename: "qr-code.png",
        blobOrBytes: blob,
        mimeType: "image/png",
        defaultExt: ".png",
      });
    }, "image/png");
  }, [generated]);

  const reset = useCallback(() => {
    setText("");
    setGenerated(false);
    setError(null);
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Input section */}
      <div className="space-y-3">
        <Label htmlFor="qr-input" className="text-sm font-semibold">
          Text or URL
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="qr-input"
            type="text"
            placeholder="https://ixdocs.com"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              // Clear error on change
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            className="h-11 flex-1 text-sm"
            autoComplete="off"
            aria-describedby={error ? "qr-error" : undefined}
          />
          <Button
            id="qr-generate-btn"
            onClick={generate}
            disabled={generating}
            className="min-h-11 w-full sm:w-auto"
          >
            {generating ? (
              <>
                <span
                  className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
                Generating…
              </>
            ) : (
              <>
                <QrCode className="size-4" aria-hidden="true" />
                Generate QR Code
              </>
            )}
          </Button>
        </div>
        {error ? (
          <p id="qr-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}
      </div>

      {/* Canvas / preview */}
      <div
        className="mt-8 flex flex-col items-center"
        aria-live="polite"
        aria-label="QR code preview"
      >
        <div
          className={`relative rounded-2xl border-2 transition-all duration-200 ${
            generated
              ? "border-primary/40 bg-white p-4 shadow-[var(--shadow-lift)]"
              : "border-dashed border-border bg-muted/40 p-10"
          }`}
          style={{ minWidth: 180, minHeight: 180 }}
        >
          {!generated ? (
            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <QrCode className="size-16 opacity-25" aria-hidden="true" />
              <p className="text-sm">Your QR code will appear here</p>
            </div>
          ) : null}
          {/* Canvas is always mounted but hidden when not generated */}
          <canvas
            ref={canvasRef}
            id="qr-canvas"
            className={generated ? "block max-w-full h-auto aspect-square" : "hidden"}
            aria-label="Generated QR code"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>

      {/* Action buttons */}
      {generated ? (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center w-full">
            <Button
              id="qr-download-btn"
              onClick={downloadPng}
              className="min-h-11 w-full sm:w-auto"
            >
              <Download className="size-4" aria-hidden="true" />
              Download PNG
            </Button>
            <Button
              id="qr-reset-btn"
              variant="outline"
              onClick={reset}
              className="min-h-11 w-full sm:w-auto"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Clear
            </Button>
          </div>
          <VerificationReminder variant="pdf" align="center" className="mt-1" />
        </div>
      ) : null}

      {/* Privacy note */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        QR codes are generated locally in your browser. Your text is never sent to IXDocs servers.
      </p>
    </div>
  );
}
