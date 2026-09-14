import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, FileArchive, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { ToolCard } from "@/components/tool/tool-workspace";
import { getTool } from "@/lib/tools";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CANONICAL = "https://ixdocs.com/pdf-compression";

const COMPRESSION_SLUGS = [
  "compress-pdf",
  "compress-pdf-to-target-size",
  "pdf-health-checker",
  "pdf-page-size-converter",
  "print-ready-pdf",
  "grayscale-pdf",
  "application-pdf-optimizer",
];

const FAQS = [
  {
    q: "How does browser-based PDF compression work?",
    a: "Our compression tools re-render pages and downsample embedded raster images using client-side HTML5 canvas and WebAssembly engines. Your document files are processed directly in your device's memory and are never uploaded to an IXDocs server.",
  },
  {
    q: "What is the difference between standard compression and target-size compression?",
    a: "Standard compression lets you choose a preset quality level (Low, Medium, or High) to reduce file size across the board. Target-size compression iteratively fine-tunes image downsampling to approach an exact file size limit, such as 100 KB, 200 KB, or 1 MB for portal uploads.",
  },
  {
    q: "Why do some text-only PDFs barely shrink?",
    a: "Documents containing only selectable vector text and standard fonts are already extremely compact. Compression primarily saves bytes by downsampling photographs and scanned paper bitmaps. For text documents, stripping unneeded metadata or removing redundant pages is more effective.",
  },
  {
    q: "Will compression affect barcode or signature legibility?",
    a: "Low and Medium compression preserve crisp lines and legible barcodes. If you apply aggressive target-size compression to meet small thresholds, check fine details like QR codes, passport photos, and small signatures before final submission.",
  },
];

export const Route = createFileRoute("/pdf-compression")({
  head: () => ({
    meta: [
      { title: "PDF Compression Tools — Reduce PDF File Size Online | IXDocs" },
      {
        name: "description",
        content:
          "Free online PDF compression and optimization tools. Reduce PDF file sizes, downsample images, target exact file sizes (100KB, 200KB, 500KB), and optimize PDFs in your browser without uploads.",
      },
      {
        property: "og:title",
        content: "PDF Compression Tools — Reduce PDF File Size Online | IXDocs",
      },
      {
        property: "og:description",
        content:
          "Reduce PDF file sizes directly in your browser. Downsample images, target exact size limits, and optimize documents for email and web forms.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:image", content: "https://ixdocs.com/ixdocs-og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://ixdocs.com/" },
            { "@type": "ListItem", position: 2, name: "Tools", item: "https://ixdocs.com/tools" },
            { "@type": "ListItem", position: 3, name: "PDF Compression", item: CANONICAL },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: PdfCompressionHub,
});

function PdfCompressionHub() {
  const tools = COMPRESSION_SLUGS.map((slug) => getTool(slug)).filter(Boolean);

  return (
    <div className="container-page py-10 sm:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
          <li>
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li>
            <Link to="/tools" className="hover:text-foreground">
              Tools
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li className="font-medium text-foreground" aria-current="page">
            PDF Compression
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          <FileArchive className="size-3.5 text-primary" aria-hidden="true" />
          <span>Category Hub</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
          PDF Compression & Optimization Tools
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Large PDF files cause failed email deliveries, rejected job applications, and sluggish web
          downloads. Our browser-based PDF compression suite allows you to shrink document sizes,
          downsample heavy embedded images, and hit strict submission ceilings—all without uploading
          your sensitive records to remote cloud servers.
        </p>
      </header>

      {/* Tool Grid */}
      <section aria-labelledby="category-tools" className="mt-10">
        <h2 id="category-tools" className="text-xl font-bold">
          Available Compression Tools ({tools.length})
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Educational Guide Callout */}
      <section
        aria-labelledby="authority-guide"
        className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Educational Resource
            </span>
            <h3 id="authority-guide" className="mt-1 text-lg font-bold sm:text-xl">
              Understand How PDF File Size & Compression Work
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Learn why some PDFs compress by 80% while others barely shrink, how raster
              downsampling differs from stream compression, and what DPI settings to choose for
              email, screens, and professional print.
            </p>
          </div>
          <Link
            to="/pdf-compression-guide"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <span>Read the Guide</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Supporting Guidance */}
      <section aria-labelledby="how-compression-works" className="prose-ixdocs mt-12 max-w-3xl">
        <h2 id="how-compression-works" className="text-2xl font-bold">
          How Browser-Based PDF Compression Works
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Traditional online PDF compressors require uploading your confidential PDFs to a
          third-party server where they are processed and stored temporarily. IXDocs takes a
          privacy-first approach: your files are processed directly in your browser and are not
          uploaded to an IXDocs server for processing.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          PDF documents typically grow large due to high-resolution photographs, multi-page scanner
          bitmaps, and embedded raster assets. When you run standard compression on IXDocs, our
          client-side engine re-renders the visual pages at a controlled resolution (DPI) and
          recompresses the underlying image data with tuned JPEG encoding. Text streams, structural
          page trees, and standard fonts remain intact.
        </p>

        <h3 className="mt-6 text-lg font-bold">Choosing the Right Compression Strategy</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">General sharing:</strong> Use <em>Compress PDF</em>{" "}
            with Medium compression to halve typical report sizes while maintaining sharp
            readability.
          </li>
          <li>
            <strong className="text-foreground">Strict application portals:</strong> Use{" "}
            <em>Compress PDF to Target Size</em> when an official form mandates a specific ceiling
            such as 100 KB, 200 KB, or 500 KB.
          </li>
          <li>
            <strong className="text-foreground">Official printing:</strong> Use{" "}
            <em>Print Ready PDF</em> to enforce standard 300 DPI resolution and trim margins without
            over-compressing.
          </li>
        </ul>
      </section>

      {/* Category FAQs */}
      <section aria-labelledby="faq-heading" className="mt-12 max-w-3xl">
        <h2 id="faq-heading" className="text-2xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold sm:text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
