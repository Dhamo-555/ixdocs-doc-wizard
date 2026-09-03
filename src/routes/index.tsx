import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gauge, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AdSlot, ToolCard } from "@/components/tool/tool-workspace";
import { SmartToolCard } from "@/components/tool/smart-tool-card";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_BLURB,
  CATEGORY_ORDER,
  POPULAR_TOOLS,
  SMART_TOOLS,
  TOOLS,
  toolsByCategory,
} from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IXDocs \u2014 Free PDF Tools: Compress, Merge, Split & Convert" },
      {
        name: "description",
        content:
          "IXDocs gives you free, fast PDF and document tools. Compress, merge, split, rotate and convert PDFs to Word, JPG or PNG right in your browser \u2014 no signup.",
      },
      {
        property: "og:title",
        content: "IXDocs \u2014 Free PDF Tools: Compress, Merge, Split & Convert",
      },
      {
        property: "og:description",
        content:
          "Free, fast PDF and document tools. Compress, merge, split, rotate and convert files in your browser \u2014 no signup, no clutter.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ixdocs.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ixdocs.com/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-16 text-center sm:py-24 lg:py-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            {TOOLS.length} free tools · no signup
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold text-balance sm:text-5xl lg:text-6xl">
            Every PDF tool you need, in one place.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground text-pretty sm:mt-5 sm:text-lg">
            <span className="font-semibold text-foreground">Documents. Simplified.</span> Compress,
            merge, split, edit and convert PDFs — most tools run right in your browser.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="min-h-12 w-full sm:w-auto">
              <Link to="/edit-pdf">
                Start with a file <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12 w-full sm:w-auto">
              <Link to="/tools">Browse all tools</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs font-medium text-muted-foreground">
            Fast • Simple • Privacy-focused
          </p>
        </div>
      </section>

      <section aria-labelledby="popular" className="container-page py-14 sm:py-16">
        <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 id="popular" className="text-2xl font-bold sm:text-3xl">
              Popular tools
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              The document tasks people reach for most.
            </p>
          </div>
          <Link to="/tools" className="text-sm font-medium text-primary hover:underline">
            See all {TOOLS.length} document tools
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {POPULAR_TOOLS.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section aria-labelledby="smart" className="container-page py-14 sm:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Sparkles className="size-3.5" aria-hidden="true" /> Smart tools
          </span>
          <h2 id="smart" className="mt-4 text-2xl font-bold sm:text-3xl">
            Tools for the problems, not just the file
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Specialised tools for the awkward document jobs — an exact upload limit, a form that
            keeps rejecting your file, or a photo that needs to become a proper document.
          </p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {SMART_TOOLS.map((tool) => (
            <SmartToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Your document is processed for this task only. Please only upload documents you have
          permission to process.
        </p>
      </section>

      <section aria-labelledby="why" className="container-page py-14 sm:py-16">
        <h2 id="why" className="text-2xl font-bold sm:text-3xl">
          Built for real document work
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Fast where it matters",
              body: "Most tools run directly in your browser, so there is no upload wait and no queue.",
            },
            {
              icon: ShieldCheck,
              title: "Honest about processing",
              body: "Powerful PDF tools, completely free to use.",
            },
            {
              icon: Gauge,
              title: "Made for tight limits",
              body: "Target-size compression helps you meet strict upload rules on application forms.",
            },
          ].map((item) => (
            <div key={item.title} className="surface-card p-5 sm:p-6">
              <item.icon className="size-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <AdSlot className="container-page" />

      <section aria-labelledby="categories" className="container-page pb-16 sm:pb-20">
        <h2 id="categories" className="text-2xl font-bold sm:text-3xl">
          Every tool, organised
        </h2>
        <div className="mt-8 space-y-10 sm:space-y-12">
          {CATEGORY_ORDER.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold tracking-wide uppercase">{category}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{CATEGORY_BLURB[category]}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {toolsByCategory(category).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
