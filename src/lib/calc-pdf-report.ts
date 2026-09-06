/**
 * IXDocs Calculator PDF Report Generator
 *
 * Generates clean, professional A4 calculation & analysis PDF reports
 * entirely in the browser using pdf-lib. Zero data is transmitted to any server.
 *
 * FLOW:
 * 1. User clicks optional "Download PDF Report" button.
 * 2. PDF is compiled in memory and sent to the browser's download manager.
 * 3. Feedback is shown to user ("Report downloaded! Redirecting to Calculator Home...").
 * 4. After approximately 1500ms, the user is redirected to https://calc.ixdocs.com/
 *    for product discovery (when redirectAfterDownload is true).
 * 5. Bill Calculator is explicitly excluded from this redirect.
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { triggerPdfDownload, sanitizeDownloadFilename } from "@/lib/download";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalcReportInput {
  /** Display name of the calculator, e.g. "Interest Calculator" */
  calculatorName: string;
  /** Optional custom report ID; generated automatically if not provided */
  reportId?: string;
  /** User inputs as label → value pairs, e.g. { "Principal": "$10,000", "Rate": "6.5%" } */
  inputs: Record<string, string>;
  /** The calculated result as a primary display string */
  result: string;
  /** Secondary breakdown metrics, e.g. [ { label: "Total Interest", value: "$3,822" } ] */
  metrics?: Array<{ label: string; value: string }>;
  /** The formula used, if applicable */
  formula?: string;
  /** Plain-language explanation of how the result was derived */
  explanation?: string;
  /**
   * Deterministic client-side analytical insights of the calculation result.
   * Labeled appropriately so they are not falsely represented as remote AI output.
   */
  aiAnalysis?: string;
  /** ISO 8601 timestamp of when the calculation was performed */
  timestamp: string;
}

export interface CalcReportOptions {
  /** User-provided filename (will be sanitized) */
  filename: string;
  /**
   * Whether to redirect the user after PDF download.
   * - true  → standard calculators (redirect to calc.ixdocs.com for tool discovery)
   * - false → bill calculator (stay on page, zero redirect)
   */
  redirectAfterDownload: boolean;
  /** Redirect destination. Defaults to "https://calc.ixdocs.com/" */
  redirectUrl?: string;
  /** Optional callback fired just before navigation starts */
  onRedirectStarting?: () => void;
}

// ─── Layout Constants ─────────────────────────────────────────────────────────

const PAGE_WIDTH = 595.28; // A4 width in points
const PAGE_HEIGHT = 841.89; // A4 height in points
const MARGIN = 45;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLOR_TEXT_DARK = rgb(0.08, 0.1, 0.12);
const COLOR_TEXT_MUTED = rgb(0.42, 0.46, 0.5);
const COLOR_EMERALD_DARK = rgb(0.02, 0.44, 0.28);
const COLOR_EMERALD_LIGHT = rgb(0.92, 0.98, 0.94);
const COLOR_CARD_BG = rgb(0.97, 0.98, 0.98);
const COLOR_BORDER = rgb(0.85, 0.88, 0.9);
const COLOR_WHITE = rgb(1, 1, 1);

// ─── Helper Functions ─────────────────────────────────────────────────────────

