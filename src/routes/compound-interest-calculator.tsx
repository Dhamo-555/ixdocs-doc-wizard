import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import {
  calculateCompoundGrowth,
  type CompoundFrequency,
} from "@/lib/calc-engines/compound-interest-calculator";
import { detectDefaultCurrency, type CurrencyOption } from "@/lib/calc-currency";
import { CurrencySelector } from "@/components/calc/currency-selector";

export const Route = createFileRoute("/compound-interest-calculator")({
  head: () => calcRouteHead("compound-interest-calculator"),
  component: CompoundInterestCalculatorPage,
});

function CompoundInterestCalculatorPage() {
  const calcMeta = getCalculatorBySlug("compound-interest-calculator")!;
  const [currency, setCurrency] = useState<CurrencyOption>(() => detectDefaultCurrency());
  const [principalStr, setPrincipalStr] = useState<string>("5000");
  const [contributionStr, setContributionStr] = useState<string>("200");
  const [contributionFreq, setContributionFreq] = useState<"monthly" | "annually">("monthly");
  const [rateStr, setRateStr] = useState<string>("7.0");
  const [yearsStr, setYearsStr] = useState<string>("10");
  const [compoundFreq, setCompoundFreq] = useState<CompoundFrequency>("monthly");

  const principal = parseFloat(principalStr) || 0;
  const contribution = parseFloat(contributionStr) || 0;
  const rate = parseFloat(rateStr) || 0;
  const years = Math.max(1, parseInt(yearsStr, 10) || 1);

  const result = useMemo(() => {
    return calculateCompoundGrowth({
      principal,
      periodicContribution: contribution,
      contributionFrequency: contributionFreq,
      annualRatePercent: rate,
      years,
      compoundFrequency: compoundFreq,
    });
  }, [principal, contribution, contributionFreq, rate, years, compoundFreq]);

  const numLocale = currency.code === "INR" ? "en-IN" : undefined;

  const getReportInput = useCallback((): CalcReportInput => {
    const formattedFV = `${currency.symbol}${result.futureValue.toLocaleString(numLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formattedDeposits = `${currency.symbol}${result.totalContributions.toLocaleString(numLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formattedInterest = `${currency.symbol}${result.totalInterest.toLocaleString(numLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return buildCalcReportInput(
      "Compound Interest Calculator",
      {
        "Starting Principal": `${currency.symbol}${principal.toLocaleString(numLocale)}`,
        "Periodic Contribution": `${currency.symbol}${contribution.toLocaleString(numLocale)} (${contributionFreq})`,
        "Annual Return Rate": `${rate}%`,
        "Investment Duration": `${years} Years`,
        "Compounding Frequency": compoundFreq,
      },
      formattedFV,
      {
        metrics: [
          { label: "Total Contributions", value: formattedDeposits },
          { label: "Total Interest Earned", value: `+${formattedInterest}` },
        ],
        formula: "FV = P × (1 + r/n)^(n×t) + PMT × [((1 + r/n)^(n×t) - 1) / (r/n)]",
        explanation: `With an initial ${currency.symbol}${principal.toLocaleString(numLocale)} deposit and ${currency.symbol}${contribution.toLocaleString(numLocale)}/${contributionFreq} additions at ${rate}% annual return over ${years} years, the portfolio accumulates to ${formattedFV}.`,
      },
    );
  }, [currency, numLocale, principal, contribution, contributionFreq, rate, years, compoundFreq, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-bold text-foreground">Investment Parameters</h2>
              <CurrencySelector
                selectedCurrency={currency}
                onCurrencyChange={setCurrency}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Initial Principal ({currency.symbol})
                </label>
                <input
                  type="number"
                  min="0"
                  value={principalStr}
                  onChange={(e) => setPrincipalStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Regular Contribution ({currency.symbol})
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={contributionStr}
                    onChange={(e) => setContributionStr(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                  />
                  <select
                    value={contributionFreq}
                    onChange={(e) => setContributionFreq(e.target.value as "monthly" | "annually")}
                    className="rounded-xl border border-border bg-surface px-2.5 py-2.5 text-xs font-semibold text-foreground"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 pt-2 border-t border-border">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Annual Return (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={rateStr}
                  onChange={(e) => setRateStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Duration (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={yearsStr}
                  onChange={(e) => setYearsStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Compounding
                </label>
                <select
                  value={compoundFreq}
                  onChange={(e) => setCompoundFreq(e.target.value as CompoundFrequency)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground"
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>
          </div>

          {/* Yearly Schedule Table */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground">Yearly Growth Schedule</h3>
            <div className="max-h-64 overflow-y-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead className="bg-surface/60 border-b border-border text-muted-foreground">
                  <tr>
                    <th className="py-2 px-3 text-left">Year</th>
                    <th className="py-2 px-3 text-right">Deposits</th>
                    <th className="py-2 px-3 text-right">Interest</th>
                    <th className="py-2 px-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {result.yearlySchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-surface/40">
                      <td className="py-1.5 px-3 font-semibold">{row.year}</td>
                      <td className="py-1.5 px-3 text-right">
                        {currency.symbol}
                        {row.contributions.toLocaleString(numLocale)}
                      </td>
                      <td className="py-1.5 px-3 text-right text-emerald-600 font-medium">
                        +{currency.symbol}
                        {row.interestEarned.toLocaleString(numLocale)}
                      </td>
                      <td className="py-1.5 px-3 text-right font-bold">
                        {currency.symbol}
                        {row.endingBalance.toLocaleString(numLocale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Results Overview */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Projected Value</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Total Future Value ({years} Yrs)
              </span>
              <div className="mt-1 text-3xl font-extrabold text-foreground">
                {currency.symbol}
                {result.futureValue.toLocaleString(numLocale, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Total Deposits</span>
                <p className="mt-1 text-base font-bold text-foreground">
                  {currency.symbol}
                  {result.totalContributions.toLocaleString(numLocale)}
                </p>
              </div>
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Total Interest</span>
                <p className="mt-1 text-base font-bold text-emerald-600">
                  +{currency.symbol}
                  {result.totalInterest.toLocaleString(numLocale)}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <CalcPdfReportButton getReportInput={getReportInput} />
            </div>
          </div>
        </div>
      </div>
    </CalcPageLayout>
  );
}
