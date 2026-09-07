import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { CurrencySelector } from "@/components/calc/currency-selector";
import { detectDefaultCurrency, type CurrencyOption } from "@/lib/calc-currency";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateMortgage } from "@/lib/calc-engines/mortgage-calculator";

export const Route = createFileRoute("/mortgage-calculator")({
  head: () => calcRouteHead("mortgage-calculator"),
  component: MortgageCalculatorPage,
});

function MortgageCalculatorPage() {
  const calcMeta = getCalculatorBySlug("mortgage-calculator")!;
  const [currency, setCurrency] = useState<CurrencyOption>(detectDefaultCurrency);
  const [homePriceStr, setHomePriceStr] = useState("350000");
  const [downPaymentStr, setDownPaymentStr] = useState("70000");
  const [rateStr, setRateStr] = useState("6.5");
  const [termYears, setTermYears] = useState<number>(30);
  const [propertyTaxStr, setPropertyTaxStr] = useState("4200");
  const [insuranceStr, setInsuranceStr] = useState("1200");
  const [hoaStr, setHoaStr] = useState("0");

  const homePrice = parseFloat(homePriceStr) || 0;
  const downPayment = parseFloat(downPaymentStr) || 0;
  const rate = parseFloat(rateStr) || 0;
  const propertyTax = parseFloat(propertyTaxStr) || 0;
  const insurance = parseFloat(insuranceStr) || 0;
  const hoa = parseFloat(hoaStr) || 0;

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
        "Home Price": `${currency.symbol}${homePrice.toLocaleString()}`,
        "Down Payment": `${currency.symbol}${downPayment.toLocaleString()} (${downPct}%)`,
        "Loan Amount": `${currency.symbol}${result.loanAmount.toLocaleString()}`,
        "Interest Rate": `${rate}%`,
        "Loan Term": `${termYears} Years`,
      },
      `${currency.symbol}${result.totalMonthlyPayment.toFixed(2)} / month`,
      {
        metrics: [
          {
            label: "Principal & Interest",
            value: `${currency.symbol}${result.monthlyPrincipalInterest.toFixed(2)}`,
          },
          { label: "Property Tax", value: `${currency.symbol}${result.monthlyTax.toFixed(2)}` },
          {
            label: "Homeowners Insurance",
            value: `${currency.symbol}${result.monthlyInsurance.toFixed(2)}`,
          },
          ...(hoa > 0
            ? [{ label: "HOA Fees", value: `${currency.symbol}${result.monthlyHoa.toFixed(2)}` }]
            : []),
          {
            label: "Total Loan Interest",
            value: `${currency.symbol}${result.totalInterest.toLocaleString()}`,
          },
        ],
        formula: "Total Monthly = P&I + (Taxes / 12) + (Insurance / 12) + HOA",
        explanation: `For a ${currency.symbol}${homePrice.toLocaleString()} home with a ${currency.symbol}${downPayment.toLocaleString()} (${downPct}%) down payment, the monthly payment is estimated at ${currency.symbol}${result.totalMonthlyPayment.toFixed(2)}.`,
      },
    );
  }, [currency.symbol, homePrice, downPayment, downPct, rate, termYears, hoa, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground">Property & Loan Details</h2>
              <CurrencySelector value={currency} onChange={setCurrency} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Home Purchase Price ({currency.symbol})
                </label>
                <input
                  type="number"
                  min="0"
                  value={homePriceStr}
                  onChange={(e) => setHomePriceStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Down Payment ({currency.symbol}){" "}
                  <span className="font-normal text-muted-foreground">({downPct}%)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={downPaymentStr}
                  onChange={(e) => setDownPaymentStr(e.target.value)}
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
                  value={rateStr}
                  onChange={(e) => setRateStr(e.target.value)}
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
                  Property Tax ({currency.symbol}/yr)
                </label>
                <input
                  type="number"
                  min="0"
                  value={propertyTaxStr}
                  onChange={(e) => setPropertyTaxStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Home Insurance ({currency.symbol}/yr)
                </label>
                <input
                  type="number"
                  min="0"
                  value={insuranceStr}
                  onChange={(e) => setInsuranceStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  HOA Fees ({currency.symbol}/mo)
                </label>
                <input
                  type="number"
                  min="0"
                  value={hoaStr}
                  onChange={(e) => setHoaStr(e.target.value)}
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
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-foreground break-all">
                {currency.symbol}
                {result.totalMonthlyPayment.toFixed(2)}
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
                  {currency.symbol}
                  {result.monthlyPrincipalInterest.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Property Taxes</span>
                <span className="font-semibold text-foreground">
                  {currency.symbol}
                  {result.monthlyTax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Home Insurance</span>
                <span className="font-semibold text-foreground">
                  {currency.symbol}
                  {result.monthlyInsurance.toFixed(2)}
                </span>
              </div>
              {hoa > 0 && (
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">HOA Dues</span>
                  <span className="font-semibold text-foreground">
                    {currency.symbol}
                    {result.monthlyHoa.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Total Lifetime Interest</span>
                <span className="font-semibold text-amber-600">
                  {currency.symbol}
                  {result.totalInterest.toLocaleString()}
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
