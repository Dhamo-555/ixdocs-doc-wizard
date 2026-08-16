import {
  PAGE_SIZES,
  ToolError,
  baseName,
  canvasToBlob,
  fileToImage,
  formatBytes,
  loadPdfDoc,
  openRenderDoc,
  parseRanges,
  rasterCompress,
  renderPageToCanvas,
  saveDoc,
  type OutputFile,
  type RunContext,
  type RunResult,
  type Runner,
} from "./pdf-engine";

const num = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const str = (v: unknown, fallback = "") => (v === undefined || v === null ? fallback : String(v));

function pdfBlobOutput(bytes: Uint8Array, name: string): OutputFile {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  return { name, blob, size: blob.size, kind: "pdf" };
}

function requireOne(ctx: RunContext) {
  const file = ctx.files[0];
  if (!file) throw new ToolError("Add a file before processing.");
  return file;
}

function sizeStats(originalSize: number, resultSize: number) {
  const reduction = ((originalSize - resultSize) / originalSize) * 100;
  return [
    { label: "Original", value: formatBytes(originalSize) },
    { label: "Result", value: formatBytes(resultSize) },
    {
      label: reduction >= 0 ? "Reduction" : "Increase",
      value: `${Math.abs(reduction).toFixed(1)}% ${reduction >= 0 ? "smaller" : "larger"}`,
      tone: reduction > 0 ? ("success" as const) : ("warning" as const),
    },
  ];
}

/* ------------------------------------------------------------------ Convert */

const jpgToPdf: Runner = async ({ files, options, onProgress }) => {
  const { PDFDocument } = await import("pdf-lib");
  if (!files.length) throw new ToolError("Add at least one image.");
  const doc = await PDFDocument.create();
  const margin = num(options["margin"], 24);
  const sizeKey = str(options["pageSize"], "a4");
  const landscape = str(options["orientation"], "portrait") === "landscape";
  const cover = str(options["fit"], "contain") === "cover";

  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    let bytes = new Uint8Array(await file.arrayBuffer());
    let type = file.type;
    if (!/jpeg|jpg|png/.test(type)) {
      const img = await fileToImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
      bytes = new Uint8Array(await blob.arrayBuffer());
      type = "image/jpeg";
    }
    const embedded = /png/.test(type) ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);

    if (sizeKey === "auto") {
      const page = doc.addPage([embedded.width + margin * 2, embedded.height + margin * 2]);
      page.drawImage(embedded, {
        x: margin,
        y: margin,
        width: embedded.width,
        height: embedded.height,
      });
    } else {
      const base = PAGE_SIZES[sizeKey] ?? PAGE_SIZES["a4"]!;
      const [w, h] = landscape ? [base[1], base[0]] : base;
      const page = doc.addPage([w, h]);
      const availW = w - margin * 2;
      const availH = h - margin * 2;
      const ratio = cover
        ? Math.max(availW / embedded.width, availH / embedded.height)
        : Math.min(availW / embedded.width, availH / embedded.height);
      const dw = embedded.width * ratio;
      const dh = embedded.height * ratio;
      page.drawImage(embedded, { x: (w - dw) / 2, y: (h - dh) / 2, width: dw, height: dh });
    }
    onProgress((i + 1) / files.length);
  }

  const out = await saveDoc(doc, `${baseName(files[0]!.name)}-ixdocs.pdf`);
  return {
    outputs: [out],
    stats: [
      { label: "Pages", value: String(files.length) },
      { label: "Size", value: formatBytes(out.size) },
    ],
  };
};

