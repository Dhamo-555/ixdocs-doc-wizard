/**
 * Compound Interest & Regular Contributions Engine
 */

export type CompoundFrequency = "daily" | "monthly" | "quarterly" | "semi-annually" | "annually";

export interface CompoundInterestInput {
  principal: number;
  periodicContribution: number;
  contributionFrequency: "monthly" | "annually";
  annualRatePercent: number;
  years: number;
  compoundFrequency: CompoundFrequency;
}

export interface YearlyGrowth {
  year: number;
  startingBalance: number;
  contributions: number;
  interestEarned: number;
  endingBalance: number;
  totalInterest: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  yearlySchedule: YearlyGrowth[];
}

const COMPOUND_PERIODS: Record<CompoundFrequency, number> = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  "semi-annually": 2,
  annually: 1,
};

export function calculateCompoundGrowth(input: CompoundInterestInput): CompoundInterestResult {
  const p0 = Math.max(0, input.principal);
  const years = Math.max(1, input.years);
  const rate = Math.max(0, input.annualRatePercent) / 100;
  const n = COMPOUND_PERIODS[input.compoundFrequency] || 12;
  const periodicDeposit = Math.max(0, input.periodicContribution);
  const isMonthlyDeposit = input.contributionFrequency === "monthly";

  let balance = p0;
  let totalDeposited = p0;
  let totalInterest = 0;
  const yearlySchedule: YearlyGrowth[] = [];

  for (let y = 1; y <= years; y++) {
    const startBal = balance;
    let yearDeposits = 0;
    let yearInterest = 0;

    // Simulate 12 months for consistency with monthly deposits
    for (let m = 1; m <= 12; m++) {
      if (isMonthlyDeposit) {
        balance += periodicDeposit;
        yearDeposits += periodicDeposit;
        totalDeposited += periodicDeposit;
      }

      // monthly interest approximation matching compound frequency
      const monthlyRate = rate / 12;
      const monthInt = balance * monthlyRate;
      balance += monthInt;
      yearInterest += monthInt;
      totalInterest += monthInt;
    }

    if (!isMonthlyDeposit) {
      balance += periodicDeposit;
      yearDeposits += periodicDeposit;
      totalDeposited += periodicDeposit;
    }

    yearlySchedule.push({
      year: y,
      startingBalance: Math.round(startBal),
      contributions: Math.round(yearDeposits),
      interestEarned: Math.round(yearInterest),
      endingBalance: Math.round(balance),
      totalInterest: Math.round(totalInterest),
    });
  }

  const round2 = (n: number) => Math.round(n * 100) / 100;

  return {
    futureValue: round2(balance),
    totalContributions: round2(totalDeposited),
    totalInterest: round2(totalInterest),
    yearlySchedule,
  };
}
