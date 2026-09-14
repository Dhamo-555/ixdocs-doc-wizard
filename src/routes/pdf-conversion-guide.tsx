import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

const CANONICAL = "https://ixdocs.com/pdf-conversion-guide";

export const Route = createFileRoute("/pdf-conversion-guide")({
  head: () => ({
    meta: [
      {
        title: "PDF Conversion & Image Quality Guide — DPI, Formats & Text Extraction | IXDocs",
      },
      {
        name: "description",
        content:
          "A complete technical guide to PDF conversion. Learn about raster vs vector rendering, DPI selection (72, 150, 300), image compression, and client-side OCR text extraction.",
      },
      {
        property: "og:title",
        content: "PDF Conversion & Image Quality Guide | IXDocs",
      },
      {
        property: "og:description",
        content:
          "Understand raster vs vector graphics, DPI resolution benchmarks, image compression formats, and how client-side OCR extraction works.",
      },
      { property: "og:type", content: "article" },
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
            {
              "@type": "ListItem",
              position: 2,
              name: "PDF Conversion",
              item: "https://ixdocs.com/pdf-conversion",
            },
            { "@type": "ListItem", position: 3, name: "Conversion Guide", item: CANONICAL },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "The Complete Technical Guide to PDF Conversion & Image Quality",
          description:
            "A comprehensive guide exploring PDF rasterization, vector preservation, DPI resolution selection, image compression, and client-side OCR text extraction.",
          author: {
            "@type": "Organization",
            name: "IXDocs",
            url: "https://ixdocs.com",
          },
          publisher: {
            "@type": "Organization",
            name: "IXDocs",
            url: "https://ixdocs.com",
            logo: {
              "@type": "ImageObject",
              url: "https://ixdocs.com/ixdocs-og-image.png",
            },
          },
          mainEntityOfPage: CANONICAL,
        }),
      },
    ],
  }),
  component: PdfConversionGuidePage,
});