function renderRunner(format: "image/jpeg" | "image/png"): Runner {
  return async ({ files, options, selectedPages, onProgress }) => {
    const file = requireOne({ files } as RunContext);
    const scale = num(options["scale"], 2);
    const quality = num(options["quality"], 85) / 100;
    const doc = await openRenderDoc(file);
    const pages = selectedPages.length
      ? selectedPages
      : Array.from({ length: doc.numPages }, (_, i) => i + 1);
    const ext = format === "image/png" ? "png" : "jpg";
    const outputs: OutputFile[] = [];
    for (let i = 0; i < pages.length; i++) {
      const canvas = await renderPageToCanvas(doc, pages[i]!, scale);
      const blob = await canvasToBlob(
        canvas,
        format,
        format === "image/jpeg" ? quality : undefined,
      );
      outputs.push({
        name: `${baseName(file.name)}-page-${pages[i]}.${ext}`,
        blob,
        size: blob.size,
        kind: "image",
      });
      onProgress((i + 1) / pages.length);
    }
    return {
      outputs,
      stats: [
        { label: "Images", value: String(outputs.length) },
        { label: "Total size", value: formatBytes(outputs.reduce((a, o) => a + o.size, 0)) },
      ],
    };
  };
}

/* ----------------------------------------------------------------- Organize */

const mergePdf: Runner = async ({ files, onProgress }) => {
  const { PDFDocument } = await import("pdf-lib");
  if (files.length < 2) throw new ToolError("Add at least two PDF files to merge.");
  const out = await PDFDocument.create();
  let total = 0;
  for (let i = 0; i < files.length; i++) {
    const src = await loadPdfDoc(files[i]!);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    total += pages.length;
    onProgress((i + 1) / files.length);
  }
  const result = await saveDoc(out, "ixdocs-merged.pdf");
  return {
    outputs: [result],
    stats: [
      { label: "Files merged", value: String(files.length) },
      { label: "Pages", value: String(total) },
      { label: "Size", value: formatBytes(result.size) },
    ],
  };
};

const splitPdf: Runner = async (ctx) => {
  const { PDFDocument } = await import("pdf-lib");
  const file = requireOne(ctx);
  const src = await loadPdfDoc(file);
  const total = src.getPageCount();
  const mode = str(ctx.options["mode"], "ranges");
  const groups =
    mode === "every"
      ? Array.from({ length: total }, (_, i) => [i + 1])
      : parseRanges(str(ctx.options["ranges"], ""), total);

  const outputs: OutputFile[] = [];
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]!;
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(
      src,
      group.map((p) => p - 1),
    );
    copied.forEach((p) => doc.addPage(p));
    const label =
      group.length === 1 ? `page-${group[0]}` : `pages-${group[0]}-${group[group.length - 1]}`;
    outputs.push(await saveDoc(doc, `${baseName(file.name)}-${label}.pdf`));
    ctx.onProgress((i + 1) / groups.length);
  }
  return { outputs, stats: [{ label: "Documents created", value: String(outputs.length) }] };
};

const rotatePdf: Runner = async (ctx) => {
  const { degrees } = await import("pdf-lib");
  const file = requireOne(ctx);
  const doc = await loadPdfDoc(file);
  const angle = num(ctx.options["angle"], 90);
  const pages = doc.getPages();
  const selected = ctx.selectedPages.length ? ctx.selectedPages : pages.map((_, i) => i + 1);
  selected.forEach((n) => {
    const page = pages[n - 1];
    if (page) page.setRotation(degrees((page.getRotation().angle + angle) % 360));
  });
  ctx.onProgress(1);
  const out = await saveDoc(doc, `${baseName(file.name)}-rotated.pdf`);
  return { outputs: [out], stats: [{ label: "Pages rotated", value: String(selected.length) }] };
};

const extractPages: Runner = async (ctx) => {
  const { PDFDocument } = await import("pdf-lib");
  const file = requireOne(ctx);
  const src = await loadPdfDoc(file);
  const selected = ctx.selectedPages;
  if (!selected.length) throw new ToolError("Select at least one page to extract.");
  const separate = str(ctx.options["output"], "single") === "separate";
  const outputs: OutputFile[] = [];
  if (separate) {
    for (let i = 0; i < selected.length; i++) {
      const doc = await PDFDocument.create();
      const [page] = await doc.copyPages(src, [selected[i]! - 1]);
      doc.addPage(page!);
      outputs.push(await saveDoc(doc, `${baseName(file.name)}-page-${selected[i]}.pdf`));
      ctx.onProgress((i + 1) / selected.length);
    }
  } else {
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(
      src,
      selected.map((p) => p - 1),
    );
    copied.forEach((p) => doc.addPage(p));
    outputs.push(await saveDoc(doc, `${baseName(file.name)}-extracted.pdf`));
    ctx.onProgress(1);
  }
  return { outputs, stats: [{ label: "Pages extracted", value: String(selected.length) }] };
};

