export type InterestType = "simple" | "compound";
export type CompoundingFrequency = "annually" | "semiannually" | "quarterly" | "monthly" | "daily";

export interface InterestInput {
  principal: number;
  ratePercent: number; // e.g. 5 for 5%
  timeYears: number;
  type: InterestType;
  frequency?: CompoundingFrequency;
}

export interface YearScheduleItem {
  year: number;
  startBalance: number;
  interestEarned: number;
  endBalance: number;
}

export interface InterestCalculationResult {
  principal: number;
  totalInterest: number;
  finalBalance: number;
  effectiveRate: number;
  yearlySchedule: YearScheduleItem[];
  formulaUsed: string;
}

const FREQ_MAP: Record<CompoundingFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export function calculateInterest(input: InterestInput): InterestCalculationResult {
  const { principal, ratePercent, timeYears, type, frequency = "annually" } = input;

  if (principal < 0 || ratePercent < 0 || timeYears <= 0) {
    return {
      principal: Math.max(0, principal),
      totalInterest: 0,
      finalBalance: Math.max(0, principal),
      effectiveRate: 0,
      yearlySchedule: [],
      formulaUsed: "",
    };
  }

  const r = ratePercent / 100;
  const t = timeYears;
  const yearlySchedule: YearScheduleItem[] = [];

  if (type === "simple") {
    const totalInterest = principal * r * t;
    const finalBalance = principal + totalInterest;
    const annualInterest = principal * r;

    let runningBalance = principal;
    const wholeYears = Math.ceil(t);
    for (let yr = 1; yr <= wholeYears; yr++) {
      const yearFraction = yr === wholeYears && t % 1 !== 0 ? t % 1 : 1;
      const yrInterest = annualInterest * yearFraction;
      yearlySchedule.push({
        year: yr,
        startBalance: round2(runningBalance),
        interestEarned: round2(yrInterest),
        endBalance: round2(runningBalance + yrInterest),
      });
      runningBalance += yrInterest;
    }

    return {
      principal: round2(principal),
      totalInterest: round2(totalInterest),
      finalBalance: round2(finalBalance),
      effectiveRate: round2(ratePercent),
      yearlySchedule,
      formulaUsed: `Simple Interest = P × r × t = ${principal} × ${r} × ${t}`,
    };
  }

  // Compound Interest: A = P * (1 + r/n)^(n*t)
  const n = FREQ_MAP[frequency] || 1;
  const finalBalance = principal * Math.pow(1 + r / n, n * t);
  const totalInterest = finalBalance - principal;
  const effectiveAnnualRate = (Math.pow(1 + r / n, n) - 1) * 100;

  let currentBal = principal;
  const wholeYears = Math.ceil(t);
  for (let yr = 1; yr <= wholeYears; yr++) {
    const yearTime = yr === wholeYears && t % 1 !== 0 ? t : yr;
    const yrEndBal = principal * Math.pow(1 + r / n, n * yearTime);
    const yrInterest = yrEndBal - currentBal;
    yearlySchedule.push({
      year: yr,
      startBalance: round2(currentBal),
      interestEarned: round2(yrInterest),
      endBalance: round2(yrEndBal),
    });
    currentBal = yrEndBal;
  }

  return {
    principal: round2(principal),
    totalInterest: round2(totalInterest),
    finalBalance: round2(finalBalance),
    effectiveRate: round2(effectiveAnnualRate),
    yearlySchedule,
    formulaUsed: `A = P(1 + r/n)^(nt) = ${principal} × (1 + ${r}/${n})^(${n} × ${t})`,
  };
}

function round2(val: number): number {
  return Math.round(val * 100) / 100;
}
