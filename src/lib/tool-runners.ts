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
  const grew = out.size >= file.size;
  const met = out.size <= targetBytes;
  return {
    outputs: grew ? [] : [out],
    partial: !met || grew,
    stats: [
      { label: "Original", value: formatBytes(file.size) },
      { label: "Target", value: formatBytes(targetBytes) },
      { label: "Result", value: formatBytes(out.size), tone: met && !grew ? "success" : "warning" },
      {
        label: grew ? "Increase" : "Reduction",
        value: grew
          ? `${Math.abs(((file.size - out.size) / file.size) * 100).toFixed(1)}% larger`
          : `${Math.max(0, ((file.size - out.size) / file.size) * 100).toFixed(1)}% smaller`,
      },
    ],
    message: grew
      ? `This document is already well optimized — compression produced a larger file (${formatBytes(out.size)}), so your original is already the smallest version.`
      : met
      ? `The file now fits inside your ${formatBytes(targetBytes)} limit.`
      : `We could not reach ${formatBytes(targetBytes)} while keeping the pages readable. This is the smallest version we produced at ${formatBytes(out.size)} — the document carries more detail than that limit allows. Removing pages first usually helps.`,
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


/* ---------------------------------------------------------------- New Tools */

const pdfToText: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const doc = await openRenderDoc(file);
  const includeHeaders = ctx.options["includeHeaders"] !== false;
  const format = str(ctx.options["format"], "plain");

  let fullText = "";
  let totalWords = 0;
  let totalChars = 0;

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageStrings = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .filter((s) => s.trim().length > 0);
    const pageText = pageStrings.join(" ");

    totalChars += pageText.length;
    totalWords += pageText ? pageText.split(/\s+/).length : 0;

    if (includeHeaders) {
      if (format === "markdown") {
        fullText += `## Page ${i}\n\n${pageText}\n\n`;
      } else {
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }
    } else {
      fullText += `${pageText}\n\n`;
    }
    ctx.onProgress(i / doc.numPages);
  }

  const ext = format === "markdown" ? "md" : "txt";
  const mime = format === "markdown" ? "text/markdown" : "text/plain";
  const blob = new Blob([fullText], { type: mime });
  const outName = `${baseName(file.name)}_extracted.${ext}`;

  return {
    outputs: [{ name: outName, blob, size: blob.size, kind: "text" }],
    stats: [
      { label: "Pages scanned", value: String(doc.numPages) },
      { label: "Extractable words", value: totalWords.toLocaleString(), tone: "success" },
      { label: "Characters", value: totalChars.toLocaleString() },
      { label: "Format", value: ext.toUpperCase() },
    ],
    report: [
      {
        title: "Text Extraction Summary",
        rows: [
          { label: "Source File", value: file.name },
          { label: "Total Pages", value: String(doc.numPages) },
          { label: "Word Count", value: `${totalWords.toLocaleString()} words` },
          {
            label: "Text Preview",
            value:
              fullText.slice(0, 150).replace(/\n/g, " ") + (fullText.length > 150 ? "..." : ""),
          },
        ],
      },
    ],
    message:
      totalWords > 0
        ? "Text extracted successfully from your PDF."
        : "No extractable text was found. If this is a scanned document, it contains image-only pages.",
  };
};

const cropPdf: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const doc = await loadPdfDoc(file);
  const preset = str(ctx.options["cropPreset"], "trim-margins-medium");
  const targetPages = str(ctx.options["targetPages"], "all");
  const customPagesInput = str(ctx.options["customPages"], "1");

  let top = num(ctx.options["cropTop"], -1);
  let bottom = num(ctx.options["cropBottom"], -1);
  let left = num(ctx.options["cropLeft"], -1);
  let right = num(ctx.options["cropRight"], -1);

  // Fallback to presets if not set by interactive editor
  if (top === -1 || bottom === -1 || left === -1 || right === -1) {
    if (preset === "trim-margins-small") {
      top = bottom = left = right = 18;
    } else if (preset === "trim-margins-medium") {
      top = bottom = left = right = 36;
    } else if (preset === "trim-margins-large") {
      top = bottom = left = right = 72;
    } else if (preset === "custom") {
      top = num(ctx.options["topMargin"], 36);
      bottom = num(ctx.options["bottomMargin"], 36);
      left = num(ctx.options["leftMargin"], 36);
      right = num(ctx.options["rightMargin"], 36);
    }
  }

  const pageCount = doc.getPageCount();
  let pagesToCrop: number[] = [];
  if (targetPages === "all") {
    pagesToCrop = Array.from({ length: pageCount }, (_, i) => i + 1);
  } else if (targetPages === "first") {
    pagesToCrop = [1];
  } else if (targetPages === "custom") {
    const parsed = parseRanges(customPagesInput, pageCount);
    pagesToCrop = Array.from(new Set(parsed.flat()));
  }

  for (let i = 0; i < pagesToCrop.length; i++) {
    const pageNum = pagesToCrop[i]!;
    const page = doc.getPage(pageNum - 1);
    const mediaBox = page.getMediaBox();
    const currentCrop = page.getCropBox();
    const box = currentCrop ?? mediaBox;

    const newX = box.x + left;
    const newY = box.y + bottom;
    const newWidth = Math.max(72, box.width - (left + right));
    const newHeight = Math.max(72, box.height - (top + bottom));

    page.setCropBox(newX, newY, newWidth, newHeight);
    page.setMediaBox(newX, newY, newWidth, newHeight);
    ctx.onProgress((i + 1) / pagesToCrop.length);
  }

  const out = await saveDoc(doc, `${baseName(file.name)}_cropped.pdf`);
  return {
    outputs: [out],
    stats: [
      { label: "Pages cropped", value: `${pagesToCrop.length} of ${pageCount}`, tone: "success" },
      { label: "Trim preset", value: preset.replace(/-/g, " ") },
      { label: "Result size", value: formatBytes(out.size) },
    ],
    message: `Cropped ${pagesToCrop.length} page${pagesToCrop.length === 1 ? "" : "s"} with ${top}pt top/bottom, ${left}pt sides.`,
  };
};

