import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { smartMeta, toolPath, type Tool } from "@/lib/tools";

/**
 * Card for specialised "Smart tools" — leads with the problem the tool solves.
 * Slightly stronger emphasis than a plain ToolCard, same design system.
 */
export function SmartToolCard({ tool, className }: { tool: Tool; className?: string }) {
  const meta = smartMeta(tool.slug);
  if (!meta) return null;

  return (
    <Link
      to={toolPath(tool.slug)}
      className={cn(
        "surface-card group flex min-w-0 flex-col gap-2 border-primary/15 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-lift)] focus-visible:-translate-y-0.5",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <tool.icon className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="min-w-0 truncate text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
          {tool.category}
        </span>
      </div>
      <p className="text-sm font-semibold text-pretty text-foreground">{meta.problem}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{meta.benefit}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
        {tool.name}
        <ArrowRight
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
