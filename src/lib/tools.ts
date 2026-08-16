import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Camera,
  Combine,
  FileArchive,
  FileCheck2,
  FileCog,
  FileImage,
  FileScan,
  FileSearch,
  FileText,
  FileType2,
  Gauge,
  Hash,
  IdCard,
  Image as ImageIcon,
  ListOrdered,
  Lock,
  Printer,
  RotateCw,
  Scissors,
  ShieldCheck,
  Sparkles,
  SquareStack,
  Trash2,
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
        q: "How many images can I add?",
        a: "There is no fixed limit, but very large batches depend on your device's memory because the PDF is built in your browser. Around 50 photos works comfortably on most phones.",
      },
      {
        q: "Will image quality drop?",
        a: "JPG and PNG images are embedded as-is, so no re-compression happens. WebP images are re-encoded to JPEG because PDF has no native WebP support.",
      },
    ],
    related: ["pdf-to-jpg", "merge-pdf", "compress-pdf", "print-ready-pdf"],
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
        q: "Are the images downloaded as a ZIP?",
        a: "No. Each page is offered as a separate JPG download so you keep full control, and there is no archive library to load.",
      },
      {
        q: "Why do large PDFs take a while?",
        a: "Each page is rendered on your device. Higher resolutions mean more pixels, so print-quality exports of long documents take longer.",
      },
    ],
    related: ["pdf-to-png", "jpg-to-pdf", "compress-pdf", "extract-pdf-pages"],
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
        q: "PNG or JPG — which should I pick?",
        a: "PNG is lossless and better for text, line art and screenshots. JPG produces much smaller files for photographic pages.",
      },
      {
        q: "Do PNGs keep transparency?",
        a: "Pages are rendered on a white background, matching how the PDF prints.",
      },
    ],
    related: ["pdf-to-jpg", "jpg-to-pdf", "pdf-page-size-converter", "compress-pdf"],
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
        q: "Is the tool available today?",
        a: "The interface is live, but the conversion engine is still being connected. IXDocs never returns a file that was not genuinely processed.",
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
        a: "Batch conversion is planned for a later release of IXDocs.",
      },
    ],
    related: ["pdf-to-word", "compress-pdf", "print-ready-pdf", "merge-pdf"],
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
        q: "Is the page order preserved?",
        a: "Yes. Files are appended in the order shown in the list, with every page kept intact.",
      },
      {
        q: "Can I merge a password-protected PDF?",
        a: "Encrypted PDFs must be unlocked first — the browser cannot read their pages while they are protected.",
      },
    ],
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
        q: "How do I write ranges?",
        a: "Use comma-separated ranges such as 1-3, 5, 9-12. Each range becomes its own PDF.",
      },
      {
        q: "Does splitting change quality?",
        a: "No. Pages are copied without re-encoding, so the content is identical to the original.",
      },
    ],
    related: ["merge-pdf", "extract-pdf-pages", "delete-pdf-pages", "reorder-pdf-pages"],
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
        q: "Is the rotation permanent?",
        a: "Yes. The page rotation is written into the PDF, so every viewer shows the corrected orientation.",
      },
      {
        q: "Can different pages rotate differently?",
        a: "Yes — select one group of pages, rotate and download, then run the result through again for the rest.",
      },
    ],
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

  /* --------------------------------------------------------------- Edit PDF */
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
        q: "Can I use an image watermark?",
        a: "Text watermarks are supported today. Image watermarks are on the IXDocs roadmap.",
      },
      {
        q: "Can the watermark be removed later?",
        a: "It is drawn into the page content, so it cannot be toggled off — keep an unwatermarked copy of your original.",
      },
    ],
    related: ["pdf-page-numbering", "password-protect-pdf", "pdf-metadata-cleaner", "compress-pdf"],
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
        a: "Text-only PDFs are already compact. The biggest savings come from scans and documents full of photographs.",
      },
      {
        q: "Does compression lose quality?",
        a: "Levels other than Structure only re-encode pages as images, so there is some quality loss. Start with Balanced and step up if you need more.",
      },
    ],
    related: [
      "compress-pdf-to-target-size",
      "pdf-health-checker",
      "pdf-page-size-converter",
      "merge-pdf",
    ],
    popular: true,
  },
  {
    slug: "compress-pdf-to-target-size",
    name: "Compress PDF to Target Size",
    metaTitle: "Compress PDF to 100 KB, 200 KB or 500 KB | IXDocs",
    metaDescription:
      "Compress a PDF towards an exact target size such as 100 KB, 200 KB, 500 KB or a custom limit. IXDocs reports the real result honestly.",
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
        q: "Can you always reach the target?",
        a: "No, and we will say so. A 40-page colour scan cannot become 100 KB while staying readable, so you get the closest usable result with an explanation.",
      },
      {
        q: "Which target should I choose for an application form?",
        a: "Use exactly the limit stated in the form's instructions. If it lists a range, aim slightly below the maximum.",
      },
    ],
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
    ready: false,
    notice: "This tool is currently unavailable. Please try one of our available tools.",
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
        q: "What makes OCR accurate?",
        a: "A straight, well-lit scan at 300 dpi or higher. Skewed or blurry pages reduce accuracy in every OCR engine.",
      },
      {
        q: "Can I use it on a photo of a page?",
        a: "Scan it with the Document Scanner first to straighten and enhance the image, then run OCR on the resulting PDF.",
      },
    ],
    related: ["document-scanner", "pdf-to-word", "smart-pdf-analyzer", "compress-pdf"],
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
        q: "Does IXDocs remove the background?",
        a: "No. Automatic background replacement is not offered, because a poor cut-out is the most common reason an ID photo is rejected.",
      },
      {
        q: "How do I print it correctly?",
        a: "Print at 100% or 'actual size'. Any scaling changes the physical dimensions and can make the photos invalid.",
      },
    ],
    related: ["document-scanner", "jpg-to-pdf", "application-pdf-optimizer", "print-ready-pdf"],
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
        q: "Why can I not open the camera?",
        a: "Browsers only allow camera access over a secure connection and after you grant permission. On desktop, adding photos from disk works the same way.",
      },
      {
        q: "How do I get a sharper scan?",
        a: "Use even lighting, place the page on a contrasting surface and hold the phone parallel to the paper.",
      },
    ],
    related: ["jpg-to-pdf", "pdf-ocr", "compress-pdf", "passport-photo"],
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
];

export const TOOLS: Tool[] = ALL_TOOLS.filter((t) => t.ready !== false);

export const TOOL_MAP: Record<string, Tool> = Object.fromEntries(ALL_TOOLS.map((t) => [t.slug, t]));

export function getTool(slug: string): Tool {
  const tool = TOOL_MAP[slug];
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}

export const POPULAR_SLUGS = [
  "compress-pdf",
  "merge-pdf",
  "split-pdf",
  "pdf-to-word",
  "word-to-pdf",
  "pdf-to-jpg",
  "pdf-to-png",
  "rotate-pdf",
];

export const POPULAR_TOOLS = POPULAR_SLUGS.map((s) => getTool(s)).filter((t) => t.ready !== false);

export function toolsByCategory(category: ToolCategory) {
  return TOOLS.filter((t) => t.category === category);
}

const SEARCH_ALIASES: Record<string, string[]> = {
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