const flattenPdf: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const mode = str(ctx.options["flattenMode"], "forms-and-annotations");

  if (mode === "full-raster") {
    const bytes = await rasterCompress(file, {
      scale: 1.75,
      quality: 0.9,
      onProgress: ctx.onProgress,
    });
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    const out: OutputFile = {
      name: `${baseName(file.name)}_flattened.pdf`,
      blob,
      size: blob.size,
      kind: "pdf",
    };
    return {
      outputs: [out],
      stats: sizeStats(file.size, out.size),
      message:
        "Visual flattening complete. All form fields, layers and annotations rasterized into static page artwork.",
    };
  }

  const doc = await loadPdfDoc(file);
  let formFlattened = false;
  try {
    const form = doc.getForm();
    if (form) {
      form.flatten();
      formFlattened = true;
    }
  } catch {
    // Document may not have an AcroForm, which is fine
  }

  const out = await saveDoc(doc, `${baseName(file.name)}_flattened.pdf`);
  return {
    outputs: [out],
    stats: [
      { label: "Original size", value: formatBytes(file.size) },
      { label: "Result size", value: formatBytes(out.size) },
      {
        label: "Interactive forms",
        value: formFlattened ? "Flattened to text" : "None found",
        tone: "success",
      },
    ],
    message: "Interactive form fields flattened into static PDF content.",
  };
};

const grayscalePdf: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const { PDFDocument } = await import("pdf-lib");
  const src = await openRenderDoc(file);
  const out = await PDFDocument.create();

  const mode = str(ctx.options["mode"], "smooth");
  const qualityKey = str(ctx.options["quality"], "standard");

  let scale = 1.5;
  let jpgQuality = 0.85;
  if (qualityKey === "high") {
    scale = 2.0;
    jpgQuality = 0.92;
  } else if (qualityKey === "compact") {
    scale = 1.0;
    jpgQuality = 0.7;
  }

  for (let i = 1; i <= src.numPages; i++) {
    const canvas = await renderPageToCanvas(src, i, scale);
    const cctx = canvas.getContext("2d");
    if (cctx) {
      const imgData = cctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let p = 0; p < data.length; p += 4) {
        const r = data[p]!;
        const g = data[p + 1]!;
        const b = data[p + 2]!;
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        if (mode === "high-contrast") {
          gray = gray < 160 ? 0 : 255;
        }
        data[p] = gray;
        data[p + 1] = gray;
        data[p + 2] = gray;
      }
      cctx.putImageData(imgData, 0, 0);
    }

    const blob = await canvasToBlob(canvas, "image/jpeg", jpgQuality);
    const img = await out.embedJpg(await blob.arrayBuffer());
    const page = out.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    ctx.onProgress(i / src.numPages);
  }

  const outBytes = await out.save({ useObjectStreams: true });
  const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
  const outputFile: OutputFile = {
    name: `${baseName(file.name)}_grayscale.pdf`,
    blob,
    size: blob.size,
    kind: "pdf",
  };

  return {
    outputs: [outputFile],
    stats: [
      { label: "Original size", value: formatBytes(file.size) },
      { label: "Grayscale size", value: formatBytes(outputFile.size) },
      { label: "Pages converted", value: `${src.numPages} pages`, tone: "success" },
      {
        label: "Mode",
        value: mode === "high-contrast" ? "B&W High Contrast" : "Smooth Grayscale",
      },
    ],
    message: `Converted ${src.numPages} page${src.numPages === 1 ? "" : "s"} to clean monochrome grayscale.`,
  };
};

