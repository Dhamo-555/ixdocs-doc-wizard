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
              Super calculator platform — 31 fast, accurate, and private browser-based calculation
              engines. No sign-up, zero server lag.
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
              All 31 Calculators
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