const deletePages: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const doc = await loadPdfDoc(file);
  const total = doc.getPageCount();
  const remove = ctx.selectedPages;
  if (!remove.length) throw new ToolError("Select the pages you want to delete.");
  if (remove.length >= total)
    throw new ToolError("A PDF must keep at least one page — deselect one page.");
  [...remove].sort((a, b) => b - a).forEach((n) => doc.removePage(n - 1));
  ctx.onProgress(1);
  const out = await saveDoc(doc, `${baseName(file.name)}-cleaned.pdf`);
  return {
    outputs: [out],
    stats: [
      { label: "Pages removed", value: String(remove.length) },
      { label: "Pages remaining", value: String(total - remove.length) },
    ],
  };
};

const reorderPages: Runner = async (ctx) => {
  const { PDFDocument } = await import("pdf-lib");
  const file = requireOne(ctx);
  const src = await loadPdfDoc(file);
  const order = ctx.pageOrder.length ? ctx.pageOrder : src.getPageIndices();
  const doc = await PDFDocument.create();
  const copied = await doc.copyPages(src, order);
  copied.forEach((p) => doc.addPage(p));
  ctx.onProgress(1);
  const out = await saveDoc(doc, `${baseName(file.name)}-reordered.pdf`);
  return { outputs: [out], stats: [{ label: "Pages", value: String(order.length) }] };
};

/* ----------------------------------------------------------------- Edit PDF */

const watermarkPdf: Runner = async (ctx) => {
  const { StandardFonts, degrees, rgb } = await import("pdf-lib");
  const file = requireOne(ctx);
  const doc = await loadPdfDoc(file);
  const text = str(ctx.options["text"], "").trim();
  if (!text) throw new ToolError("Enter the watermark text you want to apply.");
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const size = num(ctx.options["size"], 48);
  const opacity = num(ctx.options["opacity"], 20) / 100;
  const rotation = num(ctx.options["rotation"], 45);
  const position = str(ctx.options["position"], "center");
  const pages = doc.getPages();
  const selected = ctx.selectedPages.length ? ctx.selectedPages : pages.map((_, i) => i + 1);

  selected.forEach((n) => {
    const page = pages[n - 1];
    if (!page) return;
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, size);
    const rad = (rotation * Math.PI) / 180;
    const y =
      position === "top" ? height * 0.82 : position === "bottom" ? height * 0.15 : height / 2;
    page.drawText(text, {
      x: width / 2 - (Math.cos(rad) * textWidth) / 2,
      y: y - (Math.sin(rad) * textWidth) / 2,
      size,
      font,
      color: rgb(0.35, 0.4, 0.5),
      opacity,
      rotate: degrees(rotation),
    });
  });
  ctx.onProgress(1);
  const out = await saveDoc(doc, `${baseName(file.name)}-watermarked.pdf`);
  return {
    outputs: [out],
    stats: [{ label: "Pages watermarked", value: String(selected.length) }],
  };
};

