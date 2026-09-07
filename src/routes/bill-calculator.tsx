import { useState, useCallback } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  FileDown,
  RotateCcw,
  Receipt,
  ScanLine,
  Pencil,
  ShieldCheck,
  BookOpen,
  ChevronRight,
} from "lucide-react";

import {
  createEmptyBill,
  addItem,
  updateItem,
  removeItem,
  applyTotals,
  scanBarcode,
  type Bill,
  type BillItem,
  type CurrencyOption,
} from "@/lib/calc-engines/bill-calculator";
import { generateAndDownloadBillPdf } from "@/lib/bill-pdf";
import { BillCompanyHeader } from "@/components/calc/bill/bill-company-header";
import { BillItemRow } from "@/components/calc/bill/bill-item-row";
import { BillSummary } from "@/components/calc/bill/bill-summary";
import { BarcodeScanner } from "@/components/calc/bill/barcode-scanner";
import { calcRouteHead, getRelatedCalculators } from "@/lib/calculators";
import { CalcCard } from "@/components/calc/calc-card";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/bill-calculator")({
  head: () => calcRouteHead("bill-calculator"),
  component: BillCalculatorPage,
});

// ─── Modes ────────────────────────────────────────────────────────────────────

type Mode = "basic" | "barcode";

// ─── Page Component ───────────────────────────────────────────────────────────

