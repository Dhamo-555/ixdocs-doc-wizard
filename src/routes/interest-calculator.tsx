import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import {
  calculateInterest,
  type InterestType,
  type CompoundingFrequency,
} from "@/lib/calc-engines/interest-calculator";
import { detectDefaultCurrency, type CurrencyOption } from "@/lib/calc-currency";
import { CurrencySelector } from "@/components/calc/currency-selector";

export const Route = createFileRoute("/interest-calculator")({
  head: () => calcRouteHead("interest-calculator"),
  component: InterestCalculatorPage,
});

function InterestCalculatorPage() {
  const calcMeta = getCalculatorBySlug("interest-calculator")!;
  const [currency, setCurrency] = useState<CurrencyOption>(() => detectDefaultCurrency());
  const [principalStr, setPrincipalStr] = useState<string>("10000");
  const [rateStr, setRateStr] = useState<string>("6.5");
  const [yearsStr, setYearsStr] = useState<string>("5");
  const [type, setType] = useState<InterestType>("compound");
  const [frequency, setFrequency] = useState<CompoundingFrequency>("monthly");

  const principal = parseFloat(principalStr) || 0;
  const rate = parseFloat(rateStr) || 0;
  const years = Math.max(1, parseInt(yearsStr, 10) || 1);

  const result = useMemo(() => {
    return calculateInterest({
      principal: principal || 0,
      ratePercent: rate || 0,
      timeYears: years || 1,
      type,
      frequency,
    });
  }, [principal, rate, years, type, frequency]);

  const numLocale = currency.code === "INR" ? "en-IN" : undefined;

  const getReportInput = useCallback((): CalcReportInput => {
    const formattedBalance = `${currency.symbol}${result.finalBalance.toLocaleString(numLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    const formattedInterest = `${currency.symbol}${result.totalInterest.toLocaleString(numLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    const returnPct = (
      result.principal > 0 ? (result.totalInterest / result.principal) * 100 : 0
    ).toFixed(1);

    return buildCalcReportInput(
      "Interest Calculator",
      {
        "Principal Amount": `${currency.symbol}${principal.toLocaleString(numLocale)}`,
        "Annual Interest Rate": `${rate}%`,
        "Investment Duration": `${years} Year${years > 1 ? "s" : ""}`,
        "Calculation Model": type === "compound" ? "Compound Interest" : "Simple Interest",
        ...(type === "compound" ? { "Compounding Frequency": frequency } : {}),
      },
      formattedBalance,
      {
        metrics: [
          { label: "Total Interest", value: `+${formattedInterest}` },
          { label: "Total Return", value: `${returnPct}%` },
          { label: "Effective APY", value: `${result.effectiveRate.toFixed(2)}%` },
        ],
        formula: type === "compound" ? "A = P * (1 + r / n)^(n * t)" : "A = P * (1 + r * t)",
        explanation: `Calculated ${type === "compound" ? "compound" : "simple"} interest on ${currency.symbol}${principal.toLocaleString(numLocale)} at ${rate}% over ${years} years.`,
      },
    );
  }, [currency, numLocale, principal, rate, years, type, frequency, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border pb-3">
          <span className="text-xs font-semibold text-muted-foreground">Options</span>
          <CurrencySelector
            selectedCurrency={currency}
            onCurrencyChange={setCurrency}
          />
        </div>

        {/* Input parameters */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Initial Principal ({currency.symbol})
            </label>
            <input
              type="number"
              min="0"
              value={principalStr}
              onChange={(e) => setPrincipalStr(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 font-mono text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={rateStr}
              onChange={(e) => setRateStr(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 font-mono text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Duration (Years)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={yearsStr}
              onChange={(e) => setYearsStr(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 font-mono text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Calculation Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as InterestType)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="compound">Compound Interest</option>
              <option value="simple">Simple Interest</option>
            </select>
          </div>
        </div>

        {/* Compounding frequency option (if compound) */}
        {type === "compound" ? (
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Compounding Frequency
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "daily", label: "Daily (365/yr)" },
                { id: "monthly", label: "Monthly (12/yr)" },
                { id: "quarterly", label: "Quarterly (4/yr)" },
                { id: "semiannually", label: "Semiannually (2/yr)" },
                { id: "annually", label: "Annually (1/yr)" },
              ].map((freq) => (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => setFrequency(freq.id as CompoundingFrequency)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    frequency === freq.id
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Highlight Result Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              Total Accrued Balance
            </div>
            <div className="mt-1 font-mono text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {currency.symbol}
              {result.finalBalance.toLocaleString(numLocale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="mt-1 text-xs text-muted-foreground font-medium">
              Principal + Interest
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Interest Earned
            </div>
            <div className="mt-1 font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              +{currency.symbol}
              {result.totalInterest.toLocaleString(numLocale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="mt-1 text-xs text-muted-foreground font-medium">
              {(result.principal > 0 ? (result.totalInterest / result.principal) * 100 : 0).toFixed(
                1,
              )}
              % total return
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Effective Annual Rate (APY)
            </div>
            <div className="mt-1 font-mono text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {result.effectiveRate.toFixed(2)}%
            </div>
            <div className="mt-1 text-xs text-muted-foreground font-medium">
              Compound yield rate
            </div>
          </div>
        </div>

        {/* Action Bar: Download PDF Report */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-border bg-surface/60 p-4">
          <div>
            <div className="text-xs font-bold text-foreground">PDF Calculation Report</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Download complete calculation breakdown and growth metrics as a PDF document.
            </div>
          </div>
          <CalcPdfReportButton
            getInput={getReportInput}
            filename={`Interest-Report-${principal}`}
            label="Download PDF Report"
            variant="primary"
          />
        </div>

        {/* Growth Table */}
        {result.yearlySchedule.length > 0 ? (
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="size-4 text-emerald-600" />
              <span>Year-by-Year Growth Schedule</span>
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-surface border-b border-border text-xs text-muted-foreground uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Starting Balance</th>
                    <th className="px-4 py-3">Interest Earned</th>
                    <th className="px-4 py-3">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card font-mono">
                  {result.yearlySchedule.map((item) => (
                    <tr key={item.year} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-foreground">Year {item.year}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {currency.symbol}
                        {item.startBalance.toLocaleString(numLocale, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-emerald-600 font-semibold">
                        +{currency.symbol}
                        {item.interestEarned.toLocaleString(numLocale, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-foreground">
                        {currency.symbol}
                        {item.endBalance.toLocaleString(numLocale, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </CalcPageLayout>
  );
}