const pageNumbering: Runner = async (ctx) => {
  const { StandardFonts, rgb } = await import("pdf-lib");
  const file = requireOne(ctx);
  const doc = await loadPdfDoc(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const size = num(ctx.options["size"], 11);
  const start = num(ctx.options["start"], 1);
  const format = str(ctx.options["format"], "n");
  const position = str(ctx.options["position"], "bottom-center");
  const pages = doc.getPages();
  const selected = ctx.selectedPages.length ? ctx.selectedPages : pages.map((_, i) => i + 1);

  selected.forEach((n, idx) => {
    const page = pages[n - 1];
    if (!page) return;
    const value = start + idx;
    const label =
      format === "n-of-total"
        ? `${value} of ${selected.length + start - 1}`
        : format === "page-n"
          ? `Page ${value}`
          : format === "dash"
            ? `– ${value} –`
            : String(value);
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(label, size);
    const margin = 28;
    const x = position.endsWith("left")
      ? margin
      : position.endsWith("right")
        ? width - margin - textWidth
        : (width - textWidth) / 2;
    const y = position.startsWith("top") ? height - margin - size : margin;
    page.drawText(label, { x, y, size, font, color: rgb(0.25, 0.28, 0.35) });
  });
  ctx.onProgress(1);
  const out = await saveDoc(doc, `${baseName(file.name)}-numbered.pdf`);
  return { outputs: [out], stats: [{ label: "Pages numbered", value: String(selected.length) }] };
};

/* ------------------------------------------------------- Compress & optimize */

const LEVELS: Record<string, { scale: number; quality: number }> = {
  light: { scale: 2, quality: 0.85 },
  balanced: { scale: 1.5, quality: 0.65 },
  strong: { scale: 1, quality: 0.45 },
};

const compressPdf: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const level = str(ctx.options["level"], "balanced");
  let bytes: Uint8Array;
  if (level === "lossless") {
    const doc = await loadPdfDoc(file);
    bytes = await doc.save({ useObjectStreams: true });
  } else {
    const preset = LEVELS[level] ?? LEVELS["balanced"]!;
    bytes = await rasterCompress(file, { ...preset, onProgress: (p) => ctx.onProgress(p) });
  }
  const out = pdfBlobOutput(bytes, `${baseName(file.name)}-compressed.pdf`);
  const grew = out.size >= file.size;
  return {
    outputs: grew ? [] : [out],
    stats: sizeStats(file.size, out.size),
    partial: grew,
    ...(grew
      ? {
          message:
            "This document is already well optimised — every setting we tried produced a larger file, so there is nothing to download. Your original is the smallest version.",
        }
      : {}),
  };
};

const compressToTarget: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const targetOption = str(ctx.options["target"], "200");
  const targetKb =
    targetOption === "custom" ? num(ctx.options["customKb"], 300) : num(targetOption, 200);
  const targetBytes = targetKb * 1024;

  const attempts = [
    { scale: 2, quality: 0.8 },
    { scale: 1.6, quality: 0.65 },
    { scale: 1.3, quality: 0.5 },
    { scale: 1, quality: 0.4 },
    { scale: 0.8, quality: 0.3 },
    { scale: 0.6, quality: 0.22 },
  ];

  let best: Uint8Array | null = null;
  for (let i = 0; i < attempts.length; i++) {
    ctx.onProgress(
      (i + 0.5) / attempts.length,
      `Testing compression setting ${i + 1} of ${attempts.length}`,
    );
    const bytes = await rasterCompress(file, attempts[i]!);
    if (!best || bytes.length < best.length) best = bytes;
    if (bytes.length <= targetBytes) {
      best = bytes;
      break;
    }
  }
  if (!best) throw new ToolError("Compression failed before producing a result. Please try again.");

  const out = pdfBlobOutput(best, `${baseName(file.name)}-${targetKb}kb.pdf`);
  const met = out.size <= targetBytes;
  return {
    outputs: [out],
    partial: !met,
    stats: [
      { label: "Original", value: formatBytes(file.size) },
      { label: "Target", value: formatBytes(targetBytes) },
      { label: "Result", value: formatBytes(out.size), tone: met ? "success" : "warning" },
      {
        label: "Reduction",
        value: `${Math.max(0, ((file.size - out.size) / file.size) * 100).toFixed(1)}% smaller`,
      },
    ],
    message: met
      ? `The file now fits inside your ${formatBytes(targetBytes)} limit.`
      : `We could not reach ${formatBytes(targetBytes)} while keeping the pages readable. This is the smallest version we produced at ${formatBytes(out.size)} — the document simply carries more visual detail than that limit allows. Removing pages first usually helps.`,
  };
};