function BillCalculatorPage() {
  const [mode, setMode] = useState<Mode>("basic");
  const [bill, setBill] = useState<Bill>(createEmptyBill);
  const [pdfFilename, setPdfFilename] = useState("Bill");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [lastAddedItemId, setLastAddedItemId] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<
    Record<string, { productName?: string; unitPrice?: number }>
  >({});

  // ── Bill mutations ──────────────────────────────────────────────────────

  const handleAddItem = useCallback(() => {
    setGenerateSuccess(false);
    setBill((prev) => {
      const updated = addItem(prev);
      const lastItem = updated.items[updated.items.length - 1];
      if (lastItem) setLastAddedItemId(lastItem.id);
      return updated;
    });
  }, []);

  const handleUpdateItem = useCallback(
    (
      itemId: string,
      changes: Partial<Pick<BillItem, "productName" | "quantity" | "unitPrice">>,
    ) => {
      setGenerateSuccess(false);
      setBill((prev) => {
        const target = prev.items.find((i) => i.id === itemId);
        if (target?.barcode) {
          setCatalog((c) => ({
            ...c,
            [target.barcode!]: {
              productName:
                changes.productName !== undefined ? changes.productName : target.productName,
              unitPrice: changes.unitPrice !== undefined ? changes.unitPrice : target.unitPrice,
            },
          }));
        }
        return updateItem(prev, itemId, changes);
      });
    },
    [],
  );

  const handleRemoveItem = useCallback((itemId: string) => {
    setGenerateSuccess(false);
    setLastAddedItemId((prev) => (prev === itemId ? null : prev));
    setBill((prev) => removeItem(prev, itemId));
  }, []);

  const handleCompanyNameChange = useCallback((v: string) => {
    setGenerateSuccess(false);
    setBill((prev) => ({ ...prev, companyName: v }));
    // Auto-suggest PDF filename from company name
    if (v.trim()) {
      setPdfFilename(v.trim().replace(/\s+/g, "-") + "-Bill");
    }
  }, []);

  const handleCurrencyChange = useCallback((c: CurrencyOption) => {
    setBill((prev) => applyTotals({ ...prev, currency: c }));
  }, []);

  const handleGstToggle = useCallback((enabled: boolean) => {
    setBill((prev) => applyTotals({ ...prev, gstEnabled: enabled }));
  }, []);

  const handleGstPercentChange = useCallback((percent: number) => {
    setBill((prev) => applyTotals({ ...prev, gstPercent: percent }));
  }, []);

  // ── Barcode scan handler ────────────────────────────────────────────────

  const handleBarcodeDetected = useCallback(
    (barcodeValue: string) => {
      setGenerateSuccess(false);
      setBill((prev) => {
        const { bill: updated, itemId } = scanBarcode(prev, barcodeValue, (code) => catalog[code]);
        setLastAddedItemId(itemId);
        return updated;
      });
    },
    [catalog],
  );

  // ── PDF generation ──────────────────────────────────────────────────────

  const handleGeneratePdf = useCallback(async () => {
    if (bill.items.length === 0) {
      setGenerateError("Add at least one product before generating the PDF.");
      return;
    }
    setGenerateError(null);
    setGenerateSuccess(false);
    setIsGenerating(true);
    try {
      await generateAndDownloadBillPdf(bill, pdfFilename || bill.companyName || "Bill");
      setGenerateSuccess(true);
      // No redirect — bill calculator stays on the page (Part 9 exception)
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : "Failed to generate PDF. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  }, [bill, pdfFilename]);

  // ── Reset ───────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    setBill(createEmptyBill());
    setPdfFilename("Bill");
    setLastAddedItemId(null);
    setGenerateError(null);
    setGenerateSuccess(false);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-background pb-16">
      {/* Page header */}
      <section className="border-b border-border bg-surface/50">
        <div className="container-page py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link to="/calculators" className="hover:text-foreground">
              Calculators
            </Link>
            <ChevronRight className="size-3.5 text-muted-foreground/60" />
            <span className="text-muted-foreground/60">Billing & Invoicing</span>
            <ChevronRight className="size-3.5 text-muted-foreground/60" />
            <span className="font-semibold text-foreground">Bill Calculator</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                <Receipt className="size-6" />
              </span>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  Bill Calculator
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground leading-relaxed">
                  Create professional bills with GST support. Scan barcodes or enter products
                  manually, then download a clean PDF receipt.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/50 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 shrink-0 self-start sm:self-auto">
              <ShieldCheck className="size-3.5" />
              <span>100% In-Browser · Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main workspace */}
      <main className="container-page mt-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* ── Mode tab switcher ── */}
          <div className="flex items-center gap-1 rounded-2xl border border-border bg-surface/50 p-1 w-fit">
            <ModeTab
              active={mode === "basic"}
              icon={<Pencil className="size-3.5" />}
              label="Basic Bill"
              description="Manual entry"
              onClick={() => setMode("basic")}
            />
            <ModeTab
              active={mode === "barcode"}
              icon={<ScanLine className="size-3.5" />}
              label="Barcode Bill"
              description="Camera scanner"
              onClick={() => setMode("barcode")}
            />
          </div>

          {/* ── Company header (shared) ── */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-foreground flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Receipt className="size-3.5" />
              </span>
              Bill Configuration
            </h2>
            <BillCompanyHeader
              companyName={bill.companyName}
              currency={bill.currency}
              pdfFilename={pdfFilename}
              onCompanyNameChange={handleCompanyNameChange}
              onCurrencyChange={handleCurrencyChange}
              onPdfFilenameChange={setPdfFilename}
            />
          </section>

          {/* ── Barcode scanner (Barcode mode only) ── */}
          {mode === "barcode" && (
            <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-foreground flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <ScanLine className="size-3.5" />
                </span>
                Barcode Scanner
              </h2>
              <BarcodeScanner
                onBarcodeDetected={handleBarcodeDetected}
                onSwitchToBasic={() => setMode("basic")}
              />
            </section>
          )}

          {/* ── Bill Items table ── */}
          <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 sm:px-7 border-b border-border">
              <h2 className="text-sm font-bold text-foreground">
                Bill Items
                {bill.items.length > 0 && (
                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {bill.items.length}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
              >
                <Plus className="size-3.5" />
                Add Product
              </button>
            </div>

            {bill.items.length === 0 ? (
              <div className="px-5 py-14 sm:px-7 text-center">
                <Receipt className="mx-auto size-10 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">
                  {mode === "barcode"
                    ? "Scan a barcode above to add a product, or click 'Add Product' for manual entry."
                    : "Click 'Add Product' to start building your bill."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface/40">
                      <th className="py-2.5 pl-4 pr-1 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                        Product
                      </th>
                      <th className="px-1 py-2.5 text-center text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                        Qty
                      </th>
                      <th className="px-1 py-2.5 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                        Unit Price
                      </th>
                      <th className="px-1 py-2.5 text-right text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                        Amount
                      </th>
                      <th className="py-2.5 pl-1 pr-4" aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {bill.items.map((item) => (
                      <BillItemRow
                        key={item.id}
                        item={item}
                        currency={bill.currency}
                        isHighlighted={item.id === lastAddedItemId}
                        onUpdate={handleUpdateItem}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Totals + PDF section ── */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-foreground">Bill Summary</h2>
            <BillSummary
              bill={bill}
              currency={bill.currency}
              onGstToggle={handleGstToggle}
              onGstPercentChange={handleGstPercentChange}
            />

            {/* Generate PDF + Reset */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGenerating || bill.items.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown className="size-4" />
                {isGenerating ? "Generating…" : "Generate PDF Bill"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground shadow-xs transition-colors hover:text-foreground hover:bg-surface"
              >
                <RotateCcw className="size-3.5" />
                Reset Bill
              </button>
            </div>

            {generateError && (
              <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-xs font-medium text-destructive">
                {generateError}
              </p>
            )}

            {generateSuccess && (
              <p className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                ✓ Bill PDF downloaded successfully!
              </p>
            )}

            <p className="mt-3 text-xs text-muted-foreground">
              Bill data stays in your browser. Nothing is uploaded to our servers.
            </p>
          </section>

          {/* ── Info / FAQ ── */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="divide-y divide-border/60">
              {FAQS.map((faq, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-foreground">{faq.q}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Worked Example ── */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
              <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <BookOpen className="size-4" />
              </span>
              <h2>Worked Example</h2>
            </div>
            <div className="mt-4 rounded-xl border border-border/80 bg-surface/40 p-4 sm:p-5 text-sm">
              <h3 className="font-semibold text-foreground text-base">
                Retail Check-Out with Camera Barcode Scanning
              </h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Scan three items at counter, apply 18% GST, and download an 80mm thermal receipt.
              </p>
              <ul className="mt-3.5 space-y-1.5 text-xs sm:text-sm text-foreground/90 list-disc list-inside">
                <li>Point camera at items: Barcodes detected and added to cart instantly</li>
                <li>Adjust quantities and verify line totals in real-time</li>
                <li>
                  Click &apos;Generate PDF Bill&apos; to immediately download receipt without
                  leaving page
                </li>
              </ul>
            </div>
          </section>

          {/* ── Related Calculators ── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Related Calculators</h2>
              <Link
                to="/calculators"
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getRelatedCalculators("bill-calculator").map((relCalc) => (
                <CalcCard key={relCalc.slug} calc={relCalc} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// ─── Mode Tab Button ──────────────────────────────────────────────────────────

function ModeTab({
  active,
  icon,
  label,
  description,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "bg-emerald-600 text-white shadow-xs"
          : "text-muted-foreground hover:bg-background hover:text-foreground"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label}</span>
      <span
        className={`hidden text-[0.65rem] font-normal sm:inline ${active ? "text-emerald-100" : "text-muted-foreground/70"}`}
      >
        {description}
      </span>
    </button>
  );
}

// ─── FAQ content ──────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Does the barcode scanner upload camera footage?",
    a: "No. Barcode detection uses the browser's native BarcodeDetector API and runs entirely locally on your device. Camera footage is never sent to any server.",
  },
  {
    q: "Which browsers support barcode scanning?",
    a: "Chrome 83+, Edge 83+, and Samsung Internet support the BarcodeDetector API. Firefox and Safari users can still create bills manually using Basic Bill mode.",
  },
  {
    q: "Can I apply GST to my bill?",
    a: "Yes. Toggle GST on and enter any percentage. Quick-pick buttons for 5%, 12%, 18%, and 28% are provided for Indian GST slabs.",
  },
  {
    q: "Is my bill data sent to your servers?",
    a: "No. All billing data stays in your browser's memory. Nothing is uploaded. The PDF is generated locally using pdf-lib.",
  },
  {
    q: "Can I scan the same product multiple times?",
    a: "Yes. If you scan a barcode that's already in your bill, the quantity of that item is automatically increased by 1 instead of creating a duplicate row.",
  },
  {
    q: "What happens after I download the PDF?",
    a: "You stay on the bill page. Unlike other IXDocs calculators, the bill calculator does not redirect you after PDF generation — so you can continue billing.",
  },
];
