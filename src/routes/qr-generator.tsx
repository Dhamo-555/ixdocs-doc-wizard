import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Copy, Check, QrCode as QrIcon } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { generateQrCodeDataUrl } from "@/lib/calc-engines/qr-generator";

export const Route = createFileRoute("/qr-generator")({
  head: () => calcRouteHead("qr-generator"),
  component: QrGeneratorPage,
});

function QrGeneratorPage() {
  const calcMeta = getCalculatorBySlug("qr-generator")!;
  const [text, setText] = useState("https://calc.ixdocs.com");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [size, setSize] = useState(300);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    if (!text.trim()) {
      setDataUrl("");
      return;
    }
    try {
      const url = await generateQrCodeDataUrl({
        text,
        size,
        errorCorrectionLevel: errorLevel,
      });
      setDataUrl(url);
    } catch {
      setDataUrl("");
    }
  }, [text, size, errorLevel]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "ixdocs-qr-code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard && text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
        {/* Left: Input controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Target URL or Plain Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter website link, text message, Wi-Fi info, or contact details..."
              rows={4}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Resolution size */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                QR Image Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                <option value={200}>Small (200 × 200 px)</option>
                <option value={300}>Medium (300 × 300 px)</option>
                <option value={500}>Large (500 × 500 px)</option>
                <option value={800}>High-Res (800 × 800 px)</option>
              </select>
            </div>

            {/* Error correction */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Error Correction Level
              </label>
              <select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as "L" | "M" | "Q" | "H")}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                <option value="L">Low (7% recovery)</option>
                <option value="M">Medium (15% recovery)</option>
                <option value="Q">Quartile (25% recovery)</option>
                <option value="H">High (30% recovery)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => setText("https://calc.ixdocs.com")}
              className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Calculator URL
            </button>
            <button
              type="button"
              onClick={() => setText("WIFI:S:MyNetwork;T:WPA;P:MyPassword;;")}
              className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Wi-Fi Template
            </button>
            <button
              type="button"
              onClick={() => setText("mailto:support@ixdocs.com?subject=Hello")}
              className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Email Template
            </button>
          </div>
        </div>

        {/* Right: QR Preview Card */}
        <div className="flex flex-col items-center rounded-2xl border border-border bg-surface/60 p-6 text-center">
          <div className="text-xs font-semibold text-muted-foreground mb-4">Live Preview</div>

          {dataUrl ? (
            <div className="grid place-items-center rounded-2xl border border-border bg-white p-4 shadow-xs">
              <img
                src={dataUrl}
                alt="Generated QR Code"
                className="size-48 sm:size-56 object-contain"
              />
            </div>
          ) : (
            <div className="grid size-48 sm:size-56 place-items-center rounded-2xl border border-dashed border-border text-muted-foreground text-xs p-4">
              Enter content to preview QR code
            </div>
          )}

          {/* Download & Copy Buttons */}
          <div className="mt-6 flex flex-col w-full gap-2 sm:flex-row">
            <button
              type="button"
              disabled={!dataUrl}
              onClick={handleDownload}
              className="flex-1 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <Download className="size-4" />
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              disabled={!text}
              onClick={handleCopyLink}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-background hover:bg-surface px-4 text-xs font-medium text-foreground transition-colors"
            >
              {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
              <span>{copied ? "Copied" : "Copy Content"}</span>
            </button>
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
