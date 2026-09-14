import { Link } from "@tanstack/react-router";
import { Calculator, ShieldCheck, Zap, Lock } from "lucide-react";
import { CALCULATORS } from "@/lib/calculators";

export function CalcFooter() {
  const everydayMath = CALCULATORS.filter(
    (c) => c.category === "everyday" || c.category === "math",
  );
  const finance = CALCULATORS.filter((c) => c.category === "finance" || c.category === "billing");
  const healthConverters = CALCULATORS.filter(
    (c) => c.category === "health" || c.category === "conversion" || c.category === "datetime",
  );
  const securityQr = CALCULATORS.filter(
    (c) =>
      c.category === "security" || c.category === "qr-barcode" || c.category === "productivity",
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
              Browser-based calculation platform featuring 32 focused utility tools. Designed to
              process data locally in your browser where applicable.
            </p>

            <div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>Client-Side Processing — Operates Locally in Browser</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-emerald-600 shrink-0" />
                <span>Instant Results — Fast and Lightweight</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-emerald-600 shrink-0" />
                <span>No User Registration Required</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="min-w-0">
              <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                Everyday & Math
              </h2>
              <ul className="mt-3 space-y-2">
                {everydayMath.slice(0, 8).map((calc) => (
                  <li key={calc.slug}>
                    <Link
                      to={("/" + calc.slug) as never}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {calc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                Finance & Billing
              </h2>
              <ul className="mt-3 space-y-2">
                {finance.slice(0, 8).map((calc) => (
                  <li key={calc.slug}>
                    <Link
                      to={("/" + calc.slug) as never}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {calc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                Health & Time
              </h2>
              <ul className="mt-3 space-y-2">
                {healthConverters.slice(0, 8).map((calc) => (
                  <li key={calc.slug}>
                    <Link
                      to={("/" + calc.slug) as never}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {calc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                Security & Barcodes
              </h2>
              <ul className="mt-3 space-y-2">
                {securityQr.map((calc) => (
                  <li key={calc.slug}>
                    <Link
                      to={("/" + calc.slug) as never}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {calc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground/80 leading-relaxed">
          <p>
            IXDocs provides browser-based tools for general-purpose utility. Tools process data
            locally in your browser where applicable. IXDocs does not endorse and is not responsible
            for unauthorized, unlawful, or harmful use of its tools or outputs.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} IXDocs. All tools operate in-browser.</p>
          <div className="flex items-center gap-4">
            <a href="https://ixdocs.com" className="font-medium text-emerald-600 hover:underline">
              IXDocs PDF Tools
            </a>
            <span>·</span>
            <Link to="/" className="hover:text-foreground">
              All 32 Calculators
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
