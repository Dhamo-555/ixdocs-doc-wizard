/**
 * Fraction Calculator Engine
 */

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a * b)) / gcd(a, b);
}

export interface FractionResult {
  numerator: number;
  denominator: number;
  whole?: number | undefined;
  mixedRemainder?: number | undefined;
  decimal: number;
  steps: string[];
}

export function simplifyFraction(num: number, den: number): { num: number; den: number } {
  if (den === 0) throw new Error("Denominator cannot be zero");
  if (num === 0) return { num: 0, den: 1 };
  const sign = den < 0 ? -1 : 1;
  const divisor = gcd(num, den);
  return {
    num: (sign * num) / divisor,
    den: Math.abs(den) / divisor,
  };
}

export function calculateFractions(
  n1: number,
  d1: number,
  op: "+" | "-" | "×" | "÷",
  n2: number,
  d2: number,
): FractionResult {
  if (d1 === 0 || d2 === 0) {
    throw new Error("Denominator cannot be zero.");
  }

  let resNum = 0;
  let resDen = 1;
  const steps: string[] = [];

  if (op === "+" || op === "-") {
    const commonDen = lcm(d1, d2);
    const m1 = commonDen / d1;
    const m2 = commonDen / d2;
    const adjN1 = n1 * m1;
    const adjN2 = n2 * m2;

    steps.push(`Find common denominator of ${d1} and ${d2}: LCD = ${commonDen}`);
    steps.push(
      `Convert fractions: ${n1}/${d1} = ${adjN1}/${commonDen}, and ${n2}/${d2} = ${adjN2}/${commonDen}`,
    );

    if (op === "+") {
      resNum = adjN1 + adjN2;
      steps.push(`Add numerators: ${adjN1} + ${adjN2} = ${resNum}`);
    } else {
      resNum = adjN1 - adjN2;
      steps.push(`Subtract numerators: ${adjN1} - ${adjN2} = ${resNum}`);
    }
    resDen = commonDen;
  } else if (op === "×") {
    resNum = n1 * n2;
    resDen = d1 * d2;
    steps.push(`Multiply numerators: ${n1} × ${n2} = ${resNum}`);
    steps.push(`Multiply denominators: ${d1} × ${d2} = ${resDen}`);
  } else {
    // division
    if (n2 === 0) throw new Error("Cannot divide by zero fraction.");
    resNum = n1 * d2;
    resDen = d1 * n2;
    steps.push(`Invert divisor and multiply: (${n1}/${d1}) × (${d2}/${n2})`);
    steps.push(`Resulting fraction: ${resNum}/${resDen}`);
  }

  const simplified = simplifyFraction(resNum, resDen);
  const commonDiv = gcd(resNum, resDen);
  if (commonDiv > 1) {
    steps.push(
      `Simplify by dividing numerator and denominator by GCD (${commonDiv}): ${simplified.num}/${simplified.den}`,
    );
  }

  const decimal = Math.round((simplified.num / simplified.den) * 1000000) / 1000000;

  let whole: number | undefined;
  let mixedRemainder: number | undefined;
  if (Math.abs(simplified.num) >= simplified.den && simplified.den !== 1) {
    whole = Math.trunc(simplified.num / simplified.den);
    mixedRemainder = Math.abs(simplified.num % simplified.den);
    if (mixedRemainder > 0) {
      steps.push(`Convert to mixed number: ${whole} ${mixedRemainder}/${simplified.den}`);
    }
  }

  return {
    numerator: simplified.num,
    denominator: simplified.den,
    whole,
    mixedRemainder,
    decimal,
    steps,
  };
}
