import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateEmi } from "@/lib/calc-engines/emi-calculator";
import { detectDefaultCurrency, type CurrencyOption } from "@/lib/calc-currency";
import { CurrencySelector } from "@/components/calc/currency-selector";

export const Route = createFileRoute("/emi-calculator")({
  head: () => calcRouteHead("emi-calculator"),
  component: EmiCalculatorPage,
});

type TenureUnit = "years" | "months";

function EmiCalculatorPage() {
  const calcMeta = getCalculatorBySlug("emi-calculator")!;
  const [loanAmountStr, setLoanAmountStr] = useState<string>("1000000");
  const [rateStr, setRateStr] = useState<string>("8.5");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");
  const [tenureStr, setTenureStr] = useState<string>("15");
  const [currency, setCurrency] = useState<CurrencyOption>(() => detectDefaultCurrency());

  const loanAmount = Math.max(0, parseFloat(loanAmountStr) || 0);
  const rate = Math.max(0, parseFloat(rateStr) || 0);
  const rawTenure = Math.max(0, parseFloat(tenureStr) || 0);

  const tenureMonths = useMemo(() => {
    return tenureUnit === "years" ? Math.round(rawTenure * 12) : Math.round(rawTenure);
  }, [tenureUnit, rawTenure]);

  const result = useMemo(() => {
    return calculateEmi(loanAmount, rate, tenureMonths);
  }, [loanAmount, rate, tenureMonths]);

  const handleUnitToggle = useCallback(
    (unit: TenureUnit) => {
      if (unit === tenureUnit) return;
      if (unit === "months") {
        setTenureStr((Math.round(rawTenure * 12) || 12).toString());
      } else {
        setTenureStr((Math.round((rawTenure / 12) * 10) / 10 || 1).toString());
      }
      setTenureUnit(unit);
    },
    [tenureUnit, rawTenure],
  );

  const numLocale = currency.code === "INR" ? "en-IN" : undefined;

  const getReportInput = useCallback((): CalcReportInput => {
    const formattedEmi = `${currency.symbol}${result.monthlyEmi.toLocaleString(numLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    const formattedTotal = `${currency.symbol}${result.totalAmount.toLocaleString(numLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    const formattedInterest = `${currency.symbol}${result.totalInterest.toLocaleString(numLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    const tenureLabel =
      tenureUnit === "years"
        ? `${rawTenure} Years (${tenureMonths} Months)`
        : `${tenureMonths} Months (${(tenureMonths / 12).toFixed(1)} Years)`;

    return buildCalcReportInput(
      "EMI Calculator",
      {
        "Principal Loan Amount": `${currency.symbol}${loanAmount.toLocaleString(numLocale)}`,
        "Annual Interest Rate": `${rate}%`,
        "Loan Tenure": tenureLabel,
      },
      formattedEmi,
      {
        metrics: [
          { label: "Total Interest Payable", value: formattedInterest },
          { label: "Total Payment (Principal + Interest)", value: formattedTotal },
          { label: "Principal Ratio", value: `${result.principalPercent}%` },
          { label: "Interest Ratio", value: `${result.interestPercent}%` },
        ],
        formula: "EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]",
        explanation: `For a loan principal of ${currency.symbol}${loanAmount.toLocaleString(numLocale)} at ${rate}% per annum for ${tenureLabel}, monthly EMI is ${formattedEmi}. Total interest payable amounts to ${formattedInterest}.`,
      },
    );
  }, [currency, numLocale, loanAmount, rate, rawTenure, tenureMonths, tenureUnit, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7 min-w-0">
          <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-bold text-foreground">Loan Details</h2>
              <CurrencySelector selectedCurrency={currency} onCurrencyChange={setCurrency} />
            </div>

            {/* Principal Amount */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Principal Loan Amount ({currency.symbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  value={loanAmountStr}
                  onChange={(e) => setLoanAmountStr(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-border bg-background pl-8 pr-3.5 py-2.5 text-base sm:text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Rate and Tenure */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Annual Interest Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={rateStr}
                    onChange={(e) => setRateStr(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Loan Tenure</label>
                  <div className="inline-flex rounded-lg border border-border p-0.5 bg-surface text-[0.65rem] font-bold">
                    <button
                      type="button"
                      onClick={() => handleUnitToggle("years")}
                      className={`px-2 py-0.5 rounded-md transition ${
                        tenureUnit === "years"
                          ? "bg-emerald-600 text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      Years
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitToggle("months")}
                      className={`px-2 py-0.5 rounded-md transition ${
                        tenureUnit === "months"
                          ? "bg-emerald-600 text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      Months
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  max={tenureUnit === "years" ? 40 : 480}
                  value={tenureStr}
                  onChange={(e) => setTenureStr(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick tenure buttons */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-border">
              {(tenureUnit === "years" ? [5, 10, 15, 20, 25, 30] : [12, 24, 36, 60, 120, 240]).map(
                (val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTenureStr(val.toString())}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      rawTenure === val
                        ? "bg-emerald-600 text-white"
                        : "bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {val} {tenureUnit === "years" ? "Yrs" : "Mos"}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Yearly Amortization */}
          {result.amortization.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4 min-w-0">
              <h3 className="text-sm font-bold text-foreground">Repayment Schedule (Annual)</h3>
              <div className="max-h-60 overflow-x-auto rounded-xl border border-border overscroll-x-contain">
                <table className="w-full text-xs min-w-[280px] sm:min-w-[320px]">
                  <thead className="bg-surface/60 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="py-2 px-2.5 sm:px-3 text-left">Year</th>
                      <th className="py-2 px-2.5 sm:px-3 text-right">Principal Paid</th>
                      <th className="py-2 px-2.5 sm:px-3 text-right">Interest Paid</th>
                      <th className="py-2 px-2.5 sm:px-3 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {result.amortization.map((row) => (
                      <tr key={row.year} className="hover:bg-surface/40">
                        <td className="py-1.5 px-2.5 sm:px-3 font-semibold whitespace-nowrap">
                          Year {row.year}
                        </td>
                        <td className="py-1.5 px-2.5 sm:px-3 text-right whitespace-nowrap">
                          {currency.symbol}
                          {row.principalPaid.toLocaleString(numLocale)}
                        </td>
                        <td className="py-1.5 px-2.5 sm:px-3 text-right text-amber-600 font-medium whitespace-nowrap">
                          {currency.symbol}
                          {row.interestPaid.toLocaleString(numLocale)}
                        </td>
                        <td className="py-1.5 px-2.5 sm:px-3 text-right font-bold whitespace-nowrap">
                          {currency.symbol}
                          {row.balance.toLocaleString(numLocale)}
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
        <div className="space-y-6 lg:col-span-5 min-w-0">
          <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Monthly EMI</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 sm:p-5 min-w-0 overflow-hidden">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                Equated Monthly Installment
              </span>
              <div className="mt-1 text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight break-words">
                {currency.symbol}
                {result.monthlyEmi.toLocaleString(numLocale, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                per month for {tenureMonths} months
              </p>
            </div>

            {/* Principal vs Interest progress visual */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold gap-1">
                <span className="text-emerald-600">Principal ({result.principalPercent}%)</span>
                <span className="text-amber-600">Interest ({result.interestPercent}%)</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-surface flex">
                <div
                  style={{ width: `${result.principalPercent}%` }}
                  className="bg-emerald-600 transition-all"
                />
                <div
                  style={{ width: `${result.interestPercent}%` }}
                  className="bg-amber-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-border">
              <div className="rounded-xl border border-border p-3 sm:p-3.5 bg-surface/30 min-w-0">
                <span className="text-muted-foreground">Total Interest</span>
                <p className="mt-1 text-sm sm:text-base font-bold text-amber-600 break-words">
                  {currency.symbol}
                  {result.totalInterest.toLocaleString(numLocale)}
                </p>
              </div>
              <div className="rounded-xl border border-border p-3 sm:p-3.5 bg-surface/30 min-w-0">
                <span className="text-muted-foreground">Total Payment</span>
                <p className="mt-1 text-sm sm:text-base font-bold text-foreground break-words">
                  {currency.symbol}
                  {result.totalAmount.toLocaleString(numLocale)}
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
