import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check, Trash2, Clock, Volume2, Type, FileText } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { getCalculatorBySlug } from "@/lib/calculators";
import { analyzeText } from "@/lib/calc-engines/word-counter";

const calcMeta = getCalculatorBySlug("word-counter")!;

export const Route = createFileRoute("/word-counter")({
  head: () => ({
    meta: [
      { title: `${calcMeta.name} — Real-Time Text Statistics | IXDocs Calculator` },
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
  component: WordCounterPage,
});

const SAMPLE_TEXT =
  "IXDocs is an all-in-one suite of free document and calculation tools designed for speed, privacy, and simplicity. All processing happens entirely inside your web browser, ensuring your data is never uploaded to any remote server.";

function WordCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => analyzeText(text), [text]);

  const handleCopy = () => {
    if (navigator?.clipboard && text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface p-4 text-center">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.words}
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Words
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 text-center">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.characters}
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Characters
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 text-center">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.sentences}
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sentences
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 text-center">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.paragraphs}
            </div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Paragraphs
            </div>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to begin instant word and character counting..."
            rows={8}
            className="w-full rounded-2xl border border-border bg-background p-4 text-sm sm:text-base text-foreground leading-relaxed outline-hidden placeholder:text-muted-foreground focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />

          {/* Action bar below textarea */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXT)}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-surface/80 hover:text-foreground transition-colors"
              >
                Insert Sample Text
              </button>
              {text ? (
                <button
                  type="button"
                  onClick={() => setText("")}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  <span>Clear</span>
                </button>
              ) : null}
            </div>

            {text ? (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>{copied ? "Copied" : "Copy Text"}</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Secondary Details (Reading Time, Speaking Time, Characters No Space) */}
        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/50 p-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Clock className="size-4.5" />
            </span>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Reading Time</div>
              <div className="text-sm font-bold text-foreground">{stats.readingTimeString}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/50 p-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Volume2 className="size-4.5" />
            </span>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Speaking Time</div>
              <div className="text-sm font-bold text-foreground">{stats.speakingTimeString}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/50 p-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Type className="size-4.5" />
            </span>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Without Spaces</div>
              <div className="text-sm font-bold text-foreground">
                {stats.charactersNoSpaces} chars
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
