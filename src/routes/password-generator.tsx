import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check, RefreshCw, ShieldCheck } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { getCalculatorBySlug } from "@/lib/calculators";
import {
  generateSecurePassword,
  type PasswordOptions,
  type GeneratedPasswordResult,
} from "@/lib/calc-engines/password-generator";

const calcMeta = getCalculatorBySlug("password-generator")!;

export const Route = createFileRoute("/password-generator")({
  head: () => ({
    meta: [
      { title: `${calcMeta.name} — Cryptographically Secure | IXDocs Calculator` },
      { name: "description", content: calcMeta.metaDescription },
      { property: "og:title", content: `${calcMeta.name} — IXDocs Calculator` },
      { property: "og:description", content: calcMeta.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `https://calculator.ixdocs.com/${calcMeta.slug}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://calculator.ixdocs.com/${calcMeta.slug}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: calcMeta.name,
          url: `https://calculator.ixdocs.com/${calcMeta.slug}`,
          description: calcMeta.metaDescription,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "All",
        }),
      },
    ],
  }),
  component: PasswordGeneratorPage,
});

function PasswordGeneratorPage() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: true,
  });

  const [result, setResult] = useState<GeneratedPasswordResult>({
    password: "",
    entropyBits: 0,
    strength: "Strong",
    strengthPercent: 80,
  });

  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const res = generateSecurePassword(options);
    setResult(res);
  }, [options]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = () => {
    if (navigator?.clipboard && result.password) {
      navigator.clipboard.writeText(result.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const getStrengthColor = (strength: GeneratedPasswordResult["strength"]) => {
    switch (strength) {
      case "Very Strong":
        return "bg-emerald-600";
      case "Strong":
        return "bg-emerald-500";
      case "Good":
        return "bg-amber-500";
      case "Fair":
        return "bg-orange-500";
      default:
        return "bg-rose-500";
    }
  };

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-8">
        {/* Output Box */}
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-inner">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-mono text-lg sm:text-2xl font-bold text-foreground break-all select-all">
              {result.password || "Generating..."}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={generate}
                className="grid size-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                title="Generate new password"
                aria-label="Generate new password"
              >
                <RefreshCw className="size-4.5" />
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 text-xs font-bold text-white shadow-xs transition-colors"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span>{copied ? "Copied" : "Copy Password"}</span>
              </button>
            </div>
          </div>

          {/* Strength Indicator */}
          <div className="mt-4 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>Strength: {result.strength}</span>
              </span>
              <span className="text-muted-foreground font-mono">
                {result.entropyBits} bits entropy
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getStrengthColor(result.strength)}`}
                style={{ width: `${result.strengthPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Length Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground">Password Length</label>
              <span className="font-mono text-base font-bold text-emerald-600">
                {options.length} characters
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={options.length}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, length: parseInt(e.target.value, 10) }))
              }
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            {/* Quick length presets */}
            <div className="mt-2 flex gap-2">
              {[12, 16, 20, 24, 32].map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setOptions((prev) => ({ ...prev, length: len }))}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    options.length === len
                      ? "bg-emerald-600 text-white"
                      : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Character set checkboxes */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 cursor-pointer hover:bg-surface/80 transition-colors">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={(e) => setOptions((prev) => ({ ...prev, uppercase: e.target.checked }))}
                className="size-4 rounded-sm text-emerald-600 focus:ring-emerald-600"
              />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Uppercase Letters (A-Z)
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 cursor-pointer hover:bg-surface/80 transition-colors">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={(e) => setOptions((prev) => ({ ...prev, lowercase: e.target.checked }))}
                className="size-4 rounded-sm text-emerald-600 focus:ring-emerald-600"
              />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Lowercase Letters (a-z)
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 cursor-pointer hover:bg-surface/80 transition-colors">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={(e) => setOptions((prev) => ({ ...prev, numbers: e.target.checked }))}
                className="size-4 rounded-sm text-emerald-600 focus:ring-emerald-600"
              />
              <span className="text-xs sm:text-sm font-medium text-foreground">Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 cursor-pointer hover:bg-surface/80 transition-colors">
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={(e) => setOptions((prev) => ({ ...prev, symbols: e.target.checked }))}
                className="size-4 rounded-sm text-emerald-600 focus:ring-emerald-600"
              />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Special Symbols (!@#$)
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 cursor-pointer hover:bg-surface/80 transition-colors sm:col-span-2">
              <input
                type="checkbox"
                checked={options.avoidAmbiguous}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, avoidAmbiguous: e.target.checked }))
                }
                className="size-4 rounded-sm text-emerald-600 focus:ring-emerald-600"
              />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Exclude Look-alike Characters (0, O, 1, l, I)
              </span>
            </label>
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
