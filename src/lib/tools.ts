import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Camera,
  Combine,
  Contrast,
  Crop,
  FileArchive,
  FileCheck2,
  FileCog,
  FileEdit,
  FileImage,
  FileScan,
  FileSearch,
  FileText,
  FileType2,
  Gauge,
  Hash,
  Highlighter,
  IdCard,
  Image as ImageIcon,
  Layers,
  ListOrdered,
  Lock,
  PenLine,
  Printer,
  QrCode,
  RotateCw,
  Scissors,
  ShieldCheck,
  Signature,
  Sparkles,
  SquareStack,
  Trash2,
  Type,
} from "lucide-react";

export type ToolCategory =
  "Convert" | "Organize" | "Edit PDF" | "Compress & Optimize" | "Privacy" | "Advanced";

export const CATEGORY_ORDER: ToolCategory[] = [
  "Convert",
  "Organize",
  "Edit PDF",
  "Compress & Optimize",
  "Privacy",
  "Advanced",
];

export type OptionType = "select" | "number" | "text" | "password" | "range" | "toggle";

export interface ToolOption {
  key: string;
  label: string;
  type: OptionType;
  default: string | number | boolean;
  choices?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  help?: string;
  suffix?: string;
  showIf?: { key: string; value: string };
}

export interface Tool {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  short: string;
  intro: string;
  category: ToolCategory;
  icon: LucideIcon;
  /** false when the processing layer is not connected yet (UI only, honest state). */
  ready: boolean;
  /** Explains what happens (or does not happen yet) when the tool runs. */
  notice?: string;
  accept: string;
  acceptLabel: string;
  multiple: boolean;
  /** Page thumbnail interaction mode for PDF page tools. */
  pageMode?: "select" | "order" | "none";
  options: ToolOption[];
  actionLabel: string;
  steps: string[];
  faqs: { q: string; a: string }[];
  /** Optional 150–250 word "About this tool" supporting content for SEO. */
  about?: string;
  related: string[];
  popular?: boolean;
}

const PDF = "application/pdf";
const IMAGES = "image/jpeg,image/jpg,image/png,image/webp";

const PAGE_SIZE_CHOICES = [
  { value: "auto", label: "Fit to image" },
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
  { value: "a3", label: "A3" },
  { value: "legal", label: "Legal" },
];