const signPdf: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const doc = await loadPdfDoc(file);

  const sigType = str(ctx.options["signatureType"], "type");
  const typedName = str(ctx.options["typedSignature"], "John Doe") || "Signature";
  const sigPosition = str(ctx.options["signPosition"], "bottom-right");
  const targetPageOption = str(ctx.options["targetPage"], "last");
  const customPageNum = num(ctx.options["customPageNum"], 1);
  const sigScale = str(ctx.options["signatureScale"], "medium");
  const sigColorHex = str(ctx.options["signatureColor"], "#000080");
  const addDate = Boolean(ctx.options["addDate"]);

  const sigImage = str(ctx.options["sigImage"], "");
  const sigX = num(ctx.options["sigX"], -1);
  const sigY = num(ctx.options["sigY"], -1);
  const signPageNum = num(ctx.options["signPageNum"], -1);

  // If interactive signature is provided
  if (sigImage && sigX !== -1 && sigY !== -1 && signPageNum !== -1) {
    const base64Data = sigImage.split(',')[1];
    const pngBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const embeddedPng = await doc.embedPng(pngBytes);

    const pageCount = doc.getPageCount();
    const targetPageIndex = Math.min(pageCount - 1, Math.max(0, signPageNum - 1));
    const page = doc.getPage(targetPageIndex);
    const { width: pW, height: pH } = page.getSize();

    const scaleVal = num(ctx.options["sigScaleVal"], 100) / 100;
    const sigW = 150 * scaleVal;
    const sigH = 50 * scaleVal;

    const x = (sigX / 100) * pW - (sigW / 2);
    const y = (sigY / 100) * pH - (sigH / 2);

    page.drawImage(embeddedPng, { x, y, width: sigW, height: sigH });

    const out = await saveDoc(doc, `${baseName(file.name)}_signed.pdf`);
    return {
      outputs: [out],
      stats: [
        { label: "Signed by", value: sigType === "type" ? typedName : "Drawn signature" },
        { label: "Page signed", value: String(signPageNum), tone: "success" },
        { label: "Location", value: `X: ${sigX}%, Y: ${sigY}%` },
      ],
      message: `Signature placed on page ${signPageNum}.`,
    };
  }

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 200;
  const cctx = canvas.getContext("2d");
  if (!cctx) throw new ToolError("Canvas context unavailable.");

  cctx.clearRect(0, 0, canvas.width, canvas.height);
  cctx.fillStyle = sigColorHex;

  if (sigType === "type") {
    cctx.font =
      "italic 64px 'Brush Script MT', 'Great Vibes', 'Dancing Script', 'Segoe Script', cursive, sans-serif";
    cctx.textAlign = "center";
    cctx.textBaseline = "middle";
    cctx.fillText(typedName, canvas.width / 2, canvas.height / 2 - (addDate ? 20 : 0));

    if (addDate) {
      const dateStr = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      cctx.font = "22px sans-serif";
      cctx.fillStyle = "#555555";
      cctx.fillText(`Date: ${dateStr}`, canvas.width / 2, canvas.height / 2 + 50);
    }
  } else {
    cctx.strokeStyle = sigColorHex;
    cctx.lineWidth = 4;
    cctx.beginPath();
    cctx.moveTo(100, 120);
    cctx.bezierCurveTo(150, 40, 200, 160, 260, 90);
    cctx.bezierCurveTo(300, 50, 340, 140, 400, 80);
    cctx.lineTo(480, 130);
    cctx.stroke();

    cctx.font = "20px sans-serif";
    cctx.fillStyle = sigColorHex;
    cctx.textAlign = "center";
    cctx.fillText(typedName, canvas.width / 2, 170);
  }

  const pngBlob = await canvasToBlob(canvas, "image/png");
  const embeddedPng = await doc.embedPng(await pngBlob.arrayBuffer());

  const pageCount = doc.getPageCount();
  let targetPageIndex = pageCount - 1;
  if (targetPageOption === "first") targetPageIndex = 0;
  else if (targetPageOption === "custom")
    targetPageIndex = Math.min(pageCount - 1, Math.max(0, customPageNum - 1));

  const targetPages =
    targetPageOption === "all"
      ? Array.from({ length: pageCount }, (_, i) => i)
      : [targetPageIndex];

  let sigW = 160;
  let sigH = 53.33;
  if (sigScale === "small") {
    sigW = 120;
    sigH = 40;
  } else if (sigScale === "large") {
    sigW = 220;
    sigH = 73.33;
  }

  const margin = 40;

  for (const pIdx of targetPages) {
    const page = doc.getPage(pIdx);
    const { width: pW, height: pH } = page.getSize();

    let x = pW - sigW - margin;
    let y = margin;

    if (sigPosition === "bottom-left") {
      x = margin;
      y = margin;
    } else if (sigPosition === "bottom-center") {
      x = (pW - sigW) / 2;
      y = margin;
    } else if (sigPosition === "top-right") {
      x = pW - sigW - margin;
      y = pH - sigH - margin;
    } else if (sigPosition === "top-left") {
      x = margin;
      y = pH - sigH - margin;
    } else if (sigPosition === "center") {
      x = (pW - sigW) / 2;
      y = (pH - sigH) / 2;
    }

    page.drawImage(embeddedPng, { x, y, width: sigW, height: sigH });
  }

  const out = await saveDoc(doc, `${baseName(file.name)}_signed.pdf`);
  return {
    outputs: [out],
    stats: [
      { label: "Signed by", value: typedName },
      { label: "Pages signed", value: `${targetPages.length} of ${pageCount}`, tone: "success" },
      { label: "Position", value: sigPosition.replace(/-/g, " ") },
    ],
    message: `Signature placed on page ${targetPages.map((p) => p + 1).join(", ")}.`,
  };
};

const annotatePdf: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const { rgb, StandardFonts } = await import("pdf-lib");
  const doc = await loadPdfDoc(file);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  const annotationsMap = ctx.options["annotationsMap"];
  // If interactive drawing annotations are present
  if (annotationsMap && typeof annotationsMap === 'object' && Object.keys(annotationsMap).length > 0) {
    const pageCount = doc.getPageCount();
    let markedCount = 0;

    for (const [key, dataUrl] of Object.entries(annotationsMap)) {
      const pageNum = Number(key);
      if (isNaN(pageNum) || pageNum < 1 || pageNum > pageCount) continue;

      const page = doc.getPage(pageNum - 1);
      const { width: pW, height: pH } = page.getSize();

      const base64Data = (dataUrl as string).split(',')[1];
      if (!base64Data) continue;

      const pngBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      const embeddedPng = await doc.embedPng(pngBytes);

      page.drawImage(embeddedPng, { x: 0, y: 0, width: pW, height: pH });
      markedCount++;
    }

    const out = await saveDoc(doc, `${baseName(file.name)}_annotated.pdf`);
    return {
      outputs: [out],
      stats: [
        { label: "Annotation Type", value: "Draw / Highlighter / Text" },
        { label: "Pages annotated", value: `${markedCount} of ${pageCount}`, tone: "success" },
      ],
      message: `Applied annotations to ${markedCount} page(s).`,
    };
  }

  const type = str(ctx.options["annotationType"], "highlight");
  const text = str(ctx.options["annotationText"], "APPROVED").trim() || "NOTE";
  const colorKey = str(ctx.options["annotationColor"], "yellow");
  const posKey = str(ctx.options["annotationPosition"], "top");
  const opacityVal = num(ctx.options["opacity"], 80) / 100;
  const targetPagesOpt = str(ctx.options["targetPages"], "all");
  const customPagesInput = str(ctx.options["customPages"], "1");

  const colors: Record<string, [number, number, number]> = {
    yellow: [1, 0.9, 0],
    green: [0.1, 0.8, 0.2],
    blue: [0.1, 0.5, 0.9],
    red: [0.9, 0.2, 0.2],
    orange: [1, 0.5, 0],
  };
  const [cr, cg, cb] = colors[colorKey] ?? colors["yellow"]!;

  const pageCount = doc.getPageCount();
  let pagesToAnnotate: number[] = [];
  if (targetPagesOpt === "all")
    pagesToAnnotate = Array.from({ length: pageCount }, (_, i) => i + 1);
  else if (targetPagesOpt === "first") pagesToAnnotate = [1];
  else if (targetPagesOpt === "last") pagesToAnnotate = [pageCount];
  else {
    const parsed = parseRanges(customPagesInput, pageCount);
    pagesToAnnotate = Array.from(new Set(parsed.flat()));
  }

  for (const pageNum of pagesToAnnotate) {
    const page = doc.getPage(pageNum - 1);
    const { width: pW, height: pH } = page.getSize();

    if (type === "highlight") {
      const hH = 32;
      let y = pH - 70;
      if (posKey === "center") y = pH / 2 - hH / 2;
      else if (posKey === "bottom") y = 50;

      page.drawRectangle({
        x: 40,
        y,
        width: pW - 80,
        height: hH,
        color: rgb(cr, cg, cb),
        opacity: Math.min(0.5, opacityVal),
      });

      page.drawText(text, {
        x: 50,
        y: y + 8,
        size: 14,
        font,
        color: rgb(0.1, 0.1, 0.1),
        opacity: opacityVal,
      });
    } else if (type === "callout" || type === "banner") {
      const boxW = Math.min(pW - 60, font.widthOfTextAtSize(text, 14) + 30);
      const boxH = 32;
      let x = (pW - boxW) / 2;
      let y = pH - 60;
      if (posKey === "bottom") y = 40;
      else if (posKey === "center") y = (pH - boxH) / 2;

      page.drawRectangle({
        x,
        y,
        width: boxW,
        height: boxH,
        color: rgb(cr, cg, cb),
        opacity: opacityVal,
        borderColor: rgb(cr * 0.7, cg * 0.7, cb * 0.7),
        borderWidth: 1.5,
      });

      page.drawText(text, {
        x: x + 15,
        y: y + 9,
        size: 13,
        font,
        color: rgb(1, 1, 1),
      });
    } else if (type === "rectangle") {
      page.drawRectangle({
        x: 30,
        y: 30,
        width: pW - 60,
        height: pH - 60,
        borderColor: rgb(cr, cg, cb),
        borderWidth: 2.5,
        opacity: opacityVal,
      });
    }
  }

  const out = await saveDoc(doc, `${baseName(file.name)}_annotated.pdf`);
  return {
    outputs: [out],
    stats: [
      { label: "Annotation", value: type },
      {
        label: "Pages marked",
        value: `${pagesToAnnotate.length} of ${pageCount}`,
        tone: "success",
      },
      { label: "Color", value: colorKey },
    ],
    message: `Applied ${type} annotation to ${pagesToAnnotate.length} page${pagesToAnnotate.length === 1 ? "" : "s"}.`,
  };
};

