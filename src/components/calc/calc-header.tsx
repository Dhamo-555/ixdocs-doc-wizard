import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Calculator, ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { Button } from "@/components/ui/button";

const CALC_NAV = [
  { label: "All Calculators", to: "/" },
  { label: "Basic", to: "/basic-calculator" },
  { label: "Unit Converter", to: "/unit-converter" },
  { label: "Date & Age", to: "/date-calculator" },
  { label: "Finance", to: "/interest-calculator" },
  { label: "Password", to: "/password-generator" },
  { label: "Bill", to: "/bill-calculator" },
] as const;

export function CalcHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3">
        {/* Branding */}
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          aria-label="IXDocs Calculator home"
        >
          <span
            aria-hidden="true"
            className="inline-grid size-8 shrink-0 place-items-center rounded-[0.6rem] bg-emerald-600 text-white shadow-xs"
          >
            <Calculator className="size-4.5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="flex items-center gap-1.5 text-[1.05rem] font-extrabold tracking-tight text-foreground">
              IXDocs <span className="text-emerald-600">Calculator</span>
            </span>
            <span className="mt-1 hidden text-[0.68rem] font-medium text-muted-foreground sm:inline-block">
              Super Calculator Platform
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Calculator categories"
          className="hidden min-w-0 items-center justify-center gap-1 lg:flex"
        >
          {CALC_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              activeProps={{ className: "text-foreground bg-surface font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center justify-end gap-2">
          <a
            href="https://ixdocs.com"
            className="hidden items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground sm:inline-flex"
            title="Go to IXDocs PDF & Document Tools"
          >
            <span>PDF Tools</span>
            <ArrowUpRight className="size-3" />
          </a>

          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Link to="/">Explore All</Link>
          </Button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-border text-foreground lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface"
            >
              All Calculators
            </Link>
            {CALC_NAV.filter((i) => i.to !== "/").map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              <a
                href="https://ixdocs.com"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              >
                <span>Back to IXDocs PDF Tools</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
