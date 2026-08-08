import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AdSlot, RelatedTools, ToolWorkspace } from "./tool-workspace";
import { getTool } from "@/lib/tools";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function toolRouteHead(slug: string) {
  const tool = getTool(slug);
  const url = `/${slug}`;
  return {
    meta: [
      { title: tool.metaTitle },
      { name: "description", content: tool.metaDescription },
      { property: "og:title", content: tool.metaTitle },
      { property: "og:description", content: tool.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
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
    ],
  };
}

export function ToolRoutePage({ slug }: { slug: string }) {
  const tool = getTool(slug);

  return (
    <div className="container-page py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
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
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <tool.icon className="size-3.5" aria-hidden="true" />
          {tool.category}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{tool.name}</h1>
        <p className="mt-3 text-base text-muted-foreground">{tool.intro}</p>
      </header>

      <div className="mt-8">
        <ToolWorkspace tool={tool} />
      </div>

      <AdSlot className="mt-8" />

      <section aria-labelledby="how-to" className="mt-14 max-w-3xl">
        <h2 id="how-to" className="text-lg font-bold">
          How to use {tool.name}
        </h2>
        <ol className="mt-4 space-y-3">
          {tool.steps.map((step, i) => (
            <li key={step} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tool-faq" className="mt-14 max-w-3xl">
        <h2 id="tool-faq" className="text-lg font-bold">
          Frequently asked questions
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

      <RelatedTools tool={tool} />
    </div>
  );
}