const healthChecker: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const doc = await loadPdfDoc(file, false);
  const pages = doc.getPages();
  const sizes = pages.map((p) => p.getSize());
  const uniqueSizes = new Set(sizes.map((s) => `${Math.round(s.width)}×${Math.round(s.height)}`));
  const portrait = sizes.filter((s) => s.height >= s.width).length;
  const avgPage = file.size / Math.max(1, pages.length);
  const encrypted = doc.isEncrypted;

  return {
    outputs: [],
    report: [
      {
        title: "Document",
        rows: [
          { label: "File size", value: formatBytes(file.size) },
          { label: "Pages", value: String(pages.length) },
          {
            label: "Average page weight",
            value: formatBytes(avgPage),
            tone: avgPage > 500 * 1024 ? "warning" : "success",
          },
          {
            label: "Encrypted",
            value: encrypted ? "Yes" : "No",
            tone: encrypted ? "warning" : "success",
          },
        ],
      },
      {
        title: "Pages",
        rows: [
          {
            label: "Page dimensions",
            value:
              Array.from(uniqueSizes).slice(0, 4).join(", ") + (uniqueSizes.size > 4 ? " …" : ""),
          },
          {
            label: "Consistent size",
            value: uniqueSizes.size === 1 ? "Yes" : `No — ${uniqueSizes.size} different sizes`,
            tone: uniqueSizes.size === 1 ? "success" : "warning",
          },
          { label: "Portrait pages", value: `${portrait} of ${pages.length}` },
          { label: "Landscape pages", value: `${pages.length - portrait} of ${pages.length}` },
        ],
      },
      {
        title: "Metadata",
        rows: [
          { label: "Title", value: doc.getTitle() || "Not set" },
          { label: "Author", value: doc.getAuthor() || "Not set" },
          { label: "Creator", value: doc.getCreator() || "Not set" },
          { label: "Producer", value: doc.getProducer() || "Not set" },
          { label: "Created", value: doc.getCreationDate()?.toLocaleString() ?? "Not set" },
          { label: "Modified", value: doc.getModificationDate()?.toLocaleString() ?? "Not set" },
        ],
      },
    ],
    message: "Report generated from the file on your device. Nothing was uploaded.",
  };
};

async function resizeDoc(
  file: File,
  opts: { sizeKey: string; orientation: string; margin: number; align: string },
  onProgress: (p: number) => void,
) {
  const { PDFDocument } = await import("pdf-lib");
  const srcBytes = await file.arrayBuffer();
  const src = await loadPdfDoc(file);
  const out = await PDFDocument.create();
  const count = src.getPageCount();
  for (let i = 0; i < count; i++) {
    const [embedded] = await out.embedPdf(srcBytes, [i]);
    if (!embedded) continue;
    const base = PAGE_SIZES[opts.sizeKey] ?? PAGE_SIZES["a4"]!;
    const wantLandscape =
      opts.orientation === "landscape" ||
      (opts.orientation === "keep" && embedded.width > embedded.height);
    const [w, h] = wantLandscape ? [base[1], base[0]] : base;
    const page = out.addPage([w, h]);
    const availW = w - opts.margin * 2;
    const availH = h - opts.margin * 2;
    const ratio = Math.min(availW / embedded.width, availH / embedded.height);
    const dw = embedded.width * ratio;
    const dh = embedded.height * ratio;
    const y = opts.align === "top" ? h - opts.margin - dh : (h - dh) / 2;
    page.drawPage(embedded, { x: (w - dw) / 2, y, width: dw, height: dh });
    onProgress((i + 1) / count);
  }
  return await out.save({ useObjectStreams: true });
}

const pageSizeConverter: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const bytes = await resizeDoc(
    file,
    {
      sizeKey: str(ctx.options["pageSize"], "a4"),
      orientation: str(ctx.options["orientation"], "portrait"),
      margin: 0,
      align: "center",
    },
    (p) => ctx.onProgress(p),
  );
  const out = pdfBlobOutput(
    bytes,
    `${baseName(file.name)}-${str(ctx.options["pageSize"], "a4")}.pdf`,
  );
  return { outputs: [out], stats: sizeStats(file.size, out.size) };
};

