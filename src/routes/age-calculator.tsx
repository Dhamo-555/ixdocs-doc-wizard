import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Cake, Calendar, Clock, Sparkles } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { getCalculatorBySlug } from "@/lib/calculators";
import { calculateAge } from "@/lib/calc-engines/age-calculator";

const calcMeta = getCalculatorBySlug("age-calculator")!;

export const Route = createFileRoute("/age-calculator")({
  head: () => ({
    meta: [
      { title: `${calcMeta.name} — Exact Chronological Age | IXDocs Calculator` },
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
  component: AgeCalculatorPage,
});

function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const [referenceDate, setReferenceDate] = useState(() => format(new Date(), "yyyy-MM-dd"));

  const ageResult = useMemo(() => {
    try {
      const bDate = new Date(birthDate + "T00:00:00");
      const rDate = new Date(referenceDate + "T00:00:00");
      return calculateAge(bDate, rDate);
    } catch {
      return null;
    }
  }, [birthDate, referenceDate]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-8">
        {/* Date inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Age at Date (Default: Today)
            </label>
            <input
              type="date"
              value={referenceDate}
              onChange={(e) => setReferenceDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {ageResult ? (
          <div className="space-y-6">
            {/* Main result banner */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                <Cake className="size-4" />
                <span>Exact Chronological Age</span>
              </div>
              <div className="mt-2 text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {ageResult.years} Years, {ageResult.months} Months, {ageResult.days} Days
              </div>
              <div className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
                Born on a{" "}
                <span className="font-semibold text-foreground">{ageResult.dayOfWeekBorn}</span>
              </div>
            </div>

            {/* Next Birthday Countdown */}
            <div className="rounded-xl border border-border bg-surface p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300">
                  <Sparkles className="size-4.5" />
                </span>
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    Next Birthday Countdown
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ageResult.nextBirthdayCountdown.formatted}
                  </div>
                </div>
              </div>
              <span className="hidden sm:inline-block rounded-full bg-surface border border-border px-3 py-1 text-xs font-semibold text-foreground">
                In {ageResult.nextBirthdayCountdown.months}m {ageResult.nextBirthdayCountdown.days}d
              </span>
            </div>

            {/* Alternative units breakdown */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Clock className="size-4 text-emerald-600" />
                <span>Total Elapsed Lifetime Metrics</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-3.5 text-center">
                  <div className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                    {ageResult.totalMonths.toLocaleString()}
                  </div>
                  <div className="mt-1 text-[0.7rem] font-semibold text-muted-foreground uppercase">
                    Total Months
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-3.5 text-center">
                  <div className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                    {ageResult.totalWeeks.toLocaleString()}
                  </div>
                  <div className="mt-1 text-[0.7rem] font-semibold text-muted-foreground uppercase">
                    Total Weeks
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-3.5 text-center">
                  <div className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                    {ageResult.totalDays.toLocaleString()}
                  </div>
                  <div className="mt-1 text-[0.7rem] font-semibold text-muted-foreground uppercase">
                    Total Days
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-3.5 text-center">
                  <div className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                    {ageResult.totalHours.toLocaleString()}
                  </div>
                  <div className="mt-1 text-[0.7rem] font-semibold text-muted-foreground uppercase">
                    Total Hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-destructive/40 p-6 text-center text-xs text-destructive">
            Please ensure your Date of Birth is earlier than the reference date.
          </div>
        )}
      </div>
    </CalcPageLayout>
  );
}
