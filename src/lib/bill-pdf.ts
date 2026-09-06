/**
 * IXDocs Bill PDF Generator
 *
 * Generates a professional, printable bill/receipt PDF entirely in the browser
 * using pdf-lib. No data is sent to any server.
 *
 * Reuses the existing triggerPdfDownload() and sanitizeDownloadFilename()
 * utilities from src/lib/download.ts.
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Bill, BillItem } from "@/lib/calc-engines/bill-calculator";
import { formatCurrency } from "@/lib/calc-engines/bill-calculator";
import { triggerPdfDownload, sanitizeDownloadFilename } from "@/lib/download";

// ─── Layout constants ─────────────────────────────────────────────────────────

const PAGE_WIDTH = 595; // A4 width in points
const PAGE_HEIGHT = 842; // A4 height in points
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLOR_BLACK = rgb(0.05, 0.05, 0.05);
const COLOR_GRAY = rgb(0.45, 0.45, 0.45);
const COLOR_LIGHT_GRAY = rgb(0.88, 0.88, 0.88);
const COLOR_EMERALD = rgb(0.05, 0.6, 0.36);
const COLOR_WHITE = rgb(1, 1, 1);

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate and immediately trigger download of a bill PDF.
 * The user stays on the current page — no redirect.
 */
export async function generateAndDownloadBillPdf(bill: Bill, rawFilename: string): Promise<void> {
  const filename = sanitizeDownloadFilename(rawFilename || "Bill", "Bill", ".pdf");
  const pdfBytes = await buildBillPdf(bill);
  triggerPdfDownload(pdfBytes, filename);
}

// ─── PDF Builder ──────────────────────────────────────────────────────────────

async function buildBillPdf(bill: Bill): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Embed standard fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Determine number of pages needed
  const itemsPerPage = 20;
  const pageCount = Math.max(1, Math.ceil(bill.items.length / itemsPerPage));

  for (let pageIdx = 0; pageIdx < pageCount; pageIdx++) {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    const isFirstPage = pageIdx === 0;
    const isLastPage = pageIdx === pageCount - 1;
    const pageItems = bill.items.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage);

    let y = PAGE_HEIGHT - MARGIN;

    if (isFirstPage) {
      y = drawHeader(page, bill, fontBold, fontRegular, y);
      y = drawDivider(page, y, 2, COLOR_EMERALD);
      y -= 10;
    } else {
      // Continuation header
      y -= 10;
      drawText(page, `${bill.companyName} — continued`, MARGIN, y, fontBold, 10, COLOR_GRAY);
      y -= 20;
    }

    y = drawTableHeader(page, fontBold, y);
    y = drawTableRows(page, pageItems, bill, fontRegular, fontBold, y);

    if (isLastPage) {
      y -= 4;
      drawDivider(page, y, 1, COLOR_LIGHT_GRAY);
      y -= 14;
      y = drawTotals(page, bill, fontRegular, fontBold, y);
      drawDivider(page, y, 1.5, COLOR_EMERALD);
      y -= 20;
    }

    // Footer
    drawFooter(page, fontRegular, pageIdx + 1, pageCount);
  }

  pdfDoc.setTitle(bill.companyName ? `${bill.companyName} — Bill` : "Bill");
  pdfDoc.setCreator("IXDocs Bill Calculator — calc.ixdocs.com");
  pdfDoc.setProducer("IXDocs");

  return pdfDoc.save();
}

// ─── Section Drawers ──────────────────────────────────────────────────────────

function drawHeader(
  page: PDFPage,
  bill: Bill,
  fontBold: PDFFont,
  fontRegular: PDFFont,
  startY: number,
): number {
  let y = startY;

  // Company name — centered, large, emerald
  const companyName = bill.companyName || "BILL";
  const nameSize = Math.min(28, Math.max(14, Math.floor(220 / Math.max(companyName.length, 1))));
  const nameWidth = fontBold.widthOfTextAtSize(companyName.toUpperCase(), nameSize);
  const nameX = MARGIN + (CONTENT_WIDTH - nameWidth) / 2;
  page.drawText(companyName.toUpperCase(), {
    x: Math.max(MARGIN, nameX),
    y,
    size: nameSize,
    font: fontBold,
    color: COLOR_EMERALD,
  });
  y -= nameSize + 6;

  // Date + "BILL / RECEIPT" label
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const subtitle = `BILL / RECEIPT  ·  ${dateStr}  ·  ${timeStr}`;
  const subtitleWidth = fontRegular.widthOfTextAtSize(subtitle, 9);
  page.drawText(subtitle, {
    x: MARGIN + (CONTENT_WIDTH - subtitleWidth) / 2,
    y,
    size: 9,
    font: fontRegular,
    color: COLOR_GRAY,
  });
  y -= 20;

  return y;
}

function drawDivider(
  page: PDFPage,
  y: number,
  thickness: number,
  color: ReturnType<typeof rgb>,
): number {
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness,
    color,
  });
  return y;
}