const addTextToPdf: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const { rgb, StandardFonts } = await import("pdf-lib");
  const doc = await loadPdfDoc(file);

  const text = str(ctx.options["text"], "Confidential Document").trim() || "Note";
  const posKey = str(ctx.options["position"], "header-right");
  const fontSize = num(ctx.options["fontSize"], 13);
  const fontKey = str(ctx.options["fontFamily"], "helvetica");
  const colorKey = str(ctx.options["textColor"], "black");
  const bgPill = Boolean(ctx.options["bgPill"]);
  const targetPagesOpt = str(ctx.options["targetPages"], "all");
  const customPagesInput = str(ctx.options["customPages"], "1");

  let standardFont = StandardFonts.Helvetica;
  if (fontKey === "times") standardFont = StandardFonts.TimesRoman;
  else if (fontKey === "courier") standardFont = StandardFonts.Courier;
  const font = await doc.embedFont(standardFont);

  const colorMap: Record<string, [number, number, number]> = {
    black: [0, 0, 0],
    darkgray: [0.3, 0.3, 0.3],
    navy: [0, 0.1, 0.5],
    red: [0.8, 0, 0],
    darkgreen: [0, 0.5, 0.1],
  };
  const [r, g, b] = colorMap[colorKey] ?? colorMap["black"]!;

  const pageCount = doc.getPageCount();
  let targetPages: number[] = [];
  if (targetPagesOpt === "all") targetPages = Array.from({ length: pageCount }, (_, i) => i + 1);
  else if (targetPagesOpt === "first") targetPages = [1];
  else if (targetPagesOpt === "last") targetPages = [pageCount];
  else {
    const parsed = parseRanges(customPagesInput, pageCount);
    targetPages = Array.from(new Set(parsed.flat()));
  }

  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const textHeight = font.heightAtSize(fontSize);
  const margin = 36;

  for (const pageNum of targetPages) {
    const page = doc.getPage(pageNum - 1);
    const { width: pW, height: pH } = page.getSize();

    let x = pW - textWidth - margin;
    let y = pH - margin;

    if (posKey === "header-left" || posKey === "top-left") {
      x = margin;
      y = pH - margin;
    } else if (posKey === "header-center") {
      x = (pW - textWidth) / 2;
      y = pH - margin;
    } else if (posKey === "footer-left" || posKey === "bottom-left") {
      x = margin;
      y = margin;
    } else if (posKey === "footer-center") {
      x = (pW - textWidth) / 2;
      y = margin;
    } else if (posKey === "footer-right") {
      x = pW - textWidth - margin;
      y = margin;
    } else if (posKey === "center") {
      x = (pW - textWidth) / 2;
      y = (pH - textHeight) / 2;
    }

    if (bgPill) {
      page.drawRectangle({
        x: x - 6,
        y: y - 4,
        width: textWidth + 12,
        height: textHeight + 8,
        color: rgb(0.95, 0.95, 0.95),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(r, g, b),
    });
  }

  const out = await saveDoc(doc, `${baseName(file.name)}_text.pdf`);
  return {
    outputs: [out],
    stats: [
      { label: "Text added", value: `"${text.slice(0, 16)}${text.length > 16 ? "..." : ""}"` },
      { label: "Pages modified", value: `${targetPages.length} of ${pageCount}`, tone: "success" },
      { label: "Font size", value: `${fontSize} pt` },
    ],
    message: `Added custom text to ${targetPages.length} page${targetPages.length === 1 ? "" : "s"}.`,
  };
};