const printReady: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const bytes = await resizeDoc(
    file,
    {
      sizeKey: str(ctx.options["pageSize"], "a4"),
      orientation: str(ctx.options["orientation"], "portrait"),
      margin: num(ctx.options["margin"], 36),
      align: str(ctx.options["align"], "center"),
    },
    (p) => ctx.onProgress(p),
  );
  const out = pdfBlobOutput(bytes, `${baseName(file.name)}-print-ready.pdf`);
  return {
    outputs: [out],
    stats: [
      { label: "Paper", value: str(ctx.options["pageSize"], "a4").toUpperCase() },
      { label: "Margin", value: `${num(ctx.options["margin"], 36)} pt` },
      { label: "Size", value: formatBytes(out.size) },
    ],
  };
};

/* ------------------------------------------------------------------ Privacy */

const metadataCleaner: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const doc = await loadPdfDoc(file);
  const detected = [
    { label: "Title", value: doc.getTitle() || "Not set" },
    { label: "Author", value: doc.getAuthor() || "Not set" },
    { label: "Subject", value: doc.getSubject() || "Not set" },
    { label: "Keywords", value: doc.getKeywords() || "Not set" },
    { label: "Creator", value: doc.getCreator() || "Not set" },
    { label: "Producer", value: doc.getProducer() || "Not set" },
    { label: "Created", value: doc.getCreationDate()?.toLocaleString() ?? "Not set" },
    { label: "Modified", value: doc.getModificationDate()?.toLocaleString() ?? "Not set" },
  ];
  doc.setTitle("");
  doc.setAuthor("");
  doc.setSubject("");
  doc.setKeywords([]);
  doc.setCreator("");
  doc.setProducer("");
  ctx.onProgress(1);
  const out = await saveDoc(doc, `${baseName(file.name)}-clean.pdf`);
  return {
    outputs: [out],
    report: [{ title: "Metadata found in your original file", rows: detected }],
    message: "The document information fields listed above were cleared in the downloaded copy.",
  };
};

/* ----------------------------------------------------------------- Advanced */

const applicationOptimizer: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const sizeKey = str(ctx.options["pageSize"], "a4");
  const targetOption = str(ctx.options["target"], "500");
  const targetKb =
    targetOption === "custom" ? num(ctx.options["customKb"], 300) : num(targetOption, 500);
  const targetBytes = targetKb * 1024;

  let working = file;
  if (sizeKey !== "keep") {
    ctx.onProgress(null, "Standardising page size");
    const bytes = await resizeDoc(
      file,
      { sizeKey, orientation: "portrait", margin: 0, align: "center" },
      () => {},
    );
    working = new File([bytes as unknown as BlobPart], file.name, { type: "application/pdf" });
  }

  const attempts = [
    { scale: 2, quality: 0.8 },
    { scale: 1.5, quality: 0.6 },
    { scale: 1.2, quality: 0.45 },
    { scale: 1, quality: 0.35 },
    { scale: 0.8, quality: 0.25 },
  ];
  let best: Uint8Array | null = null;
  for (let i = 0; i < attempts.length; i++) {
    ctx.onProgress((i + 0.5) / attempts.length, `Optimising images (pass ${i + 1})`);
    const bytes = await rasterCompress(working, attempts[i]!);
    if (!best || bytes.length < best.length) best = bytes;
    if (bytes.length <= targetBytes) {
      best = bytes;
      break;
    }
  }
  const out = pdfBlobOutput(best!, `${baseName(file.name)}-application.pdf`);
  const met = out.size <= targetBytes;
  return {
    outputs: [out],
    partial: !met,
    stats: [
      { label: "Page size", value: sizeKey === "keep" ? "Unchanged" : sizeKey.toUpperCase() },
      { label: "Original", value: formatBytes(file.size) },
      { label: "Final size", value: formatBytes(out.size), tone: met ? "success" : "warning" },
      { label: "Limit", value: formatBytes(targetBytes) },
    ],
    message: met
      ? "The document meets the size and page settings you entered. Acceptance is always decided by the organisation you submit to."
      : `The document could not be brought under ${formatBytes(targetBytes)} at a readable quality. This is the smallest version produced.`,
  };
};

