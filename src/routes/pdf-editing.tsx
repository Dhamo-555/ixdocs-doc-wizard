import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Edit3, ShieldCheck, ArrowRight } from "lucide-react";
import { ToolCard } from "@/components/tool/tool-workspace";
import { getTool } from "@/lib/tools";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CANONICAL = "https://ixdocs.com/pdf-editing";

const EDITING_SLUGS = [
  "edit-pdf",
  "sign-pdf",
  "add-text-to-pdf",
  "annotate-pdf",
  "watermark-pdf",
  "pdf-page-numbering",
];

const FAQS = [
  {
    q: "Can I edit existing text in a PDF document?",
    a: "PDF files store fixed visual glyphs and position vectors rather than reflowable word processing text. Our tools allow you to overlay new text, redact or whiteout old content, add freehand drawings, and insert annotations, but they do not re-flow paragraphs like a desktop word processor.",
  },
  {
    q: "Are electronic signatures created here legally valid?",
    a: "In many jurisdictions, standard electronic signatures created by drawing or typing are legally binding for everyday commercial agreements, non-disclosure forms, and rental contracts under laws such as the US ESIGN Act and EU eIDAS regulations for basic electronic signatures.",
  },
  {
    q: "How does page numbering work with mixed document orientations?",
    a: "Our PDF Page Numbering tool allows you to place sequential numbers on headers or footers with customizable margins, font sizes, and start numbers, automatically adjusting positions across portrait and landscape pages.",
  },
  {
    q: "Are my edited documents uploaded to an external server?",
    a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. All drawing, text stamping, watermarking, and page numbering execute in client-side browser memory.",
  },
];

export const Route = createFileRoute("/pdf-editing")({
  head: () => ({
    meta: [
      { title: "PDF Editor Tools — Edit, Sign, Annotate & Watermark PDFs | IXDocs" },
      {
        name: "description",
        content:
          "Edit and annotate PDF documents directly in your browser. Add text, draw signatures, insert watermarks, number pages, and whiteout sections with no software to install.",
      },
      {
        property: "og:title",
        content: "PDF Editor Tools — Edit, Sign, Annotate & Watermark PDFs | IXDocs",
      },
      {
        property: "og:description",
        content:
          "Edit, sign, watermark, and annotate PDFs online. Free browser-based tools with zero document uploads.",
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
            { "@type": "ListItem", position: 3, name: "PDF Editing", item: CANONICAL },
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
  component: PdfEditingHub,
});

function PdfEditingHub() {
  const tools = EDITING_SLUGS.map((slug) => getTool(slug)).filter(Boolean);

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
            PDF Editing
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          <Edit3 className="size-3.5 text-primary" aria-hidden="true" />
          <span>Category Hub</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">PDF Editing & Annotation Tools</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Fill forms, sign agreements, add notes, and protect your intellectual property without
          installing heavy desktop applications. Our browser-based editing suite allows you to
          markup, stamp, and modify PDF documents securely in client memory with zero server
          uploads.
        </p>
      </header>

      {/* Tool Grid */}
      <section aria-labelledby="category-tools" className="mt-10">
        <h2 id="category-tools" className="text-xl font-bold">
          Available Editing Tools ({tools.length})
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Supporting Guidance */}
      <section aria-labelledby="editing-architecture" className="prose-ixdocs mt-12 max-w-3xl">
        <h2 id="editing-architecture" className="text-2xl font-bold">
          How PDF Editing Operates in Your Browser
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          PDF documents were originally engineered as a digital printing format, which means content
          is locked into absolute coordinate positions. Understanding how our client-side tools
          handle modifications helps you achieve the cleanest results:
        </p>

        <h3 className="mt-6 text-lg font-bold">Filling Forms & Adding Text</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Many PDF forms lack interactive form fields. With <em>Edit PDF</em> and{" "}
          <em>Add Text to PDF</em>, you can click anywhere on the page to insert custom typography,
          adjust font sizing, select text colors, and align responses accurately over printed form
          lines.
        </p>

        <h3 className="mt-6 text-lg font-bold">Signing Agreements</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Our <em>Sign PDF</em> tool provides an intuitive canvas for drawing your signature with a
          mouse, trackpad, or finger on touchscreen devices. You can also type your name in cursive
          script or upload a transparent signature image. Signatures are embedded directly into the
          page layer without leaving any temporary artifacts on external servers.
        </p>

        <h3 className="mt-6 text-lg font-bold">Watermarking & Page Numbers</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Protect draft documents with diagonal or horizontal text watermarks using{" "}
          <em>Watermark PDF</em>, or prepare multi-part submissions for legal discovery and academic
          defense with standardized Bates or sequential numbering via
          <em>PDF Page Numbering</em>.
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