const pdfOcr: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const lang = str(ctx.options["language"], "eng");
  const outputMode = str(ctx.options["output"], "searchable");

  ctx.onProgress(0.05, "Initializing Tesseract.js OCR engine...");
  const Tesseract = await import("tesseract.js");

  ctx.onProgress(0.1, "Loading PDF document...");
  const src = await openRenderDoc(file);
  const totalPages = src.numPages;

  let fullText = "";

  if (outputMode === "text") {
    for (let i = 1; i <= totalPages; i++) {
      ctx.onProgress(
        (i - 1) / totalPages,
        `Rendering page ${i} of ${totalPages} for analysis...`
      );
      const canvas = await renderPageToCanvas(src, i, 1.5);

      ctx.onProgress(
        (i - 0.5) / totalPages,
        `Running OCR on page ${i} of ${totalPages} (${lang})...`
      );

      const { data: { text } } = await Tesseract.recognize(canvas, lang, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            ctx.onProgress(
              ((i - 1) + m.progress) / totalPages,
              `Page ${i}: Recognizing text (${Math.round(m.progress * 100)}%)...`
            );
          }
        }
      });

      fullText += `--- Page ${i} ---\n${text}\n\n`;
    }

    const blob = new Blob([fullText], { type: "text/plain" });
    const outName = `${baseName(file.name)}_ocr.txt`;
    return {
      outputs: [{ name: outName, blob, size: blob.size, kind: "text" }],
      stats: [
        { label: "Pages processed", value: String(totalPages) },
        { label: "Recognition language", value: lang.toUpperCase() },
        { label: "Result format", value: "PLAIN TEXT" },
      ],
      report: [
        {
          title: "OCR Results Summary",
          rows: [
            { label: "Source file", value: file.name },
            { label: "Detected pages", value: String(totalPages) },
            { label: "Total words recognized", value: String(fullText.split(/\s+/).filter(Boolean).length) },
            { label: "OCR Engine", value: "Tesseract.js (WebAssembly)" },
          ],
        },
      ],
      message: "OCR processing completed. Download your extracted plain text file.",
    };
  } else {
    const { PDFDocument, rgb } = await import("pdf-lib");
    const out = await PDFDocument.create();
    const standardFont = await out.embedFont("Helvetica");

    for (let i = 1; i <= totalPages; i++) {
      ctx.onProgress(
        (i - 1) / totalPages,
        `Rendering page ${i} of ${totalPages} for searchable overlay...`
      );
      const canvas = await renderPageToCanvas(src, i, 1.5);

      ctx.onProgress(
        (i - 0.5) / totalPages,
        `Running layout OCR on page ${i} of ${totalPages}...`
      );

      const { data } = await Tesseract.recognize(canvas, lang, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            ctx.onProgress(
              ((i - 1) + m.progress) / totalPages,
              `Page ${i}: Analyzing layout (${Math.round(m.progress * 100)}%)...`
            );
          }
        }
      });

      const imgBlob = await canvasToBlob(canvas, "image/jpeg", 0.85);
      const img = await out.embedJpg(await imgBlob.arrayBuffer());
      const page = out.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

      const scaleX = img.width / canvas.width;
      const scaleY = img.height / canvas.height;

      if (data.words) {
        for (const word of data.words) {
          if (!word.text || !word.bbox) continue;
          const { x0, y0, x1, y1 } = word.bbox;
          const wW = (x1 - x0) * scaleX;
          const wH = (y1 - y0) * scaleY;
          const wX = x0 * scaleX;
          const wY = img.height - (y1 * scaleY);

          try {
            page.drawText(word.text, {
              x: wX,
              y: wY,
              size: Math.max(4, Math.min(wH, 32)),
              font: standardFont,
              color: rgb(0, 0, 0),
              opacity: 0.001,
            });
          } catch {
            // Ignore text drawing errors
          }
        }
      }
    }

    const outBytes = await out.save({ useObjectStreams: true });
    const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
    const outName = `${baseName(file.name)}_searchable.pdf`;

    return {
      outputs: [{ name: outName, blob, size: blob.size, kind: "pdf" }],
      stats: [
        { label: "Pages processed", value: String(totalPages) },
        { label: "Overlay font", value: "Helvetica" },
        { label: "Output size", value: formatBytes(blob.size) },
      ],
      report: [
        {
          title: "Searchable PDF Generation",
          rows: [
            { label: "Original file", value: file.name },
            { label: "Pages processed", value: String(totalPages) },
            { label: "Result file", value: outName },
            { label: "Text Layer", value: "Selectable & Searchable PDF 1.7" },
          ],
        },
      ],
      message: "Scanned PDF converted to searchable PDF locally in your browser.",
    };
  }
};


