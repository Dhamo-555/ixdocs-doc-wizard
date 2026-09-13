import { Link } from "@tanstack/react-router";
import { ChevronRight, FileCheck2, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { AdSlot, RelatedTools, ToolWorkspace } from "./tool-workspace";
import { getTool, smartMeta } from "@/lib/tools";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SITE_URL = "https://ixdocs.com";

export function toolRouteHead(slug: string) {
  const tool = getTool(slug);
  const url = `${SITE_URL}/${slug}`;

  let ogImage = "https://ixdocs.com/ixdocs-og-image.png";
  if (slug === "compress-pdf") {
    ogImage = "https://ixdocs.com/og-compress-pdf.png";
  } else if (slug === "edit-pdf") {
    ogImage = "https://ixdocs.com/og-edit-pdf.png";
  } else if (slug === "merge-pdf") {
    ogImage = "https://ixdocs.com/og-merge-pdf.png";
  } else if (slug === "split-pdf") {
    ogImage = "https://ixdocs.com/og-split-pdf.png";
  } else if (slug === "jpg-to-pdf") {
    ogImage = "https://ixdocs.com/og-jpg-to-pdf.png";
  } else if (slug === "pdf-to-jpg") {
    ogImage = "https://ixdocs.com/og-pdf-to-jpg.jpg";
  }

  const scripts = [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IXDocs", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
          { "@type": "ListItem", position: 3, name: tool.name, item: url },
        ],
      }),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.name,
        url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web browser",
        description: tool.metaDescription,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }),
    },
  ];

  if (tool.steps && tool.steps.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to use ${tool.name}`,
        description: tool.metaDescription,
        step: tool.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          text: step,
        })),
      }),
    });
  }

  return {
    meta: [
      { title: tool.metaTitle },
      { name: "description", content: tool.metaDescription },
      { property: "og:title", content: tool.metaTitle },
      { property: "og:description", content: tool.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { property: "og:image:type", content: ogImage.endsWith(".jpg") ? "image/jpeg" : "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${tool.name} — Free PDF Tool | IXDocs` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: tool.metaTitle },
      { name: "twitter:description", content: tool.metaDescription },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}

export function ToolRoutePage({ slug }: { slug: string }) {
  const tool = getTool(slug);
  const smart = smartMeta(slug);

  return (
    <div className="container-page py-8 sm:py-12">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
      >
        <Link to="/" className="hover:text-foreground">
          IXDocs
        </Link>
        <ChevronRight className="size-3" aria-hidden="true" />
        <Link to="/tools" className="hover:text-foreground">
          Tools
        </Link>
        <ChevronRight className="size-3" aria-hidden="true" />
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <header className="mt-4 max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <tool.icon className="size-3.5" aria-hidden="true" />
            {tool.category}
          </span>
          {smart ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" aria-hidden="true" /> Smart tool
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 text-3xl font-extrabold text-balance sm:text-4xl">{tool.name}</h1>
        {smart ? (
          <p className="mt-3 text-base font-semibold text-pretty text-foreground">
            {smart.problem}
          </p>
        ) : null}
        <p className="mt-2 text-base text-muted-foreground">{smart ? smart.benefit : tool.intro}</p>
        {smart ? <p className="mt-2 text-sm text-muted-foreground">{tool.intro}</p> : null}
      </header>

      <div className="mt-8">
        <ToolWorkspace tool={tool} />
      </div>

      <ul className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <li className="flex items-start gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <FileCheck2 className="mt-px size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0">Accepts {tool.acceptLabel}</span>
        </li>
        <li className="flex items-start gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Gauge className="mt-px size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0">
            {tool.slug === "qr-code-generator"
              ? "Instant client-side generation"
              : "Files up to 100 MB"}
          </span>
        </li>
        <li className="flex items-start gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <ShieldCheck className="mt-px size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0">Free, no sign-up required</span>
        </li>
      </ul>

      <p className="mt-3 text-xs text-muted-foreground">
        Your files are processed locally in your browser and are never uploaded to a server. IXDocs
        does not store, read, or transmit your documents — they remain on your device throughout. No
        account is required. Please only upload documents you have permission to process.
      </p>

      <section aria-labelledby="how-to" className="mt-14">
        <h2 id="how-to" className="text-lg font-bold">
          How to use {tool.name}
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {tool.steps.map((step, i) => (
            <li key={step} className="min-w-0 rounded-xl border border-border bg-surface p-4">
              <span className="grid size-6 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <AdSlot className="mt-10" />

      <section aria-labelledby="tool-faq" className="mt-14 max-w-3xl">
        <h2 id="tool-faq" className="text-lg font-bold">
          {tool.name} — frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-3">
          {tool.faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger className="text-left text-sm font-medium">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {tool.about ? (
        <section aria-labelledby="tool-about" className="mt-14 max-w-3xl">
          <h2 id="tool-about" className="text-lg font-bold">
            About {tool.name}
          </h2>
          <div className="mt-3 space-y-3">
            {tool.about.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <RelatedTools tool={tool} />
    </div>
  );
}
