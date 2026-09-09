import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  HelpCircle,
  BookOpen,
  Calculator as CalcIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { CalculatorMeta } from "@/lib/calculators";
import { getRelatedCalculators } from "@/lib/calculators";
import { CalcCard } from "./calc-card";

export interface CalcPageLayoutProps {
  calc: CalculatorMeta;
  children: ReactNode;
}

export function CalcPageLayout({ calc, children }: CalcPageLayoutProps) {
  const Icon = calc.icon;
  const related = getRelatedCalculators(calc.slug);

  return (
    <div className="min-h-dvh bg-background pb-16">
      {/* Top Breadcrumb & Header bar */}
      <section className="border-b border-border bg-surface/50">
        <div className="container-page py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link to="/calculators" className="hover:text-foreground">
              Calculators
            </Link>
            <ChevronRight className="size-3.5 text-muted-foreground/60" />
            <span className="capitalize">{calc.category}</span>
            <ChevronRight className="size-3.5 text-muted-foreground/60" />
            <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
              {calc.name}
            </span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                <Icon className="size-6" />
              </span>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {calc.name}
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground leading-relaxed">
                  {calc.shortDescription}
                </p>
              </div>
            </div>

            {/* Privacy badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/50 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 shrink-0 self-start sm:self-auto">
              <ShieldCheck className="size-3.5" />
              <span>100% In-Browser · Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Calculator Workspace */}
      <main className="container-page mt-8">
        <div className="mx-auto max-w-4xl">
          {/* The interactive tool workspace */}
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-8">
            {children}
          </div>

          {/* Educational Content & Formula Section */}
          <div className="mt-12 space-y-10">
            {/* Formula (if available) */}
            {calc.formula ? (
              <section className="rounded-2xl border border-border bg-surface/50 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                  <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CalcIcon className="size-4" />
                  </span>
                  <h2>Calculation Formula</h2>
                </div>
                <div className="mt-4 rounded-xl border border-border/80 bg-background p-4 font-mono text-xs sm:text-sm text-foreground overflow-x-auto">
                  <code>{calc.formula}</code>
                </div>
              </section>
            ) : null}

            {/* How It Works */}
            {calc.howItWorks && calc.howItWorks.length > 0 ? (
              <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                  <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <Zap className="size-4" />
                  </span>
                  <h2>How It Works</h2>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {calc.explanation}
                </p>
                <ol className="mt-4 space-y-2 text-sm text-foreground">
                  {calc.howItWorks.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface border border-border text-xs font-semibold text-muted-foreground">
                        {idx + 1}
                      </span>
                      <span className="leading-normal">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {/* Worked Example (if available) */}
            {calc.example ? (
              <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                  <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <BookOpen className="size-4" />
                  </span>
                  <h2>Worked Example</h2>
                </div>
                <div className="mt-4 rounded-xl border border-border/80 bg-surface/40 p-4 sm:p-5 text-sm">
                  <h3 className="font-semibold text-foreground text-base">{calc.example.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {calc.example.description}
                  </p>
                  {calc.example.steps && calc.example.steps.length > 0 ? (
                    <ul className="mt-3.5 space-y-1.5 text-xs sm:text-sm text-foreground/90 list-disc list-inside">
                      {calc.example.steps.map((step, sIdx) => (
                        <li key={sIdx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ) : null}

            {/* FAQs */}
            {calc.faqs && calc.faqs.length > 0 ? (
              <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                  <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <HelpCircle className="size-4" />
                  </span>
                  <h2>Frequently Asked Questions</h2>
                </div>
                <div className="mt-6 divide-y divide-border/60">
                  {calc.faqs.map((faq, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0">
                      <h3 className="text-sm font-semibold text-foreground">{faq.question}</h3>
                      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Related Calculators */}
            {related.length > 0 ? (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-foreground">Related Calculators</h2>
                  <Link
                    to="/calculators"
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((relCalc) => (
                    <CalcCard key={relCalc.slug} calc={relCalc} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
