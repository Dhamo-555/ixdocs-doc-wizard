import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateMortgage } from "@/lib/calc-engines/mortgage-calculator";

export const Route = createFileRoute("/mortgage-calculator")({
  head: () => calcRouteHead("mortgage-calculator"),
  component: MortgageCalculatorPage,
});

function MortgageCalculatorPage() {
  const calcMeta = getCalculatorBySlug("mortgage-calculator")!;
  const [homePrice, setHomePrice] = useState<number>(350000);
  const [downPayment, setDownPayment] = useState<number>(70000);
  const [rate, setRate] = useState<number>(6.5);
  const [termYears, setTermYears] = useState<number>(30);
  const [propertyTax, setPropertyTax] = useState<number>(4200);
  const [insurance, setInsurance] = useState<number>(1200);
  const [hoa, setHoa] = useState<number>(0);

  const result = useMemo(() => {
    return calculateMortgage({
      homePrice,
      downPayment,
      interestRate: rate,
      loanTermYears: termYears,
      annualPropertyTax: propertyTax,
      annualHomeInsurance: insurance,
      monthlyHoa: hoa,
    });
  }, [homePrice, downPayment, rate, termYears, propertyTax, insurance, hoa]);

  const downPct = homePrice > 0 ? Math.round((downPayment / homePrice) * 100) : 0;

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Mortgage Calculator",
      {
        "Home Price": `$${homePrice.toLocaleString()}`,
        "Down Payment": `$${downPayment.toLocaleString()} (${downPct}%)`,
        "Loan Amount": `$${result.loanAmount.toLocaleString()}`,
        "Interest Rate": `${rate}%`,
        "Loan Term": `${termYears} Years`,
      },
      `$${result.totalMonthlyPayment.toFixed(2)} / month`,
      {
        metrics: [
          {
            label: "Principal & Interest",
            value: `$${result.monthlyPrincipalInterest.toFixed(2)}`,
          },
          { label: "Property Tax", value: `$${result.monthlyTax.toFixed(2)}` },
          { label: "Homeowners Insurance", value: `$${result.monthlyInsurance.toFixed(2)}` },
          ...(hoa > 0 ? [{ label: "HOA Fees", value: `$${result.monthlyHoa.toFixed(2)}` }] : []),
          { label: "Total Loan Interest", value: `$${result.totalInterest.toLocaleString()}` },
        ],
        formula: "Total Monthly = P&I + (Taxes / 12) + (Insurance / 12) + HOA",
        explanation: `For a $${homePrice.toLocaleString()} home with a $${downPayment.toLocaleString()} (${downPct}%) down payment, the monthly payment is estimated at $${result.totalMonthlyPayment.toFixed(2)}.`,
      },
    );
  }, [homePrice, downPayment, downPct, rate, termYears, hoa, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Property & Loan Details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Home Purchase Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Down Payment ($){" "}
                  <span className="font-normal text-muted-foreground">({downPct}%)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
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
                  Loan Term (Years)
                </label>
                <div className="flex gap-2">
                  {[15, 20, 30].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setTermYears(yr)}
                      className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                        termYears === yr
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {yr} Yrs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Taxes & Insurance */}
            <div className="grid gap-4 sm:grid-cols-3 pt-2 border-t border-border">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Property Tax ($/yr)
                </label>
                <input
                  type="number"
                  min="0"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Home Insurance ($/yr)
                </label>
                <input
                  type="number"
                  min="0"
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  HOA Fees ($/mo)
                </label>
                <input
                  type="number"
                  min="0"
                  value={hoa}
                  onChange={(e) => setHoa(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Monthly Payment</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Total Monthly PITI
              </span>
              <div className="mt-1 text-4xl font-extrabold text-foreground">
                ${result.totalMonthlyPayment.toFixed(2)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Principal, Interest, Taxes & Insurance
              </p>
            </div>

            {/* Breakdown line items */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Principal & Interest</span>
                <span className="font-bold text-foreground">
                  ${result.monthlyPrincipalInterest.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Property Taxes</span>
                <span className="font-semibold text-foreground">
                  ${result.monthlyTax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Home Insurance</span>
                <span className="font-semibold text-foreground">
                  ${result.monthlyInsurance.toFixed(2)}
                </span>
              </div>
              {hoa > 0 && (
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">HOA Dues</span>
                  <span className="font-semibold text-foreground">
                    ${result.monthlyHoa.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Total Lifetime Interest</span>
                <span className="font-semibold text-amber-600">
                  ${result.totalInterest.toLocaleString()}
                </span>
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