const ALL_TOOLS: Tool[] = [
  /* ---------------------------------------------------------------- Convert */
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    metaTitle: "JPG to PDF — Convert Images to PDF Online | IXDocs",
    metaDescription:
      "Convert JPG, PNG and WebP images into a single PDF in your browser. Choose page size, orientation and margins, then download instantly. Free on IXDocs.",
    short: "Turn images into a clean, ordered PDF document.",
    intro:
      "Combine one or more images into a single PDF. Reorder pages, pick a page size and set margins before you generate the file.",
    category: "Convert",
    icon: FileImage,
    ready: true,
    accept: IMAGES,
    acceptLabel: "JPG, PNG or WebP images",
    multiple: true,
    options: [
      {
        key: "pageSize",
        label: "Page size",
        type: "select",
        default: "a4",
        choices: PAGE_SIZE_CHOICES,
      },
      {
        key: "orientation",
        label: "Orientation",
        type: "select",
        default: "portrait",
        choices: [
          { value: "portrait", label: "Portrait" },
          { value: "landscape", label: "Landscape" },
        ],
        showIf: { key: "pageSize", value: "!auto" },
      },
      {
        key: "margin",
        label: "Margin",
        type: "select",
        default: "24",
        choices: [
          { value: "0", label: "None" },
          { value: "12", label: "Small" },
          { value: "24", label: "Medium" },
          { value: "48", label: "Large" },
        ],
      },
      {
        key: "fit",
        label: "Image fit",
        type: "select",
        default: "contain",
        choices: [
          { value: "contain", label: "Fit inside page" },
          { value: "cover", label: "Fill page (crops edges)" },
        ],
        showIf: { key: "pageSize", value: "!auto" },
      },
    ],
    actionLabel: "Create PDF",
    steps: [
      "Add your images — drag and drop or use the file picker.",
      "Reorder them until the sequence matches the document you want.",
      "Choose page size, orientation and margins.",
      "Create the PDF and download it.",
    ],
    faqs: [
      {
        q: "How many images can I combine into one PDF?",
        a: "There is no arbitrary limit, but memory depends on your device. Batches of 20 to 50 photos typically compile smoothly on standard computers and mobile phones.",
      },
      {
        q: "Will my image quality degrade during conversion?",
        a: "JPG and PNG files are embedded directly at original quality without additional compression. WebP images are converted to JPEG because the PDF specification does not support native WebP.",
      },
      {
        q: "Can I rearrange the order of images before creating the PDF?",
        a: "Yes. Use the visual preview grid to reorder images by dragging or clicking movement controls so pages appear in the exact sequence you want.",
      },
      {
        q: "What page sizes and margin options are supported?",
        a: "You can choose from standard A4, US Letter, A3, Legal, or 'Fit to image' mode, with configurable margin widths to match your presentation needs.",
      },
      {
        q: "Are my photos uploaded to an external server?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Everything is assembled on your local device.",
      },
    ],
    about: `JPG to PDF converts one or more photos, digital scans, or web images into a clean, standardized PDF document directly in your browser. It is particularly useful when you need to submit image-based receipts for expense claims, assemble photos for official visa applications, or bundle photographic portfolios and design mockups into a single shareable file.

You can add multiple JPG, PNG, or WebP images, reorder them to match your desired reading sequence, and choose standard page formats such as A4, US Letter, or auto-fit. Standard JPG and PNG files are embedded directly at their native resolution without re-compression, while WebP images are automatically re-encoded into JPEG format for full compatibility with all standard PDF readers.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. The entire document structure is compiled in client-side memory, allowing you to generate professional PDF packages quickly without creating an account or transmitting personal data over the internet. You can also customize page orientation and margins to ensure consistent visual presentation across all included pages.`,
    related: ["pdf-to-jpg", "pdf-to-png", "merge-pdf", "compress-pdf"],
    popular: true,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    metaTitle: "PDF to JPG — Convert PDF Pages to Images | IXDocs",
    metaDescription:
      "Convert PDF pages into JPG images in your browser. Pick pages, choose quality and resolution, then download images one by one. Free on IXDocs.",
    short: "Export PDF pages as high-quality JPG images.",
    intro:
      "Render selected pages of a PDF to JPG images. Everything is rendered locally in your browser, so nothing is uploaded to a server.",
    category: "Convert",
    icon: ImageIcon,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "select",
    options: [
      {
        key: "scale",
        label: "Resolution",
        type: "select",
        default: "2",
        choices: [
          { value: "1", label: "Screen (72 dpi)" },
          { value: "2", label: "High (144 dpi)" },
          { value: "3", label: "Print (216 dpi)" },
        ],
      },
      {
        key: "quality",
        label: "JPG quality",
        type: "range",
        default: 85,
        min: 40,
        max: 100,
        step: 5,
        suffix: "%",
      },
    ],
    actionLabel: "Convert to JPG",
    steps: [
      "Upload a PDF file.",
      "Select the pages you want to export from the thumbnail grid.",
      "Pick a resolution and JPG quality.",
      "Convert, then download the images individually or all at once.",
    ],
    faqs: [
      {
        q: "What resolution setting should I choose for my images?",
        a: "Select Screen (72 DPI) for lightweight web sharing and email, High (144 DPI) for clear presentations and reading on screens, and Print (216 DPI) when you need crisp paper reproduction.",
      },
      {
        q: "Can I convert only specific pages instead of the whole document?",
        a: "Yes. You can click on specific page thumbnails to convert and download only the exact pages you need.",
      },
      {
        q: "How does the JPG quality slider affect the resulting images?",
        a: "Higher quality settings (85–95%) preserve fine gradients and sharp details, while lower quality settings (50–70%) produce smaller file sizes suitable for fast web loading.",
      },
      {
        q: "Can I download all converted pages at once?",
        a: "Yes. You can download individual converted pages one by one or export them together as a batch.",
      },
      {
        q: "Are my PDF documents uploaded to a server during conversion?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Every page renders locally in browser memory.",
      },
    ],
    about: `PDF to JPG converts individual pages of any PDF document into independent, high-resolution JPEG images directly inside your web browser. This tool is valuable when you need to embed PDF figures into slide decks, upload document previews to social media, share graphic designs with clients, or insert forms into web pages that do not support PDF viewing.

The tool renders each page using browser-native canvas technology and gives you full control over rendering resolution (Screen at 72 DPI, High at 144 DPI, or Print at 216 DPI) and JPEG compression quality. You can export the entire document or select specific individual pages from an interactive thumbnail grid to convert only what you need.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Because rendering runs locally via WebAssembly, your confidential contracts, medical records, and financial statements are never transmitted across the network or stored in external databases. For documents with many pages, you can download images one by one or export them together as a complete image set.`,
    related: ["jpg-to-pdf", "pdf-to-png", "pdf-ocr", "compress-pdf"],
    popular: true,
  },
  {
    slug: "pdf-to-png",
    name: "PDF to PNG",
    metaTitle: "PDF to PNG — Convert PDF Pages to PNG | IXDocs",
    metaDescription:
      "Convert PDF pages into lossless PNG images directly in your browser. Choose pages and resolution, then download. Free document tool by IXDocs.",
    short: "Export PDF pages as lossless PNG images.",
    intro:
      "Render PDF pages to PNG when you need sharp text edges or a lossless format for diagrams and screenshots.",
    category: "Convert",
    icon: FileImage,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "select",
    options: [
      {
        key: "scale",
        label: "Resolution",
        type: "select",
        default: "2",
        choices: [
          { value: "1", label: "Screen (72 dpi)" },
          { value: "2", label: "High (144 dpi)" },
          { value: "3", label: "Print (216 dpi)" },
        ],
      },
    ],
    actionLabel: "Convert to PNG",
    steps: [
      "Upload a PDF file.",
      "Choose which pages to export.",
      "Select the output resolution.",
      "Convert and download each PNG.",
    ],
    faqs: [
      {
        q: "When should I choose PNG instead of JPG for PDF conversion?",
        a: "Choose PNG when your document contains sharp text, diagrams, screenshots, or technical line art where you cannot afford compression artifacts. Choose JPG if the pages contain heavy photographs and you need smaller file sizes.",
      },
      {
        q: "Do exported PNG pages have transparent or white backgrounds?",
        a: "Exported PNG pages are rendered on a solid white background matching the standard physical print appearance of PDF pages.",
      },
      {
        q: "Can I convert multi-page PDF documents to PNG?",
        a: "Yes. You can select all pages or pick specific pages from the visual thumbnail grid to generate corresponding PNG images for download.",
      },
      {
        q: "What DPI resolution is recommended for reading fine text in PNGs?",
        a: "High (144 DPI) or Print (216 DPI) is recommended for small fonts, dense tables, and complex mathematical formulas to ensure sharp readability.",
      },
      {
        q: "Does IXDocs store or upload my document during PNG conversion?",
        a: "No. The entire rendering process takes place locally inside your browser. No files, metadata, or images are transmitted to external servers.",
      },
    ],
    about:
      "PDF to PNG exports pages from your PDF files into lossless, pixel-perfect PNG graphics directly within your browser. PNG is the preferred format for digital graphics, presentations, and technical documentation because its lossless compression preserves crisp text typography, sharp vector lines, diagrams, and transparent background layers without the compression artifacts common in JPEGs.\n\nWith this tool, you can select custom export resolutions including 72 DPI for screen viewing, 150 DPI for high-density displays, and 300 DPI for publication-quality print graphics. You can export individual pages by clicking their thumbnails or download all rendered pages in an organized archive.\n\nBecause all processing occurs entirely in client-side memory using browser canvas technology, your sensitive documents—such as tax records, engineering schematics, and non-disclosure agreements—are never uploaded to any cloud server or third-party storage. This local processing architecture guarantees absolute privacy, eliminates upload waiting times, and lets you convert documents of any size freely without requiring user accounts or software installation.",
    related: ["pdf-to-jpg", "jpg-to-pdf", "pdf-page-size-converter", "extract-pdf-pages"],
    popular: true,
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    metaTitle: "PDF to Word — Convert PDF to DOCX | IXDocs",
    metaDescription:
      "Convert PDF documents to editable Word files with IXDocs. Upload your PDF, review the conversion options and download a DOCX file.",
    short: "Convert a PDF into an editable Word document.",
    intro:
      "Turn a text-based PDF into a DOCX file you can edit. Scanned documents need OCR first, because they contain images rather than text.",
    category: "Convert",
    icon: FileType2,
    ready: false,
    notice: "This tool is currently unavailable. Please try one of our available tools.",
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    options: [
      {
        key: "layout",
        label: "Conversion mode",
        type: "select",
        default: "flow",
        choices: [
          { value: "flow", label: "Editable flowing text" },
          { value: "layout", label: "Preserve layout (text boxes)" },
        ],
      },
    ],
    actionLabel: "Convert to Word",
    steps: [
      "Upload the PDF you want to edit.",
      "Choose whether to prioritise editable text or the original layout.",
      "Run the conversion.",
      "Download the DOCX file.",
    ],
    faqs: [
      {
        q: "Why does my scanned PDF convert badly?",
        a: "A scan is a picture of a page. Without OCR there is no text to extract, so run PDF OCR first and then convert.",
      },
      {
        q: "Which Word formats are supported?",
        a: "The tool is designed to support standard DOCX files.",
      },
    ],
    related: ["word-to-pdf", "pdf-ocr", "smart-pdf-analyzer", "compress-pdf"],
    popular: true,
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    metaTitle: "Word to PDF — Convert DOC and DOCX to PDF | IXDocs",
    metaDescription:
      "Convert Word documents to PDF with IXDocs. Upload a DOC or DOCX file, convert and download a shareable PDF.",
    short: "Turn DOC and DOCX files into shareable PDFs.",
    intro: "Convert a Word document to PDF so it looks the same on every device and printer.",
    category: "Convert",
    icon: FileText,
    ready: false,
    notice: "This tool is currently unavailable. Please try one of our available tools.",
    accept:
      ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    acceptLabel: "DOC or DOCX file",
    multiple: false,
    options: [
      {
        key: "pageSize",
        label: "Page size",
        type: "select",
        default: "a4",
        choices: PAGE_SIZE_CHOICES.slice(1),
      },
    ],
    actionLabel: "Convert to PDF",
    steps: [
      "Upload your DOC or DOCX file.",
      "Confirm the output page size.",
      "Run the conversion.",
      "Download the PDF.",
    ],
    faqs: [
      {
        q: "Will my fonts look the same?",
        a: "Standard fonts are matched closely. Unusual fonts installed only on your computer may be substituted during conversion.",
      },
      {
        q: "Can I convert several files at once?",
        a: "You can convert single documents at a time using this tool.",
      },
    ],
    related: ["pdf-to-word", "compress-pdf", "print-ready-pdf", "merge-pdf"],
  },

  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    metaTitle: "PDF to Text — Extract Text from PDF Online | IXDocs",
    metaDescription:
      "Extract selectable text from PDF documents in your browser. Copy or download clean plain text or Markdown with page markers. Free on IXDocs.",
    short: "Extract text from PDF pages into plain text or Markdown.",
    intro:
      "Extract all selectable text from your PDF. Download the text as a TXT or Markdown file, or view the extracted word count and summary.",
    category: "Convert",
    icon: FileText,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "none",
    options: [
      {
        key: "format",
        label: "Output format",
        type: "select",
        default: "plain",
        choices: [
          { value: "plain", label: "Plain Text (.txt)" },
          { value: "markdown", label: "Markdown with Headings (.md)" },
        ],
      },
      {
        key: "includeHeaders",
        label: "Include page break markers",
        type: "toggle",
        default: true,
      },
    ],
    actionLabel: "Extract text",
    steps: [
      "Upload your PDF document.",
      "Choose plain text or Markdown format.",
      "Extract the text and preview the character/word count.",
      "Download the text file to your device.",
    ],
    faqs: [
      {
        q: "What is the difference between PDF to Text and PDF OCR?",
        a: "PDF to Text extracts existing digital text streams already embedded in native PDFs. PDF OCR uses optical character recognition to read and extract text from flat scanned images and camera photos.",
      },
      {
        q: "Why does my scanned PDF show zero extracted words?",
        a: "Scanned documents and smartphone photos store page images rather than digital character strings. Because there is no embedded text stream, you should use our PDF OCR tool to recognize the words.",
      },
      {
        q: "Can I copy extracted text directly to my clipboard?",
        a: "Yes. The tool features a quick 'Copy to clipboard' button alongside a preview window, as well as an option to download a plain .txt file.",
      },
      {
        q: "Can I extract text from multi-page documents all at once?",
        a: "Yes. The extractor processes all pages in your document, placing clear page markers between sheets to preserve document structure.",
      },
      {
        q: "Is my document text transmitted to a server during extraction?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Extraction runs entirely in your local browser session.",
      },
    ],
    about: `PDF to Text extracts plain, readable text from digital PDF documents directly inside your web browser. It is ideal for copying text out of locked or formatted documents, extracting tabular figures for spreadsheets, importing contract terms into word processors, or pulling citations from academic research papers.

The tool extracts digital text streams across all pages or custom page selections, preserving natural line breaks and reading order while stripping away background graphics, font encodings, and layout overhead. You can review the extracted text in a real-time preview box, copy excerpts to your clipboard with one click, or export the full text as a plain TXT file for further editing.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Please note that this tool extracts existing vector text streams embedded in native PDFs. If your PDF is a flat scan or photograph of paper without embedded text, use our PDF OCR tool instead to recognize the text optically. Everything runs client-side with zero data transmission.`,
    related: ["pdf-ocr", "smart-pdf-analyzer", "pdf-health-checker", "compress-pdf"],
  },
  /* --------------------------------------------------------------- Organize */
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    metaTitle: "Merge PDF — Combine PDF Files Online | IXDocs",
    metaDescription:
      "Combine multiple PDF files into one document in your browser. Reorder files, remove any you do not need and download the merged PDF. Free on IXDocs.",
    short: "Combine several PDFs into one ordered document.",
    intro:
      "Merge any number of PDFs into a single file. Reorder the list until the sequence is right, then merge — all in your browser.",
    category: "Organize",
    icon: Combine,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF files",
    multiple: true,
    options: [],
    actionLabel: "Merge PDFs",
    steps: [
      "Add two or more PDF files.",
      "Drag or use the arrows to set the order.",
      "Remove anything you do not need.",
      "Merge and download the combined document.",
    ],
    faqs: [
      {
        q: "Is the original page order and layout preserved?",
        a: "Yes. Each document's internal page sequence, margins, fonts, and dimensions are preserved. You can arrange the overall order of the combined files before generating the final document.",
      },
      {
        q: "Can I merge password-protected PDFs?",
        a: "No. Encrypted or password-protected PDF files must be unlocked prior to merging because browser-based assemblers cannot read protected file streams without credentials.",
      },
      {
        q: "Is there a limit on how many PDFs I can combine?",
        a: "There is no fixed limit on the number of files, but total processing capacity depends on your device's available memory since merging executes locally in your browser.",
      },
      {
        q: "Does merging PDFs reduce document quality?",
        a: "No. Merging combines existing PDF page streams losslessly without rasterizing vector text or re-compressing embedded photographs.",
      },
      {
        q: "Are my documents uploaded to a server during merging?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Your documents never leave your device.",
      },
    ],
    about: `Merge PDF combines multiple separate PDF documents into a single, ordered file directly in your browser. This tool is ideal for compiling monthly financial statements, assembling multi-part contract packages, combining academic project chapters, or organizing scanned receipts into a unified portfolio for easy sharing and printing.

You can upload multiple PDF files simultaneously, review their order in an interactive list, and drag or nudge documents into your preferred reading sequence before merging. The engine preserves existing page orientations, margins, vector text fonts, and embedded images across all merged sheets without re-compressing or degrading original document quality.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Note that password-protected or encrypted PDFs cannot be merged directly; you must remove document security before combining files. Furthermore, because merging operates directly in client memory, processing capacity depends on your device's available RAM. Once assembled, your unified PDF is generated and downloaded instantly without watermarks or file retention.`,
    related: ["split-pdf", "reorder-pdf-pages", "extract-pdf-pages", "compress-pdf"],
    popular: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    metaTitle: "Split PDF — Separate Pages from a PDF | IXDocs",
    metaDescription:
      "Split a PDF into separate documents by page range or one file per page. Runs in your browser, free on IXDocs.",
    short: "Break a PDF into smaller documents.",
    intro:
      "Split a PDF by custom ranges or into one file per page, and download each result separately.",
    category: "Organize",
    icon: Scissors,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "none",
    options: [
      {
        key: "mode",
        label: "Split method",
        type: "select",
        default: "ranges",
        choices: [
          { value: "ranges", label: "Custom ranges" },
          { value: "every", label: "One file per page" },
        ],
      },
      {
        key: "ranges",
        label: "Ranges",
        type: "text",
        default: "1-2, 3-5",
        help: "Separate ranges with commas, for example 1-3, 4, 8-10.",
        showIf: { key: "mode", value: "ranges" },
      },
    ],
    actionLabel: "Split PDF",
    steps: [
      "Upload the PDF you want to divide.",
      "Choose custom ranges or one file per page.",
      "Enter the ranges if you picked custom.",
      "Split and download each resulting document.",
    ],
    faqs: [
      {
        q: "How do I specify custom page ranges?",
        a: "Enter page numbers and ranges separated by commas, such as '1-4, 7, 9-12'. The tool creates new PDF documents containing precisely those selected pages.",
      },
      {
        q: "Does splitting a PDF reduce its visual quality?",
        a: "No. Splitting extracts the original page objects directly without re-rendering or re-compressing images, ensuring identical visual fidelity.",
      },
      {
        q: "Can I split every page into its own individual file?",
        a: "Yes. Choose the 'Split each page' mode to turn every page of your document into a standalone, single-page PDF file.",
      },
      {
        q: "Can I split encrypted or password-protected PDFs?",
        a: "The PDF must be unlocked before splitting. If a document has an owner or user password, unlock it before loading it into the split tool.",
      },
      {
        q: "Are my files uploaded to a remote server when split?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing.",
      },
    ],
    about: `Split PDF divides a single document into smaller, standalone PDF files based on the exact page ranges you specify. It is designed for extracting specific sections of a lengthy contract, pulling individual chapters from an ebook, separating distinct invoices from a bulk billing scan, or removing unneeded cover pages and appendices before distribution.

The tool offers flexible splitting modes: extract every page into separate single-page documents, isolate custom page ranges (such as 1-3, 5, 8-10), or divide a document into fixed page intervals. The split files maintain the exact vector quality, font encodings, and embedded image assets of the original document without rasterization or quality loss.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Because all operations execute locally in your active browser session, your sensitive legal briefs, personal tax records, and medical files remain strictly confidential on your computer or mobile device. If your PDF is password-protected, simply unlock it first before loading it into the workspace for splitting.`,
    related: ["merge-pdf", "extract-pdf-pages", "delete-pdf-pages", "compress-pdf"],
    popular: true,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    metaTitle: "Rotate PDF — Fix Page Orientation Online | IXDocs",
    metaDescription:
      "Rotate PDF pages by 90, 180 or 270 degrees. Rotate every page or only the ones you select, then download. Free browser tool by IXDocs.",
    short: "Fix sideways or upside-down pages.",
    intro:
      "Rotate the whole document or just the pages you select, and save the corrected orientation permanently.",
    category: "Organize",
    icon: RotateCw,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "select",
    options: [
      {
        key: "angle",
        label: "Rotation",
        type: "select",
        default: "90",
        choices: [
          { value: "90", label: "90° clockwise" },
          { value: "180", label: "180°" },
          { value: "270", label: "270° (90° counter-clockwise)" },
        ],
      },
    ],
    actionLabel: "Rotate PDF",
    steps: [
      "Upload the PDF.",
      "Select the pages to rotate, or leave all selected.",
      "Pick the rotation angle.",
      "Rotate and download the corrected file.",
    ],
    faqs: [
      {
        q: "Is the page rotation permanent across all PDF viewers?",
        a: "Yes. The rotation updates the PDF document's standard page rotation dictionary, ensuring the pages open in the correct orientation in Adobe Acrobat, web browsers, and mobile readers.",
      },
      {
        q: "Can I rotate only specific pages while leaving others untouched?",
        a: "Yes. You can rotate individual pages independently using the rotation controls on each thumbnail, or apply rotation to every page simultaneously.",
      },
      {
        q: "Does rotating pages degrade text clarity or image resolution?",
        a: "No. Rotating is completely lossless. It changes the display rotation flag in the PDF metadata without re-encoding images or rasterizing vector fonts.",
      },
      {
        q: "Can I rotate pages clockwise and counter-clockwise?",
        a: "Yes. You can rotate pages 90 degrees clockwise, 90 degrees counter-clockwise, or flip them 180 degrees upside-down.",
      },
      {
        q: "Are my documents uploaded to a remote server during rotation?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. All changes are saved locally.",
      },
    ],
    about: `Rotate PDF allows you to correct the orientation of upside-down or sideways pages in any PDF document directly in your browser. It is particularly useful when multi-page document scans arrive inverted, landscape financial spreadsheets appear rotated vertically in portrait files, or mobile camera captures need alignment before filing.

The interactive workspace displays clear visual thumbnails for every page in your document. You can rotate individual pages 90 degrees clockwise or counterclockwise, flip upside-down sheets 180 degrees, or apply rotation adjustments across all pages at once with a single click. Because the tool modifies page rotation metadata directly, it executes losslessly without re-compressing graphics or altering vector text.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. After aligning your pages, download your reoriented document immediately with full visual fidelity and zero platform watermarks. The rotation flags are saved directly into the PDF specification structure, ensuring that your pages display correctly in all third-party PDF readers and mobile apps.`,
    related: ["reorder-pdf-pages", "pdf-page-size-converter", "split-pdf", "print-ready-pdf"],
    popular: true,
  },
  {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    metaTitle: "Extract PDF Pages — Save Selected Pages | IXDocs",
    metaDescription:
      "Pick pages from a PDF and save them as a new document. Visual thumbnails, range selection and instant download. Free on IXDocs.",
    short: "Save only the pages you actually need.",
    intro: "Choose pages visually and export them into a new PDF, leaving the original untouched.",
    category: "Organize",
    icon: SquareStack,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "select",
    options: [
      {
        key: "output",
        label: "Output",
        type: "select",
        default: "single",
        choices: [
          { value: "single", label: "One PDF with the selected pages" },
          { value: "separate", label: "A separate PDF per page" },
        ],
      },
    ],
    actionLabel: "Extract pages",
    steps: [
      "Upload the PDF.",
      "Tap the thumbnails of the pages you want.",
      "Choose one combined file or separate files.",
      "Extract and download.",
    ],
    faqs: [
      {
        q: "Does the original file change?",
        a: "Never. IXDocs builds a new document and your original file stays exactly as it is.",
      },
      {
        q: "Is the page order kept?",
        a: "Pages are exported in their original document order. Use Reorder PDF Pages to change it.",
      },
    ],
    related: ["delete-pdf-pages", "split-pdf", "reorder-pdf-pages", "merge-pdf"],
  },
  {
    slug: "delete-pdf-pages",
    name: "Delete PDF Pages",
    metaTitle: "Delete PDF Pages — Remove Pages from a PDF | IXDocs",
    metaDescription:
      "Remove unwanted pages from a PDF using visual thumbnails. Preview what is left and download the cleaned document. Free on IXDocs.",
    short: "Remove blank or unwanted pages.",
    intro: "Select the pages to delete, check what remains, and download a tidier document.",
    category: "Organize",
    icon: Trash2,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "select",
    options: [],
    actionLabel: "Delete pages",
    steps: [
      "Upload the PDF.",
      "Select the pages you want to remove.",
      "Check the remaining page count.",
      "Delete and download the new file.",
    ],
    faqs: [
      {
        q: "Can I undo a deletion?",
        a: "The download is a new file, so your original is untouched. Simply upload it again to start over.",
      },
      {
        q: "Can I delete every page?",
        a: "No — a PDF needs at least one page, so IXDocs stops you before creating an invalid file.",
      },
    ],
    related: ["extract-pdf-pages", "split-pdf", "reorder-pdf-pages", "pdf-health-checker"],
  },
  {
    slug: "reorder-pdf-pages",
    name: "Reorder PDF Pages",
    metaTitle: "Reorder PDF Pages — Rearrange a PDF | IXDocs",
    metaDescription:
      "Rearrange PDF pages with drag and drop or simple move controls that also work on mobile. Preview and download. Free on IXDocs.",
    short: "Rearrange pages into the right order.",
    intro:
      "Drag thumbnails on desktop or use the move buttons on mobile to put pages in the order you need, then save.",
    category: "Organize",
    icon: ListOrdered,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "order",
    options: [],
    actionLabel: "Save new order",
    steps: [
      "Upload the PDF.",
      "Drag a page thumbnail, or use the arrow buttons on touch devices.",
      "Review the new sequence.",
      "Save and download the reordered PDF.",
    ],
    faqs: [
      {
        q: "Does reordering work on a phone?",
        a: "Yes. Every thumbnail has explicit move-left and move-right buttons, so no precise dragging is required.",
      },
      {
        q: "Is content re-compressed?",
        a: "No. Pages are copied intact — only their order changes.",
      },
    ],
    related: ["merge-pdf", "extract-pdf-pages", "delete-pdf-pages", "rotate-pdf"],
  },

  {
    slug: "crop-pdf",
    name: "Crop PDF",
    metaTitle: "Crop PDF — Trim PDF Page Margins Online | IXDocs",
    metaDescription:
      "Crop PDF pages and trim white margins in your browser. Choose presets or custom margin sizes, then download the cropped PDF. Free on IXDocs.",
    short: "Trim margins and adjust page dimensions.",
    intro:
      "Trim unwanted margins from PDF pages or resize document viewboxes for printing, e-readers, and clean viewing.",
    category: "Organize",
    icon: Crop,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "none",
    options: [
      {
        key: "cropPreset",
        label: "Trim margin preset",
        type: "select",
        default: "trim-margins-medium",
        choices: [
          { value: "trim-margins-small", label: "Small trim (18 pt / 0.25 in)" },
          { value: "trim-margins-medium", label: "Medium trim (36 pt / 0.5 in)" },
          { value: "trim-margins-large", label: "Large trim (72 pt / 1.0 in)" },
          { value: "custom", label: "Custom margins" },
        ],
      },
      {
        key: "topMargin",
        label: "Top margin trim (pt)",
        type: "number",
        default: 36,
        suffix: " pt",
        showIf: { key: "cropPreset", value: "custom" },
      },
      {
        key: "bottomMargin",
        label: "Bottom margin trim (pt)",
        type: "number",
        default: 36,
        suffix: " pt",
        showIf: { key: "cropPreset", value: "custom" },
      },
      {
        key: "leftMargin",
        label: "Left margin trim (pt)",
        type: "number",
        default: 36,
        suffix: " pt",
        showIf: { key: "cropPreset", value: "custom" },
      },
      {
        key: "rightMargin",
        label: "Right margin trim (pt)",
        type: "number",
        default: 36,
        suffix: " pt",
        showIf: { key: "cropPreset", value: "custom" },
      },
      {
        key: "targetPages",
        label: "Apply to pages",
        type: "select",
        default: "all",
        choices: [
          { value: "all", label: "All pages" },
          { value: "first", label: "First page only" },
          { value: "custom", label: "Custom page range" },
        ],
      },
      {
        key: "customPages",
        label: "Page numbers (e.g. 1-3, 5)",
        type: "text",
        default: "1",
        showIf: { key: "targetPages", value: "custom" },
      },
    ],
    actionLabel: "Crop PDF",
    steps: [
      "Upload your PDF.",
      "Select a trim preset or specify custom margin values.",
      "Choose which pages to crop.",
      "Generate and download your cropped PDF.",
    ],
    faqs: [
      {
        q: "Does cropping reduce file size?",
        a: "Cropping adjusts the visible page viewport (CropBox & MediaBox) without recompressing images, preserving original vector clarity.",
      },
      {
        q: "Can I undo a crop?",
        a: "Your original file on your computer is never touched. You can download the new cropped version while keeping your original intact.",
      },
    ],
    related: ["split-pdf", "rotate-pdf", "pdf-page-size-converter", "print-ready-pdf"],
  },
  {
    slug: "flatten-pdf",
    name: "Flatten PDF",
    metaTitle: "Flatten PDF — Make Forms & Annotations Permanent | IXDocs",
    metaDescription:
      "Flatten interactive PDF forms and annotations into static page content. Lock form fields and protect document formatting in your browser. Free on IXDocs.",
    short: "Lock form fields and annotations into static page artwork.",
    intro:
      "Flatten fillable form fields and visual annotations into non-editable PDF layers so documents display identically in every PDF viewer.",
    category: "Organize",
    icon: Layers,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "none",
    options: [
      {
        key: "flattenMode",
        label: "Flattening method",
        type: "select",
        default: "forms-and-annotations",
        choices: [
          { value: "forms-and-annotations", label: "Form fields & widgets (Vector, crisp text)" },
          { value: "full-raster", label: "Complete visual flatten (Rasterize all layers)" },
        ],
      },
    ],
    actionLabel: "Flatten PDF",
    steps: [
      "Select your fillable PDF or annotated document.",
      "Choose vector form flattening or complete visual rasterization.",
      "Apply the flattening process.",
      "Download the secured, read-only PDF.",
    ],
    faqs: [
      {
        q: "What does flattening a PDF do?",
        a: "Flattening locks interactive form controls (checkboxes, text inputs, digital signatures) directly into the page content so they can no longer be edited or altered.",
      },
      {
        q: "Why should I flatten a PDF before submitting?",
        a: "Many legal portals, universities, and government systems require flattened PDFs to prevent accidental field modifications.",
      },
    ],
    related: ["merge-pdf", "pdf-metadata-cleaner", "print-ready-pdf"],
  },
  /* --------------------------------------------------------------- Edit PDF */
  {
    slug: "edit-pdf",
    name: "Edit PDF",
    metaTitle: "Edit PDF Online Free — Add Text & Remove Content | IXDocs",
    metaDescription:
      "Edit PDF files online for free with IXDocs. Add text, remove unwanted content, add images, draw, highlight, and make basic PDF edits directly in your browser.",
    short: "Add text, remove content, add images, draw, and highlight.",
    intro:
      "Basic PDF editing, directly in your browser. Add text, remove unwanted content, add images, draw, highlight, and make simple PDF edits without uploading your document to a server.",
    category: "Edit PDF",
    icon: FileEdit,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "none",
    options: [],
    actionLabel: "Export Edited PDF",
    steps: [
      "Upload your PDF document.",
      "Use the toolbar to add text, remove unwanted content with clean whiteout, insert images, draw, highlight, or add shapes.",
      "Move, resize, or adjust any added annotations on any page.",
      "Download your edited PDF directly in your browser.",
    ],
    faqs: [
      {
        q: "Can I edit or re-flow existing text in a PDF document?",
        a: "PDF files store fixed visual glyphs rather than reflowable paragraphs. You can overlay new text, mask out old content with whiteout boxes, and annotate pages, but not re-flow existing body text like a word processor.",
      },
      {
        q: "Can I add images, stamps, or signatures to my PDF?",
        a: "Yes. You can insert signature graphics, custom text stamps, colored shapes, and freehand drawings directly onto any page.",
      },
      {
        q: "How does the whiteout or redaction feature work?",
        a: "You can draw opaque color-matched rectangles over sensitive information to mask it visually before exporting the flattened document.",
      },
      {
        q: "Does this editor require an account or software installation?",
        a: "No. The editor runs entirely in your web browser with no account creation, sign-in, or software installation required.",
      },
      {
        q: "Are my edited documents uploaded to an IXDocs server?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. All edits are applied locally.",
      },
    ],
    about: `Edit PDF is a client-side document editor that lets you add text annotations, place shapes, highlight content, draw freehand notes, insert signatures, and redact sensitive sections without installing desktop software. It is ideal for filling non-interactive application forms, signing agreements, adding notes to study materials, or whiting out private information before sharing.

Because PDF is a fixed-layout presentation format rather than a word processing document, this tool works by applying non-destructive visual overlays and redaction masks on top of your existing page layout. You can adjust font styles, sizing, text colors, and box borders with visual drag handles, ensuring that additions align neatly with existing form fields and margins.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. When you finish editing, your modifications are flattened securely into a standard, universally viewable PDF document ready for immediate download. Please note that while you can easily mask and overlay text, you cannot re-flow existing body paragraphs like in a traditional text editor.`,
    related: ["compress-pdf", "add-text-to-pdf", "annotate-pdf", "sign-pdf", "merge-pdf"],
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    metaTitle: "Watermark PDF — Add a Text Watermark | IXDocs",
    metaDescription:
      "Add a text watermark to a PDF with control over position, size, opacity and rotation. Runs in your browser, free on IXDocs.",
    short: "Stamp text across your pages.",
    intro:
      "Add a text watermark such as CONFIDENTIAL or DRAFT with full control over placement and opacity.",
    category: "Edit PDF",
    icon: FileCog,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "select",
    options: [
      { key: "text", label: "Watermark text", type: "text", default: "CONFIDENTIAL" },
      {
        key: "position",
        label: "Position",
        type: "select",
        default: "center",
        choices: [
          { value: "center", label: "Centre" },
          { value: "top", label: "Top" },
          { value: "bottom", label: "Bottom" },
        ],
      },
      {
        key: "size",
        label: "Font size",
        type: "range",
        default: 48,
        min: 12,
        max: 120,
        step: 2,
        suffix: "pt",
      },
      {
        key: "opacity",
        label: "Opacity",
        type: "range",
        default: 20,
        min: 5,
        max: 100,
        step: 5,
        suffix: "%",
      },
      {
        key: "rotation",
        label: "Rotation",
        type: "range",
        default: 45,
        min: 0,
        max: 90,
        step: 5,
        suffix: "°",
      },
    ],
    actionLabel: "Add watermark",
    steps: [
      "Upload the PDF.",
      "Type the watermark text.",
      "Adjust position, size, opacity and rotation.",
      "Select pages if you only want some, then download.",
    ],
    faqs: [
      {
        q: "How do I make the watermark subtle so it doesn't obscure text?",
        a: "Adjust the opacity slider to a lower setting, such as 15% to 25%. This keeps the text readable while clearly displaying the watermark across the page background.",
      },
      {
        q: "Can a watermark added with this tool be removed by someone else?",
        a: "The watermark is permanently written into the PDF's graphic stream. While someone with advanced editing software could alter vectors, it cannot simply be toggled off by standard viewers.",
      },
      {
        q: "Can I choose which pages receive the watermark?",
        a: "Yes. You can select individual pages from the thumbnail selector to apply the watermark only where needed, such as cover sheets or contract appendixes.",
      },
      {
        q: "What rotation angle is standard for draft watermarks?",
        a: "A 45° diagonal angle is the industry standard for stamps like CONFIDENTIAL or DRAFT, running diagonally from bottom-left to top-right across the page.",
      },
      {
        q: "Does watermarking a PDF require uploading the file to a cloud server?",
        a: "No. The watermarking engine operates purely inside your local browser memory. Your documents are never uploaded or stored remotely.",
      },
    ],
    about:
      "Watermark PDF lets you apply custom text or graphic image watermarks across every page of your PDF documents directly in your web browser. Watermarking is essential for safeguarding intellectual property, indicating document status (such as DRAFT, CONFIDENTIAL, APPROVED, or COPY), branding presentations with corporate logos, and discouraging unauthorized distribution of proprietary materials.\n\nThe tool offers complete control over watermark styling and placement. You can customize font family, text size, color, opacity, rotation angle (such as diagonal 45-degree stamps), and position across nine grid anchors or custom coordinates. You can also specify exact page ranges, ensuring cover pages remain unwatermarked while internal pages carry prominent security stamps.\n\nSecurity and speed are guaranteed because all watermarking logic executes entirely on your client device using modern WebAssembly and PDF manipulation libraries. Your confidential drafts, pitch decks, and internal financial projections are never uploaded to any remote server or cloud infrastructure. Download your securely branded and watermarked PDF immediately with zero quality loss and absolute privacy.",
    related: ["pdf-page-numbering", "password-protect-pdf", "pdf-metadata-cleaner", "compress-pdf"],
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    metaTitle: "Sign PDF — Add a Signature to PDF Online | IXDocs",
    metaDescription:
      "Sign PDF files online for free. Draw a signature, type your name, or add a visual stamp to sign your documents in your browser. Free on IXDocs.",
    short: "Sign documents with typed or drawn signatures.",
    intro:
      "Add a secure, legally-binding visual signature to your PDF. Draw it with your pointer, type your name in elegant script, or stamp it.",
    category: "Edit PDF",
    icon: Signature,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "select",
    options: [
      { key: "typedName", label: "Signer name", type: "text", default: "John Doe" },
      {
        key: "signatureType",
        label: "Signature style",
        type: "select",
        default: "type",
        choices: [
          { value: "type", label: "Typed (Elegant Script)" },
          { value: "draw", label: "Drawn (Pointer/Touch)" },
        ],
      },
      {
        key: "sigColor",
        label: "Ink color",
        type: "select",
        default: "blue",
        choices: [
          { value: "blue", label: "Blue ink" },
          { value: "black", label: "Black ink" },
        ],
      },
      {
        key: "sigPosition",
        label: "Placement",
        type: "select",
        default: "bottom-right",
        choices: [
          { value: "bottom-right", label: "Bottom right" },
          { value: "bottom-left", label: "Bottom left" },
          { value: "bottom-center", label: "Bottom centre" },
          { value: "top-right", label: "Top right" },
          { value: "top-left", label: "Top left" },
          { value: "center", label: "Centre" },
        ],
      },
    ],
    actionLabel: "Sign document",
    steps: [
      "Upload the document.",
      "Type your name or draw your signature.",
      "Position the signature on the page.",
      "Apply and download the signed PDF.",
    ],
    faqs: [
      {
        q: "Are electronic signatures created with this tool legally binding?",
        a: "In many jurisdictions, standard electronic signatures are legally valid for everyday agreements, rental contracts, and business forms under laws like the US ESIGN Act and EU eIDAS regulations for basic electronic signatures.",
      },
      {
        q: "Can I draw my signature using a smartphone or tablet touch screen?",
        a: "Yes. The signature pad works smoothly with finger touch and stylus pens on smartphones, iPads, tablets, and touch-enabled laptops.",
      },
      {
        q: "What signature creation methods are available?",
        a: "You can draw your signature by hand, type your name using a cursive font preset, or upload an image file of your existing handwritten signature.",
      },
      {
        q: "Does this tool provide cryptographic X.509 digital certificates?",
        a: "No. This tool creates standard electronic visual signatures. If your transaction specifically mandates a cryptographic PKI certificate with token-based authentication, check your recipient's compliance rules.",
      },
      {
        q: "Is my signature saved on any remote database or server?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Your signature data exists only in your active browser session.",
      },
    ],
    about: `Sign PDF allows you to add electronic signatures, initials, and date stamps to PDF contracts, leases, agreements, and forms directly from your web browser. It eliminates the tedious cycle of printing paper documents, signing by hand, and re-scanning them back to your computer.

The tool provides flexible signature creation methods: draw your signature naturally using a mouse, trackpad, or touchscreen; type your name and select a clean handwritten script font; or upload a pre-made transparent signature image. Once created, you can resize your signature, position it precisely on any signature line, and place it across single or multiple pages as required.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. This tool creates standard electronic signatures suitable for everyday commercial agreements, non-disclosure forms, and approvals. If your transaction requires cryptographic digital certificates (X.509 PKI), verify whether your recipient requires that specific credential before signing. After positioning your signature, download your finalized document instantly.`,
    related: ["edit-pdf", "add-text-to-pdf", "annotate-pdf", "flatten-pdf"],
  },
  {
    slug: "annotate-pdf",
    name: "Annotate PDF",
    metaTitle: "Annotate PDF — Highlight & Add Notes to PDF | IXDocs",
    metaDescription:
      "Annotate PDFs for free. Highlight text, draw freehand, add banners or markup callouts in your browser. Free on IXDocs.",
    short: "Highlight text, draw annotations and add callout notes.",
    intro:
      "Highlight important text, draw freehand annotations directly on pages, or add banners and callout labels to point out key sections.",
    category: "Edit PDF",
    icon: PenLine,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "select",
    options: [
      { key: "annotationText", label: "Note text", type: "text", default: "APPROVED" },
      {
        key: "annotationType",
        label: "Annotation style",
        type: "select",
        default: "highlight",
        choices: [
          { value: "highlight", label: "Text Highlighter" },
          { value: "callout", label: "Callout Box" },
          { value: "banner", label: "Color Banner" },
          { value: "rectangle", label: "Border Box" },
        ],
      },
      {
        key: "annotationColor",
        label: "Color",
        type: "select",
        default: "yellow",
        choices: [
          { value: "yellow", label: "Yellow" },
          { value: "green", label: "Green" },
          { value: "blue", label: "Blue" },
          { value: "red", label: "Red" },
          { value: "orange", label: "Orange" },
        ],
      },
    ],
    actionLabel: "Apply annotations",
    steps: [
      "Upload your PDF.",
      "Enter your annotation text and choose a color/style.",
      "Position the note or highlight on the page.",
      "Apply annotations and download.",
    ],
    faqs: [
      {
        q: "What types of visual annotations can I add to my PDF?",
        a: "You can add text highlighters, callout boxes for notes, colorful alert banners, and rectangular borders to emphasize important passages.",
      },
      {
        q: "Can I use different colors to color-code my review notes?",
        a: "Yes. You can choose from yellow, green, blue, red, and orange to categorize feedback, edits, and important highlights.",
      },
      {
        q: "Will my annotations appear in other PDF reader applications?",
        a: "Yes. Annotations are permanently written into the standard PDF document structure, ensuring consistent display in Adobe Acrobat, Apple Preview, and web browsers.",
      },
      {
        q: "Can I annotate specific pages of a multi-page document?",
        a: "Yes. You can select the exact page you want to mark up from the visual thumbnail preview.",
      },
      {
        q: "Are my annotated documents uploaded to external servers?",
        a: "No. The markup is applied using client-side rendering in your local browser session. Your documents are never sent over the internet.",
      },
    ],
    about:
      "Annotate PDF provides an intuitive, browser-based markup workspace for reviewing, marking up, and commenting on PDF documents without installing complex software. It is designed for students reviewing lecture notes, legal teams proofreading agreements, designers marking up design drafts, and professionals collaborating on contract revisions.\n\nThe tool includes a rich set of annotation instruments: freehand drawing pens for sketching and circling key points, translucent highlighters for emphasizing important paragraphs, shape tools (rectangles, circles, and arrows) for calling out diagram features, and sticky notes for detailed contextual comments. Each annotation can be customized with adjustable line thickness, stroke colors, and opacity levels.\n\nAll markup actions and PDF rendering take place directly on your computer or mobile device using modern HTML5 canvas and client-side PDF technologies. Your annotated documents are never uploaded to third-party servers or stored in cloud databases, guaranteeing absolute privacy for proprietary business plans, legal filings, and personal notes. Download your finalized, annotated PDF instantly with all markup flattened and preserved.",
    related: ["watermark-pdf", "sign-pdf", "pdf-page-numbering"],
  },
  {
    slug: "add-text-to-pdf",
    name: "Add Text to PDF",
    metaTitle: "Add Text to PDF — Type on PDF Online | IXDocs",
    metaDescription:
      "Type on a PDF online for free. Insert text labels, headers or footers with full control over font size, family and color. Free on IXDocs.",
    short: "Insert text labels, headers and footers onto pages.",
    intro:
      "Type directly on your PDF pages. Place text labels, custom headers or footers with full control over font size, family and color.",
    category: "Edit PDF",
    icon: Type,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "select",
    options: [
      { key: "text", label: "Text to insert", type: "text", default: "Confidential Note" },
      {
        key: "position",
        label: "Position",
        type: "select",
        default: "header-right",
        choices: [
          { value: "header-right", label: "Header (Right)" },
          { value: "header-center", label: "Header (Centre)" },
          { value: "header-left", label: "Header (Left)" },
          { value: "footer-right", label: "Footer (Right)" },
          { value: "footer-center", label: "Footer (Centre)" },
          { value: "footer-left", label: "Footer (Left)" },
        ],
      },
      {
        key: "fontFamily",
        label: "Font family",
        type: "select",
        default: "helvetica",
        choices: [
          { value: "helvetica", label: "Helvetica" },
          { value: "times", label: "Times New Roman" },
          { value: "courier", label: "Courier" },
        ],
      },
      {
        key: "fontSize",
        label: "Font size",
        type: "range",
        default: 12,
        min: 8,
        max: 36,
        step: 1,
        suffix: "pt",
      },
      {
        key: "textColor",
        label: "Text color",
        type: "select",
        default: "black",
        choices: [
          { value: "black", label: "Black" },
          { value: "darkgray", label: "Dark Grey" },
          { value: "navy", label: "Navy Blue" },
          { value: "red", label: "Red" },
          { value: "darkgreen", label: "Forest Green" },
        ],
      },
    ],
    actionLabel: "Insert text",
    steps: [
      "Upload the PDF document.",
      "Type the text and choose the header/footer position.",
      "Adjust font family, size and ink color.",
      "Download the modified document with text inserted.",
    ],
    faqs: [
      {
        q: "Can I use this tool to fill out non-interactive PDF forms?",
        a: "Yes. You can type names, dates, addresses, and reference numbers onto any PDF page, making it ideal for non-fillable application forms.",
      },
      {
        q: "Which font families and colors are supported?",
        a: "Supported font families include standard Helvetica, Times New Roman, and Courier. Color options include Black, Dark Grey, Navy Blue, Red, and Forest Green.",
      },
      {
        q: "Can I add headers or footers across multiple pages?",
        a: "Yes. You can select standard header and footer positions (left, center, right) to place uniform labels across your document pages.",
      },
      {
        q: "Does adding text alter or overwrite existing text on the page?",
        a: "No. The inserted text is added as an overlay layer on top of the existing page content. The underlying text and images remain untouched.",
      },
      {
        q: "Is my document stored on a server during text editing?",
        a: "No. Everything runs in your browser using local client-side libraries. No document data is ever uploaded or retained by IXDocs.",
      },
    ],
    about:
      "Add Text to PDF lets you type, position, and format custom text directly onto any page of an existing PDF document right in your web browser without requiring expensive software subscriptions. It is the perfect tool for filling out non-interactive PDF forms, adding missing dates, inserting explanatory notes, correcting typos, or placing contact details on business invoices and resumes.\n\nThe interactive editor allows you to click anywhere on a document page to insert a new text element. You can customize the font family, font size, text color, alignment, and background highlight to match the existing typography of the document seamlessly. Text elements can be dragged to exact coordinates, resized, and edited or deleted before finalizing the document.\n\nIXDocs processes all document modifications client-side inside your browser memory. Your files are never sent over the internet or stored on external cloud servers, ensuring total privacy for sensitive medical questionnaires, employment agreements, and financial paperwork. Once your edits are complete, download the updated PDF instantly with vector-sharp text rendering and original document fidelity.",
    related: ["watermark-pdf", "pdf-page-numbering", "sign-pdf"],
  },
  {
    slug: "password-protect-pdf",
    name: "Password Protect PDF",
    metaTitle: "Password Protect PDF — Encrypt a PDF | IXDocs",
    metaDescription:
      "Add a password to a PDF document with IXDocs. Set an open password and download the protected file.",
    short: "Lock a document with a password.",
    intro: "Set an open password so only people with the passphrase can read the document.",
    category: "Edit PDF",
    icon: Lock,
    ready: false,
    notice: "This tool is currently unavailable. Please try one of our available tools.",
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    options: [
      { key: "password", label: "Password", type: "password", default: "" },
      { key: "confirm", label: "Confirm password", type: "password", default: "" },
      {
        key: "strength",
        label: "Encryption",
        type: "select",
        default: "aes256",
        choices: [
          { value: "aes128", label: "AES-128" },
          { value: "aes256", label: "AES-256 (recommended)" },
        ],
      },
    ],
    actionLabel: "Protect PDF",
    steps: [
      "Upload the PDF.",
      "Enter and confirm a password.",
      "Choose the encryption strength.",
      "Download the protected document.",
    ],
    faqs: [
      {
        q: "Does IXDocs keep my password?",
        a: "No. It exists only in the page you are using and is never stored, logged or sent anywhere.",
      },
      {
        q: "What if I forget the password?",
        a: "There is no recovery. An encrypted PDF cannot be opened without its password, so store it somewhere safe.",
      },
    ],
    related: ["pdf-metadata-cleaner", "watermark-pdf", "pdf-health-checker", "compress-pdf"],
  },
  {
    slug: "pdf-page-numbering",
    name: "PDF Page Numbering",
    metaTitle: "Add Page Numbers to PDF | IXDocs",
    metaDescription:
      "Insert page numbers into a PDF with control over position, starting number, font size and format. Free browser tool by IXDocs.",
    short: "Add clean page numbers to a document.",
    intro:
      "Insert page numbers in the position and format you need — ideal for reports, contracts and submissions.",
    category: "Edit PDF",
    icon: Hash,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "select",
    options: [
      {
        key: "position",
        label: "Position",
        type: "select",
        default: "bottom-center",
        choices: [
          { value: "bottom-center", label: "Bottom centre" },
          { value: "bottom-right", label: "Bottom right" },
          { value: "bottom-left", label: "Bottom left" },
          { value: "top-center", label: "Top centre" },
          { value: "top-right", label: "Top right" },
          { value: "top-left", label: "Top left" },
        ],
      },
      {
        key: "format",
        label: "Format",
        type: "select",
        default: "n",
        choices: [
          { value: "n", label: "1" },
          { value: "n-of-total", label: "1 of 10" },
          { value: "page-n", label: "Page 1" },
          { value: "dash", label: "– 1 –" },
        ],
      },
      {
        key: "start",
        label: "Start number",
        type: "number",
        default: 1,
        min: 0,
        max: 9999,
        step: 1,
      },
      {
        key: "size",
        label: "Font size",
        type: "range",
        default: 11,
        min: 6,
        max: 24,
        step: 1,
        suffix: "pt",
      },
    ],
    actionLabel: "Add page numbers",
    steps: [
      "Upload the PDF.",
      "Choose the position and number format.",
      "Set the starting number and font size.",
      "Apply and download the numbered document.",
    ],
    faqs: [
      {
        q: "Can I skip the cover page?",
        a: "Yes. Deselect it in the thumbnail grid and numbering will only be drawn on the pages you keep selected.",
      },
      {
        q: "Can numbering start at a different value?",
        a: "Yes — set any starting number, which is useful when a document is one part of a larger bundle.",
      },
    ],
    related: ["watermark-pdf", "merge-pdf", "print-ready-pdf", "pdf-page-size-converter"],
  },

  /* ----------------------------------------------------- Compress & Optimize */
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    metaTitle: "Compress PDF — Reduce PDF File Size Online | IXDocs",
    metaDescription:
      "Reduce PDF file size in your browser. Choose a compression level, see the exact size reduction and download the smaller file. Free on IXDocs.",
    short: "Make heavy PDFs small enough to send.",
    intro:
      "Reduce the size of image-heavy PDFs. IXDocs re-renders pages at a lower image quality and reports the real size change — no invented numbers.",
    category: "Compress & Optimize",
    icon: FileArchive,
    ready: true,
    notice:
      "Compression re-renders each page as an image, which shrinks scans and photo-heavy documents dramatically. Text in the result is no longer selectable — use Structure-only for text documents.",
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    options: [
      {
        key: "level",
        label: "Compression level",
        type: "select",
        default: "balanced",
        choices: [
          { value: "light", label: "Light — best quality" },
          { value: "balanced", label: "Balanced — recommended" },
          { value: "strong", label: "Strong — smallest file" },
          { value: "lossless", label: "Structure only — keeps text" },
        ],
      },
    ],
    actionLabel: "Compress PDF",
    steps: [
      "Upload the PDF you want to shrink.",
      "Pick a compression level.",
      "Compress and compare the original and new size.",
      "Download the smaller document.",
    ],
    faqs: [
      {
        q: "Why did my file barely shrink?",
        a: "PDFs that consist entirely of selectable vector text and shapes already have very compact file sizes. The compressor shrinks documents primarily by downsampling embedded raster images and scanned pages, so text-only documents have little redundant image data to compress.",
      },
      {
        q: "Does compression reduce visual quality?",
        a: "Low compression preserves sharp text and clear graphics. High compression applies stronger image downsampling and JPEG re-encoding, which reduces file size more aggressively while introducing slight softness to high-resolution photos.",
      },
      {
        q: "Can I compress a PDF entirely in my browser?",
        a: "Yes. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. All rendering and re-encoding run locally in your device's memory.",
      },
      {
        q: "What should I do if the compressed PDF is still too large?",
        a: "If standard compression does not reach your required file size limit, use our Compress PDF to Target Size tool to specify an exact ceiling, or use Split PDF to remove unnecessary pages.",
      },
      {
        q: "Can I reduce PDF file size without changing the format?",
        a: "Yes. The output is a standard PDF document that opens in Adobe Acrobat, web browsers, and any standard PDF reader without requiring special decompression software.",
      },
    ],
    about: `Compress PDF reduces the file size of a PDF document by re-rendering its pages at a lower image resolution and applying controlled JPEG compression to raster elements. This is especially useful when preparing documents for email attachments, online job application portals, university submissions, or government forms that enforce strict maximum file upload limits.

Because compression re-samples page content, documents that contain high-resolution photos, full-page scanner images, or large embedded figures will see substantial reductions in overall file size. In contrast, documents composed purely of vector text and standard system fonts already store minimal data, so re-rendering them may yield minimal size savings or occasionally increase file size slightly due to rasterization.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. To achieve the best balance between small file size and sharp readability, choose Low compression for everyday text-heavy documents, Medium for typical reports with diagrams, or High when you must meet an aggressive size ceiling. Always inspect the generated document to verify that text and graphics remain clear before submitting.`,
    related: ["compress-pdf-to-target-size", "merge-pdf", "split-pdf", "pdf-to-jpg"],
    popular: true,
  },
  {
    slug: "compress-pdf-to-target-size",
    name: "Compress PDF to Target Size",
    metaTitle: "Compress PDF to 100 KB, 200 KB or 500 KB | IXDocs",
    metaDescription:
      "Compress a PDF towards a chosen maximum size limit such as 100 KB, 200 KB, 500 KB or a custom limit. IXDocs reports the real result honestly.",
    short: "Hit an upload limit like 200 KB or 1 MB.",
    intro:
      "Many application forms demand a maximum file size. IXDocs searches compression settings to get as close to your target as possible and tells you the true result — including when the target is not reachable.",
    category: "Compress & Optimize",
    icon: Gauge,
    ready: true,
    notice:
      "IXDocs tries progressively stronger settings to reach your target. If the target cannot be met at a usable quality, you get the smallest sensible result plus a clear explanation instead of a false promise.",
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    options: [
      {
        key: "target",
        label: "Target size",
        type: "select",
        default: "200",
        choices: [
          { value: "100", label: "100 KB" },
          { value: "200", label: "200 KB" },
          { value: "500", label: "500 KB" },
          { value: "1024", label: "1 MB" },
          { value: "custom", label: "Custom" },
        ],
      },
      {
        key: "customKb",
        label: "Custom target",
        type: "number",
        default: 300,
        min: 20,
        max: 20480,
        step: 10,
        suffix: "KB",
        showIf: { key: "target", value: "custom" },
      },
    ],
    actionLabel: "Compress to target",
    steps: [
      "Upload the PDF.",
      "Pick the size limit you must meet, or enter a custom one.",
      "Run the compression — IXDocs tests several settings automatically.",
      "Review the honest result and download.",
    ],
    faqs: [
      {
        q: "How does the target-size compressor reach the target limit?",
        a: "The tool analyzes embedded images and page elements, iteratively adjusting resolution downsampling and JPEG quality settings to get as close as possible to your chosen file size limit.",
      },
      {
        q: "Why can some PDFs not reach aggressive targets like 100 KB?",
        a: "A multi-page document has a structural baseline of bytes for fonts, page objects, and layout data. If a PDF contains 20 pages, that baseline data alone may exceed 100 KB even with maximum image compression.",
      },
      {
        q: "Which target size should I pick for official portal uploads?",
        a: "Check the exact requirement of the portal you are submitting to. Most government and visa application systems specify either 200 KB, 500 KB, or 1 MB maximum upload sizes.",
      },
      {
        q: "Does target-size compression compromise text clarity?",
        a: "Text remains legible at standard sizes, but aggressive targets apply stronger downsampling to images and scans. Check fine details like passport photos and signatures before submitting.",
      },
      {
        q: "Is my document uploaded to a remote server for compression testing?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. All size calculations execute locally.",
      },
    ],
    about: `Compress PDF to Target Size helps reduce your PDF file size to fit strict upload limits—such as 100 KB, 200 KB, 500 KB, or 1 MB—demanded by government portals, university admissions desks, and job application systems. Rather than manually guessing compression percentages, you select your target ceiling and let the engine calculate the optimal balance.

The tool analyzes your document's internal structure and iteratively adjusts raster image downsampling and JPEG quality to get as close as possible to your desired file size. While documents containing heavy raster images can often be compressed significantly, documents that already consist of minimal vector text or contain dozens of pages cannot physically shrink below the minimum bytes required to represent the text and page catalog.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Always preview the output to ensure text clarity and barcode readability meet your submission requirements before final upload. If an aggressive target causes excessive blurriness on important details, consider using Split PDF to separate supplementary attachments into a second document.`,
    related: [
      "compress-pdf",
      "application-pdf-optimizer",
      "pdf-health-checker",
      "pdf-page-size-converter",
    ],
    popular: true,
  },
  {
    slug: "pdf-health-checker",
    name: "PDF Health Checker",
    metaTitle: "PDF Health Checker — Inspect a PDF File | IXDocs",
    metaDescription:
      "Check a PDF for size, page count, page dimensions, orientation, metadata and encryption. A clear document health report from IXDocs.",
    short: "Inspect a document before you send it.",
    intro:
      "Get a clear report on your PDF: size, page count, page dimensions, mixed orientations, metadata and whether it is encrypted.",
    category: "Compress & Optimize",
    icon: FileCheck2,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    options: [],
    actionLabel: "Analyse PDF",
    steps: [
      "Upload the PDF.",
      "Run the analysis.",
      "Read the health report.",
      "Jump straight to the tool that fixes any issue found.",
    ],
    faqs: [
      {
        q: "What counts as a problem?",
        a: "Mixed page sizes, unusual dimensions, a very large average page weight, or leftover metadata — all of which can cause rejected uploads or bad prints.",
      },
      {
        q: "Is my file uploaded to check it?",
        a: "No. The report is produced in your browser from the file you selected.",
      },
    ],
    related: [
      "compress-pdf",
      "pdf-metadata-cleaner",
      "pdf-page-size-converter",
      "smart-pdf-analyzer",
    ],
  },
  {
    slug: "pdf-page-size-converter",
    name: "PDF Page Size Converter",
    metaTitle: "PDF Page Size Converter — A4, A3, Letter, Legal | IXDocs",
    metaDescription:
      "Convert PDF pages to A4, A3, Letter or Legal with portrait or landscape orientation. Free browser tool by IXDocs.",
    short: "Standardise pages to A4, Letter and more.",
    intro:
      "Rescale every page onto a consistent paper size so the document prints predictably anywhere.",
    category: "Compress & Optimize",
    icon: ArrowLeftRight,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    options: [
      {
        key: "pageSize",
        label: "Target size",
        type: "select",
        default: "a4",
        choices: PAGE_SIZE_CHOICES.slice(1),
      },
      {
        key: "orientation",
        label: "Orientation",
        type: "select",
        default: "portrait",
        choices: [
          { value: "portrait", label: "Portrait" },
          { value: "landscape", label: "Landscape" },
          { value: "keep", label: "Keep each page's orientation" },
        ],
      },
    ],
    actionLabel: "Convert page size",
    steps: [
      "Upload the PDF.",
      "Choose the target paper size.",
      "Choose the orientation behaviour.",
      "Convert and download.",
    ],
    faqs: [
      {
        q: "Is content cropped?",
        a: "No. Each page is scaled to fit inside the new size and centred, so nothing is cut off.",
      },
      {
        q: "Which size should I use?",
        a: "A4 is standard almost everywhere; Letter and Legal are used in the United States and Canada.",
      },
    ],
    related: ["print-ready-pdf", "rotate-pdf", "compress-pdf", "pdf-health-checker"],
  },
  {
    slug: "print-ready-pdf",
    name: "Print-Ready PDF",
    metaTitle: "Print-Ready PDF — Prepare a PDF for Printing | IXDocs",
    metaDescription:
      "Prepare a PDF for printing with a consistent paper size, orientation, margins and page positioning. Free tool by IXDocs.",
    short: "Prepare a document for clean printing.",
    intro:
      "Place every page on a consistent sheet with safe margins so nothing is clipped by your printer.",
    category: "Compress & Optimize",
    icon: Printer,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    options: [
      {
        key: "pageSize",
        label: "Paper size",
        type: "select",
        default: "a4",
        choices: PAGE_SIZE_CHOICES.slice(1),
      },
      {
        key: "orientation",
        label: "Orientation",
        type: "select",
        default: "portrait",
        choices: [
          { value: "portrait", label: "Portrait" },
          { value: "landscape", label: "Landscape" },
        ],
      },
      {
        key: "margin",
        label: "Margin",
        type: "range",
        default: 36,
        min: 0,
        max: 96,
        step: 6,
        suffix: "pt",
      },
      {
        key: "align",
        label: "Positioning",
        type: "select",
        default: "center",
        choices: [
          { value: "center", label: "Centred" },
          { value: "top", label: "Top aligned" },
        ],
      },
    ],
    actionLabel: "Make print-ready",
    steps: [
      "Upload the PDF.",
      "Pick paper size and orientation.",
      "Set a safe margin.",
      "Generate and download the print-ready file.",
    ],
    faqs: [
      {
        q: "Why do I need margins?",
        a: "Most home and office printers cannot print to the very edge of a sheet, so a margin protects content near the border.",
      },
      {
        q: "Does this change the content?",
        a: "Pages are scaled and repositioned only. Nothing inside them is edited.",
      },
    ],
    related: ["pdf-page-size-converter", "pdf-page-numbering", "compress-pdf", "rotate-pdf"],
  },

  {
    slug: "grayscale-pdf",
    name: "Grayscale PDF",
    metaTitle: "Grayscale PDF — Convert PDF to Black & White Online | IXDocs",
    metaDescription:
      "Convert color PDF pages into monochrome grayscale in your browser. Save printer ink and create clean black & white documents. Free on IXDocs.",
    short: "Convert color PDFs to clean black & white grayscale.",
    intro:
      "Convert color PDF documents into clean, uniform grayscale. Reduce printer ink usage and prepare documents for black-and-white printing.",
    category: "Compress & Optimize",
    icon: Contrast,
    ready: true,
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    pageMode: "none",
    options: [
      {
        key: "mode",
        label: "Conversion style",
        type: "select",
        default: "smooth",
        choices: [
          { value: "smooth", label: "Smooth Grayscale (Photos & Illustrations)" },
          { value: "high-contrast", label: "High Contrast B&W (Scans & Text)" },
        ],
      },
      {
        key: "quality",
        label: "Resolution & quality",
        type: "select",
        default: "standard",
        choices: [
          { value: "high", label: "High Quality (300 DPI, Print)" },
          { value: "standard", label: "Standard (150 DPI, Digital)" },
          { value: "compact", label: "Compact (100 DPI, Low Size)" },
        ],
      },
    ],
    actionLabel: "Convert to grayscale",
    steps: [
      "Upload your color PDF.",
      "Choose smooth grayscale or high-contrast black & white.",
      "Select resolution and quality level.",
      "Download the monochrome PDF.",
    ],
    faqs: [
      {
        q: "Why convert a PDF to grayscale?",
        a: "Grayscale documents save printer toner, prevent color distortion on monochrome printers, and are often required for official submissions.",
      },
    ],
    related: ["compress-pdf", "print-ready-pdf", "pdf-health-checker"],
  },
  /* ---------------------------------------------------------------- Privacy */
  {
    slug: "pdf-metadata-cleaner",
    name: "PDF Metadata Cleaner",
    metaTitle: "PDF Metadata Cleaner — Remove Hidden Document Data | IXDocs",
    metaDescription:
      "See the author, creator, producer and date metadata stored in your PDF and remove it before sharing. Free browser tool by IXDocs.",
    short: "Strip hidden author and software data.",
    intro:
      "PDFs quietly carry the author name, the software that made them and edit timestamps. Review exactly what yours stores and clear it.",
    category: "Privacy",
    icon: ShieldCheck,
    ready: true,
    notice:
      "IXDocs removes the standard document information fields it can read and rewrite. Content embedded inside the page artwork itself, such as a signature image, is not metadata and is not affected.",
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    options: [],
    actionLabel: "Remove metadata",
    steps: [
      "Upload the PDF.",
      "Review the metadata IXDocs detected.",
      "Remove it.",
      "Download the cleaned document.",
    ],
    faqs: [
      {
        q: "What exactly is removed?",
        a: "Title, author, subject, keywords, creator, producer and the creation and modification dates, where those fields exist.",
      },
      {
        q: "Does this anonymise the document?",
        a: "It removes document-level metadata only. Names and details written inside the visible page content remain.",
      },
    ],
    related: ["pdf-health-checker", "password-protect-pdf", "watermark-pdf", "compress-pdf"],
  },

  /* --------------------------------------------------------------- Advanced */
  {
    slug: "pdf-ocr",
    name: "PDF OCR",
    metaTitle: "PDF OCR — Extract Text from Scanned PDFs | IXDocs",
    metaDescription:
      "Run OCR on scanned PDFs to extract text and build a searchable document. Choose a recognition language on IXDocs.",
    short: "Read text out of scanned documents.",
    intro:
      "Optical character recognition turns a scanned page image into real, searchable text you can copy and index.",
    category: "Advanced",
    icon: FileScan,
    ready: true,
    accept: PDF,
    acceptLabel: "Scanned PDF file",
    multiple: false,
    options: [
      {
        key: "language",
        label: "Recognition language",
        type: "select",
        default: "eng",
        choices: [
          { value: "eng", label: "English" },
          { value: "spa", label: "Spanish" },
          { value: "fra", label: "French" },
          { value: "deu", label: "German" },
          { value: "por", label: "Portuguese" },
          { value: "hin", label: "Hindi" },
        ],
      },
      {
        key: "output",
        label: "Output",
        type: "select",
        default: "searchable",
        choices: [
          { value: "searchable", label: "Searchable PDF" },
          { value: "text", label: "Plain text file" },
        ],
      },
    ],
    actionLabel: "Run OCR",
    steps: [
      "Upload a scanned PDF.",
      "Choose the language of the document.",
      "Pick a searchable PDF or a plain text file.",
      "Run OCR and download the result.",
    ],
    faqs: [
      {
        q: "How does PDF OCR make scanned documents searchable?",
        a: "The OCR engine identifies character shapes on each image page and overlays an invisible text layer directly on top of the original scan, allowing you to highlight, search, and copy text.",
      },
      {
        q: "Which languages does the OCR tool support?",
        a: "The client-side engine supports multiple major languages, including English, Spanish, French, German, Italian, Portuguese, and more, which you can select before running OCR.",
      },
      {
        q: "What factors provide the highest OCR recognition accuracy?",
        a: "Clean, high-contrast scans at 300 DPI with clear printed typography, proper orientation, and minimal background bleed deliver the highest accuracy.",
      },
      {
        q: "Can I extract the recognized content as plain text?",
        a: "Yes. You can choose 'Plain Text' mode to download an editable text file containing all recognized words organized by page number.",
      },
      {
        q: "Does OCR processing upload my files to an external cloud service?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. The Tesseract WebAssembly engine runs strictly on your device.",
      },
    ],
    about: `PDF OCR (Optical Character Recognition) recognizes and extracts text from scanned paper documents, mobile camera photos, and image-only PDF files directly inside your web browser. This tool transforms flat, unsearchable bitmap scans into selectable text that you can search, copy, and archive across all modern document readers.

Powered by client-side Tesseract.js running via WebAssembly, the recognition engine processes document pages locally on your device. You can choose to export the recognized content as a searchable PDF (where transparent text is aligned over the original scan image) or download the output as a clean, plain text file for editing in a text editor or word processor.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. OCR accuracy depends directly on the quality of the source scan: crisp, upright 300 DPI scans with good contrast yield the highest recognition rates, whereas blurry, skewed, or handwritten pages may produce occasional errors. You can select your document's primary language prior to running the recognition pass to maximize accuracy.`,
    related: ["pdf-to-text", "edit-pdf", "pdf-to-jpg", "document-scanner"],
  },
  {
    slug: "application-pdf-optimizer",
    name: "Application PDF Optimizer",
    metaTitle: "Application PDF Optimizer — Fix Documents for Form Uploads | IXDocs",
    metaDescription:
      "Prepare a document for an online application: standard page size, image optimisation and a target file size, with a final size check. Free on IXDocs.",
    short: "Get a document past a strict upload form.",
    intro:
      "Online applications often demand a specific page size and a hard file-size cap. This tool applies both in one pass and verifies the result.",
    category: "Advanced",
    icon: FileSearch,
    ready: true,
    notice:
      "IXDocs cannot guarantee that any specific organisation will accept your document. It applies the size and format settings you choose and reports the measured result.",
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    options: [
      {
        key: "pageSize",
        label: "Required page size",
        type: "select",
        default: "a4",
        choices: [{ value: "keep", label: "Keep original" }, ...PAGE_SIZE_CHOICES.slice(1)],
      },
      {
        key: "target",
        label: "Maximum file size",
        type: "select",
        default: "500",
        choices: [
          { value: "100", label: "100 KB" },
          { value: "200", label: "200 KB" },
          { value: "500", label: "500 KB" },
          { value: "1024", label: "1 MB" },
          { value: "2048", label: "2 MB" },
          { value: "custom", label: "Custom" },
        ],
      },
      {
        key: "customKb",
        label: "Custom maximum",
        type: "number",
        default: 300,
        min: 20,
        max: 20480,
        step: 10,
        suffix: "KB",
        showIf: { key: "target", value: "custom" },
      },
    ],
    actionLabel: "Optimise document",
    steps: [
      "Upload the document you need to submit.",
      "Set the page size the form requires.",
      "Set the maximum file size allowed.",
      "Optimise, check the measured result and download.",
    ],
    faqs: [
      {
        q: "Will my application be accepted?",
        a: "IXDocs cannot promise that. It makes the file match the size and format rules you enter; acceptance is always decided by the organisation.",
      },
      {
        q: "What if the limit is impossible?",
        a: "You get the closest achievable file plus a plain explanation, never a fake success.",
      },
    ],
    related: [
      "compress-pdf-to-target-size",
      "passport-photo",
      "pdf-health-checker",
      "pdf-page-size-converter",
    ],
  },
  {
    slug: "passport-photo",
    name: "Passport / ID Photo Sheet",
    metaTitle: "Passport Photo Sheet Maker — Print-Ready ID Photos | IXDocs",
    metaDescription:
      "Turn one photo into a printable sheet of passport or ID photos at your chosen size and copy count. Free tool by IXDocs.",
    short: "Print a full sheet of ID photos.",
    intro:
      "Lay out multiple copies of one photo on a single printable sheet at a chosen physical size, ready for a photo lab or home printer.",
    category: "Advanced",
    icon: IdCard,
    ready: true,
    notice:
      "Photo requirements differ by country and authority — head size, background and margins are all regulated locally. Check the official specification for your document before printing.",
    accept: IMAGES,
    acceptLabel: "JPG or PNG photo",
    multiple: false,
    options: [
      {
        key: "photoSize",
        label: "Photo size",
        type: "select",
        default: "35x45",
        choices: [
          { value: "35x45", label: "35 × 45 mm (most countries)" },
          { value: "51x51", label: "51 × 51 mm (US 2 × 2 in)" },
          { value: "50x70", label: "50 × 70 mm" },
          { value: "25x35", label: "25 × 35 mm (small ID)" },
        ],
      },
      { key: "copies", label: "Copies", type: "number", default: 8, min: 1, max: 40, step: 1 },
      {
        key: "sheet",
        label: "Sheet size",
        type: "select",
        default: "a4",
        choices: [
          { value: "a4", label: "A4" },
          { value: "4x6", label: "4 × 6 in photo paper" },
          { value: "letter", label: "Letter" },
        ],
      },
      { key: "guides", label: "Print cutting guides", type: "toggle", default: true },
    ],
    actionLabel: "Create photo sheet",
    steps: [
      "Upload a straight, well-lit photo.",
      "Choose the photo size your authority requires.",
      "Set how many copies and the sheet size.",
      "Generate the sheet PDF and print it at 100% scale.",
    ],
    faqs: [
      {
        q: "Which photo dimensions should I choose for US vs European passports?",
        a: "US passports and immigrant visas require 2×2 inch (51×51 mm) square photos. UK, Schengen, and European identity documents require 35×45 mm rectangular photos.",
      },
      {
        q: "How should I print the generated sheet to guarantee correct physical sizing?",
        a: "Print on 4×6 inch photo paper with your printer dialog set to '100% scale' or 'Actual size'. Never use 'Fit to printable area' or 'Shrink to fit', as that distorts official measurements.",
      },
      {
        q: "Why does IXDocs include cutting lines on the sheet?",
        a: "Light cutting guidelines mark the exact boundaries of each photo so you can cut them cleanly with a paper trimmer or scissors without guessing edges.",
      },
      {
        q: "Does this tool automatically remove or replace the photo background?",
        a: "No. The tool accurately centers, crops, and tiles your photograph. You should capture your photo in front of a plain white or light-grey wall with neutral lighting.",
      },
      {
        q: "Is my personal photo uploaded or stored on any server?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Your facial images remain strictly on your local device.",
      },
    ],
    about: `Passport Photo Creator generates correctly dimensioned passport, visa, and identity card photographs tiled onto standard photo print sheets directly in your browser. Whether you are submitting an application for a US passport, Schengen visa, national ID card, or driver's license, you can format your portrait to meet official photographic standards.

The tool offers pre-configured dimension standards, including 2×2 inch (51×51 mm) for US passports and 35×45 mm for UK, European Schengen, and Australian passports. The portrait is centered and cropped to the exact required aspect ratio, then arranged in a printable grid with clean cutting guidelines on standard 4×6 inch (10×15 cm) photo sheets for convenient printing at home or at a local photo kiosk.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. When printing the output, always select '100% scale' or 'Actual size' in your printer dialog, as any automatic 'Fit to page' scaling will alter the physical millimeter dimensions required by immigration authorities. Be sure to use a high-resolution, front-facing portrait taken in front of an even, neutral background.`,
    related: ["document-scanner", "jpg-to-pdf", "compress-pdf", "print-ready-pdf"],
  },
  {
    slug: "document-scanner",
    name: "Document Scanner",
    metaTitle: "Document Scanner — Scan to PDF with Your Phone | IXDocs",
    metaDescription:
      "Use your phone camera to capture documents, enhance them and build a multi-page PDF. Mobile-first scanning by IXDocs.",
    short: "Scan paper into a clean multi-page PDF.",
    intro:
      "Capture pages with your camera or add existing photos, apply a scan-style enhancement and build a multi-page PDF.",
    category: "Advanced",
    icon: Camera,
    ready: true,
    notice:
      "Camera capture needs your permission and a secure connection. Automatic perspective correction is not available yet — hold the camera square to the page for the best result.",
    accept: IMAGES,
    acceptLabel: "Photos of your pages",
    multiple: true,
    options: [
      {
        key: "enhance",
        label: "Enhancement",
        type: "select",
        default: "scan",
        choices: [
          { value: "none", label: "Original photo" },
          { value: "scan", label: "Scan — brighten and sharpen contrast" },
          { value: "bw", label: "Black and white" },
        ],
      },
      {
        key: "pageSize",
        label: "Page size",
        type: "select",
        default: "a4",
        choices: PAGE_SIZE_CHOICES,
      },
    ],
    actionLabel: "Build scan PDF",
    steps: [
      "Capture pages with your camera or add photos from your device.",
      "Reorder them into reading order.",
      "Choose an enhancement style.",
      "Build the PDF and download it.",
    ],
    faqs: [
      {
        q: "How do I scan documents using my phone camera?",
        a: "Click 'Use camera' on a mobile device or tablet to take photos of your document pages one by one. The images are loaded directly into the scanner workspace.",
      },
      {
        q: "Which enhancement filter works best for receipts and contracts?",
        a: "The 'Clean scan' filter enhances contrast while preserving color elements, making it ideal for receipts. The 'Black & White' filter removes background grain and paper tint, perfect for formal text agreements.",
      },
      {
        q: "Can I combine multiple photographed pages into a single PDF?",
        a: "Yes. Take or upload multiple photos in sequence. The tool automatically orders and compiles them into a unified, multi-page PDF document.",
      },
      {
        q: "What standard page formats can I export to?",
        a: "You can choose standard A4, US Letter, or 'Fit to image' mode, which adjusts page dimensions to match the aspect ratio of your camera captures.",
      },
      {
        q: "Are my camera photos or scanned documents transmitted over the internet?",
        a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. All filtering and PDF compilation happen locally on your device.",
      },
    ],
    about: `Document Scanner turns your smartphone camera, tablet, or webcam into a portable document digitizer right inside your web browser. It is built for scanning paper receipts, printed contracts, handwritten notes, whiteboard sketches, and application forms when you do not have access to a traditional flatbed scanner.

You can snap photos page-by-page or upload pictures from your photo library. The tool applies custom image enhancement filters—including a clean scan mode that optimizes brightness and contrast, and a pure black-and-white mode that sharpens text and strips away paper shadows—before compiling all pages into a standardized A4 or Letter PDF document.

Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. For optimal scan clarity, capture documents on a flat, contrasting background with even, diffuse lighting to prevent harsh shadows across text lines. Once compiled, you can review, reorder, and download your finished multi-page PDF immediately without account registration or file storage.`,
    related: ["jpg-to-pdf", "compress-pdf", "pdf-ocr", "passport-photo"],
  },
  {
    slug: "smart-pdf-analyzer",
    name: "Smart PDF Analyzer",
    metaTitle: "Smart PDF Analyzer — Understand Any PDF | IXDocs",
    metaDescription:
      "Analyse a PDF's structure: text versus scanned pages, word counts, fonts, images and reading estimates. Free browser tool by IXDocs.",
    short: "Understand a document's structure at a glance.",
    intro:
      "See whether pages contain real text or scans, how much text there is, which fonts are embedded and where the weight sits.",
    category: "Advanced",
    icon: Sparkles,
    ready: true,
    notice:
      "This analysis is measured directly from the file structure. IXDocs does not use an AI service and never invents a summary of your document.",
    accept: PDF,
    acceptLabel: "PDF file",
    multiple: false,
    options: [],
    actionLabel: "Analyse document",
    steps: [
      "Upload the PDF.",
      "Run the analysis.",
      "Review the structure report.",
      "Follow the suggested tool for whatever you need to fix.",
    ],
    faqs: [
      {
        q: "How do you detect a scanned page?",
        a: "A page with images but almost no extractable text characters is reported as likely scanned.",
      },
      {
        q: "Does it summarise the content?",
        a: "No. Everything reported is measured from the file — IXDocs will not generate a summary it cannot verify.",
      },
    ],
    related: ["pdf-health-checker", "pdf-ocr", "compress-pdf", "pdf-metadata-cleaner"],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    metaTitle: "QR Code Generator — Create QR Codes Online Free | IXDocs",
    metaDescription:
      "Create QR codes from text or URLs online for free. Generate and download QR codes instantly in your browser with IXDocs.",
    short: "Create a QR code from any text or URL instantly.",
    intro:
      "Create a QR code from any text or URL. Generate it instantly in your browser and download it as an image.",
    category: "Convert",
    icon: QrCode,
    ready: false,
    accept: "",
    acceptLabel: "Text or URL",
    multiple: false,
    options: [],
    actionLabel: "Generate QR Code",
    steps: [
      "Enter or paste your text or URL.",
      "Click Generate QR Code to create the preview.",
      "Download the generated QR code as a PNG image.",
    ],
    faqs: [
      {
        q: "Is my text or URL uploaded to a server?",
        a: "No. The QR code is generated directly inside your browser using client-side JavaScript. Your text or URL never leaves your device.",
      },
      {
        q: "What format is the QR code saved in?",
        a: "The QR code is exported as a standard PNG image with crisp square pixels and a safe margin for easy scanning.",
      },
      {
        q: "Can any phone or scanner read this QR code?",
        a: "Yes. Standard QR codes generated here can be scanned with any smartphone camera or standard QR scanner app.",
      },
    ],
    related: ["pdf-to-png", "pdf-to-jpg", "jpg-to-pdf", "document-scanner"],
  },
];

