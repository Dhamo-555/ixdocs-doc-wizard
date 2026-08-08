import { Link } from "@tanstack/react-router";
import { LogoMark } from "./logo";
import { CATEGORY_ORDER, toolPath, toolsByCategory } from "@/lib/tools";

const LEGAL = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "FAQ", to: "/faq" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-base font-extrabold tracking-tight">IXDocs</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Documents. Simplified. Free tools for PDFs and documents, built to be fast, clear and honest about what
              they do.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {CATEGORY_ORDER.slice(0, 3).map((category) => (
              <div key={category} className="min-w-0">
                <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">{category}</h2>
                <ul className="mt-3 space-y-2">
                  {toolsByCategory(category).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        to={toolPath(tool.slug)}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {CATEGORY_ORDER.slice(3).map((category) => (
            <div key={category} className="min-w-0">
              <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">{category}</h2>
              <ul className="mt-3 space-y-2">
                {toolsByCategory(category).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      to={toolPath(tool.slug)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} IXDocs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
