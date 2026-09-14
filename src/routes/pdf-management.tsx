import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Layers, ShieldCheck, ArrowRight } from "lucide-react";
import { ToolCard } from "@/components/tool/tool-workspace";
import { getTool } from "@/lib/tools";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CANONICAL = "https://ixdocs.com/pdf-management";

const MANAGEMENT_SLUGS = [
  "merge-pdf",
  "split-pdf",
  "rotate-pdf",
  "extract-pdf-pages",
  "delete-pdf-pages",
  "reorder-pdf-pages",
  "crop-pdf",
  "flatten-pdf",
];

const FAQS = [
  {
    q: "Does rearranging, merging, or splitting pages reduce document quality?",
    a: "No. Our management tools manipulate PDF document trees losslessly using client-side PDF-Lib. Pages, vector fonts, and embedded images are extracted and assembled directly without rasterization or re-compression.",
  },
  {
    q: "Can I manage password-protected PDF documents?",
    a: "No. You must remove password protection or decryption locks prior to merging, splitting, or rearranging pages, as client-side tools cannot read encrypted internal streams without authorization.",
  },
  {
    q: "How does Crop PDF differ from Page Size Converter?",
    a: "Crop PDF trims outer margins or focuses on specific page regions by modifying the document's visible CropBox and MediaBox coordinates. Page Size Converter rescales the entire document canvas to standard paper dimensions like A4 or US Letter.",
  },
  {
    q: "Are my files uploaded to a remote server when I organize pages?",
    a: "No. Your files are processed directly in your browser and are not uploaded to an IXDocs server for processing. Your legal contracts, tax records, and personal documents never leave your computer or phone.",
  },
];

export const Route = createFileRoute("/pdf-management")({
  head: () => ({
    meta: [
      { title: "PDF Management Tools — Merge, Split, Rotate & Organize Pages | IXDocs" },
      {
        name: "description",
        content:
          "Organize, combine, divide, and manage PDF pages in your browser. Merge multiple files, split by page ranges, rotate orientations, crop margins, and reorder pages without uploads.",
      },
      {
        property: "og:title",
        content: "PDF Management Tools — Merge, Split, Rotate & Organize Pages | IXDocs",
      },
      {
        property: "og:description",
        content:
          "Merge, split, rotate, crop, and reorder PDF pages directly in your browser. Fast, private, client-side document management.",
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
            { "@type": "ListItem", position: 3, name: "PDF Management", item: CANONICAL },
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
  component: PdfManagementHub,
});

function PdfManagementHub() {
  const tools = MANAGEMENT_SLUGS.map((slug) => getTool(slug)).filter(Boolean);

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
            PDF Management
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          <Layers className="size-3.5 text-primary" aria-hidden="true" />
          <span>Category Hub</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
          PDF Management & Page Organization Tools
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Take complete control of document page flow, sequence, and structure. Whether you need to
          merge multiple reports into a single filing, divide a large manual into chapter files,
          rotate inverted scan pages, or trim unwanted white margins, our browser tools organize
          your files quickly and losslessly.
        </p>
      </header>

      {/* Tool Grid */}
      <section aria-labelledby="category-tools" className="mt-10">
        <h2 id="category-tools" className="text-xl font-bold">
          Available Management Tools ({tools.length})
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Supporting Guidance */}
      <section aria-labelledby="management-architecture" className="prose-ixdocs mt-12 max-w-3xl">
        <h2 id="management-architecture" className="text-2xl font-bold">
          Lossless Page Reorganization in the Browser
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          When dealing with sensitive legal discovery documents, financial audits, or academic
          papers, preserving the original digital fidelity of text fonts and vector lines is
          critical. Our page management tools operate directly on the document object model:
        </p>

        <h3 className="mt-6 text-lg font-bold">Combining & Dividing Documents</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Use <em>Merge PDF</em> to combine separate documents into one sequential presentation, or
          use <em>Split PDF</em>
          and <em>Extract PDF Pages</em> to isolate specific contract sections or invoice numbers.
          Because pages are copied as raw streams, there is zero generational quality loss.
        </p>

        <h3 className="mt-6 text-lg font-bold">Orientation & Visual Layout</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Inverted or sideways pages from desktop scanners can be corrected with <em>Rotate PDF</em>
          , while <em>Crop PDF</em>
          allows you to trim wide margins or frame content accurately. If you need to rearrange the
          flow of a multi-page binder, <em>Reorder PDF Pages</em> provides an interactive
          drag-and-drop thumbnail grid.
        </p>

        <h3 className="mt-6 text-lg font-bold">Flattening for Universal Compatibility</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Interactive form fields and dynamic annotations sometimes fail to display or print
          properly on older hardware or strict court filing systems. Use <em>Flatten PDF</em> to
          bake form entries and visual stamps permanently into the page canvas, ensuring identical
          rendering on any device.
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
