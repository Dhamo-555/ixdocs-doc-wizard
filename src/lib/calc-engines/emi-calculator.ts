/**
 * EMI (Equated Monthly Installment) Calculator Engine
 */

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalAmount: number;
  interestPercent: number;
  principalPercent: number;
  amortization: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    balance: number;
  }[];
}

export function calculateEmi(
  principal: number,
  annualRatePct: number,
  tenureMonths: number,
): EmiResult {
  const p = Math.max(0, principal);
  const n = Math.max(1, Math.round(tenureMonths));
  const rate = Math.max(0, annualRatePct);

  if (p === 0) {
    return {
      monthlyEmi: 0,
      totalInterest: 0,
      totalAmount: 0,
      interestPercent: 0,
      principalPercent: 0,
      amortization: [],
    };
  }

  const r = rate > 0 ? rate / (12 * 100) : 0;
  let emi = 0;

  if (r === 0) {
    emi = p / n;
  } else {
    const factor = Math.pow(1 + r, n);
    emi = (p * r * factor) / (factor - 1);
  }

  const totalAmount = emi * n;
  const totalInterest = Math.max(0, totalAmount - p);

  const interestPercent = totalAmount > 0 ? Math.round((totalInterest / totalAmount) * 100) : 0;
  const principalPercent = totalAmount > 0 ? 100 - interestPercent : 0;

  // Yearly schedule
  const amortization: EmiResult["amortization"] = [];
  let balance = p;
  let yearP = 0;
  let yearI = 0;

  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    const princ = emi - interest;
    balance = Math.max(0, balance - princ);
    yearI += interest;
    yearP += princ;

    if (m % 12 === 0 || m === n) {
      amortization.push({
        year: Math.ceil(m / 12),
        principalPaid: Math.round(yearP),
        interestPaid: Math.round(yearI),
        balance: Math.round(balance),
      });
      yearP = 0;
      yearI = 0;
    }
  }

  const round2 = (v: number) => Math.round(v * 100) / 100;

  return {
    monthlyEmi: round2(emi),
    totalInterest: round2(totalInterest),
    totalAmount: round2(totalAmount),
    interestPercent,
    principalPercent,
    amortization,
  };
}