function drawTableHeader(page: PDFPage, fontBold: PDFFont, startY: number): number {
  const y = startY - 4;
  const rowHeight = 18;

  // Header background
  page.drawRectangle({
    x: MARGIN,
    y: y - rowHeight + 4,
    width: CONTENT_WIDTH,
    height: rowHeight + 2,
    color: rgb(0.93, 0.97, 0.94),
  });

  const cols = getColPositions();
  const labelY = y - rowHeight + 9;
  const size = 8;

  drawText(page, "PRODUCT", cols.product, labelY, fontBold, size, COLOR_EMERALD);
  drawText(page, "QTY", cols.qty, labelY, fontBold, size, COLOR_EMERALD);
  drawText(page, "UNIT PRICE", cols.price, labelY, fontBold, size, COLOR_EMERALD);
  drawTextRight(page, "AMOUNT", cols.amountRight, labelY, fontBold, size, COLOR_EMERALD);

  return y - rowHeight - 2;
}

function drawTableRows(
  page: PDFPage,
  items: BillItem[],
  bill: Bill,
  fontRegular: PDFFont,
  fontBold: PDFFont,
  startY: number,
): number {
  let y = startY;
  const rowHeight = 16;
  const cols = getColPositions();

  items.forEach((item, idx) => {
    // Alternate row background
    if (idx % 2 === 0) {
      page.drawRectangle({
        x: MARGIN,
        y: y - rowHeight + 4,
        width: CONTENT_WIDTH,
        height: rowHeight,
        color: rgb(0.97, 0.97, 0.97),
      });
    }

    const rowY = y - rowHeight + 7;
    const textSize = 8.5;

    // Product name — truncate if too long
    const maxNameChars = 38;
    const name = item.productName || "(unnamed)";
    const displayName = name.length > maxNameChars ? name.slice(0, maxNameChars - 1) + "…" : name;
    drawText(page, displayName, cols.product, rowY, fontRegular, textSize, COLOR_BLACK);
    drawText(page, String(item.quantity), cols.qty, rowY, fontRegular, textSize, COLOR_BLACK);
    drawText(
      page,
      formatCurrency(item.unitPrice, bill.currency),
      cols.price,
      rowY,
      fontRegular,
      textSize,
      COLOR_BLACK,
    );
    drawTextRight(
      page,
      formatCurrency(item.lineTotal, bill.currency),
      cols.amountRight,
      rowY,
      fontBold,
      textSize,
      COLOR_BLACK,
    );

    y -= rowHeight;
  });

  return y;
}

function drawTotals(
  page: PDFPage,
  bill: Bill,
  fontRegular: PDFFont,
  fontBold: PDFFont,
  startY: number,
): number {
  let y = startY - 6;
  const labelX = PAGE_WIDTH - MARGIN - 210;
  const valueRight = PAGE_WIDTH - MARGIN;
  const size = 9;

  // Subtotal
  drawText(page, "Subtotal", labelX, y, fontRegular, size, COLOR_GRAY);
  drawTextRight(
    page,
    formatCurrency(bill.subtotal, bill.currency),
    valueRight,
    y,
    fontRegular,
    size,
    COLOR_BLACK,
  );
  y -= 14;

  // GST
  if (bill.gstEnabled && bill.gstAmount > 0) {
    drawText(page, `GST (${bill.gstPercent}%)`, labelX, y, fontRegular, size, COLOR_GRAY);
    drawTextRight(
      page,
      formatCurrency(bill.gstAmount, bill.currency),
      valueRight,
      y,
      fontRegular,
      size,
      COLOR_BLACK,
    );
    y -= 14;
  }

  y -= 4;

  // Grand total row — visually emphasized
  page.drawRectangle({
    x: MARGIN,
    y: y - 12,
    width: CONTENT_WIDTH,
    height: 26,
    color: COLOR_EMERALD,
  });
  drawText(page, "GRAND TOTAL", MARGIN + 8, y + 1, fontBold, 11, COLOR_WHITE);
  drawTextRight(
    page,
    formatCurrency(bill.total, bill.currency),
    valueRight - 4,
    y + 1,
    fontBold,
    13,
    COLOR_WHITE,
  );

  return y - 20;
}

function drawFooter(
  page: PDFPage,
  fontRegular: PDFFont,
  pageNum: number,
  totalPages: number,
): void {
  const y = 22;
  const footerText = `Generated by IXDocs Bill Calculator — calc.ixdocs.com${totalPages > 1 ? `  ·  Page ${pageNum} of ${totalPages}` : ""}`;
  const textWidth = fontRegular.widthOfTextAtSize(footerText, 7);
  page.drawText(footerText, {
    x: MARGIN + (CONTENT_WIDTH - textWidth) / 2,
    y,
    size: 7,
    font: fontRegular,
    color: COLOR_LIGHT_GRAY,
  });
}

// ─── Column positions ─────────────────────────────────────────────────────────

function getColPositions() {
  return {
    product: MARGIN + 4,
    qty: MARGIN + 300,
    price: MARGIN + 360,
    amountRight: PAGE_WIDTH - MARGIN - 2,
  };
}

// ─── Text helpers ─────────────────────────────────────────────────────────────

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
): void {
  page.drawText(text, { x, y, size, font, color });
}

function drawTextRight(
  page: PDFPage,
  text: string,
  rightEdge: number,
  y: number,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
): void {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: rightEdge - width, y, size, font, color });
}
