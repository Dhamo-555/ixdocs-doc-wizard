/**
 * Fuel Cost & Trip Mileage Engine
 */

export interface FuelCostResult {
  fuelNeeded: number;
  totalCost: number;
  costPerDistanceUnit: number;
  costPerPassenger: number;
}

export function calculateFuelCost(
  distance: number,
  efficiency: number, // L/100km or MPG
  efficiencyUnit: "L_per_100km" | "km_per_L" | "mpg_us",
  pricePerUnit: number,
  passengers = 1,
): FuelCostResult {
  const d = Math.max(0, distance);
  const eff = Math.max(0.1, efficiency);
  const price = Math.max(0, pricePerUnit);
  const pass = Math.max(1, Math.floor(passengers));

  let fuelUnits = 0;
  if (efficiencyUnit === "L_per_100km") {
    fuelUnits = (d * eff) / 100;
  } else if (efficiencyUnit === "km_per_L") {
    fuelUnits = d / eff;
  } else {
    // MPG (miles per gallon)
    fuelUnits = d / eff;
  }

  const totalCost = fuelUnits * price;
  const costPerDist = d > 0 ? totalCost / d : 0;
  const costPerPass = totalCost / pass;

  const round2 = (n: number) => Math.round(n * 100) / 100;

  return {
    fuelNeeded: round2(fuelUnits),
    totalCost: round2(totalCost),
    costPerDistanceUnit: round2(costPerDist),
    costPerPassenger: round2(costPerPass),
  };
}
