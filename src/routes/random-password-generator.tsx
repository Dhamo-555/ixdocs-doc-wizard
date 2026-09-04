import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check, RefreshCw, Shield, Key, Hash, Sparkles } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { getCalculatorBySlug } from "@/lib/calculators";
import {
  generateByPreset,
  type RandomPasswordPreset,
} from "@/lib/calc-engines/random-password-generator";

const calcMeta = getCalculatorBySlug("random-password-generator")!;

export const Route = createFileRoute("/random-password-generator")({
  head: () => ({
    meta: [
      { title: `${calcMeta.name} — Instant Random PINs & Passphrases | IXDocs Calculator` },
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
  component: RandomPasswordGeneratorPage,
});

function RandomPasswordGeneratorPage() {
  const [preset, setPreset] = useState<RandomPasswordPreset>("strong");
  const [pinLength, setPinLength] = useState<number>(6);
  const [wordCount, setWordCount] = useState<number>(4);
  const [currentPassword, setCurrentPassword] = useState("");
  const [strengthLabel, setStrengthLabel] = useState("Strong");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let customLength: number | undefined;
    if (preset === "pin") customLength = pinLength;
    if (preset === "memorable") customLength = wordCount;

    const res = generateByPreset(
      customLength !== undefined ? { preset, customLength } : { preset },
    );
    setCurrentPassword(res.password);
    setStrengthLabel(res.strength);
  }, [preset, pinLength, wordCount]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = () => {
    if (navigator?.clipboard && currentPassword) {
      navigator.clipboard.writeText(currentPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-8">
        {/* Presets Bar */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
            Choose Generation Preset
          </label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => setPreset("strong")}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-4 text-center transition-all ${
                preset === "strong"
                  ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-xs"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              <Key className="size-5" />
              <span className="text-xs font-bold">Standard Strong</span>
              <span className="text-[0.65rem] opacity-75">16 characters</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("ultra")}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-4 text-center transition-all ${
                preset === "ultra"
                  ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-xs"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="size-5" />
              <span className="text-xs font-bold">Ultra Secure</span>
              <span className="text-[0.65rem] opacity-75">24 characters</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("memorable")}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-4 text-center transition-all ${
                preset === "memorable"
                  ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-xs"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="size-5" />
              <span className="text-xs font-bold">Memorable</span>
              <span className="text-[0.65rem] opacity-75">Passphrase</span>
            </button>

            <button
              type="button"
              onClick={() => setPreset("pin")}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-4 text-center transition-all ${
                preset === "pin"
                  ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-xs"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              <Hash className="size-5" />
              <span className="text-xs font-bold">Numeric PIN</span>
              <span className="text-[0.65rem] opacity-75">Digits only</span>
            </button>
          </div>
        </div>

        {/* Sub-options for PIN and Memorable */}
        {preset === "pin" ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-foreground">PIN Length:</span>
            {[4, 6, 8, 10].map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => setPinLength(len)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                  pinLength === len
                    ? "bg-emerald-600 text-white"
                    : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {len} Digits
              </button>
            ))}
          </div>
        ) : null}

        {preset === "memorable" ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-foreground">Word Count:</span>
            {[3, 4, 5, 6].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setWordCount(count)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                  wordCount === count
                    ? "bg-emerald-600 text-white"
                    : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {count} Words
              </button>
            ))}
          </div>
        ) : null}

        {/* Output Box */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-inner">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-mono text-xl sm:text-3xl font-extrabold text-foreground break-all select-all">
              {currentPassword || "Generating..."}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={generate}
                className="grid size-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                title="Generate another"
                aria-label="Generate another"
              >
                <RefreshCw className="size-4.5" />
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 text-xs font-bold text-white shadow-xs transition-colors"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Cryptographic strength:{" "}
              <strong className="text-emerald-600 font-semibold">{strengthLabel}</strong>
            </span>
            <span>Generated locally via Web Crypto</span>
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