const editPdf: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const { rgb, StandardFonts } = await import("pdf-lib");
  const doc = await loadPdfDoc(file);

  const fontHelvetica = await doc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontHelveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique);
  const fontTimes = await doc.embedFont(StandardFonts.TimesRoman);
  const fontTimesBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const fontCourier = await doc.embedFont(StandardFonts.Courier);

  function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    if (clean.length === 6) {
      return [
        parseInt(clean.slice(0, 2), 16) / 255,
        parseInt(clean.slice(2, 4), 16) / 255,
        parseInt(clean.slice(4, 6), 16) / 255,
      ];
    }
    return [0, 0, 0];
  }

  const pagesState = ctx.options["pagesState"] || {};
  const pageCount = doc.getPageCount();
  let totalModifications = 0;

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const pageData = pagesState[pageNum];
    if (!pageData) continue;

    const page = doc.getPage(pageNum - 1);
    const { width: pW, height: pH } = page.getSize();

    const elements: any[] = pageData.elements || [];
    const sorted = [...elements].sort((a, b) => {
      const order: Record<string, number> = { whiteout: 1, rectangle: 2, line: 3, image: 4, text: 5 };
      return (order[a.type] || 5) - (order[b.type] || 5);
    });

    for (const el of sorted) {
      const elX = (el.x / 100) * pW;
      const elW = (el.width / 100) * pW;
      const elH = (el.height / 100) * pH;
      const elY = pH - ((el.y / 100) * pH) - elH;

      if (el.type === "whiteout") {
        const [r, g, b] = hexToRgb(el.bgColor || "#ffffff");
        page.drawRectangle({
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          color: rgb(r, g, b),
          opacity: 1,
        });
        totalModifications++;
      } else if (el.type === "rectangle") {
        const noBorder = !el.color || el.color === "transparent" || el.lineWidth === 0;
        const rectBgColor = el.bgColor ? rgb(...hexToRgb(el.bgColor)) : undefined;
        page.drawRectangle({
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          ...(noBorder ? {} : { borderColor: rgb(...hexToRgb(el.color!)), borderWidth: el.lineWidth || 2 }),
          ...(rectBgColor ? { color: rectBgColor } : {}),
          opacity: el.opacity ?? 1,
        });
        totalModifications++;
      } else if (el.type === "line") {
        const [r, g, b] = hexToRgb(el.color || "#000000");
        page.drawLine({
          start: { x: elX, y: elY + elH },
          end: { x: elX + elW, y: elY },
          thickness: el.lineWidth || 2,
          color: rgb(r, g, b),
          opacity: el.opacity ?? 1,
        });
        totalModifications++;
      } else if (el.type === "image" && el.imageData) {
        try {
          const base64Data = el.imageData.split(",")[1];
          if (base64Data) {
            const bytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
            const embedded = el.imageData.includes("png")
              ? await doc.embedPng(bytes)
              : await doc.embedJpg(bytes);
            page.drawImage(embedded, {
              x: elX,
              y: elY,
              width: elW,
              height: elH,
              opacity: el.opacity ?? 1,
            });
            totalModifications++;
          }
        } catch (e) {
          console.warn("Failed to embed image in editPdf runner:", e);
        }
      } else if (el.type === "text" && el.text) {
        if (el.isReplacement) {
          const [bgR, bgG, bgB] = hexToRgb(el.bgColor || "#ffffff");
          page.drawRectangle({
            x: elX,
            y: elY,
            width: elW,
            height: elH,
            color: rgb(bgR, bgG, bgB),
          });
        }
        let font = fontHelvetica;
        if (el.fontFamily === "times") {
          font = el.bold ? fontTimesBold : fontTimes;
        } else if (el.fontFamily === "courier") {
          font = fontCourier;
        } else {
          font = el.bold ? fontHelveticaBold : el.italic ? fontHelveticaOblique : fontHelvetica;
        }

        const [r, g, b] = hexToRgb(el.color || "#000000");
        const fontSize = Math.max(6, (el.fontSize || 14) * (pH / 800));

        page.drawText(el.text, {
          x: elX,
          y: elY + (elH * 0.15),
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity: el.opacity ?? 1,
        });
        totalModifications++;
      }
    }

    if (pageData.drawingsDataUrl) {
      try {
        const base64Data = pageData.drawingsDataUrl.split(",")[1];
        if (base64Data) {
          const bytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          const embeddedPng = await doc.embedPng(bytes);
          page.drawImage(embeddedPng, {
            x: 0,
            y: 0,
            width: pW,
            height: pH,
          });
          totalModifications++;
        }
      } catch (e) {
        console.warn("Failed to embed drawing overlay:", e);
      }
    }
  }

  const out = await saveDoc(doc, `${baseName(file.name)}_edited.pdf`);
  return {
    outputs: [out],
    stats: [
      { label: "Document Pages", value: String(pageCount) },
      { label: "Edits Applied", value: `${totalModifications} changes`, tone: "success" },
    ],
    message: `Edited PDF generated successfully with ${totalModifications} modifications.`,
  };
};

/* --------------------------------------------------------------- Redact PDF */

/**
 * Permanently redacts selected rectangular regions from a PDF.
 *
 * Security approach: affected pages are fully rasterised via pdf.js canvas
 * rendering. Black rectangles are painted onto the canvas pixels BEFORE the
 * canvas is encoded as JPEG and embedded into the output PDF. This means the
 * original vector text/image data is NOT present in the affected page — it has
 * been replaced by a flat image that contains only the post-redaction pixels.
 * No eval(), no new Function(), no external service.
 *
 * ctx.options["redactions"] must be a JSON string representing:
 *   Array<{ page: number; rects: Array<{ x: number; y: number; w: number; h: number }> }>
 * where coordinates are in canvas-pixel space at the renderScale used during
 * the interactive preview, and page is 1-based.
 */
