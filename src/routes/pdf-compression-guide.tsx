import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const CANONICAL = "https://ixdocs.com/pdf-compression-guide";

export const Route = createFileRoute("/pdf-compression-guide")({
  head: () => ({
    meta: [
      { title: "PDF Compression & File Size Guide — How Compression Works | IXDocs" },
      {
        name: "description",
        content:
          "A complete technical guide to PDF file size and compression. Learn about raster downsampling, vector preservation, Flate streams, DPI standards, and portal size limits.",
      },
      { property: "og:title", content: "PDF Compression & File Size Guide | IXDocs" },
      {
        property: "og:description",
        content:
          "Understand why PDFs get large, how raster downsampling works, and how to reduce document size without sacrificing text clarity.",
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
              name: "PDF Compression",
              item: "https://ixdocs.com/pdf-compression",
            },
            { "@type": "ListItem", position: 3, name: "Compression Guide", item: CANONICAL },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "The Complete Technical Guide to PDF File Size & Compression",
          description:
            "A comprehensive guide exploring the mechanisms of PDF file size reduction, raster downsampling, vector font preservation, and DPI selection.",
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
  component: PdfCompressionGuidePage,
});

function PdfCompressionGuidePage() {
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
            <Link to="/pdf-compression" className="hover:text-foreground">
              PDF Compression
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li className="font-medium text-foreground" aria-current="page">
            Compression Guide
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
            The Complete Technical Guide to PDF File Size & Compression
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            PDF documents are universally accepted because they guarantee identical visual
            presentation across every operating system and display. However, that portability often
            comes at the cost of unexpectedly bloated file sizes. This guide explains the internal
            architecture of PDF files, how compression algorithms operate, and how to optimize
            documents for email attachments and portal upload limits without degrading readability.
          </p>
        </header>

        <hr className="my-8 border-border" />

        {/* Section 1 */}
        <section aria-labelledby="anatomy-of-pdf">
          <h2 id="anatomy-of-pdf" className="text-2xl font-bold">
            1. What Actually Makes a PDF File Large?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A PDF is essentially a structured container consisting of a header, an object hierarchy
            (pages, fonts, annotations, and content streams), an image catalog, and a
            cross-reference table. In practice, over 90% of the megabytes in an oversized PDF
            originate from four distinct sources:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">High-Resolution Raster Images:</strong> Digital
              cameras and flatbed scanners capture images at 300 to 600 DPI (dots per inch). An
              uncompressed 24-bit color A4 scan at 300 DPI contains approximately 25 million
              pixels—over 70 megabytes of raw bitmap data before compression.
            </li>
            <li>
              <strong className="text-foreground">Embedded Full Font Sets:</strong> When software
              compiles a PDF, it can either embed a subset of characters actually used in the
              document or the entire typography font package (often 1–5 MB per custom font family).
            </li>
            <li>
              <strong className="text-foreground">Uncompressed Content Streams:</strong> Older
              software sometimes writes page content dictionaries as raw ASCII text rather than
              applying standard Flate (ZIP) encoding.
            </li>
            <li>
              <strong className="text-foreground">Redundant Metadata & Thumbnail Caches:</strong>{" "}
              Adobe Acrobat, desktop scanners, and graphic design software routinely append edit
              histories, XML metadata packets (XMP), and embedded preview thumbnails for every page.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section aria-labelledby="compression-mechanisms" className="mt-10">
          <h2 id="compression-mechanisms" className="text-2xl font-bold">
            2. Lossless Stream Compression vs. Lossy Raster Downsampling
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Document compression falls into two fundamentally different engineering categories:
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
                <CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" />
                <span>Lossless Stream Compression</span>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Uses algorithms like Flate (zlib/DEFLATE) and CCITT Fax encoding. It reorganizes
                binary data to eliminate repetitive byte sequences without altering a single pixel
                or character. Every letter and line remains bit-for-bit identical to the original.
                This is ideal for vector engineering blueprints and text contracts.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
                <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                <span>Lossy Raster Downsampling</span>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Reduces the physical pixel count of embedded photographs and applies controlled DCT
                (JPEG) quantization. Because human eyes are far less sensitive to minor color
                gradients than high-frequency text edges, downsampling can shrink image weights by
                70% to 90% while keeping photographs clear and natural.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section aria-labelledby="dpi-standards" className="mt-10">
          <h2 id="dpi-standards" className="text-2xl font-bold">
            3. Understanding Resolution: The DPI Trade-Off
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            DPI (Dots Per Inch) determines how many pixels represent each physical inch of the
            printed or displayed document. Choosing the right target resolution is the single most
            effective way to manage PDF weight:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="p-3 font-semibold text-foreground">Target Use Case</th>
                  <th className="p-3 font-semibold text-foreground">Recommended DPI</th>
                  <th className="p-3 font-semibold text-foreground">Typical Page Size</th>
                  <th className="p-3 font-semibold text-foreground">Visual Characteristic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                <tr>
                  <td className="p-3 font-medium text-foreground">Web & Email Sharing</td>
                  <td className="p-3">72 – 96 DPI</td>
                  <td className="p-3">50 – 150 KB</td>
                  <td className="p-3">
                    Fast loading on mobile; slight blurriness if zoomed past 200%.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">Tablets & High-Res Screens</td>
                  <td className="p-3">144 – 150 DPI</td>
                  <td className="p-3">200 – 400 KB</td>
                  <td className="p-3">
                    Crisp, sharp reading experience on Retina and 4K displays.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">Commercial Printing</td>
                  <td className="p-3">300 DPI</td>
                  <td className="p-3">1 – 3 MB</td>
                  <td className="p-3">
                    Professional print-ready sharpness; zero pixelation on glossy paper.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 */}
        <section aria-labelledby="why-text-rarely-shrinks" className="mt-10">
          <h2 id="why-text-rarely-shrinks" className="text-2xl font-bold">
            4. Why Text-Heavy Documents Rarely Shrink
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            One of the most common user frustrations is compressing a 50-page PDF of contract terms
            or legal filings only to find that the file size barely changed.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This occurs because native PDF text is stored as mathematical vector glyphs rather than
            bitmaps. A complete page of pure text requires only about 2 to 5 kilobytes of compressed
            data. Because there are no heavy image pixels to downsample, raster-based compression
            has virtually nothing to compress. In fact, running aggressive raster compression on
            text documents can sometimes increase file size by turning compact vector characters
            into heavy bitmap images.
          </p>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-xs sm:text-sm">
            <AlertCircle className="size-5 shrink-0 text-amber-500" aria-hidden="true" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Best Practice for Text Files:</strong> To shrink
              text-heavy documents, use
              <Link to="/split-pdf" className="text-primary hover:underline">
                {" "}
                Split PDF{" "}
              </Link>
              to extract only required pages, or run
              <Link to="/pdf-metadata-cleaner" className="text-primary hover:underline">
                {" "}
                PDF Metadata Cleaner{" "}
              </Link>
              to strip bulky XML histories.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section aria-labelledby="portal-limits" className="mt-10">
          <h2 id="portal-limits" className="text-2xl font-bold">
            5. Hitting Strict Submission Limits (100 KB, 200 KB, 500 KB)
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Government visa portals, university admission desks, and corporate recruiting systems
            frequently reject attachments exceeding strict limits (e.g. "Max file size: 200 KB"). To
            pass these automated gates:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Use Target-Size Compression:</strong> Rather than
              guessing arbitrary percentage sliders, our
              <Link to="/compress-pdf-to-target-size" className="text-primary hover:underline">
                {" "}
                Compress PDF to Target Size{" "}
              </Link>
              tool uses binary-search downsampling to converge on your exact requested limit.
            </li>
            <li>
              <strong className="text-foreground">Verify Small Details:</strong> When a file is
              compressed aggressively down to 100 KB, fine details like passport photos, security
              barcodes, and faint notary stamps may soften. Always preview the output at 100% zoom
              before submitting.
            </li>
            <li>
              <strong className="text-foreground">Split Large Attachments:</strong> If your document
              contains 30 pages, it is mathematically impossible to reach 100 KB without rendering
              pages unreadable. Separate annexures or transcripts into individual smaller PDF files.
            </li>
          </ol>
        </section>

        {/* Section 6 */}
        <section aria-labelledby="client-side-privacy" className="mt-10">
          <h2 id="client-side-privacy" className="text-2xl font-bold">
            6. How IXDocs Achieves Browser-Only Compression
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Most online PDF compressors upload your files to server farms where documents are
            processed and queued on shared disks. IXDocs eliminates this security risk:
          </p>
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
              <span>Zero Server Transmission</span>
            </div>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Your files are processed directly in your browser and are not uploaded to an IXDocs
              server for processing. All parsing, rendering, canvas downsampling, and PDF-Lib
              assembly execute in your local device's memory. No copies are stored, no data is
              retained, and no personal documents ever leave your computer or phone.
            </p>
          </div>
        </section>

        {/* Related Tools Footer Callout */}
        <footer className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h3 className="text-lg font-bold sm:text-xl">Ready to Compress Your Document?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose the compression tool that best matches your document problem:
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/compress-pdf"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:text-sm"
            >
              <span>Compress PDF</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              to="/compress-pdf-to-target-size"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 sm:text-sm"
            >
              <span>Target Size Compression</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              to="/pdf-compression"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 sm:text-sm"
            >
              <span>All Compression Tools</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
