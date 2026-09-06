import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { CalcPageLayout } from "@/components/calc/calc-page-layout";
import { CalcPdfReportButton } from "@/components/calc/calc-pdf-report-button";
import { getCalculatorBySlug, calcRouteHead } from "@/lib/calculators";
import { buildCalcReportInput, type CalcReportInput } from "@/lib/calc-pdf-report";
import { calculateFuelCost } from "@/lib/calc-engines/fuel-cost-calculator";

export const Route = createFileRoute("/fuel-cost-calculator")({
  head: () => calcRouteHead("fuel-cost-calculator"),
  component: FuelCostCalculatorPage,
});

function FuelCostCalculatorPage() {
  const calcMeta = getCalculatorBySlug("fuel-cost-calculator")!;
  const [distance, setDistance] = useState<number>(350);
  const [efficiency, setEfficiency] = useState<number>(7.5);
  const [efficiencyUnit, setEfficiencyUnit] = useState<"L_per_100km" | "km_per_L" | "mpg_us">(
    "L_per_100km",
  );
  const [pricePerUnit, setPricePerUnit] = useState<number>(1.65);
  const [passengers, setPassengers] = useState<number>(2);

  const result = useMemo(() => {
    return calculateFuelCost(distance, efficiency, efficiencyUnit, pricePerUnit, passengers);
  }, [distance, efficiency, efficiencyUnit, pricePerUnit, passengers]);

  const getReportInput = useCallback((): CalcReportInput => {
    return buildCalcReportInput(
      "Fuel Cost Calculator",
      {
        Distance: `${distance} ${efficiencyUnit === "mpg_us" ? "miles" : "km"}`,
        Efficiency: `${efficiency} ${efficiencyUnit.replace(/_/g, " ")}`,
        "Fuel Price": `$${pricePerUnit.toFixed(2)} per unit`,
        Passengers: `${passengers}`,
      },
      `$${result.totalCost.toFixed(2)} total ($${result.costPerPassenger.toFixed(2)} each)`,
      {
        metrics: [
          { label: "Total Fuel Required", value: `${result.fuelNeeded} units` },
          { label: "Total Fuel Cost", value: `$${result.totalCost.toFixed(2)}` },
          { label: "Cost per Passenger", value: `$${result.costPerPassenger.toFixed(2)}` },
          { label: "Cost per Distance Unit", value: `$${result.costPerDistanceUnit.toFixed(2)}` },
        ],
        formula: "Fuel = Distance × Consumption; Cost = Fuel × Price / Passengers",
        explanation: `Driving ${distance} units at an efficiency of ${efficiency} consumes ${result.fuelNeeded} units of fuel. At $${pricePerUnit.toFixed(2)}/unit, total trip cost is $${result.totalCost.toFixed(2)}, or $${result.costPerPassenger.toFixed(2)} split across ${passengers} passengers.`,
      },
    );
  }, [distance, efficiency, efficiencyUnit, pricePerUnit, passengers, result]);

  return (
    <CalcPageLayout calc={calcMeta}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Trip Details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Trip Distance ({efficiencyUnit === "mpg_us" ? "miles" : "km"})
                </label>
                <input
                  type="number"
                  min="0"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Fuel Price ($/L or $/gal)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-lg font-bold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Fuel Efficiency */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Fuel Consumption / Efficiency
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={efficiency}
                  onChange={(e) => setEfficiency(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Efficiency Unit
                </label>
                <select
                  value={efficiencyUnit}
                  onChange={(e) =>
                    setEfficiencyUnit(e.target.value as "L_per_100km" | "km_per_L" | "mpg_us")
                  }
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                >
                  <option value="L_per_100km">Liters per 100 km (L/100km)</option>
                  <option value="km_per_L">Kilometers per Liter (km/L)</option>
                  <option value="mpg_us">Miles per Gallon (US MPG)</option>
                </select>
              </div>
            </div>

            {/* Passengers */}
            <div className="pt-2 border-t border-border space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground">
                Passengers (Split Expense)
              </label>
              <div className="flex items-center gap-3">
                <Users className="size-5 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                    disabled={passengers <= 1}
                    className="size-8 rounded-lg border border-border bg-surface text-foreground font-bold hover:bg-muted disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-foreground">
                    {passengers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPassengers((p) => p + 1)}
                    className="size-8 rounded-lg border border-border bg-surface text-foreground font-bold hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-foreground">Estimated Trip Cost</h2>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Cost per Passenger
              </span>
              <div className="mt-1 text-4xl font-extrabold text-foreground">
                ${result.costPerPassenger.toFixed(2)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Total trip gas cost: ${result.totalCost.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">Fuel Required</span>
                <p className="mt-1 text-base font-bold text-foreground">
                  {result.fuelNeeded} {efficiencyUnit === "mpg_us" ? "gallons" : "liters"}
                </p>
              </div>
              <div className="rounded-xl border border-border p-3.5 bg-surface/30">
                <span className="text-muted-foreground">
                  Cost per {efficiencyUnit === "mpg_us" ? "Mile" : "Km"}
                </span>
                <p className="mt-1 text-base font-bold text-foreground">
                  ${result.costPerDistanceUnit.toFixed(2)}
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
