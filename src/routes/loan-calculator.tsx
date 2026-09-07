import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateLoan } from "@/lib/calc-engines/loan-calculator";
import { detectDefaultCurrency, type CurrencyOption } from "@/lib/calc-currency";
import { CurrencySelector } from "@/components/calc/currency-selector";

export const Route = createFileRoute("/loan-calculator")({
  head: () => calcRouteHead("loan-calculator"),
  component: LoanCalculatorPage,
});

function LoanCalculatorPage() {
  const calcMeta = getCalculatorBySlug("loan-calculator")!;
  const [currency, setCurrency] = useState<CurrencyOption>(() => detectDefaultCurrency());
  const [loanAmountStr, setLoanAmountStr] = useState<string>("25000");
  const [annualRateStr, setAnnualRateStr] = useState<string>("6.5");
  const [termYearsStr, setTermYearsStr] = useState<string>("5");

  const loanAmount = parseFloat(loanAmountStr) || 0;
  const annualRate = parseFloat(annualRateStr) || 0;
  const termYears = parseFloat(termYearsStr) || 0;

  const result = useMemo(() => {
    return calculateLoan(loanAmount, annualRate, termYears * 12);
  }, [loanAmount, annualRate, termYears]);

  const numLocale = currency.code === "INR" ? "en-IN" : undefined;

  const getReportInput = useCallback((): CalcReportInput => {
    const formattedPayment = `${currency.symbol}${result.monthlyPayment.toFixed(2)}`;
    const formattedTotal = `${currency.symbol}${result.totalPayment.toFixed(2)}`;
    const formattedInterest = `${currency.symbol}${result.totalInterest.toFixed(2)}`;

    return buildCalcReportInput(
      "Loan Calculator",
      {
        "Loan Amount": `${currency.symbol}${loanAmount.toLocaleString(numLocale)}`,
        "Annual Interest Rate": `${annualRate}%`,
        "Loan Term": `${termYears} Years (${termYears * 12} Months)`,
      },
      formattedPayment,
      {
        metrics: [
          { label: "Total Loan Cost", value: formattedTotal },
          { label: "Total Interest Paid", value: formattedInterest },
          {
            label: "Interest to Principal",
            value: `${((result.totalInterest / (loanAmount || 1)) * 100).toFixed(1)}%`,
          },
        ],
        formula: "PMT = P × [r(1+r)^n] / [(1+r)^n - 1]",
        explanation: `A loan of ${currency.symbol}${loanAmount.toLocaleString(numLocale)} at ${annualRate}% over ${termYears} years requires ${termYears * 12} monthly payments of ${formattedPayment}, incurring a total interest charge of ${formattedInterest}.`,
      },
    );
  }, [currency, numLocale, loanAmount, annualRate, termYears, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-bold text-foreground">Loan Terms</h2>
              <CurrencySelector
                selectedCurrency={currency}
                onCurrencyChange={setCurrency}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Loan Amount ({currency.symbol})
              </label>
              <input
                type="number"
                min="0"
                value={loanAmountStr}
                onChange={(e) => setLoanAmountStr(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={annualRateStr}
                  onChange={(e) => setAnnualRateStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Loan Term (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={termYearsStr}
                  onChange={(e) => setTermYearsStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick term selection pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              {[2, 3, 4, 5, 7, 10].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTermYearsStr(String(yr))}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    termYears === yr
                      ? "bg-emerald-600 text-white"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {yr} Years
                </button>
              ))}
            </div>
          </div>

          {/* Annual Amortization Breakdown */}
          {result.amortization.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground">Annual Amortization</h3>
              <div className="max-h-60 overflow-y-auto rounded-xl border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-surface/60 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="py-2 px-3 text-left">Year</th>
                      <th className="py-2 px-3 text-right">Principal</th>
                      <th className="py-2 px-3 text-right">Interest</th>
                      <th className="py-2 px-3 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {result.amortization.map((row) => (
                      <tr key={row.year} className="hover:bg-surface/40">
                        <td className="py-1.5 px-3 font-semibold">Year {row.year}</td>
                        <td className="py-1.5 px-3 text-right">
                          {currency.symbol}
                          {row.principalPaid.toLocaleString(numLocale)}
                        </td>
                        <td className="py-1.5 px-3 text-right text-amber-600 font-medium">
                          {currency.symbol}
                          {row.interestPaid.toLocaleString(numLocale)}
                        </td>
                        <td className="py-1.5 px-3 text-right font-bold">
                          {currency.symbol}
                          {row.remainingBalance.toLocaleString(numLocale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Payment Summary</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Monthly Payment
              </span>
              <div className="mt-1 text-4xl font-extrabold text-foreground">
                {currency.symbol}
                {result.monthlyPayment.toFixed(2)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                per month for {termYears * 12} months
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Total Interest</span>
                <p className="mt-1 text-base font-bold text-amber-600">
                  {currency.symbol}
                  {result.totalInterest.toLocaleString(numLocale)}
                </p>
              </div>
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Total Payment</span>
                <p className="mt-1 text-base font-bold text-foreground">
                  {currency.symbol}
                  {result.totalPayment.toLocaleString(numLocale)}
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
