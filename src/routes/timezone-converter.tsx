import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, ArrowRight, Globe, ArrowLeftRight } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { POPULAR_TIMEZONES, convertTimezone } from "@/lib/calc-engines/timezone-converter";

export const Route = createFileRoute("/timezone-converter")({
  head: () => calcRouteHead("timezone-converter"),
  component: TimezoneConverterPage,
});

function getLocalIsoDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function TimezoneConverterPage() {
  const calcMeta = getCalculatorBySlug("timezone-converter")!;
  const [dateTime, setDateTime] = useState(getLocalIsoDateTime());
  const [fromTz, setFromTz] = useState("America/New_York");
  const [toTz, setToTz] = useState("Europe/London");

  const conversion = useMemo(() => {
    return convertTimezone(dateTime, fromTz, toTz);
  }, [dateTime, fromTz, toTz]);

  const handleSwap = () => {
    const prevFrom = fromTz;
    setFromTz(toTz);
    setToTz(prevFrom);
  };

  // Quick comparison list across major business hubs
  const majorCities = useMemo(() => {
    const targets = [
      { city: "New York", tz: "America/New_York" },
      { city: "London", tz: "Europe/London" },
      { city: "Dubai", tz: "Asia/Dubai" },
      { city: "Mumbai", tz: "Asia/Kolkata" },
      { city: "Singapore", tz: "Asia/Singapore" },
      { city: "Tokyo", tz: "Asia/Tokyo" },
    ];
    return targets.map((t) => ({
      ...t,
      res: convertTimezone(dateTime, fromTz, t.tz),
    }));
  }, [dateTime, fromTz]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-8">
        {/* Controls */}
        <div className="grid gap-4 sm:grid-cols-[1.2fr_auto_1.2fr] sm:items-end">
          {/* Origin Timezone */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Origin Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 mb-2"
            />
            <label className="block text-xs font-semibold text-foreground mb-1">
              Origin Timezone
            </label>
            <select
              value={fromTz}
              onChange={(e) => setFromTz(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-xs sm:text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              {POPULAR_TIMEZONES.map((tz) => (
                <option key={tz.id} value={tz.id}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center sm:pb-1">
            <button
              type="button"
              onClick={handleSwap}
              className="grid size-11 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition-colors"
              title="Swap timezones"
              aria-label="Swap timezones"
            >
              <ArrowLeftRight className="size-4.5" />
            </button>
          </div>

          {/* Target Timezone */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Destination Timezone
            </label>
            <div className="sm:h-11 mb-2 hidden sm:flex items-center text-xs text-muted-foreground">
              <span>Automatic time offset calculation</span>
            </div>
            <label className="block text-xs font-semibold text-foreground mb-1 sm:hidden">
              Target
            </label>
            <select
              value={toTz}
              onChange={(e) => setToTz(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-xs sm:text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              {POPULAR_TIMEZONES.map((tz) => (
                <option key={tz.id} value={tz.id}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Result Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                Converted Destination Time
              </div>
              <div className="mt-1 text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {conversion.formattedTime}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{conversion.formattedDate}</div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                <Clock className="size-3.5" />
                <span>{conversion.timeDifference}</span>
              </span>
              {conversion.isDifferentDay ? (
                <span className="text-[0.75rem] font-medium text-amber-600 dark:text-amber-400">
                  (Different calendar day)
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Major Global Cities Comparison */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Globe className="size-4 text-emerald-600" />
            <span>Simultaneous World City Comparison</span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {majorCities.map((item) => (
              <div
                key={item.tz}
                className="rounded-xl border border-border bg-surface p-3.5 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-foreground">{item.city}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                    {item.res.formattedDate}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-foreground">
                    {item.res.formattedTime}
                  </div>
                  <div className="text-[0.7rem] text-muted-foreground font-semibold">
                    {item.res.timeDifference}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