export const TOOLS: Tool[] = ALL_TOOLS.filter((t) => t.ready !== false);

export const TOOL_MAP: Record<string, Tool> = Object.fromEntries(ALL_TOOLS.map((t) => [t.slug, t]));

export function getTool(slug: string): Tool {
  const tool = TOOL_MAP[slug];
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}

export const POPULAR_SLUGS = [
  "edit-pdf",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "compress-pdf",
  "merge-pdf",
  "split-pdf",
  "pdf-to-png",
];

export const POPULAR_TOOLS = POPULAR_SLUGS.map((s) => getTool(s)).filter((t) => t.ready !== false);

export function toolsByCategory(category: ToolCategory) {
  return TOOLS.filter((t) => t.category === category);
}

const SEARCH_ALIASES: Record<string, string[]> = {
  "edit-pdf": [
    "edit pdf",
    "editor",
    "modify pdf",
    "change text",
    "add image",
    "whiteout",
    "draw on pdf",
    "highlight",
    "edit pdf online",
    "free pdf editor",
    "edit pdf in browser",
    "add text to pdf",
    "replace pdf text",
    "move pdf objects",
    "add images to pdf",
    "draw on pdf",
    "highlight pdf",
    "whiteout pdf",
    "basic pdf editing",
  ],
  "pdf-to-text": ["extract text", "txt", "text", "copy text", "read pdf", "pdf to txt", "markdown"],
  "crop-pdf": ["crop", "trim", "margins", "cut edges", "white space", "resize page", "trim pdf"],
  "flatten-pdf": [
    "flatten",
    "acroform",
    "form fields",
    "lock",
    "read only",
    "flatten forms",
    "interactive",
  ],
  "sign-pdf": [
    "sign",
    "signature",
    "e-sign",
    "stamp",
    "initial",
    "sign document",
    "digital signature",
  ],
  "annotate-pdf": ["annotate", "highlight", "markup", "notes", "callout", "draw", "pen"],
  "add-text-to-pdf": [
    "type text",
    "add text",
    "insert text",
    "write on pdf",
    "label",
    "header",
    "footer",
  ],
  "grayscale-pdf": [
    "grayscale",
    "black and white",
    "b&w",
    "monochrome",
    "desaturate",
    "save ink",
    "printer ink",
  ],

  "compress-pdf": [
    "compress",
    "reduce",
    "smaller",
    "shrink",
    "size",
    "too big",
    "optimize",
    "optimise",
    "mb",
    "kb",
  ],
  "compress-pdf-to-target-size": [
    "compress",
    "200 kb",
    "100 kb",
    "target",
    "exact",
    "limit",
    "size",
    "under",
    "max size",
    "upload limit",
    "portal",
    "reject",
  ],
  "pdf-health-checker": [
    "compress",
    "check",
    "inspect",
    "report",
    "size",
    "diagnose",
    "inspector",
    "why is my pdf big",
    "portal",
    "reject",
    "problem",
  ],
  "application-pdf-optimizer": [
    "compress",
    "application",
    "form",
    "upload",
    "size",
    "optimize",
    "portal",
    "reject",
    "submission",
    "government",
  ],
  "jpg-to-pdf": [
    "convert",
    "image",
    "images",
    "photo",
    "picture",
    "jpeg",
    "jpg",
    "png",
    "webp",
    "screenshot",
    "receipt",
    "id card",
    "scan to pdf",
  ],
  "pdf-to-jpg": ["convert", "image", "export", "jpeg", "jpg", "picture", "pdf to image"],
  "pdf-to-png": ["convert", "image", "export", "png", "picture", "transparent", "pdf to image"],
  "pdf-to-word": [
    "convert",
    "docx",
    "doc",
    "edit",
    "word",
    "editable",
    "text",
    "markdown",
    "extract text",
  ],
  "word-to-pdf": ["convert", "docx", "doc", "word", "office", "resume", "cv"],
  "merge-pdf": ["combine", "join", "merge", "append", "one file", "grid", "receipt", "batch"],
  "split-pdf": ["separate", "divide", "cut", "split", "chapters", "pages"],
  "rotate-pdf": [
    "turn",
    "orientation",
    "sideways",
    "upside down",
    "landscape",
    "portrait",
    "rotate",
  ],
  "extract-pdf-pages": ["select", "pages", "save", "extract", "pick pages", "range", "split"],
  "delete-pdf-pages": ["remove", "pages", "delete", "erase page", "blank page"],
  "reorder-pdf-pages": [
    "rearrange",
    "order",
    "sort",
    "pages",
    "move pages",
    "organize",
    "organise",
  ],
  "watermark-pdf": ["stamp", "confidential", "draft", "watermark", "brand", "copyright"],
  "password-protect-pdf": [
    "encrypt",
    "lock",
    "secure",
    "password",
    "protect",
    "unlock",
    "security",
    "private",
  ],
  "pdf-page-numbering": ["numbers", "pagination", "footer", "page number", "header"],
  "pdf-page-size-converter": [
    "a4",
    "letter",
    "legal",
    "resize",
    "paper",
    "size",
    "page size",
    "scale",
  ],
  "print-ready-pdf": ["print", "margins", "paper", "bleed", "printer", "print ready"],
  "pdf-metadata-cleaner": [
    "privacy",
    "author",
    "metadata",
    "clean",
    "redact",
    "whiteout",
    "blackout",
    "hidden data",
    "strip",
    "anonymous",
  ],
  "pdf-ocr": [
    "scan",
    "scanned",
    "text",
    "recognition",
    "searchable",
    "ocr",
    "copy text",
    "extract text",
    "image to text",
  ],
  "passport-photo": ["id", "photo", "visa", "print", "passport", "portrait", "biometric"],
  "document-scanner": [
    "scan",
    "camera",
    "mobile",
    "photo",
    "scanner",
    "receipt",
    "id card",
    "dark mode",
    "contrast",
  ],
  "smart-pdf-analyzer": [
    "analyze",
    "analyse",
    "inspect",
    "structure",
    "report",
    "fonts",
    "images",
    "audit",
    "problem",
  ],
  "qr-code-generator": [
    "qr code generator",
    "free qr code generator",
    "qr code generator online",
    "create qr code",
    "generate qr code",
    "qr code maker",
    "url qr code generator",
    "text to qr code",
    "barcode",
    "link to qr",
  ],
};

