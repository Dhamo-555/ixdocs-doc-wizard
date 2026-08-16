import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { POPULAR_TOOLS, TOOLS, searchTools, toolPath } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function ToolSearch({ variant = "button" }: { variant?: "button" | "icon" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(navigator.userAgent.toLowerCase().includes("mac"));
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        // Prevent trigger if the button is currently hidden by responsive CSS (e.g. display: none)
        if (buttonRef.current && buttonRef.current.offsetParent === null) {
          return;
        }
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(
    () => (query.trim() ? searchTools(query) : POPULAR_TOOLS.slice(0, 6)),
    [query],
  );

  const go = (slug: string) => {
    setOpen(false);
    setQuery("");
    navigate({ to: toolPath(slug) });
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search tools"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border bg-surface text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
          variant === "button" ? "h-10 w-56 px-3.5" : "size-10 justify-center",
        )}
      >
        <Search className="size-4 shrink-0" />
        {variant === "button" ? (
          <>
            <span className="truncate">Search {TOOLS.length} tools</span>
            <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 text-[0.65rem] font-medium lg:inline">
              {isMac ? "⌘K" : "Ctrl+K"}
            </kbd>
          </>
        ) : null}
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search tools — try 'compress' or 'convert'"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            No tool matches that search. Try “compress”, “merge”, “convert” or “size”.
          </CommandEmpty>
          <CommandGroup heading={query.trim() ? "Results" : "Popular tools"}>
            {results.map((tool) => (
              <CommandItem
                key={tool.slug}
                value={tool.slug}
                onSelect={() => go(tool.slug)}
                className="gap-3"
              >
                <tool.icon className="size-4 text-primary" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{tool.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{tool.short}</span>
                </span>
                <span className="ml-auto hidden shrink-0 text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase sm:inline">
                  {tool.category}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
