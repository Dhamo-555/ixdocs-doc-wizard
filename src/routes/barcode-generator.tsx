import { useState, useEffect, useRef, useId, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import JsBarcode from "jsbarcode";
import {
  Barcode,
  Download,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import {
  BARCODE_FORMAT_CONFIGS,
  DEFAULT_BARCODE_CONFIG,
  type BarcodeCustomization,
} from "@/lib/calc-engines/barcode-generator";

export const Route = createFileRoute("/barcode-generator")({
  head: () => calcRouteHead("barcode-generator"),
  component: BarcodeGeneratorPage,
});

function BarcodeGeneratorPage() {
  const calcMeta = getCalculatorBySlug("barcode-generator")!;
  const [value, setValue] = useState("IXDOCS-1094");
  const [config, setConfig] = useState<BarcodeCustomization>(DEFAULT_BARCODE_CONFIG);
  const [copied, setCopied] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const barcodeValueId = useId();
  const barcodeFormatId = useId();

  const currentFormat = useMemo(() => {
    return BARCODE_FORMAT_CONFIGS.find((f) => f.id === config.format) || BARCODE_FORMAT_CONFIGS[0]!;
  }, [config.format]);

  // Validation
  const validation = useMemo(() => {
    return currentFormat.validate(value);
  }, [currentFormat, value]);

  // Render barcode into SVG
  useEffect(() => {
    if (!svgRef.current) return;
    if (!validation.valid) {
      setRenderError(validation.error || "Invalid barcode input");
      return;
    }

    try {
      JsBarcode(svgRef.current, value.trim(), {
        format: config.format,
        width: config.width,
        height: config.height,
        displayValue: config.displayValue,
        fontSize: config.fontSize,
        lineColor: config.lineColor,
        background: config.background,
        margin: 12,
        valid: (valid: boolean) => {
          if (!valid) {
            setRenderError(`Invalid characters or checksum for ${currentFormat.name}`);
          } else {
            setRenderError(null);
          }
        },
      });
      setRenderError(null);
    } catch (err) {
      setRenderError(err instanceof Error ? err.message : "Failed to generate barcode");
    }
  }, [value, config, validation, currentFormat]);

  const handleDownloadSvg = () => {
    if (!svgRef.current || renderError || !validation.valid) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode-${value.trim() || "ixdocs"}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    if (!svgRef.current || renderError || !validation.valid) return;
    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const bbox = svgElement.getBoundingClientRect();
    const scale = 2; // High resolution
    canvas.width = (bbox.width || 300) * scale;
    canvas.height = (bbox.height || 150) * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = config.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `barcode-${value.trim() || "ixdocs"}.png`;
      a.click();
    };
    img.src = url;
  };

  const handlePrint = () => {
    if (!svgRef.current || renderError || !validation.valid) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcode - ${value}</title>
          <style>
            body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; }
            .card { border: 1px dashed #ccc; padding: 24px; border-radius: 8px; text-align: center; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="card">
            ${svgData}
            <div style="margin-top: 12px; font-size: 12px; color: #555;">Generated via IXDocs Calculator</div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyValue = async () => {
    try {
      await navigator.clipboard.writeText(value.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setValue("IXDOCS-1094");
    setConfig(DEFAULT_BARCODE_CONFIG);
    setRenderError(null);
  };

  const pdfSummary = useMemo(() => {
    return [
      { label: "Barcode Value", value: value.trim() || "None" },
      { label: "Format Standard", value: currentFormat.name },
      { label: "Barcode Dimensions", value: `Width: ${config.width}, Height: ${config.height}px` },
      { label: "Display Human Text", value: config.displayValue ? "Enabled" : "Disabled" },
      { label: "Foreground Color", value: config.lineColor },
      { label: "Background Color", value: config.background },
      { label: "Validation Status", value: validation.valid ? "Valid" : "Invalid" },
    ];
  }, [value, currentFormat, config, validation]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Form Controls */}
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sliders className="size-4 text-emerald-600" />
              Barcode Settings
            </h2>

            {/* Value Input */}
            <div className="space-y-1.5">
              <label
                htmlFor={barcodeValueId}
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Barcode Content / Value
              </label>
              <input
                id={barcodeValueId}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={currentFormat.placeholder}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-mono text-foreground focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
              />
              <p className="text-xs text-muted-foreground">{currentFormat.description}</p>
            </div>

            {/* Format Selection */}
            <div className="space-y-1.5">
              <label
                htmlFor={barcodeFormatId}
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Barcode Standard / Symbology
              </label>
              <select
                id={barcodeFormatId}
                value={config.format}
                onChange={(e) => {
                  const newFormat = e.target.value;
                  const cfg = BARCODE_FORMAT_CONFIGS.find((f) => f.id === newFormat);
                  setConfig((prev) => ({ ...prev, format: newFormat }));
                  if (cfg) setValue(cfg.example);
                }}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
              >
                {BARCODE_FORMAT_CONFIGS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Customization Sliders */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Bar Width</span>
                  <span>{config.width}px</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={1}
                  value={config.width}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, width: Number(e.target.value) }))
                  }
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Height</span>
                  <span>{config.height}px</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={160}
                  step={10}
                  value={config.height}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, height: Number(e.target.value) }))
                  }
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            {/* Checkbox and Font Options */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.displayValue}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, displayValue: e.target.checked }))
                  }
                  className="rounded border-border text-emerald-600 focus:ring-emerald-600"
                />
                Show Human-Readable Text
              </label>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                Reset Defaults
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Barcode Preview & Export */}
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Barcode Preview</h2>

            {/* SVG Render Canvas Container */}
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-6 shadow-inner">
              {renderError ? (
                <div className="flex flex-col items-center justify-center text-center text-destructive space-y-2 p-4">
                  <AlertCircle className="size-8" />
                  <p className="text-xs font-semibold">{renderError}</p>
                </div>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <svg ref={svgRef} className="mx-auto" />
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={Boolean(renderError)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-40"
              >
                <Download className="size-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                disabled={Boolean(renderError)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground shadow-xs transition hover:bg-surface disabled:opacity-40"
              >
                <FileCode className="size-3.5" />
                <span>Download SVG</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                disabled={Boolean(renderError)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground shadow-xs transition hover:bg-surface disabled:opacity-40"
                title="Print Barcode Label"
              >
                <Printer className="size-3.5" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={handleCopyValue}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground shadow-xs transition hover:bg-surface"
                title="Copy Barcode Content"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* PDF Report with Post-Download Return */}
            <div className="pt-3 border-t border-border">
              <CalcPdfReportButton
                calcName="Barcode Generator"
                inputs={[
                  { label: "Content", value: value.trim() },
                  { label: "Standard", value: currentFormat.name },
                ]}
                results={pdfSummary}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Educational Guide & FAQs */}
      <div className="mt-12 space-y-6">
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Barcode Formats Comparison</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div className="rounded-2xl border border-border p-4 space-y-2 bg-surface/30">
              <h3 className="font-bold text-foreground text-sm">Code 128</h3>
              <p className="text-muted-foreground leading-relaxed">
                The most versatile 1D barcode format. Encodes any ASCII character, including
                letters, numbers, and symbols. Ideal for logistics, product SKUs, and packaging
                labels.
              </p>
            </div>
            <div className="rounded-2xl border border-border p-4 space-y-2 bg-surface/30">
              <h3 className="font-bold text-foreground text-sm">EAN-13</h3>
              <p className="text-muted-foreground leading-relaxed">
                The global retail standard (International Article Number) used outside North
                America. Encodes 13 numeric digits and is scanned at supermarket checkout POS
                counters worldwide.
              </p>
            </div>
            <div className="rounded-2xl border border-border p-4 space-y-2 bg-surface/30">
              <h3 className="font-bold text-foreground text-sm">UPC-A</h3>
              <p className="text-muted-foreground leading-relaxed">
                The standard 12-digit retail barcode for goods sold in the United States and Canada.
                Universally recognized across North American retail registers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </CalcPageLayout>
  );
}
