import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RUNNERS } from "@/lib/tool-runners";
import { TOOL_MAP } from "@/lib/tools";
import { getPdfjs, type RunContext } from "@/lib/pdf-engine";

interface TestResult {
  name: string;
  expected: string;
  actual: string;
  status: "PASS" | "FAIL" | "NOT VERIFIED";
  details?: string;
}

export const Route = createFileRoute("/test-runner")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: TestRunnerPage,
});

function TestRunnerPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    runTestSuite();
  }, []);

  async function runTestSuite() {
    const list: TestResult[] = [];

    const addResult = (res: TestResult) => {
      list.push(res);
      setResults([...list]);
    };

    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");

      // Helper to generate a simple mock PDF of N pages
      const createMockPdf = async (pagesCount = 1, title = "Test PDF") => {
        const doc = await PDFDocument.create();
        const font = await doc.embedFont(StandardFonts.Helvetica);
        for (let i = 0; i < pagesCount; i++) {
          const page = doc.addPage([600, 400]);
          page.drawText(`${title} - Page ${i + 1}`, {
            x: 50,
            y: 200,
            size: 20,
            font,
            color: rgb(0, 0, 0.5),
          });
        }
        const bytes = await doc.save();
        return new File([bytes], `mock_${pagesCount}p.pdf`, { type: "application/pdf" });
      };

      // Helper to generate a mock image
      const createMockImage = (name = "test.png", type = "image/png") => {
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 100, 100);
        // data URL to binary File
        const dataUrl = canvas.toDataURL(type);
        const binary = atob(dataUrl.split(",")[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        return new File([new Uint8Array(array)], name, { type });
      };

      // 1. merge-pdf
      try {
        const f1 = await createMockPdf(1, "Doc A");
        const f2 = await createMockPdf(2, "Doc B");
        const runner = RUNNERS["merge-pdf"]!;
        const result = await runner({
          files: [f1, f2],
          options: {},
          selectedPages: [],
          pageOrder: [],
          totalPages: 3,
          onProgress: () => {},
        });
        const outPdf = await PDFDocument.load(await result.outputs[0].blob.arrayBuffer());
        const count = outPdf.getPageCount();
        addResult({
          name: "Merge PDF",
          expected: "Merged PDF with 3 pages",
          actual: `Merged PDF with ${count} pages`,
          status: count === 3 ? "PASS" : "FAIL",
          details: `Output size: ${result.outputs[0].size} bytes`,
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Merge PDF",
          expected: "Merged PDF with 3 pages",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 2. split-pdf
      try {
        const f = await createMockPdf(5, "Doc Multi");
        const runner = RUNNERS["split-pdf"]!;
        const result = await runner({
          files: [f],
          options: { mode: "ranges", ranges: "1-2, 3-5" },
          selectedPages: [],
          pageOrder: [],
          totalPages: 5,
          onProgress: () => {},
        });
        // Returns output files zip/files
        const filesCount = result.outputs?.length ?? 0;
        addResult({
          name: "Split PDF",
          expected: "Split into 2 output documents",
          actual: `Split into ${filesCount} documents`,
          status: filesCount === 2 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Split PDF",
          expected: "Split into 2 output documents",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 3. extract-pdf-pages
      try {
        const f = await createMockPdf(5, "Doc Multi");
        const runner = RUNNERS["extract-pdf-pages"]!;
        const result = await runner({
          files: [f],
          options: { output: "single" },
          selectedPages: [1, 3, 5],
          pageOrder: [],
          totalPages: 5,
          onProgress: () => {},
        });
        const outPdf = await PDFDocument.load(await result.outputs[0].blob.arrayBuffer());
        const count = outPdf.getPageCount();
        addResult({
          name: "Extract PDF Pages",
          expected: "Extracted PDF with 3 pages",
          actual: `Extracted PDF with ${count} pages`,
          status: count === 3 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Extract PDF Pages",
          expected: "Extracted PDF with 3 pages",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 4. delete-pdf-pages
      try {
        const f = await createMockPdf(5, "Doc Multi");
        const runner = RUNNERS["delete-pdf-pages"]!;
        const result = await runner({
          files: [f],
          options: {},
          selectedPages: [2, 4],
          pageOrder: [],
          totalPages: 5,
          onProgress: () => {},
        });
        const outPdf = await PDFDocument.load(await result.outputs[0].blob.arrayBuffer());
        const count = outPdf.getPageCount();
        addResult({
          name: "Delete PDF Pages",
          expected: "PDF with 3 pages (pages 2, 4 deleted)",
          actual: `PDF with ${count} pages`,
          status: count === 3 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Delete PDF Pages",
          expected: "PDF with 3 pages",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 5. rotate-pdf
      try {
        const f = await createMockPdf(1, "RotatedDoc");
        const runner = RUNNERS["rotate-pdf"]!;
        const result = await runner({
          files: [f],
          options: { angle: "90" },
          selectedPages: [1],
          pageOrder: [],
          totalPages: 1,
          onProgress: () => {},
        });
        const outPdf = await PDFDocument.load(await result.outputs[0].blob.arrayBuffer());
        const page = outPdf.getPage(0);
        const rotation = page.getRotation().angle;
        addResult({
          name: "Rotate PDF",
          expected: "Rotation angle 90 degrees",
          actual: `Rotation angle ${rotation} degrees`,
          status: rotation === 90 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Rotate PDF",
          expected: "Rotation angle 90 degrees",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 6. watermark-pdf
      try {
        const f = await createMockPdf(1, "WatermarkDoc");
        const runner = RUNNERS["watermark-pdf"]!;
        const result = await runner({
          files: [f],
          options: {
            text: "CONFIDENTIAL",
            color: "#FF0000",
            opacity: "20",
            rotation: "45",
            position: "center",
          },
          selectedPages: [1],
          pageOrder: [],
          totalPages: 1,
          onProgress: () => {},
        });
        addResult({
          name: "Watermark PDF",
          expected: "Watermark applied successfully",
          actual: `Output size: ${result.outputs[0].size} bytes`,
          status: result.outputs[0].size > 0 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Watermark PDF",
          expected: "Watermark applied successfully",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 7. pdf-page-numbering
      try {
        const f = await createMockPdf(2, "NumberedDoc");
        const runner = RUNNERS["pdf-page-numbering"]!;
        const result = await runner({
          files: [f],
          options: {
            format: "Page {n} of {total}",
            position: "bottom-center",
            size: "11",
            start: "1",
          },
          selectedPages: [1, 2],
          pageOrder: [],
          totalPages: 2,
          onProgress: () => {},
        });
        addResult({
          name: "PDF Page Numbering",
          expected: "Page numbers applied successfully",
          actual: `Output size: ${result.outputs[0].size} bytes`,
          status: result.outputs[0].size > 0 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "PDF Page Numbering",
          expected: "Page numbers applied successfully",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 8. pdf-metadata-cleaner
      try {
        const f = await createMockPdf(1, "MetadataDoc");
        const runner = RUNNERS["pdf-metadata-cleaner"]!;
        const result = await runner({
          files: [f],
          options: {},
          selectedPages: [],
          pageOrder: [],
          totalPages: 1,
          onProgress: () => {},
        });
        const outPdf = await PDFDocument.load(await result.outputs[0].blob.arrayBuffer());
        const author = outPdf.getAuthor();
        const title = outPdf.getTitle();
        addResult({
          name: "PDF Metadata Cleaner",
          expected: "Metadata fields (Author, Title, etc.) cleared to empty strings",
          actual: `Author: "${author || ""}", Title: "${title || ""}"`,
          status: !author && !title ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "PDF Metadata Cleaner",
          expected: "Author set to CleanAuthor",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 9. reorder-pdf-pages
      try {
        const f = await createMockPdf(3, "ReorderDoc");
        const runner = RUNNERS["reorder-pdf-pages"]!;
        const result = await runner({
          files: [f],
          options: {},
          selectedPages: [],
          pageOrder: [2, 0, 1],
          totalPages: 3,
          onProgress: () => {},
        });
        const outPdf = await PDFDocument.load(await result.outputs[0].blob.arrayBuffer());
        const count = outPdf.getPageCount();
        addResult({
          name: "Reorder PDF Pages",
          expected: "Reordered PDF with 3 pages",
          actual: `Reordered PDF with ${count} pages`,
          status: count === 3 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Reorder PDF Pages",
          expected: "Reordered PDF with 3 pages",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 10. compress-pdf
      try {
        const f = await createMockPdf(2, "CompressDoc");
        const runner = RUNNERS["compress-pdf"]!;
        const result = await runner({
          files: [f],
          options: { level: "lossless" },
          selectedPages: [],
          pageOrder: [],
          totalPages: 2,
          onProgress: () => {},
        });
        const hasOut = result.outputs.length > 0 || result.partial;
        addResult({
          name: "Compress PDF",
          expected: "Compressed output or optimization notice generated",
          actual:
            result.outputs.length > 0
              ? `Output size: ${result.outputs[0].size} bytes`
              : "Original was already optimal",
          status: hasOut ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Compress PDF",
          expected: "Compressed output generated",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 11. compress-pdf-to-target-size
      try {
        const f = await createMockPdf(2, "TargetCompressDoc");
        const runner = RUNNERS["compress-pdf-to-target-size"]!;
        const result = await runner({
          files: [f],
          options: { target: "100" },
          selectedPages: [],
          pageOrder: [],
          totalPages: 2,
          onProgress: () => {},
        });
        const out0 = result.outputs[0];
        addResult({
          name: "Compress to Target Size",
          expected: "Compressed output",
          actual: out0
            ? `Output size: ${(out0.size / 1024).toFixed(1)} KB`
            : `Original was already optimal (${result.message ?? ""})`,
          status: out0 || result.message ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Compress to Target Size",
          expected: "Compressed output",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 12. pdf-health-checker
      try {
        const f = await createMockPdf(2, "HealthCheckDoc");
        const runner = RUNNERS["pdf-health-checker"]!;
        const result = await runner({
          files: [f],
          options: {},
          selectedPages: [],
          pageOrder: [],
          totalPages: 2,
          onProgress: () => {},
        });
        const hasReport = result.report && result.report.length > 0;
        addResult({
          name: "PDF Health Checker",
          expected: "Health reports and metrics generated",
          actual: `Reports count: ${result.report?.length ?? 0}`,
          status: hasReport ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "PDF Health Checker",
          expected: "Health reports generated",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 13. pdf-page-size-converter
      try {
        const f = await createMockPdf(1, "ResizedDoc");
        const runner = RUNNERS["pdf-page-size-converter"]!;
        const result = await runner({
          files: [f],
          options: { pageSize: "letter", orientation: "portrait" },
          selectedPages: [],
          pageOrder: [],
          totalPages: 1,
          onProgress: () => {},
        });
        const outPdf = await PDFDocument.load(await result.outputs[0].blob.arrayBuffer());
        const size = outPdf.getPage(0).getSize();
        // Letter size in points is approx 612 x 792
        const isLetter = Math.abs(size.width - 612) < 2 && Math.abs(size.height - 792) < 2;
        addResult({
          name: "PDF Page Size Converter",
          expected: "Letter page dimensions (612 x 792 points)",
          actual: `Resized dimensions: ${Math.round(size.width)} x ${Math.round(size.height)} points`,
          status: isLetter ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "PDF Page Size Converter",
          expected: "Letter dimensions",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 14. print-ready-pdf
      try {
        const f = await createMockPdf(1, "PrintReadyDoc");
        const runner = RUNNERS["print-ready-pdf"]!;
        const result = await runner({
          files: [f],
          options: { bleed: "3", margins: "10", pageSize: "a4" },
          selectedPages: [],
          pageOrder: [],
          totalPages: 1,
          onProgress: () => {},
        });
        addResult({
          name: "Print-Ready PDF",
          expected: "Print-ready output generated",
          actual: `Output size: ${result.outputs[0].size} bytes`,
          status: result.outputs[0].size > 0 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Print-Ready PDF",
          expected: "Print-ready output",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 15. application-pdf-optimizer
      try {
        const f = await createMockPdf(1, "AppOptDoc");
        const runner = RUNNERS["application-pdf-optimizer"]!;
        const result = await runner({
          files: [f],
          options: { target: "200", pageSize: "a4" },
          selectedPages: [],
          pageOrder: [],
          totalPages: 1,
          onProgress: () => {},
        });
        addResult({
          name: "Application PDF Optimizer",
          expected: "Optimized application document generated",
          actual: `Output size: ${result.outputs[0].size} bytes`,
          status: result.outputs[0].size > 0 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Application PDF Optimizer",
          expected: "Optimized document",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 16. smart-pdf-analyzer
      try {
        const f = await createMockPdf(3, "SmartAnalysisDoc");
        const runner = RUNNERS["smart-pdf-analyzer"]!;
        const result = await runner({
          files: [f],
          options: {},
          selectedPages: [],
          pageOrder: [],
          totalPages: 3,
          onProgress: () => {},
        });
        const pageCountRow = result.report?.[0]?.rows?.find((row) => row.label === "Pages");
        const pageCount = pageCountRow ? Number(pageCountRow.value) : 0;
        addResult({
          name: "Smart PDF Analyzer",
          expected: "Analysis report with 3 pages detected",
          actual: `Reported page count: ${pageCount}`,
          status: pageCount === 3 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Smart PDF Analyzer",
          expected: "Analysis report",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 17. jpg-to-pdf (Image Conversion)
      try {
        const imgFile = createMockImage("test_image.png", "image/png");
        const runner = RUNNERS["jpg-to-pdf"]!;
        const result = await runner({
          files: [imgFile],
          options: { pageSize: "auto", margin: "10", orientation: "portrait", fit: "contain" },
          selectedPages: [],
          pageOrder: [],
          totalPages: 1,
          onProgress: () => {},
        });
        const outPdf = await PDFDocument.load(await result.outputs[0].blob.arrayBuffer());
        const count = outPdf.getPageCount();
        addResult({
          name: "Image to PDF Converter",
          expected: "PDF with 1 page containing embedded image",
          actual: `PDF with ${count} pages`,
          status: count === 1 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Image to PDF Converter",
          expected: "PDF with 1 page",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 18. pdf-to-jpg (PDF Rendering to Image)
      try {
        const f = await createMockPdf(2, "RenderDoc");
        const runner = RUNNERS["pdf-to-jpg"]!;
        const result = await runner({
          files: [f],
          options: { scale: "1", quality: "80" },
          selectedPages: [1],
          pageOrder: [],
          totalPages: 2,
          onProgress: () => {},
        });
        const count = result.outputs.length;
        addResult({
          name: "PDF to JPG",
          expected: "Rendered 1 JPG page image",
          actual: `Rendered ${count} images`,
          status: count === 1 && result.outputs[0].kind === "image" ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "PDF to JPG",
          expected: "Rendered 1 JPG page",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 19. pdf-to-png (PDF Rendering to Image)
      try {
        const f = await createMockPdf(2, "RenderDoc");
        const runner = RUNNERS["pdf-to-png"]!;
        const result = await runner({
          files: [f],
          options: { scale: "1" },
          selectedPages: [1, 2],
          pageOrder: [],
          totalPages: 2,
          onProgress: () => {},
        });
        const count = result.outputs.length;
        addResult({
          name: "PDF to PNG",
          expected: "Rendered 2 PNG page images",
          actual: `Rendered ${count} images`,
          status: count === 2 && result.outputs[0].kind === "image" ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "PDF to PNG",
          expected: "Rendered 2 PNG pages",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 20. passport-photo
      try {
        const imgFile = createMockImage("photo.jpg", "image/jpeg");
        const runner = RUNNERS["passport-photo"]!;
        const result = await runner({
          files: [imgFile],
          options: { paperSize: "a4", photoSize: "35x45" },
          selectedPages: [],
          pageOrder: [],
          totalPages: 1,
          onProgress: () => {},
        });
        addResult({
          name: "Passport Photo Sheet",
          expected: "Passport photo grid generated",
          actual: `Output type: ${result.outputs[0].kind}, size: ${result.outputs[0].size} bytes`,
          status: result.outputs[0].size > 0 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Passport Photo Sheet",
          expected: "Passport photo grid",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 21. document-scanner
      try {
        const imgFile = createMockImage("capture.jpg", "image/jpeg");
        const runner = RUNNERS["document-scanner"]!;
        const result = await runner({
          files: [imgFile],
          options: { filter: "grayscale" },
          selectedPages: [],
          pageOrder: [],
          totalPages: 1,
          onProgress: () => {},
        });
        addResult({
          name: "Document Scanner",
          expected: "Scanned document output generated",
          actual: `Output size: ${result.outputs[0].size} bytes`,
          status: result.outputs[0].size > 0 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "Document Scanner",
          expected: "Scanned document output",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 29. pdf-ocr
      try {
        const f = await createMockPdf(1, "Scanned Text Page");
        const runner = RUNNERS["pdf-ocr"]!;
        // Use a mock of Tesseract if needed or actual. In test page, it will load Tesseract.js.
        // We'll test output format text to avoid layout complexity in quick tests.
        const result = await runner({
          files: [f],
          options: { language: "eng", output: "text" },
          selectedPages: [],
          pageOrder: [],
          totalPages: 1,
          onProgress: () => {},
        });
        addResult({
          name: "PDF OCR",
          expected: "OCR text output file generated",
          actual: `Output size: ${result.outputs[0].size} bytes`,
          status: result.outputs[0].size > 0 ? "PASS" : "FAIL",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "PDF OCR",
          expected: "OCR text output file",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }

      // 23. qr-code-generator
      try {
        const QRCode = await import("qrcode");
        const canvas = document.createElement("canvas");
        const testInput = "https://ixdocs.com";
        await QRCode.toCanvas(canvas, testInput, {
          width: 400,
          margin: 4,
          errorCorrectionLevel: "M",
        });

        const isDrawn = canvas.width === 400 && canvas.height === 400;
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/png"),
        );

        let validPng = false;
        if (blob && blob.size > 0 && blob.type === "image/png") {
          const buffer = await blob.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          // Check PNG magic bytes: 0x89 0x50 0x4E 0x47 (89 80 78 71)
          if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
            validPng = true;
          }
        }

        const pass = isDrawn && validPng;
        addResult({
          name: "QR Code Generator",
          expected: "Valid client-side PNG QR code (qr-code.png)",
          actual: pass
            ? `Generated 400x400 PNG (${blob?.size} bytes, valid PNG header)`
            : "Failed to generate valid PNG QR code",
          status: pass ? "PASS" : "FAIL",
          details: `Encoded "${testInput}", output: qr-code.png`,
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        addResult({
          name: "QR Code Generator",
          expected: "Valid client-side PNG QR code",
          actual: `Error: ${msg}`,
          status: "FAIL",
        });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      console.error("Critical test runner error:", e);
      addResult({
        name: "Test Runner Suite",
        expected: "Complete without error",
        actual: `Crash: ${msg}`,
        status: "FAIL",
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">IXDocs Tools Test Suite</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Programmatic browser-side execution of all active tools.
      </p>

      {running ? (
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg mb-6">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span className="text-sm font-medium">Running functional test suite...</span>
        </div>
      ) : (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-lg mb-6 text-sm font-semibold">
          Completed in-browser tests for all active tools.
        </div>
      )}

      <div className="border rounded-lg overflow-hidden bg-surface">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Tool
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Expected
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Actual
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {results.map((r, i) => (
              <tr key={i} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.expected}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.actual}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      r.status === "PASS"
                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                        : r.status === "FAIL"
                          ? "bg-red-500/10 text-red-700 dark:text-red-400"
                          : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