function generateReportId(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `IXC-${t}-${r}`;
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, fontSize);
    if (width <= maxWidth) {
      currentLine = candidate;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// ─── PDF Builder ──────────────────────────────────────────────────────────────

async function buildCalcReportPdf(data: CalcReportInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  // 1. Top Decorative Brand Bar
  page.drawRectangle({
    x: MARGIN,
    y: y - 4,
    width: CONTENT_WIDTH,
    height: 4,
    color: COLOR_EMERALD_DARK,
  });
  y -= 22;

  // 2. HEADER
  page.drawText("IXDocs Calculator Official Report", {
    x: MARGIN,
    y,
    size: 15,
    font: fontBold,
    color: COLOR_EMERALD_DARK,
  });

  const reportId = data.reportId || generateReportId();
  const reportIdStr = `Report ID: ${reportId}`;
  const reportIdWidth = fontMono.widthOfTextAtSize(reportIdStr, 8);
  page.drawText(reportIdStr, {
    x: PAGE_WIDTH - MARGIN - reportIdWidth,
    y: y + 2,
    size: 8,
    font: fontMono,
    color: COLOR_TEXT_MUTED,
  });
  y -= 14;

  page.drawText(data.calculatorName, {
    x: MARGIN,
    y,
    size: 18,
    font: fontBold,
    color: COLOR_TEXT_DARK,
  });

  const formattedDate = `Generated: ${new Date(data.timestamp).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })}`;
  const dateWidth = fontRegular.widthOfTextAtSize(formattedDate, 8);
  page.drawText(formattedDate, {
    x: PAGE_WIDTH - MARGIN - dateWidth,
    y,
    size: 8,
    font: fontRegular,
    color: COLOR_TEXT_MUTED,
  });
  y -= 22;

  // 3. SECTION 1: KEY CALCULATION RESULT
  page.drawText("SECTION 1 · KEY CALCULATION RESULT", {
    x: MARGIN,
    y,
    size: 9,
    font: fontBold,
    color: COLOR_EMERALD_DARK,
  });
  y -= 10;

  const resultBoxHeight = 56;
  page.drawRectangle({
    x: MARGIN,
    y: y - resultBoxHeight,
    width: CONTENT_WIDTH,
    height: resultBoxHeight,
    color: COLOR_EMERALD_LIGHT,
    borderColor: COLOR_EMERALD_DARK,
    borderWidth: 1,
  });

  page.drawText("PRIMARY RESULT", {
    x: MARGIN + 16,
    y: y - 18,
    size: 7.5,
    font: fontBold,
    color: COLOR_EMERALD_DARK,
  });

  page.drawText(data.result, {
    x: MARGIN + 16,
    y: y - 42,
    size: 18,
    font: fontBold,
    color: COLOR_TEXT_DARK,
  });
  y -= resultBoxHeight + 16;

  // Secondary breakdown metrics (if provided)
  if (data.metrics && data.metrics.length > 0) {
    const colWidth = (CONTENT_WIDTH - (data.metrics.length - 1) * 10) / data.metrics.length;
    const cardHeight = 38;

    data.metrics.forEach((metric, idx) => {
      const cardX = MARGIN + idx * (colWidth + 10);
      page.drawRectangle({
        x: cardX,
        y: y - cardHeight,
        width: colWidth,
        height: cardHeight,
        color: COLOR_CARD_BG,
        borderColor: COLOR_BORDER,
        borderWidth: 0.75,
      });

      page.drawText(metric.label.toUpperCase(), {
        x: cardX + 10,
        y: y - 14,
        size: 7,
        font: fontBold,
        color: COLOR_TEXT_MUTED,
      });

      page.drawText(metric.value, {
        x: cardX + 10,
        y: y - 29,
        size: 10,
        font: fontBold,
        color: COLOR_TEXT_DARK,
      });
    });

    y -= cardHeight + 18;
  }

  // 4. SECTION 2: INPUT PARAMETERS
  const inputKeys = Object.keys(data.inputs);
  if (inputKeys.length > 0) {
    page.drawText("SECTION 2 · INPUT PARAMETERS", {
      x: MARGIN,
      y,
      size: 9,
      font: fontBold,
      color: COLOR_EMERALD_DARK,
    });
    y -= 10;

    const rowHeight = 20;
    const tableHeight = inputKeys.length * rowHeight;

    page.drawRectangle({
      x: MARGIN,
      y: y - tableHeight,
      width: CONTENT_WIDTH,
      height: tableHeight,
      color: COLOR_WHITE,
      borderColor: COLOR_BORDER,
      borderWidth: 0.75,
    });

    inputKeys.forEach((key, idx) => {
      const rowY = y - (idx + 1) * rowHeight;
      const isEven = idx % 2 === 0;

      if (isEven) {
        page.drawRectangle({
          x: MARGIN + 0.5,
          y: rowY,
          width: CONTENT_WIDTH - 1,
          height: rowHeight,
          color: COLOR_CARD_BG,
        });
      }

      page.drawText(key, {
        x: MARGIN + 12,
        y: rowY + 6,
        size: 8,
        font: fontRegular,
        color: COLOR_TEXT_MUTED,
      });

      const val = data.inputs[key] ?? "";
      page.drawText(val, {
        x: MARGIN + CONTENT_WIDTH * 0.45,
        y: rowY + 6,
        size: 8,
        font: fontBold,
        color: COLOR_TEXT_DARK,
      });
    });

    y -= tableHeight + 18;
  }

  // 5. SECTION 3: FORMULA & METHODOLOGY
  if (data.formula || data.explanation) {
    page.drawText("SECTION 3 · FORMULA & METHODOLOGY", {
      x: MARGIN,
      y,
      size: 9,
      font: fontBold,
      color: COLOR_EMERALD_DARK,
    });
    y -= 10;

    if (data.formula) {
      const formulaBoxHeight = 26;
      page.drawRectangle({
        x: MARGIN,
        y: y - formulaBoxHeight,
        width: CONTENT_WIDTH,
        height: formulaBoxHeight,
        color: COLOR_CARD_BG,
        borderColor: COLOR_BORDER,
        borderWidth: 0.75,
      });

      page.drawText(data.formula, {
        x: MARGIN + 12,
        y: y - 17,
        size: 8,
        font: fontMono,
        color: COLOR_TEXT_DARK,
      });

      y -= formulaBoxHeight + 10;
    }

    if (data.explanation) {
      const wrappedExp = wrapText(data.explanation, fontRegular, 8, CONTENT_WIDTH);
      const maxExpLines = Math.min(3, wrappedExp.length);
      for (let i = 0; i < maxExpLines; i++) {
        const line = wrappedExp[i];
        if (line) {
          page.drawText(line, {
            x: MARGIN,
            y,
            size: 8,
            font: fontRegular,
            color: COLOR_TEXT_MUTED,
          });
          y -= 11;
        }
      }
      y -= 8;
    }
  }

  // 6. SECTION 4: ANALYSIS & INSIGHTS
  if (data.aiAnalysis) {
    page.drawText("SECTION 4 · ANALYSIS & INSIGHTS (Client-Side)", {
      x: MARGIN,
      y,
      size: 9,
      font: fontBold,
      color: COLOR_EMERALD_DARK,
    });
    y -= 10;

    const wrappedLines = wrapText(data.aiAnalysis, fontRegular, 8, CONTENT_WIDTH - 24);
    const analysisHeight = Math.max(40, wrappedLines.length * 12 + 16);

    page.drawRectangle({
      x: MARGIN,
      y: y - analysisHeight,
      width: CONTENT_WIDTH,
      height: analysisHeight,
      color: COLOR_WHITE,
      borderColor: COLOR_BORDER,
      borderWidth: 0.75,
    });

    wrappedLines.forEach((line, idx) => {
      page.drawText(line, {
        x: MARGIN + 12,
        y: y - 15 - idx * 12,
        size: 8,
        font: fontRegular,
        color: COLOR_TEXT_DARK,
      });
    });

    y -= analysisHeight + 16;
  }

  // 7. FOOTER
  page.drawLine({
    start: { x: MARGIN, y: 44 },
    end: { x: PAGE_WIDTH - MARGIN, y: 44 },
    thickness: 0.5,
    color: COLOR_BORDER,
  });

  page.drawText("100% In-Browser · No Data Uploaded", {
    x: MARGIN,
    y: 30,
    size: 7.5,
    font: fontRegular,
    color: COLOR_TEXT_MUTED,
  });

  page.drawText("calc.ixdocs.com", {
    x: MARGIN + CONTENT_WIDTH * 0.45,
    y: 30,
    size: 7.5,
    font: fontBold,
    color: COLOR_EMERALD_DARK,
  });

  page.drawText("Page 1 of 1", {
    x: PAGE_WIDTH - MARGIN - 45,
    y: 30,
    size: 7.5,
    font: fontRegular,
    color: COLOR_TEXT_MUTED,
  });

  return pdfDoc.save();
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate and download a PDF report for a calculator result.
 *
 * Sequence:
 * A. Generate PDF in browser via pdf-lib.
 * B. Trigger browser download.
 * C. Call onRedirectStarting callback to show feedback.
 * D. Wait ~1500 ms.
 * E. Redirect to https://calc.ixdocs.com/ (when redirectAfterDownload is true).
 */
export async function generateCalcPdfReport(
  input: CalcReportInput,
  options: CalcReportOptions,
): Promise<void> {
  const filename = sanitizeDownloadFilename(
    options.filename || `${input.calculatorName}-Report`,
    "Report",
    ".pdf",
  );

  // 1. Build and download the PDF in the browser
  const pdfBytes = await buildCalcReportPdf(input);
  triggerPdfDownload(pdfBytes, filename);

  // 2. Perform post-download product discovery redirect if requested
  if (options.redirectAfterDownload) {
    if (typeof window !== "undefined") {
      options.onRedirectStarting?.();

      const targetUrl = options.redirectUrl || "https://calc.ixdocs.com/";

      // Wait approximately 1500 ms so the download prompt is initiated
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1500);
    }
  }
}

/**
 * Helper to build a standard CalcReportInput from a calculator's state.
 */
export function buildCalcReportInput(
  calculatorName: string,
  inputs: Record<string, string>,
  result: string,
  options?: {
    reportId?: string;
    metrics?: Array<{ label: string; value: string }>;
    formula?: string;
    explanation?: string;
    aiAnalysis?: string;
  },
): CalcReportInput {
  return {
    calculatorName,
    inputs,
    result,
    ...(options?.reportId !== undefined ? { reportId: options.reportId } : {}),
    ...(options?.metrics !== undefined ? { metrics: options.metrics } : {}),
    ...(options?.formula !== undefined ? { formula: options.formula } : {}),
    ...(options?.explanation !== undefined ? { explanation: options.explanation } : {}),
    ...(options?.aiAnalysis !== undefined ? { aiAnalysis: options.aiAnalysis } : {}),
    timestamp: new Date().toISOString(),
  };
}