const passportSheet: Runner = async (ctx) => {
  const { PDFDocument, rgb } = await import("pdf-lib");
  const file = requireOne(ctx);
  const img = await fileToImage(file);
  const [pw, ph] = (
    {
      "35x45": [35, 45],
      "51x51": [51, 51],
      "50x70": [50, 70],
      "25x35": [25, 35],
    } as Record<string, [number, number]>
  )[str(ctx.options["photoSize"], "35x45")] ?? [35, 45];
  const mmToPt = 72 / 25.4;
  const cellW = pw * mmToPt;
  const cellH = ph * mmToPt;
  const sheetKey = str(ctx.options["sheet"], "a4");
  const [sw, sh] = PAGE_SIZES[sheetKey] ?? PAGE_SIZES["a4"]!;
  const copies = Math.max(1, num(ctx.options["copies"], 8));
  const guides = ctx.options["guides"] !== false;

  // Normalise the photo to the exact aspect ratio with a centre crop.
  const canvas = document.createElement("canvas");
  const targetRatio = cellW / cellH;
  const srcRatio = img.naturalWidth / img.naturalHeight;
  let sx = 0,
    sy = 0,
    sWidth = img.naturalWidth,
    sHeight = img.naturalHeight;
  if (srcRatio > targetRatio) {
    sWidth = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sWidth) / 2;
  } else {
    sHeight = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sHeight) / 2;
  }
  canvas.width = Math.round(pw * 12);
  canvas.height = Math.round(ph * 12);
  const c = canvas.getContext("2d")!;
  c.fillStyle = "#ffffff";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
  const blob = await canvasToBlob(canvas, "image/jpeg", 0.95);

  const doc = await PDFDocument.create();
  const embedded = await doc.embedJpg(await blob.arrayBuffer());
  const gap = 8;
  const margin = 24;
  const cols = Math.max(1, Math.floor((sw - margin * 2 + gap) / (cellW + gap)));
  const rows = Math.max(1, Math.floor((sh - margin * 2 + gap) / (cellH + gap)));
  const perSheet = cols * rows;
  const sheets = Math.ceil(copies / perSheet);
  let placed = 0;
  for (let s = 0; s < sheets; s++) {
    const page = doc.addPage([sw, sh]);
    for (let r = 0; r < rows && placed < copies; r++) {
      for (let col = 0; col < cols && placed < copies; col++) {
        const x = margin + col * (cellW + gap);
        const y = sh - margin - (r + 1) * cellH - r * gap;
        page.drawImage(embedded, { x, y, width: cellW, height: cellH });
        if (guides) {
          page.drawRectangle({
            x,
            y,
            width: cellW,
            height: cellH,
            borderColor: rgb(0.75, 0.78, 0.82),
            borderWidth: 0.5,
          });
        }
        placed++;
      }
    }
    ctx.onProgress((s + 1) / sheets);
  }
  const out = await saveDoc(doc, `${baseName(file.name)}-photo-sheet.pdf`);
  return {
    outputs: [out],
    stats: [
      { label: "Photo size", value: `${pw} × ${ph} mm` },
      { label: "Copies", value: String(copies) },
      { label: "Sheets", value: String(sheets) },
    ],
    message: "Print at 100% scale — any resizing changes the physical photo dimensions.",
  };
};

