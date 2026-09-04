import { Link } from "@tanstack/react-router";
import { Calculator, ShieldCheck, Zap, Lock } from "lucide-react";
import { CALCULATORS, CATEGORY_LABELS } from "@/lib/calculators";

export function CalcFooter() {
  const mathCalcs = CALCULATORS.filter((c) => c.category === "math" || c.category === "finance");
  const conversionCalcs = CALCULATORS.filter(
    (c) => c.category === "conversion" || c.category === "datetime",
  );
  const securityCalcs = CALCULATORS.filter(
    (c) => c.category === "security" || c.category === "text" || c.category === "utility",
  );

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="inline-grid size-8 shrink-0 place-items-center rounded-[0.6rem] bg-emerald-600 text-white shadow-xs"
              >
                <Calculator className="size-4.5" />
              </span>
              <span className="text-base font-extrabold tracking-tight">
                IXDocs <span className="text-emerald-600">Calculator</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Super calculator platform — from everyday arithmetic to advanced conversions. Fast,
              accurate, and runs completely inside your browser.
            </p>

            <div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>100% Client-Side Privacy — Zero Data Uploads</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-emerald-600 shrink-0" />
                <span>Instant Calculations — No Server Lag</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-emerald-600 shrink-0" />
                <span>Cryptographically Secure Random Generation</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="min-w-0">
              <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                Math & Finance
              </h2>
              <ul className="mt-3 space-y-2">
                {mathCalcs.map((calc) => (
                  <li key={calc.slug}>
                    <Link
                      to={`/${calc.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {calc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                Time & Unit Converters
              </h2>
              <ul className="mt-3 space-y-2">
                {conversionCalcs.map((calc) => (
                  <li key={calc.slug}>
                    <Link
                      to={`/${calc.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {calc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                Privacy & Utilities
              </h2>
              <ul className="mt-3 space-y-2">
                {securityCalcs.map((calc) => (
                  <li key={calc.slug}>
                    <Link
                      to={`/${calc.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {calc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} IXDocs. All calculations are executed locally in your
            browser.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://ixdocs.com" className="font-medium text-emerald-600 hover:underline">
              IXDocs PDF Tools
            </a>
            <span>·</span>
            <Link to="/calculators" className="hover:text-foreground">
              All Calculators
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