function PdfConversionGuidePage() {
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
            <Link to="/pdf-conversion" className="hover:text-foreground">
              PDF Conversion
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li className="font-medium text-foreground" aria-current="page">
            Conversion Guide
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <article className="prose-ixdocs mx-auto max-w-3xl">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            <FileText className="size-3.5 text-primary" aria-hidden="true" />
            <span>Technical Authority Guide</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            The Complete Technical Guide to PDF Conversion & Image Quality
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Converting documents between PDF and image formats involves complex trade-offs between
            visual sharpness, file size, vector fidelity, and computational memory. Whether you are
            extracting pages into high-resolution JPGs, assembling phone camera photos into a formal
            PDF, or running client-side OCR on scanned invoices, understanding document architecture
            ensures you choose the optimal resolution and format for every workflow.
          </p>
        </header>

        <hr className="my-8 border-border" />

        {/* Section 1 */}
        <section aria-labelledby="vector-vs-raster">
          <h2 id="vector-vs-raster" className="text-2xl font-bold">
            1. Vector vs. Raster: The Core Architectural Difference
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every digital document represents graphics and typography in one of two fundamentally
            different ways:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
                <Layers className="size-4 text-primary" aria-hidden="true" />
                <span>Vector Typography & Linework</span>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                In standard PDFs generated from Word, LaTeX, or InDesign, text and drawings are
                defined as mathematical Bézier curves, font outlines, and vector paths. They scale
                infinitely with zero loss of sharpness and occupy minimal file space. When you zoom
                in 800% on vector text, edges remain razor-sharp.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
                <ImageIcon className="size-4 text-emerald-500" aria-hidden="true" />
                <span>Raster Bitmaps (Pixels)</span>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Formats like JPG and PNG represent content as a fixed grid of colored pixels. When a
                PDF page is converted to an image, its vector text is permanently rasterized
                (flattened into pixels). Once rasterized, zooming past 100% reveals pixelation, and
                individual characters can no longer be selected, copied, or searched without OCR.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Understanding this distinction explains why converting a 10-page text PDF into images
            can turn a 200 KB document into a 15 MB image collection, and why converting images back
            into a PDF does not automatically make the text selectable.
          </p>
        </section>

        {/* Section 2 */}
        <section aria-labelledby="dpi-resolution-standards" className="mt-10">
          <h2 id="dpi-resolution-standards" className="text-2xl font-bold">
            2. Resolution Standards: Choosing 72, 150, or 300 DPI
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            DPI (Dots Per Inch) determines the pixel density used during document rasterization.
            Because pixel counts scale quadratically (doubling DPI quadruples total pixels and
            memory consumption), selecting the proper resolution benchmark is vital:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="p-3 font-semibold text-foreground">Target Resolution</th>
                  <th className="p-3 font-semibold text-foreground">A4 Pixel Dimensions</th>
                  <th className="p-3 font-semibold text-foreground">Typical File Size</th>
                  <th className="p-3 font-semibold text-foreground">Optimal Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                <tr>
                  <td className="p-3 font-medium text-foreground">72 – 96 DPI</td>
                  <td className="p-3">595 × 842 px</td>
                  <td className="p-3">80 – 200 KB</td>
                  <td className="p-3">
                    Fast web page embedding, lightweight email previews, quick mobile viewing.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">150 DPI</td>
                  <td className="p-3">1240 × 1754 px</td>
                  <td className="p-3">300 – 800 KB</td>
                  <td className="p-3">
                    Digital archiving, office distribution, crisp reading on Retina and 4K displays.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">300 DPI</td>
                  <td className="p-3">2480 × 3508 px</td>
                  <td className="p-3">1.5 – 5 MB</td>
                  <td className="p-3">
                    Commercial printing, passport photo production, legal filings, and OCR input.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            For document OCR and passport photos, 300 DPI is the recommended standard because
            character recognition engines require at least 20 to 30 pixels per lowercase character
            height for reliable neural classification.
          </p>
        </section>

        {/* Section 3 */}
        <section aria-labelledby="image-formats" className="mt-10">
          <h2 id="image-formats" className="text-2xl font-bold">
            3. Image Formats in PDF: JPEG, PNG & WebP Encoding
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            When converting images into PDF or extracting pages into image files, format selection
            directly impacts visual clarity and storage efficiency:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">JPEG (Lossy):</strong> Best for continuous-tone
              photographs, camera scans, and shaded graphics. JPEG uses discrete cosine transforms
              (DCT) to compress smooth color variations efficiently, shrinking photo weights by 80%
              while preserving natural color fidelity.
            </li>
            <li>
              <strong className="text-foreground">PNG (Lossless):</strong> Ideal for technical
              diagrams, financial charts, screenshots, and line art. PNG uses Flate/Deflate
              compression to preserve exact pixel values with zero compression artifacts, ensuring
              fine text edges and barcode lines remain perfectly crisp.
            </li>
            <li>
              <strong className="text-foreground">WebP (Modern Hybrid):</strong> Offers superior
              compression ratios for both photographic and graphic content on the modern web,
              reducing file sizes by 25% to 35% compared to equivalent JPEG images.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section aria-labelledby="ocr-fundamentals" className="mt-10">
          <h2 id="ocr-fundamentals" className="text-2xl font-bold">
            4. Optical Character Recognition (OCR) & Text Extraction
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            When a document consists of flat scanned images, search engines and screen readers
            cannot read the content. Optical Character Recognition (OCR) bridges this gap by
            analyzing pixel patterns to identify letterforms, words, and paragraph structures.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Modern browser-based OCR (powered by WebAssembly engines like Tesseract.js) executes
            neural network character recognition locally on your device. To maximize OCR accuracy:
          </p>
          <div className="mt-4 rounded-xl border border-border bg-surface p-5 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="size-4 shrink-0 text-emerald-500 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Resolution Matters:</strong> Provide input
                images scanned at 200 to 300 DPI. Blurry, low-resolution 72 DPI mobile photos cause
                significantly higher character error rates.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="size-4 shrink-0 text-emerald-500 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Straighten & Orient:</strong> Skewed pages or
                upside-down orientations degrade line-segmentation algorithms. Use Rotate PDF before
                running OCR.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="size-4 shrink-0 text-emerald-500 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">High Contrast:</strong> Clean black-and-white or
                grayscale contrast separates dark letter stems from background paper noise cleanly.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section aria-labelledby="privacy-and-memory" className="mt-10">
          <h2 id="privacy-and-memory" className="text-2xl font-bold">
            5. Client-Side Processing, Browser Memory & Privacy
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Historically, document conversion required transmitting sensitive files across the
            internet to third-party server farms where proprietary software rendered and returned
            the converted assets. This legacy approach introduced severe confidentiality concerns
            for medical records, tax returns, and legal contracts.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            IXDocs utilizes HTML5 Canvas, WebAssembly, and modern browser memory sandboxing to
            execute image-to-PDF compilation, raster extraction, and OCR text recognition entirely
            within your local browser session. Because modern 64-bit web browsers allocate isolated
            memory heaps, documents up to 100 MB can be rendered, converted, and downloaded locally
            with zero latency, zero server bandwidth consumption, and complete data sovereignty.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
            <ShieldCheck className="size-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
            <p>
              <strong className="text-foreground">The IXDocs Privacy Standard:</strong> Your files
              are processed directly in your browser and are not uploaded to an IXDocs server for
              processing. No accounts, tracking cookies, or file retention policies apply because no
              document data ever leaves your device.
            </p>
          </div>
        </section>

        {/* Related Tools */}
        <section aria-labelledby="conversion-tools-nav" className="mt-12">
          <h2 id="conversion-tools-nav" className="text-xl font-bold">
            Recommended PDF Conversion Tools
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              to="/jpg-to-pdf"
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/50"
            >
              <div>
                <h3 className="text-sm font-semibold text-foreground">JPG to PDF</h3>
                <p className="text-xs text-muted-foreground">
                  Combine JPG, PNG, and WebP images into a clean PDF.
                </p>
              </div>
              <ArrowRight className="size-4 text-primary shrink-0" aria-hidden="true" />
            </Link>
            <Link
              to="/pdf-to-jpg"
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/50"
            >
              <div>
                <h3 className="text-sm font-semibold text-foreground">PDF to JPG</h3>
                <p className="text-xs text-muted-foreground">
                  Extract high-resolution JPG images from PDF pages.
                </p>
              </div>
              <ArrowRight className="size-4 text-primary shrink-0" aria-hidden="true" />
            </Link>
            <Link
              to="/pdf-to-png"
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/50"
            >
              <div>
                <h3 className="text-sm font-semibold text-foreground">PDF to PNG</h3>
                <p className="text-xs text-muted-foreground">
                  Convert PDF pages to lossless PNG graphics.
                </p>
              </div>
              <ArrowRight className="size-4 text-primary shrink-0" aria-hidden="true" />
            </Link>
            <Link
              to="/pdf-ocr"
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/50"
            >
              <div>
                <h3 className="text-sm font-semibold text-foreground">PDF OCR</h3>
                <p className="text-xs text-muted-foreground">
                  Recognize text in scanned PDFs using client-side OCR.
                </p>
              </div>
              <ArrowRight className="size-4 text-primary shrink-0" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/pdf-conversion"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <span>Browse all tools in the PDF Conversion Category Hub</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
