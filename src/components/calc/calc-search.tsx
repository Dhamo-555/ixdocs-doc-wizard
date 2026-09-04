import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X, ArrowRight } from "lucide-react";
import { CALCULATORS } from "@/lib/calculators";

export function CalcSearch() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CALCULATORS.filter((c) => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchDesc = c.shortDescription.toLowerCase().includes(q);
      const matchKeywords = c.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchKeywords;
    });
  }, [query]);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-4 size-4.5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all calculators (e.g., compound interest, age, password)..."
          className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-10 text-sm text-foreground shadow-xs outline-hidden placeholder:text-muted-foreground focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3.5 grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {/* Instant search dropdown */}
      {query ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border bg-popover p-2 shadow-xl">
          {filtered.length > 0 ? (
            <div className="divide-y divide-border/50">
              {filtered.map((calc) => {
                const Icon = calc.icon;
                return (
                  <Link
                    key={calc.slug}
                    to={("/" + calc.slug) as any}
                    onClick={() => setQuery("")}
                    className="flex items-center justify-between gap-3 rounded-xl p-3 transition-colors hover:bg-surface"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Icon className="size-4.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">
                          {calc.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {calc.shortDescription}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No calculators found matching "{query}".
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
