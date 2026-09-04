import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight, Copy, Check } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import {
  UNIT_CATEGORIES,
  convertUnits,
  type UnitCategory,
} from "@/lib/calc-engines/unit-converter";

export const Route = createFileRoute("/unit-converter")({
  head: () => calcRouteHead("unit-converter"),
  component: UnitConverterPage,
});

function UnitConverterPage() {
  const calcMeta = getCalculatorBySlug("unit-converter")!;
  const [category, setCategory] = useState<UnitCategory>("length");
  const currentCatUnits = UNIT_CATEGORIES[category].units;

  const [fromUnit, setFromUnit] = useState<string>(currentCatUnits[0]?.id ?? "m");
  const [toUnit, setToUnit] = useState<string>(
    currentCatUnits[1]?.id ?? currentCatUnits[0]?.id ?? "km",
  );
  const [inputValue, setInputValue] = useState<string>("1");
  const [copied, setCopied] = useState(false);

  // When category changes, reset units
  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const units = UNIT_CATEGORIES[cat].units;
    setFromUnit(units[0]?.id ?? "");
    setToUnit(units[1]?.id ?? units[0]?.id ?? "");
  };

  const handleSwap = () => {
    const prevFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(prevFrom);
  };

  const numVal = parseFloat(inputValue);
  const conversion = useMemo(() => {
    if (Number.isNaN(numVal)) {
      return { result: 0, formula: "" };
    }
    return convertUnits(numVal, fromUnit, toUnit, category);
  }, [numVal, fromUnit, toUnit, category]);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(conversion.result.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-6">
        {/* Category switcher */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Select Measurement Category
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(UNIT_CATEGORIES) as UnitCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  category === cat
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface/80"
                }`}
              >
                {UNIT_CATEGORIES[cat].name}
              </button>
            ))}
          </div>
        </div>

        {/* Two-way conversion workspace */}
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          {/* From Column */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">From</label>
            <div className="space-y-2">
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                {currentCatUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="h-12 w-full rounded-xl border border-border bg-surface px-4 font-mono text-lg font-bold text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center sm:pb-2">
            <button
              type="button"
              onClick={handleSwap}
              className="grid size-11 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition-colors"
              title="Swap units"
              aria-label="Swap units"
            >
              <ArrowLeftRight className="size-4.5" />
            </button>
          </div>

          {/* To Column */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">To</label>
            <div className="space-y-2">
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                {currentCatUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
              <div className="flex h-12 w-full items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 px-4">
                <span className="font-mono text-lg font-bold text-emerald-900 dark:text-emerald-300 truncate">
                  {Number.isNaN(numVal) ? "0" : conversion.result}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formula output */}
        {conversion.formula ? (
          <div className="rounded-xl border border-border bg-surface/40 p-4 text-xs text-muted-foreground flex items-center justify-between">
            <span className="font-mono">{conversion.formula}</span>
            <span className="text-[0.7rem] text-emerald-600 font-semibold">Exact Conversion</span>
          </div>
        ) : null}
      </div>
    </CalcPageLayout>
  );
}
