import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateEmi } from "@/lib/calc-engines/emi-calculator";

export const Route = createFileRoute("/emi-calculator")({
  head: () => calcRouteHead("emi-calculator"),
  component: EmiCalculatorPage,
});

function EmiCalculatorPage() {
  const calcMeta = getCalculatorBySlug("emi-calculator")!;
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(15);

  const result = useMemo(() => {
    return calculateEmi(loanAmount, rate, tenureYears * 12);
  }, [loanAmount, rate, tenureYears]);

  const getReportInput = useCallback((): CalcReportInput => {
    const formattedEmi = `₹${result.monthlyEmi.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formattedTotal = `₹${result.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formattedInterest = `₹${result.totalInterest.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return buildCalcReportInput(
      "EMI Calculator",
      {
        "Principal Loan Amount": `₹${loanAmount.toLocaleString("en-IN")}`,
        "Annual Interest Rate": `${rate}%`,
        "Loan Tenure": `${tenureYears} Years (${tenureYears * 12} Months)`,
      },
      formattedEmi,
      {
        metrics: [
          { label: "Total Interest Payable", value: formattedInterest },
          { label: "Total Payment (Principal + Interest)", value: formattedTotal },
          { label: "Interest Ratio", value: `${result.interestPercent}%` },
        ],
        formula: "EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]",
        explanation: `For a loan principal of ₹${loanAmount.toLocaleString("en-IN")} at ${rate}% per annum for ${tenureYears} years, your monthly EMI is ${formattedEmi}. Total interest payable amounts to ${formattedInterest}.`,
      },
    );
  }, [loanAmount, rate, tenureYears, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Loan Details</h2>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Loan Amount (₹ / $)
              </label>
              <input
                type="number"
                min="0"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Tenure (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="35"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick tenure buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              {[5, 10, 15, 20, 25, 30].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTenureYears(yr)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    tenureYears === yr
                      ? "bg-emerald-600 text-white"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {yr} Yrs
                </button>
              ))}
            </div>
          </div>

          {/* Yearly Amortization */}
          {result.amortization.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground">Repayment Schedule</h3>
              <div className="max-h-60 overflow-y-auto rounded-xl border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-surface/60 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="py-2 px-3 text-left">Year</th>
                      <th className="py-2 px-3 text-right">Principal Paid</th>
                      <th className="py-2 px-3 text-right">Interest Paid</th>
                      <th className="py-2 px-3 text-right">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {result.amortization.map((row) => (
                      <tr key={row.year} className="hover:bg-surface/40">
                        <td className="py-1.5 px-3 font-semibold">Year {row.year}</td>
                        <td className="py-1.5 px-3 text-right">
                          {row.principalPaid.toLocaleString()}
                        </td>
                        <td className="py-1.5 px-3 text-right text-amber-600 font-medium">
                          {row.interestPaid.toLocaleString()}
                        </td>
                        <td className="py-1.5 px-3 text-right font-bold">
                          {row.balance.toLocaleString()}
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
            <h2 className="text-base font-bold text-foreground">Monthly EMI</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Equated Monthly Installment
              </span>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-foreground">
                {result.monthlyEmi.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                per month for {tenureYears * 12} months
              </p>
            </div>

            {/* Principal vs Interest progress visual */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-600">Principal ({result.principalPercent}%)</span>
                <span className="text-amber-600">Interest ({result.interestPercent}%)</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-surface flex">
                <div style={{ width: `${result.principalPercent}%` }} className="bg-emerald-600" />
                <div style={{ width: `${result.interestPercent}%` }} className="bg-amber-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border">
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Total Interest</span>
                <p className="mt-1 text-base font-bold text-amber-600">
                  {result.totalInterest.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Total Amount</span>
                <p className="mt-1 text-base font-bold text-foreground">
                  {result.totalAmount.toLocaleString()}
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
