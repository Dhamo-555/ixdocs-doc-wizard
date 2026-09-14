import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, RefreshCw, FileText, ArrowRight } from "lucide-react";
import { ToolCard } from "@/components/tool/tool-workspace";
import { getTool } from "@/lib/tools";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CANONICAL = "https://ixdocs.com/pdf-conversion";

const CONVERSION_SLUGS = ["jpg-to-pdf", "pdf-to-jpg", "pdf-to-png", "pdf-to-text", "pdf-ocr"];

const FAQS = [
  {
    q: "How does browser-based PDF conversion work without uploads?",
    a: "Our conversion tools leverage HTML5 Canvas, WebAssembly, and PDF-Lib directly in your browser. Files are decoded into memory, converted, and re-encoded locally. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing.",
  },
  {
    q: "What is the difference between PDF to Text and PDF OCR?",
    a: "PDF to Text extracts digital text streams already embedded within native electronic PDFs. If your PDF is a flat scan or photograph of paper, it contains only pixels; PDF OCR analyzes those pixels with an optical character recognition engine to identify and reconstruct characters.",
  },
  {
    q: "Will converting JPG or PNG images to PDF degrade their quality?",
    a: "No. Standard JPG and PNG images are embedded into the PDF structure at their native pixel resolution without re-compression, preserving the exact visual clarity of your original photos.",
  },
  {
    q: "Can I convert multi-page documents all at once?",
    a: "Yes. In JPG to PDF, you can combine dozens of images into a single sequential PDF. In PDF to JPG and PDF to PNG, you can preview all pages and download them individually or as a batch.",
  },
];

export const Route = createFileRoute("/pdf-conversion")({
  head: () => ({
    meta: [
      { title: "PDF Conversion Tools — Convert To & From PDF Online | IXDocs" },
      {
        name: "description",
        content:
          "Convert images, documents, and text to and from PDF directly in your browser. JPG to PDF, PDF to JPG, PDF to PNG, and PDF text extraction — free, private, no file uploads.",
      },
      {
        property: "og:title",
        content: "PDF Conversion Tools — Convert To & From PDF Online | IXDocs",
      },
      {
        property: "og:description",
        content:
          "Convert images, pages, and text to and from PDF in your web browser. Free, fast, and completely client-side.",
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
            { "@type": "ListItem", position: 3, name: "PDF Conversion", item: CANONICAL },
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
  component: PdfConversionHub,
});

function PdfConversionHub() {
  const tools = CONVERSION_SLUGS.map((slug) => getTool(slug)).filter(Boolean);

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
            PDF Conversion
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          <RefreshCw className="size-3.5 text-primary" aria-hidden="true" />
          <span>Category Hub</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">PDF Conversion Tools</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Transform documents between standard image formats, text files, and universal PDF files.
          Whether you are compiling photo receipts into an official submission, extracting
          high-resolution page graphics for a presentation, or pulling selectable text out of
          scanned records, our tools run instantly inside your browser.
        </p>
      </header>

      {/* Tool Grid */}
      <section aria-labelledby="category-tools" className="mt-10">
        <h2 id="category-tools" className="text-xl font-bold">
          Available Conversion Tools ({tools.length})
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Supporting Guidance */}
      <section aria-labelledby="conversion-architecture" className="prose-ixdocs mt-12 max-w-3xl">
        <h2 id="conversion-architecture" className="text-2xl font-bold">
          Converting Between Images, Text & PDFs
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          PDF is a fixed-layout document container capable of holding vector fonts, geometric paths,
          and raster bitmaps. Converting to or from PDF requires choosing the right method for your
          content:
        </p>

        <h3 className="mt-6 text-lg font-bold">Images to PDF</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Our <em>JPG to PDF</em> tool takes one or more image files (JPG, PNG, WebP) and packages
          them into standardized pages (A4, US Letter, or auto-fit). Because standard JPG and PNG
          streams are embedded losslessly into the PDF container, there is zero compression
          degradation. This is ideal for identity documents, certificates, and photo evidence.
        </p>

        <h3 className="mt-6 text-lg font-bold">PDF to High-Resolution Images</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          When you need to insert a PDF figure into a slide deck or upload a document preview to a
          web portal, our
          <em>PDF to JPG</em> and <em>PDF to PNG</em> tools render the vector pages at your choice
          of 72 DPI (web), 144 DPI (screens), or 216 DPI (print) using browser canvas rendering.
        </p>

        <h3 className="mt-6 text-lg font-bold">
          Extracting Text vs Optical Character Recognition (OCR)
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If your document was generated electronically (from Word, Google Docs, or a code export),
          use <em>PDF to Text</em>
          to copy raw text streams instantly. If the document originated as a paper scan or photo,
          use <em>PDF OCR</em>
          to recognize letter shapes using client-side Tesseract.js WebAssembly without sending
          sensitive documents to external servers.
        </p>
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
