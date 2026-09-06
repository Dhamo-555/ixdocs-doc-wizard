/**
 * Ratio Calculator Engine
 */
import { gcd } from "./fraction-calculator";

export interface SimplifiedRatio {
  a: number;
  b: number;
  decimalRatio: number;
  percentageA: number;
  percentageB: number;
}

export function simplifyRatio(a: number, b: number): SimplifiedRatio {
  if (b === 0) throw new Error("Second term cannot be zero.");
  const factor = gcd(a, b);
  const simpA = a / factor;
  const simpB = b / factor;
  const total = a + b;
  return {
    a: simpA,
    b: simpB,
    decimalRatio: Math.round((a / b) * 10000) / 10000,
    percentageA: total > 0 ? Math.round((a / total) * 100 * 100) / 100 : 0,
    percentageB: total > 0 ? Math.round((b / total) * 100 * 100) / 100 : 0,
  };
}

export function solveProportion(
  a: number | null,
  b: number | null,
  c: number | null,
  d: number | null,
): { missing: "A" | "B" | "C" | "D"; value: number; explanation: string } {
  // A / B = C / D  => A*D = B*C
  if (a === null && b !== null && c !== null && d !== null) {
    if (d === 0) throw new Error("Denominator cannot be 0");
    const val = (b * c) / d;
    return {
      missing: "A",
      value: Math.round(val * 10000) / 10000,
      explanation: `A = (B × C) ÷ D = (${b} × ${c}) ÷ ${d} = ${val}`,
    };
  }
  if (b === null && a !== null && c !== null && d !== null) {
    if (c === 0) throw new Error("Cannot divide by 0");
    const val = (a * d) / c;
    return {
      missing: "B",
      value: Math.round(val * 10000) / 10000,
      explanation: `B = (A × D) ÷ C = (${a} × ${d}) ÷ ${c} = ${val}`,
    };
  }
  if (c === null && a !== null && b !== null && d !== null) {
    if (b === 0) throw new Error("Cannot divide by 0");
    const val = (a * d) / b;
    return {
      missing: "C",
      value: Math.round(val * 10000) / 10000,
      explanation: `C = (A × D) ÷ B = (${a} × ${d}) ÷ ${b} = ${val}`,
    };
  }
  if (d === null && a !== null && b !== null && c !== null) {
    if (a === 0) throw new Error("Cannot divide by 0");
    const val = (b * c) / a;
    return {
      missing: "D",
      value: Math.round(val * 10000) / 10000,
      explanation: `D = (B × C) ÷ A = (${b} × ${c}) ÷ ${a} = ${val}`,
    };
  }
  throw new Error("Exactly one value must be empty to solve.");
}