const redactPdf: Runner = async (ctx) => {
  const file = requireOne(ctx);

  // Parse the redaction map passed from the UI if present.
  const redactionMap: Record<number, Array<{ x: number; y: number; w: number; h: number }>> = {};
  try {
    const raw = ctx.options["redactions"];
    if (raw && typeof raw === "string") {
      const parsed = JSON.parse(raw) as Array<{
        page: number;
        rects: Array<{ x: number; y: number; w: number; h: number }>;
      }>;
      for (const item of parsed) {
        if (item.rects && item.rects.length > 0) {
          redactionMap[item.page] = item.rects;
        }
      }
    }
  } catch {
    // Ignore parse errors; fall back to annotationsMap
  }

  // Also support interactive canvas annotationsMap from ToolWorkspace
  const annotationsMap = (ctx.options["annotationsMap"] as Record<number, string>) || {};
  const hasAnnotations = Object.keys(annotationsMap).length > 0;
  const hasRects = Object.keys(redactionMap).length > 0;

  if (!hasRects && !hasAnnotations) {
    throw new ToolError(
      "No redaction areas were selected. Use the blackout brush or draw redaction boxes on at least one page before processing."
    );
  }

  // The render scale used by the preview canvas — must match what the UI uses.
  const renderScale = num(ctx.options["renderScale"], 2);

  const { PDFDocument } = await import("pdf-lib");
  const src = await openRenderDoc(file);
  const out = await PDFDocument.create();
  const totalPages = src.numPages;
  let affectedPages = 0;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    // Render every page to a canvas — rasterisation is the guarantee of
    // permanent redaction; we cannot trust overlay-only approaches.
    const canvas = await renderPageToCanvas(src, pageNum, renderScale);
    const cctx = canvas.getContext("2d");
    if (!cctx) throw new ToolError("Canvas context unavailable during redaction.");

    let pageRedacted = false;

    const rects = redactionMap[pageNum];
    if (rects && rects.length > 0) {
      // Paint opaque black over every selected region directly on the canvas
      // pixels. This permanently destroys the underlying rasterised content.
      cctx.fillStyle = "#000000";
      for (const r of rects) {
        cctx.fillRect(Math.floor(r.x), Math.floor(r.y), Math.ceil(r.w), Math.ceil(r.h));
      }
      pageRedacted = true;
    }

    const annotDataUrl = annotationsMap[pageNum];
    if (annotDataUrl && typeof annotDataUrl === "string") {
      const imgEl = new Image();
      imgEl.src = annotDataUrl;
      if (!imgEl.complete) {
        await new Promise<void>((resolve, reject) => {
          imgEl.onload = () => resolve();
          imgEl.onerror = reject;
        });
      }
      cctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
      pageRedacted = true;
    }

    if (pageRedacted) {
      affectedPages++;
    }

    // Encode the (potentially redacted) canvas as JPEG and embed it.
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.88);
    const img = await out.embedJpg(await blob.arrayBuffer());
    // Create a new page at the canvas pixel dimensions — this preserves aspect
    // ratio and prevents any pdf-lib coordinate-mapping confusion.
    const page = out.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

    ctx.onProgress(pageNum / totalPages);
  }

  const bytes = await out.save({ useObjectStreams: true });
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  const outFile: OutputFile = {
    name: `${baseName(file.name)}-redacted.pdf`,
    blob,
    size: blob.size,
    kind: "pdf",
  };

  return {
    outputs: [outFile],
    stats: [
      { label: "Pages redacted", value: `${affectedPages} of ${totalPages}`, tone: "success" },
      { label: "Security", value: "Permanent raster overwrite", tone: "success" },
      { label: "Total pages", value: String(totalPages) },
      { label: "Output size", value: formatBytes(outFile.size) },
    ],
    message:
      "Redaction permanently removes the selected content from the downloaded PDF. Your original file remains unchanged on your device. To also remove hidden metadata, run the PDF Metadata Cleaner next.",
  };
};

/* -------------------------------------------------------- Split PDF by Size */

/**
 * Splits a PDF into parts where each part's serialized size is at or below the
 * requested byte limit.
 *
 * Algorithm: greedy page accumulation with accurate size measurement.
 * After each page is added to the current part, we serialise it and measure the
 * resulting Blob size. When adding the next page would exceed the limit, we
 * flush the current part and start a new one.
 *
 * This approach is O(n * saveDoc) but is the only way to guarantee accuracy
 * because PDF serialisation overhead (object streams, xref tables, compression)
 * is document-dependent and cannot be reliably estimated from source bytes alone.
 */
const splitPdfBySize: Runner = async (ctx) => {
  const file = requireOne(ctx);

  const targetOption = str(ctx.options["target"], "2");
  const targetMb =
    targetOption === "custom" ? num(ctx.options["customMb"], 2) : num(targetOption, 2);

  if (!Number.isFinite(targetMb) || targetMb <= 0) {
    throw new ToolError("Enter a positive target size.");
  }
  const targetBytes = targetMb * 1024 * 1024;

  const { PDFDocument } = await import("pdf-lib");
  const src = await loadPdfDoc(file);
  const totalPages = src.getPageCount();

  if (totalPages === 0) throw new ToolError("This PDF has no pages.");

  // Test whether even a single page exceeds the limit.
  const singleTest = await PDFDocument.create();
  const [firstPage] = await singleTest.copyPages(src, [0]);
  singleTest.addPage(firstPage!);
  const singleBytes = (await singleTest.save({ useObjectStreams: true })).length;

  if (singleBytes > targetBytes) {
    throw new ToolError(
      `A single page of this document serialises to approximately ${formatBytes(singleBytes)}, which already exceeds your ${formatBytes(targetBytes)} limit. Try compressing the PDF first, or raise the target size.`
    );
  }

  // If the whole file fits inside the limit, return it as-is.
  if (file.size <= targetBytes) {
    return {
      outputs: [{ name: file.name, blob: file, size: file.size, kind: "pdf" }],
      stats: [
        { label: "Result", value: "Document already fits within the target size", tone: "success" },
        { label: "File size", value: formatBytes(file.size) },
        { label: "Target", value: formatBytes(targetBytes) },
      ],
      message: `This document (${formatBytes(file.size)}) is already smaller than your ${formatBytes(targetBytes)} target — no splitting needed.`,
    };
  }

  const outputs: OutputFile[] = [];
  let partDoc = await PDFDocument.create();
  let partPageCount = 0;
  let partIndex = 1;

  const flushPart = async () => {
    if (partPageCount === 0) return;
    const bytes = await partDoc.save({ useObjectStreams: true });
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    outputs.push({
      name: `${baseName(file.name)}-part-${partIndex}.pdf`,
      blob,
      size: blob.size,
      kind: "pdf",
    });
    partIndex++;
    partDoc = await PDFDocument.create();
    partPageCount = 0;
  };

  for (let i = 0; i < totalPages; i++) {
    // We build a fresh candidate doc with the new page to check size.
    const testDoc = await PDFDocument.create();
    if (partPageCount > 0) {
      // Re-add current part pages.
      const currentBytes = await partDoc.save({ useObjectStreams: true });
      const currentSrc = await PDFDocument.load(currentBytes, { updateMetadata: false });
      const copied = await testDoc.copyPages(currentSrc, currentSrc.getPageIndices());
      copied.forEach((p) => testDoc.addPage(p));
    }
    const [newPage] = await testDoc.copyPages(src, [i]);
    testDoc.addPage(newPage!);

    const testBytes = (await testDoc.save({ useObjectStreams: true })).length;

    if (testBytes > targetBytes && partPageCount > 0) {
      // Flush current part before adding this page.
      await flushPart();
      // Start a new part with just this page.
      const [freshPage] = await partDoc.copyPages(src, [i]);
      partDoc.addPage(freshPage!);
      partPageCount = 1;
    } else {
      // Accept the test doc as our current part.
      partDoc = testDoc;
      partPageCount++;
    }

    ctx.onProgress((i + 1) / totalPages, `Processing page ${i + 1} of ${totalPages}`);
  }

  // Flush the last part.
  await flushPart();

  const largestPart = Math.max(...outputs.map((o) => o.size));
  const allMeetTarget = outputs.every((o) => o.size <= targetBytes);

  return {
    outputs,
    partial: !allMeetTarget,
    stats: [
      { label: "Original file", value: formatBytes(file.size) },
      { label: "Target per part", value: formatBytes(targetBytes) },
      { label: "Parts created", value: String(outputs.length), tone: "success" },
      { label: "Largest part", value: formatBytes(largestPart), tone: allMeetTarget ? "success" : "warning" },
    ],
    message: allMeetTarget
      ? `Split into ${outputs.length} parts. Every part is at or below ${formatBytes(targetBytes)}.`
      : `Split into ${outputs.length} parts. Some parts may be slightly above the target due to PDF serialisation overhead. The values shown are the actual measured sizes.`,
  };
};