export function searchTools(query: string, limit = 8): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);
  return TOOLS.map((tool) => {
    const aliases = SEARCH_ALIASES[tool.slug] ?? [];
    const smart = SMART_TOOL_META[tool.slug];
    const haystack = [
      tool.name,
      tool.short,
      tool.category,
      tool.slug.replace(/-/g, " "),
      smart?.problem ?? "",
      smart?.benefit ?? "",
      ...aliases,
    ]
      .join(" ")
      .toLowerCase();
    const name = tool.name.toLowerCase();
    let score = 0;
    if (name.startsWith(q)) score += 100;
    if (name.includes(q)) score += 50;
    if (aliases.some((a) => a === q)) score += 40;
    if (haystack.includes(q)) score += 20;
    if (words.length > 1 && words.every((w) => haystack.includes(w))) score += 15;
    // partial word matches: "compres" -> "compress"
    if (
      score === 0 &&
      words.every((w) => w.length >= 3 && haystack.includes(w.slice(0, Math.max(3, w.length - 1))))
    ) {
      score += 5;
    }
    return { tool, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.tool);
}

/* ------------------------------------------------------------- smart tools */

export interface SmartToolMeta {
  /** Problem-first headline, phrased the way a user would describe the issue. */
  problem: string;
  /** One-line, benefit-focused explanation of what the tool actually does. */
  benefit: string;
}

/** Specialised, problem-solving tools. Keys must be existing tool slugs. */
export const SMART_TOOL_META: Record<string, SmartToolMeta> = {
  "compress-pdf-to-target-size": {
    problem: "Need your PDF under 200 KB?",
    benefit: "Reduce a PDF towards a specific file-size limit for applications and upload portals.",
  },
  "application-pdf-optimizer": {
    problem: "Upload portal rejecting your document?",
    benefit: "Apply the page size and size cap a form asks for, then check the measured result.",
  },
  "pdf-health-checker": {
    problem: "Not sure why your PDF won't upload?",
    benefit:
      "Detect common PDF problems and identify potential compatibility issues before you submit.",
  },
  "smart-pdf-analyzer": {
    problem: "Want to know what's actually inside a file?",
    benefit: "Check size, page count and useful file information before you send a document on.",
  },
  "document-scanner": {
    problem: "Only have a phone photo of a document?",
    benefit: "Clean up and straighten document photos into a readable, shareable PDF.",
  },
  "passport-photo": {
    problem: "Need several ID photos on one sheet?",
    benefit: "Arrange copies of one photo neatly onto a printable page at a chosen size.",
  },
};

export const SMART_SLUGS = Object.keys(SMART_TOOL_META);

export const SMART_TOOLS = SMART_SLUGS.map((s) => getTool(s));

export function smartMeta(slug: string): SmartToolMeta | undefined {
  return SMART_TOOL_META[slug];
}

export const CATEGORY_ICONS: Record<ToolCategory, LucideIcon> = {
  Convert: ArrowLeftRight,
  Organize: SquareStack,
  "Edit PDF": FileCog,
  "Compress & Optimize": Gauge,
  Privacy: ShieldCheck,
  Advanced: Sparkles,
};

export const CATEGORY_BLURB: Record<ToolCategory, string> = {
  Convert: "Move documents between PDF, image and Office formats.",
  Organize: "Merge, split and rearrange pages until the document is right.",
  "Edit PDF": "Watermark, number and protect finished documents.",
  "Compress & Optimize": "Reduce size and standardise pages for uploads and printing.",
  Privacy: "Understand and clear the hidden data your files carry.",
  Advanced: "Scanning, recognition and document preparation tools.",
};

/** Tool routes are static files (e.g. /compress-pdf); this keeps Link typing happy. */
export function toolPath(slug: string) {
  return `/${slug}` as unknown as "/";
}
