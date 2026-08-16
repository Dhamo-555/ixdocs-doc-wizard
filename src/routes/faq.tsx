import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is IXDocs free?",
    a: "Yes. Every tool on the site is free to use and funded by advertising. There is no checkout, no subscription and no trial.",
  },
  {
    q: "Do I need an account?",
    a: "No. Nothing on IXDocs requires signing up, and there is no login.",
  },
  {
    q: "What files are supported?",
    a: "PDF files for the PDF tools, and JPG, PNG and WebP images for the image tools. Word conversion accepts DOC and DOCX once that engine is connected.",
  },
  {
    q: "Are my files stored?",
    a: "The tools available today process files in your browser, so your document is not uploaded to IXDocs. Tools that will need a server engine say so on their page, and the privacy policy will be updated before any server processing goes live.",
  },
  {
    q: "How does PDF compression work?",
    a: "Pages are re-rendered as images at a lower quality, which shrinks scans and photo-heavy documents substantially. A structure-only mode is available when you need to keep selectable text.",
  },
  {
    q: "How can I compress to 200 KB?",
    a: "Use Compress PDF to Target Size and pick 200 KB. IXDocs tries progressively stronger settings and reports the real result — including when the target cannot be reached at a readable quality.",
  },
  {
    q: "Can I use IXDocs on mobile?",
    a: "Yes. The whole site is designed mobile-first, with large tap targets, a mobile file picker and camera capture in the Document Scanner.",
  },
  {
    q: "Is IXDocs secure?",
    a: "Browser-based processing means your document never leaves your device for those tools. We avoid claims our architecture cannot support, and every tool states what it actually does.",
  },
  {
    q: "What happens if processing fails?",
    a: "You get a plain-language explanation of what went wrong and what to try next. Internal error details are never shown, and no file is offered if processing did not succeed.",
  },
  {
    q: "What are the file limits?",
    a: "Files up to 100 MB are accepted. In practice, very large or very long documents depend on your device's available memory because processing happens locally.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ \u2014 Common Questions About IXDocs" },
      {
        name: "description",
        content:
          "Answers about pricing, accounts, supported files, file storage, compression, mobile use and file limits on IXDocs.",
      },
      { property: "og:title", content: "FAQ \u2014 Common Questions About IXDocs" },
      {
        property: "og:description",
        content:
          "Answers about pricing, accounts, supported files, file storage, compression, mobile use and file limits on IXDocs.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ixdocs.com/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ixdocs.com/faq" }],
    scripts: [
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
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Frequently asked questions</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Straight answers about how IXDocs works.
        </p>
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