const documentScanner: Runner = async (ctx) => {
  const { PDFDocument } = await import("pdf-lib");
  if (!ctx.files.length) throw new ToolError("Capture or add at least one page.");
  const enhance = str(ctx.options["enhance"], "scan");
  const sizeKey = str(ctx.options["pageSize"], "a4");
  const doc = await PDFDocument.create();

  for (let i = 0; i < ctx.files.length; i++) {
    const img = await fileToImage(ctx.files[i]!);
    const canvas = document.createElement("canvas");
    const maxDim = 2200;
    const ratio = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    canvas.width = Math.round(img.naturalWidth * ratio);
    canvas.height = Math.round(img.naturalHeight * ratio);
    const c = canvas.getContext("2d")!;
    if (enhance === "scan") c.filter = "grayscale(0.15) brightness(1.12) contrast(1.35)";
    if (enhance === "bw") c.filter = "grayscale(1) brightness(1.18) contrast(1.9)";
    c.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.82);
    const embedded = await doc.embedJpg(await blob.arrayBuffer());

    if (sizeKey === "auto") {
      const page = doc.addPage([embedded.width, embedded.height]);
      page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
    } else {
      const base = PAGE_SIZES[sizeKey] ?? PAGE_SIZES["a4"]!;
      const [w, h] = embedded.width > embedded.height ? [base[1], base[0]] : base;
      const page = doc.addPage([w, h]);
      const scale = Math.min(w / embedded.width, h / embedded.height);
      const dw = embedded.width * scale;
      const dh = embedded.height * scale;
      page.drawImage(embedded, { x: (w - dw) / 2, y: (h - dh) / 2, width: dw, height: dh });
    }
    ctx.onProgress((i + 1) / ctx.files.length);
  }
  const out = await saveDoc(doc, "ixdocs-scan.pdf");
  return {
    outputs: [out],
    stats: [
      { label: "Pages scanned", value: String(ctx.files.length) },
      { label: "Size", value: formatBytes(out.size) },
    ],
  };
};

const smartAnalyzer: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const doc = await openRenderDoc(file);
  let words = 0;
  let characters = 0;
  let likelyScanned = 0;
  const fonts = new Set<string>();
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    content.items.forEach((item) => {
      if ("fontName" in item && item.fontName) fonts.add(String(item.fontName));
    });
    const trimmed = text.replace(/\s+/g, " ").trim();
    characters += trimmed.length;
    words += trimmed ? trimmed.split(" ").length : 0;
    const ops = await page.getOperatorList();
    const hasImages = ops.fnArray.some((fn) => fn === 85 || fn === 86 || fn === 87);
    if (trimmed.length < 30 && hasImages) likelyScanned++;
    ctx.onProgress(i / doc.numPages);
  }
  const readingMinutes = Math.max(1, Math.round(words / 220));

  return {
    outputs: [],
    report: [
      {
        title: "Content",
        rows: [
          { label: "Pages", value: String(doc.numPages) },
          { label: "Extractable words", value: words.toLocaleString() },
          { label: "Characters", value: characters.toLocaleString() },
          { label: "Estimated reading time", value: `${readingMinutes} min` },
        ],
      },
      {
        title: "Structure",
        rows: [
          {
            label: "Likely scanned pages",
            value: likelyScanned ? `${likelyScanned} of ${doc.numPages}` : "None detected",
            tone: likelyScanned ? "warning" : "success",
          },
          {
            label: "Text is selectable",
            value: characters > 50 ? "Yes" : "No — this looks like an image-only document",
            tone: characters > 50 ? "success" : "warning",
          },
          { label: "Distinct fonts referenced", value: String(fonts.size) },
          { label: "File size", value: formatBytes(file.size) },
        ],
      },
    ],
    message: likelyScanned
      ? "Some pages contain images with little extractable text. Run PDF OCR to make them searchable."
      : "Everything above was measured directly from your file. No AI service was used.",
  };
};

export const RUNNERS: Record<string, Runner> = {
  "jpg-to-pdf": jpgToPdf,
  "pdf-to-jpg": renderRunner("image/jpeg"),
  "pdf-to-png": renderRunner("image/png"),
  "merge-pdf": mergePdf,
  "split-pdf": splitPdf,
  "rotate-pdf": rotatePdf,
  "extract-pdf-pages": extractPages,
  "delete-pdf-pages": deletePages,
  "reorder-pdf-pages": reorderPages,
  "watermark-pdf": watermarkPdf,
  "pdf-page-numbering": pageNumbering,
  "compress-pdf": compressPdf,
  "compress-pdf-to-target-size": compressToTarget,
  "pdf-health-checker": healthChecker,
  "pdf-page-size-converter": pageSizeConverter,
  "print-ready-pdf": printReady,
  "pdf-metadata-cleaner": metadataCleaner,
  "application-pdf-optimizer": applicationOptimizer,
  "passport-photo": passportSheet,
  "document-scanner": documentScanner,
  "smart-pdf-analyzer": smartAnalyzer,
};

export type { RunResult };
