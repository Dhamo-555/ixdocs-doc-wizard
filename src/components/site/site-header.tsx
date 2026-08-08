import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./logo";
import { ToolSearch } from "./tool-search";
import { POPULAR_TOOLS, toolPath } from "@/lib/tools";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Tools", to: "/tools" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "FAQ", to: "/faq" },
  { label: "About", to: "/about" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="container-page grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3">
        <Wordmark />

        <nav aria-label="Main" className="hidden min-w-0 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              activeProps={{ className: "text-foreground bg-surface" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden lg:block">
            <ToolSearch />
          </div>
          <div className="lg:hidden">
            <ToolSearch variant="icon" />
          </div>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-border text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link to="/tools">All tools</Link>
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-3 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Popular</p>
            <div className="grid grid-cols-2 gap-1 pt-1">
              {POPULAR_TOOLS.slice(0, 6).map((tool) => (
                <Link
                  key={tool.slug}
                  to={toolPath(tool.slug)}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
