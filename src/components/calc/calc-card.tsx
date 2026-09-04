import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { CalculatorMeta } from "@/lib/calculators";
import { CATEGORY_LABELS } from "@/lib/calculators";

export function CalcCard({ calc }: { calc: CalculatorMeta }) {
  const Icon = calc.icon;
  const categoryLabel = CATEGORY_LABELS[calc.category] || calc.category;

  return (
    <Link
      to={`/${calc.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/40 dark:text-emerald-400">
            <Icon className="size-5.5" />
          </span>
          <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground">
            {categoryLabel}
          </span>
        </div>

        <h3 className="mt-4 text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-emerald-600">
          {calc.name}
        </h3>

        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {calc.shortDescription}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:underline">
        <span>Open calculator</span>
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
