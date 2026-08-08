import { createFileRoute } from "@tanstack/react-router";
import { AdSlot, ToolCard } from "@/components/tool/tool-workspace";
import { CATEGORY_BLURB, CATEGORY_ORDER, TOOLS, toolsByCategory } from "@/lib/tools";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "All Tools \u2014 Every IXDocs PDF & Document Tool" },
      { name: "description", content: "Browse every IXDocs tool: convert, organise, edit, compress, protect and analyse PDFs and documents. Free and organised by category." },
      { property: "og:title", content: "All Tools \u2014 Every IXDocs PDF & Document Tool" },
      { property: "og:description", content: "Browse every IXDocs tool: convert, organise, edit, compress, protect and analyse PDFs and documents. Free and organised by category." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/tools" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <div className="container-page py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">All tools</h1>
        <p className="mt-3 text-base text-muted-foreground">
          {TOOLS.length} document tools, grouped by what you need to do. Every tool has its own page, upload area and
          honest description of what it produces.
        </p>
      </header>
      <div className="mt-10 space-y-12">
        {CATEGORY_ORDER.map((category, index) => (
          <section key={category} aria-labelledby={category.replace(/\W/g, "-")}>
            <h2 id={category.replace(/\W/g, "-")} className="text-xl font-bold">{category}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{CATEGORY_BLURB[category]}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {toolsByCategory(category).map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
            {index === 1 ? <AdSlot className="mt-8" /> : null}
          </section>
        ))}
      </div>
    </div>
  );
}
