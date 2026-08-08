import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gauge, ShieldCheck, Zap } from "lucide-react";
import { AdSlot, ToolCard } from "@/components/tool/tool-workspace";
import { Button } from "@/components/ui/button";
import { CATEGORY_BLURB, CATEGORY_ORDER, POPULAR_TOOLS, TOOLS, toolsByCategory } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IXDocs \u2014 Documents. Simplified. Free PDF & Document Tools" },
      { name: "description", content: "Free, fast, easy-to-use tools for your documents and PDFs. Compress, merge, split, convert and organise files right in your browser with IXDocs." },
      { property: "og:title", content: "IXDocs \u2014 Documents. Simplified. Free PDF & Document Tools" },
      { property: "og:description", content: "Free, fast, easy-to-use tools for your documents and PDFs. Compress, merge, split, convert and organise files right in your browser with IXDocs." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-16 text-center sm:py-24">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">IXDocs</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold sm:text-6xl">Documents. Simplified.</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Free, fast and easy-to-use tools for your documents and PDFs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="min-h-12">
              <Link to="/tools">
                Explore tools <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12">
              <Link to="/compress-pdf">Upload a file</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs font-medium text-muted-foreground">Fast • Simple • Privacy-focused</p>
        </div>
      </section>

      <section aria-labelledby="popular" className="container-page py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="popular" className="text-2xl font-bold">Popular tools</h2>
            <p className="mt-1 text-sm text-muted-foreground">The tools people reach for most on IXDocs.</p>
          </div>
          <Link to="/tools" className="text-sm font-medium text-primary hover:underline">
            All {TOOLS.length} tools
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {POPULAR_TOOLS.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <AdSlot className="container-page" />

      <section aria-labelledby="why" className="container-page py-14">
        <h2 id="why" className="text-2xl font-bold">Built for real document work</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: Zap, title: "Fast where it matters", body: "Most tools run directly in your browser, so there is no upload wait and no queue." },
            { icon: ShieldCheck, title: "Honest about processing", body: "We tell you exactly what each tool does — and when an engine is not connected yet." },
            { icon: Gauge, title: "Made for tight limits", body: "Target-size compression helps you meet strict upload rules on application forms." },
          ].map((item) => (
            <div key={item.title} className="surface-card p-5">
              <item.icon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="categories" className="container-page pb-16">
        <h2 id="categories" className="text-2xl font-bold">Every tool, organised</h2>
        <div className="mt-6 space-y-10">
          {CATEGORY_ORDER.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold tracking-wide uppercase">{category}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{CATEGORY_BLURB[category]}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
