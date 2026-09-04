export type UnitCategory = "length" | "mass" | "temperature" | "speed" | "volume" | "area" | "data";

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  // Factor to base unit (e.g. meter, gram, m/s, liter, m², bytes)
  toBase?: (val: number) => number;
  fromBase?: (baseVal: number) => number;
  factor?: number; // ratio to base unit if linear
}

export const UNIT_CATEGORIES: Record<UnitCategory, { name: string; units: UnitDefinition[] }> = {
  length: {
    name: "Length",
    units: [
      { id: "m", name: "Meter", symbol: "m", factor: 1 },
      { id: "km", name: "Kilometer", symbol: "km", factor: 1000 },
      { id: "cm", name: "Centimeter", symbol: "cm", factor: 0.01 },
      { id: "mm", name: "Millimeter", symbol: "mm", factor: 0.001 },
      { id: "in", name: "Inch", symbol: "in", factor: 0.0254 },
      { id: "ft", name: "Foot", symbol: "ft", factor: 0.3048 },
      { id: "yd", name: "Yard", symbol: "yd", factor: 0.9144 },
      { id: "mi", name: "Mile", symbol: "mi", factor: 1609.344 },
    ],
  },
  mass: {
    name: "Mass / Weight",
    units: [
      { id: "kg", name: "Kilogram", symbol: "kg", factor: 1 },
      { id: "g", name: "Gram", symbol: "g", factor: 0.001 },
      { id: "mg", name: "Milligram", symbol: "mg", factor: 0.000001 },
      { id: "lb", name: "Pound", symbol: "lb", factor: 0.45359237 },
      { id: "oz", name: "Ounce", symbol: "oz", factor: 0.028349523125 },
      { id: "t", name: "Metric Ton", symbol: "t", factor: 1000 },
    ],
  },
  temperature: {
    name: "Temperature",
    units: [
      {
        id: "c",
        name: "Celsius",
        symbol: "°C",
        toBase: (c) => c,
        fromBase: (c) => c,
      },
      {
        id: "f",
        name: "Fahrenheit",
        symbol: "°F",
        toBase: (f) => ((f - 32) * 5) / 9,
        fromBase: (c) => (c * 9) / 5 + 32,
      },
      {
        id: "k",
        name: "Kelvin",
        symbol: "K",
        toBase: (k) => k - 273.15,
        fromBase: (c) => c + 273.15,
      },
    ],
  },
  speed: {
    name: "Speed",
    units: [
      { id: "mps", name: "Meters per second", symbol: "m/s", factor: 1 },
      { id: "kmh", name: "Kilometers per hour", symbol: "km/h", factor: 1 / 3.6 },
      { id: "mph", name: "Miles per hour", symbol: "mph", factor: 0.44704 },
      { id: "kn", name: "Knot", symbol: "kn", factor: 0.514444 },
    ],
  },
  volume: {
    name: "Volume",
    units: [
      { id: "l", name: "Liter", symbol: "L", factor: 1 },
      { id: "ml", name: "Milliliter", symbol: "mL", factor: 0.001 },
      { id: "m3", name: "Cubic Meter", symbol: "m³", factor: 1000 },
      { id: "gal", name: "US Gallon", symbol: "gal", factor: 3.78541 },
      { id: "floz", name: "US Fluid Ounce", symbol: "fl oz", factor: 0.0295735 },
      { id: "cup", name: "US Cup", symbol: "cup", factor: 0.236588 },
    ],
  },
  area: {
    name: "Area",
    units: [
      { id: "sqm", name: "Square Meter", symbol: "m²", factor: 1 },
      { id: "sqkm", name: "Square Kilometer", symbol: "km²", factor: 1000000 },
      { id: "sqft", name: "Square Foot", symbol: "ft²", factor: 0.092903 },
      { id: "sqyd", name: "Square Yard", symbol: "yd²", factor: 0.836127 },
      { id: "acre", name: "Acre", symbol: "ac", factor: 4046.86 },
      { id: "ha", name: "Hectare", symbol: "ha", factor: 10000 },
    ],
  },
  data: {
    name: "Data Storage",
    units: [
      { id: "b", name: "Byte", symbol: "B", factor: 1 },
      { id: "kb", name: "Kilobyte", symbol: "KB", factor: 1024 },
      { id: "mb", name: "Megabyte", symbol: "MB", factor: 1024 * 1024 },
      { id: "gb", name: "Gigabyte", symbol: "GB", factor: 1024 * 1024 * 1024 },
      { id: "tb", name: "Terabyte", symbol: "TB", factor: 1024 * 1024 * 1024 * 1024 },
    ],
  },
};

export function convertUnits(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  category: UnitCategory,
): { result: number; formula: string } {
  if (!Number.isFinite(value)) {
    return { result: 0, formula: "" };
  }

  const cat = UNIT_CATEGORIES[category];
  const fromUnit = cat.units.find((u) => u.id === fromUnitId);
  const toUnit = cat.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) {
    return { result: value, formula: "" };
  }

  if (fromUnitId === toUnitId) {
    return { result: value, formula: `${value} ${fromUnit.symbol} = ${value} ${toUnit.symbol}` };
  }

  let baseVal: number;
  if (fromUnit.toBase) {
    baseVal = fromUnit.toBase(value);
  } else {
    baseVal = value * (fromUnit.factor ?? 1);
  }

  let finalVal: number;
  if (toUnit.fromBase) {
    finalVal = toUnit.fromBase(baseVal);
  } else {
    finalVal = baseVal / (toUnit.factor ?? 1);
  }

  const rounded = parseFloat(finalVal.toPrecision(10));
  return {
    result: rounded,
    formula: `${value} ${fromUnit.symbol} = ${rounded} ${toUnit.symbol}`,
  };
}
