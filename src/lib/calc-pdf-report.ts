/**
 * IXDocs Calculator PDF Report Generator
 *
 * Generates clean, compact calculation output PDFs directly in the browser
 * using pdf-lib. Zero data is transmitted to any server.
 *
 * Structure:
 * - Small header: "IXDocs Online Calculator"
 * - Subtitle: "PDF generated based on your entered values."
 * - [Calculation result]
 * - [Input values]
 * - [Formula / calculation details if useful]
 * - Small footer: "Calculated in your browser · No data uploaded"
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
  /** Client-side analysis notes if useful */
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

// ─── Text Sanitization for pdf-lib WinAnsi Font Compatibility ─────────────────

/**
 * StandardFonts in pdf-lib (Helvetica, Times, Courier) only support the
 * WinAnsi / Latin-1 encoding (character codes 0-255).
 * Characters like '₹', '∎', '•', curly quotes, or em-dashes cause pdf-lib to crash.
 * This sanitizer converts special characters to safe ASCII equivalents.
 */
export function sanitizePdfText(str: string): string {
  if (!str) return "";
  const mapped = str
    .replace(/₹/g, "INR ")
    .replace(/€/g, "EUR ")
    .replace(/£/g, "GBP ")
    .replace(/¥/g, "JPY ")
    .replace(/∎/g, "")
    .replace(/[•·]/g, "- ")
    .replace(/[—–]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/√/g, "sqrt ")
    .replace(/π/g, "pi");

  // Keep printable ASCII and Latin-1 supplement characters (WinAnsi compatible)
  return mapped
    .split("")
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 32 && code <= 255;
    })
    .join("");
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = sanitizePdfText(text).split(" ");
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
    y: y - 3,
    width: CONTENT_WIDTH,
    height: 3,
    color: COLOR_EMERALD_DARK,
  });
  y -= 20;

  // 2. Simple Header (Non-institutional, utility focused)
  page.drawText("IXDocs Online Calculator", {
    x: MARGIN,
    y,
    size: 13,
    font: fontBold,
    color: COLOR_EMERALD_DARK,
  });

  const formattedDate = `Date: ${new Date(data.timestamp).toLocaleString("en-US", {
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
  y -= 13;

  page.drawText("PDF generated based on your entered values.", {
    x: MARGIN,
    y,
    size: 9,
    font: fontRegular,
    color: COLOR_TEXT_MUTED,
  });
  y -= 18;

  // Tool Title
  const calcNameSanitized = sanitizePdfText(data.calculatorName);
  page.drawText(calcNameSanitized, {
    x: MARGIN,
    y,
    size: 16,
    font: fontBold,
    color: COLOR_TEXT_DARK,
  });
  y -= 20;

  // 3. Calculation Result Block
  const resultBoxHeight = 52;
  page.drawRectangle({
    x: MARGIN,
    y: y - resultBoxHeight,
    width: CONTENT_WIDTH,
    height: resultBoxHeight,
    color: COLOR_EMERALD_LIGHT,
    borderColor: COLOR_EMERALD_DARK,
    borderWidth: 0.75,
  });

  page.drawText("CALCULATION RESULT", {
    x: MARGIN + 14,
    y: y - 16,
    size: 7.5,
    font: fontBold,
    color: COLOR_EMERALD_DARK,
  });

  const resultSanitized = sanitizePdfText(data.result);
  page.drawText(resultSanitized, {
    x: MARGIN + 14,
    y: y - 38,
    size: 17,
    font: fontBold,
    color: COLOR_TEXT_DARK,
  });
  y -= resultBoxHeight + 14;

  // Secondary metrics (if provided)
  if (data.metrics && data.metrics.length > 0) {
    const colWidth = (CONTENT_WIDTH - (data.metrics.length - 1) * 8) / data.metrics.length;
    const cardHeight = 36;

    data.metrics.forEach((metric, idx) => {
      const cardX = MARGIN + idx * (colWidth + 8);
      page.drawRectangle({
        x: cardX,
        y: y - cardHeight,
        width: colWidth,
        height: cardHeight,
        color: COLOR_CARD_BG,
        borderColor: COLOR_BORDER,
        borderWidth: 0.5,
      });

      page.drawText(sanitizePdfText(metric.label.toUpperCase()), {
        x: cardX + 8,
        y: y - 13,
        size: 7,
        font: fontBold,
        color: COLOR_TEXT_MUTED,
      });

      page.drawText(sanitizePdfText(metric.value), {
        x: cardX + 8,
        y: y - 27,
        size: 9.5,
        font: fontBold,
        color: COLOR_TEXT_DARK,
      });
    });

    y -= cardHeight + 16;
  }

  // 4. Input Values
  const inputKeys = Object.keys(data.inputs);
  if (inputKeys.length > 0) {
    page.drawText("Input Values", {
      x: MARGIN,
      y,
      size: 9.5,
      font: fontBold,
      color: COLOR_TEXT_DARK,
    });
    y -= 8;

    const rowHeight = 20;
    const tableHeight = inputKeys.length * rowHeight;

    page.drawRectangle({
      x: MARGIN,
      y: y - tableHeight,
      width: CONTENT_WIDTH,
      height: tableHeight,
      color: COLOR_WHITE,
      borderColor: COLOR_BORDER,
      borderWidth: 0.5,
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

      page.drawText(sanitizePdfText(key), {
        x: MARGIN + 10,
        y: rowY + 6,
        size: 8,
        font: fontRegular,
        color: COLOR_TEXT_MUTED,
      });

      const rawVal = data.inputs[key] ?? "";
      page.drawText(sanitizePdfText(rawVal), {
        x: MARGIN + CONTENT_WIDTH * 0.45,
        y: rowY + 6,
        size: 8,
        font: fontBold,
        color: COLOR_TEXT_DARK,
      });
    });

    y -= tableHeight + 16;
  }

  // 5. Formula & Details (if useful)
  if (data.formula || data.explanation) {
    page.drawText("Calculation Details", {
      x: MARGIN,
      y,
      size: 9.5,
      font: fontBold,
      color: COLOR_TEXT_DARK,
    });
    y -= 8;

    if (data.formula) {
      const formulaBoxHeight = 24;
      page.drawRectangle({
        x: MARGIN,
        y: y - formulaBoxHeight,
        width: CONTENT_WIDTH,
        height: formulaBoxHeight,
        color: COLOR_CARD_BG,
        borderColor: COLOR_BORDER,
        borderWidth: 0.5,
      });

      page.drawText(sanitizePdfText(data.formula), {
        x: MARGIN + 10,
        y: y - 15,
        size: 8,
        font: fontMono,
        color: COLOR_TEXT_DARK,
      });

      y -= formulaBoxHeight + 8;
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
      y -= 6;
    }
  }

  // 6. Simple Summary note (if provided via aiAnalysis)
  if (data.aiAnalysis) {
    const wrappedLines = wrapText(data.aiAnalysis, fontRegular, 8, CONTENT_WIDTH - 20);
    const noteHeight = Math.max(32, wrappedLines.length * 11 + 12);

    page.drawRectangle({
      x: MARGIN,
      y: y - noteHeight,
      width: CONTENT_WIDTH,
      height: noteHeight,
      color: COLOR_WHITE,
      borderColor: COLOR_BORDER,
      borderWidth: 0.5,
    });

    wrappedLines.forEach((line, idx) => {
      page.drawText(line, {
        x: MARGIN + 10,
        y: y - 13 - idx * 11,
        size: 8,
        font: fontRegular,
        color: COLOR_TEXT_DARK,
      });
    });

    y -= noteHeight + 14;
  }

  // 7. Small Clean Footer
  page.drawLine({
    start: { x: MARGIN, y: 40 },
    end: { x: PAGE_WIDTH - MARGIN, y: 40 },
    thickness: 0.5,
    color: COLOR_BORDER,
  });

  page.drawText("Calculated in your browser - No data uploaded", {
    x: MARGIN,
    y: 28,
    size: 7.5,
    font: fontRegular,
    color: COLOR_TEXT_MUTED,
  });

  page.drawText("calc.ixdocs.com", {
    x: MARGIN + CONTENT_WIDTH * 0.45,
    y: 28,
    size: 7.5,
    font: fontBold,
    color: COLOR_EMERALD_DARK,
  });

  page.drawText("Page 1 of 1", {
    x: PAGE_WIDTH - MARGIN - 45,
    y: 28,
    size: 7.5,
    font: fontRegular,
    color: COLOR_TEXT_MUTED,
  });

  return pdfDoc.save();
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate and download a PDF report for a calculator result.
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
  if (options.redirectAfterDownload && typeof window !== "undefined") {
    options.onRedirectStarting?.();
    const targetUrl = options.redirectUrl || "https://calc.ixdocs.com/";

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        try {
          window.location.assign(targetUrl);
        } catch {
          window.location.href = targetUrl;
        }
        resolve();
      }, 1500);
    });
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