/* ------------------------------------------------------- Add Header & Footer */

/**
 * Adds configurable header and/or footer text to every page of a PDF.
 *
 * Dynamic tokens supported (safe string replacement only — no eval):
 *   {page}  → current page number (respects startPage option)
 *   {date}  → today's date in locale format
 *
 * Never uses eval() or new Function().
 */
const addHeaderFooter: Runner = async (ctx) => {
  const file = requireOne(ctx);
  const { StandardFonts, rgb } = await import("pdf-lib");
  const doc = await loadPdfDoc(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);

  const headerText = str(ctx.options["headerText"], "").trim();
  const footerText = str(ctx.options["footerText"], "").trim();

  if (!headerText && !footerText) {
    throw new ToolError("Enter at least a header or footer text before processing.");
  }

  const headerPos = str(ctx.options["headerPosition"], "center");
  const footerPos = str(ctx.options["footerPosition"], "center");
  const fontSize = num(ctx.options["fontSize"], 10);
  const startPage = Math.max(1, num(ctx.options["startPage"], 1));
  const margin = 22; // points from the page edge

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  /** Safe token substitution — no dynamic code execution. */
  function applyTokens(template: string, pageNumber: number): string {
    return template
      .replace(/\{page\}/g, String(pageNumber))
      .replace(/\{date\}/g, today);
  }

  function calcX(
    textStr: string,
    position: string,
    pageWidth: number
  ): number {
    const textWidth = font.widthOfTextAtSize(textStr, fontSize);
    if (position === "left") return margin;
    if (position === "right") return Math.max(margin, pageWidth - margin - textWidth);
    // center
    return Math.max(margin, (pageWidth - textWidth) / 2);
  }

  const pages = doc.getPages();
  const pageCount = pages.length;

  pages.forEach((page, idx) => {
    const pageNumber = startPage + idx;
    const { width: pW, height: pH } = page.getSize();

    if (headerText) {
      const resolved = applyTokens(headerText, pageNumber);
      const x = calcX(resolved, headerPos, pW);
      const y = pH - margin - fontSize; // near top of page
      page.drawText(resolved, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.15, 0.18, 0.25),
      });
    }

    if (footerText) {
      const resolved = applyTokens(footerText, pageNumber);
      const x = calcX(resolved, footerPos, pW);
      const y = margin; // near bottom of page
      page.drawText(resolved, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.15, 0.18, 0.25),
      });
    }
  });

  ctx.onProgress(1);
  const out = await saveDoc(doc, `${baseName(file.name)}-headerfooter.pdf`);

  const applied = [];
  if (headerText) applied.push(`header "${headerText}"`);
  if (footerText) applied.push(`footer "${footerText}"`);

  return {
    outputs: [out],
    stats: [
      { label: "Pages processed", value: String(pageCount), tone: "success" as const },
      ...(headerText ? [{ label: "Header", value: `"${headerText}" (${headerPos})` }] : []),
      ...(footerText ? [{ label: "Footer", value: `"${footerText}" (${footerPos})` }] : []),
      { label: "Font size", value: `${fontSize} pt` },
      { label: "Start number", value: String(startPage) },
    ],
    message: `Applied ${applied.join(" and ")} to ${pageCount} page${pageCount === 1 ? "" : "s"}.`,
  };
};

export const RUNNERS: Record<string, Runner> = {

  "edit-pdf": editPdf,
  "jpg-to-pdf": jpgToPdf,
  "pdf-to-jpg": renderRunner("image/jpeg"),
  "pdf-to-png": renderRunner("image/png"),
  "pdf-to-text": pdfToText,
  "merge-pdf": mergePdf,
  "split-pdf": splitPdf,
  "rotate-pdf": rotatePdf,
  "extract-pdf-pages": extractPages,
  "delete-pdf-pages": deletePages,
  "reorder-pdf-pages": reorderPages,
  "crop-pdf": cropPdf,
  "flatten-pdf": flattenPdf,
  "watermark-pdf": watermarkPdf,
  "sign-pdf": signPdf,
  "annotate-pdf": annotatePdf,
  "add-text-to-pdf": addTextToPdf,
  "pdf-page-numbering": pageNumbering,
  "compress-pdf": compressPdf,
  "compress-pdf-to-target-size": compressToTarget,
  "grayscale-pdf": grayscalePdf,
  "pdf-health-checker": healthChecker,
  "pdf-page-size-converter": pageSizeConverter,
  "print-ready-pdf": printReady,
  "pdf-metadata-cleaner": metadataCleaner,
  "application-pdf-optimizer": applicationOptimizer,
  "passport-photo": passportSheet,
  "document-scanner": documentScanner,
  "smart-pdf-analyzer": smartAnalyzer,
  "pdf-ocr": pdfOcr,
  "redact-pdf": redactPdf,
  "split-pdf-by-size": splitPdfBySize,
  "add-header-footer-pdf": addHeaderFooter,
};

export type { RunResult };
