/**
 * IXDocs processing layer.
 *
 * Everything here runs in the browser. It is deliberately isolated from the UI
 * so a production service can replace individual runners without touching the
 * interface. A runner that cannot genuinely process a file must throw — the UI
 * never fabricates a successful result.
 */
import type { PDFDocument as PDFDocumentType } from "pdf-lib";

export interface OutputFile {
  name: string;
  blob: Blob;
  size: number;
  kind: "pdf" | "image" | "text";
}

export interface StatLine {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
}

export interface ReportRow {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
}

export interface ReportSection {
  title: string;
  rows: ReportRow[];
}

export interface RunResult {
  outputs: OutputFile[];
  stats?: StatLine[];
  report?: ReportSection[];
  message?: string;
  /** true when a requested target/goal could not be fully met. */
  partial?: boolean;
}

export interface RunContext {
  files: File[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any;
  /** 1-based page numbers currently selected (page tools only). */
  selectedPages: number[];
  /** 0-based page indices in display order (reorder tools only). */
  pageOrder: number[];
  totalPages: number;
  onProgress: (value: number | null, label?: string) => void;
}

export type Runner = (ctx: RunContext) => Promise<RunResult>;

export class ToolError extends Error {}

/* ------------------------------------------------------------------ utils */

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const PAGE_SIZES: Record<string, [number, number]> = {
  a4: [595.28, 841.89],
  a3: [841.89, 1190.55],
  letter: [612, 792],
  legal: [612, 1008],
  "4x6": [288, 432],
};

export function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

export function parseRanges(input: string, max: number): number[][] {
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) throw new ToolError("Enter at least one page range, for example 1-3, 5.");
  return parts.map((part) => {
    const m = part.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
    if (!m) throw new ToolError(`"${part}" is not a valid page range. Use formats like 4 or 2-6.`);
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    if (start < 1 || end > max || end < start) {
      throw new ToolError(
        `Range "${part}" is outside this document, which has ${max} page${max === 1 ? "" : "s"}.`,
      );
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });
}

async function loadPdfLib() {
  return await import("pdf-lib");
}

export async function loadPdfDoc(file: File, forEditing = true): Promise<PDFDocumentType> {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  try {
    return await PDFDocument.load(bytes, { ignoreEncryption: !forEditing, updateMetadata: false });
  } catch (err) {
    if (String(err).toLowerCase().includes("encrypt")) {
      throw new ToolError(
        "This PDF is password protected. Unlock it in a PDF reader first, then try again.",
      );
    }
    throw new ToolError(
      "This file could not be read as a PDF. It may be corrupt or in a different format.",
    );
  }
}

export async function saveDoc(doc: PDFDocumentType, name: string): Promise<OutputFile> {
  const bytes = await doc.save({ useObjectStreams: true });
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  return { name, blob, size: blob.size, kind: "pdf" };
}

/* ------------------------------------------------------------------ pdf.js */

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

export async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs = await import("pdfjs-dist");
      const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}

export async function openRenderDoc(file: File) {
  const pdfjs = await getPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  try {
    return await pdfjs.getDocument({ data }).promise;
  } catch {
    throw new ToolError(
      "This PDF could not be opened for rendering. It may be corrupt or password protected.",
    );
  }
}

export async function renderPageToCanvas(
  doc: Awaited<ReturnType<typeof openRenderDoc>>,
  pageNumber: number,
  scale: number,
): Promise<HTMLCanvasElement> {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ToolError("Your browser could not create a drawing canvas for rendering.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvas, canvasContext: ctx, viewport } as never).promise;
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new ToolError("The browser could not encode the rendered page.")),
      type,
      quality,
    );
  });
}

export async function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new ToolError("This image could not be read. Try a JPG or PNG file."));
    img.src = src;
  });
}

export async function fileToImage(file: File) {
  const url = URL.createObjectURL(file);
  try {
    return await loadImageElement(url);
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}

/** Rebuild a PDF by rasterising each page — the only reliable browser-side compression. */
export async function rasterCompress(
  file: File,
  opts: { scale: number; quality: number; onProgress?: (p: number) => void },
): Promise<Uint8Array> {
  const { PDFDocument } = await loadPdfLib();
  const src = await openRenderDoc(file);
  const out = await PDFDocument.create();
  for (let i = 1; i <= src.numPages; i++) {
    const canvas = await renderPageToCanvas(src, i, opts.scale);
    const blob = await canvasToBlob(canvas, "image/jpeg", opts.quality);
    const img = await out.embedJpg(await blob.arrayBuffer());
    const page = out.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    opts.onProgress?.(i / src.numPages);
  }
  return await out.save({ useObjectStreams: true });
}
