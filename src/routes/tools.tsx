import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Sparkles, X } from "lucide-react";
import { AdSlot, ToolCard } from "@/components/tool/tool-workspace";
import { SmartToolCard } from "@/components/tool/smart-tool-card";
import {
  CATEGORY_BLURB,
  CATEGORY_ICONS,
  CATEGORY_ORDER,
  SMART_TOOLS,
  TOOLS,
  searchTools,
  toolsByCategory,
  type ToolCategory,
} from "@/lib/tools";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "All Tools \u2014 Every IXDocs PDF & Document Tool" },
      { name: "description", content: "Browse every IXDocs tool: convert, organise, edit, compress, protect and analyse PDFs and documents. Search by task or browse by category \u2014 free, no signup." },
      { property: "og:title", content: "All Tools \u2014 Every IXDocs PDF & Document Tool" },
      { property: "og:description", content: "Search or browse every IXDocs tool: convert, organise, edit, compress, protect and analyse PDFs and documents." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/tools" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory | "all">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = query.trim();
  const results = useMemo(() => {
    const base = trimmed ? searchTools(trimmed, TOOLS.length) : TOOLS;
    return category === "all" ? base : base.filter((t) => t.category === category);
  }, [trimmed, category]);

  const filtering = trimmed.length > 0 || category !== "all";

  const clear = () => {
    setQuery("");
    setCategory("all");
    inputRef.current?.focus();
  };

  return (
    <div className="container-page py-10 sm:py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">All tools</h1>
        <p className="mt-3 text-base text-muted-foreground">
          {TOOLS.length} document tools, grouped by what you need to do. Search by task — try “compress”, “size”,
          “image” or “word” — or browse a category below.
        </p>
      </header>

      {/* Search */}
      <div className="mt-8">
        <label htmlFor="tool-search" className="sr-only">
          Search IXDocs tools
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="tool-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
            }}
            placeholder="Search tools by name or task"
            autoComplete="off"
            className="h-13 w-full min-w-0 rounded-2xl border border-border bg-surface pr-12 pl-11 text-base text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        {/* Categories */}
        <div
          role="group"
          aria-label="Filter by category"
          className="mt-4 flex flex-wrap gap-2"
        >
          <CategoryChip active={category === "all"} onClick={() => setCategory("all")} label={`All (${TOOLS.length})`} />
          {CATEGORY_ORDER.map((c) => {
            const Icon = CATEGORY_ICONS[c];
            return (
              <CategoryChip
                key={c}
                active={category === c}
                onClick={() => setCategory(category === c ? "all" : c)}
                label={c}
                icon={<Icon className="size-3.5 shrink-0" aria-hidden="true" />}
              />
            );
          })}
        </div>
      </div>

      {/* Filtered / searched view */}
      {filtering ? (
        <section aria-live="polite" className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-muted-foreground">
              {results.length} {results.length === 1 ? "tool" : "tools"}
              {trimmed ? ` matching “${trimmed}”` : ""}
              {category !== "all" ? ` in ${category}` : ""}
            </h2>
            <button
              type="button"
              onClick={clear}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Show all tools
            </button>
          </div>

          {results.length ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} showCategory />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-sm font-semibold">No tool matches “{trimmed}”.</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Try a simpler word like “compress”, “merge”, “convert” or “size”, or pick a category to browse.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {CATEGORY_ORDER.map((c) => (
                  <CategoryChip
                    key={c}
                    active={false}
                    label={c}
                    onClick={() => {
                      setQuery("");
                      setCategory(c);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="mt-12 space-y-12">
          <section aria-labelledby="smart-tools">
            <h2 id="smart-tools" className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="size-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              <span className="min-w-0">Smart tools</span>
              <span className="text-sm font-medium text-muted-foreground">({SMART_TOOLS.length})</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Specialised tools for specific document problems — upload limits, rejected forms and messy scans.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SMART_TOOLS.map((tool) => (
                <SmartToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
          {CATEGORY_ORDER.map((c, index) => {
            const id = c.replace(/\W/g, "-");
            const Icon = CATEGORY_ICONS[c];
            const list = toolsByCategory(c);
            return (
              <section key={c} aria-labelledby={id}>
                <h2 id={id} className="flex items-center gap-2 text-xl font-bold">
                  <Icon className="size-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  <span className="min-w-0">{c}</span>
                  <span className="text-sm font-medium text-muted-foreground">({list.length})</span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{CATEGORY_BLURB[c]}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {list.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
                {index === 1 ? <AdSlot className="mt-8" /> : null}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-9 min-w-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
