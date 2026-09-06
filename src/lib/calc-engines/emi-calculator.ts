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
  if (principal <= 0 || tenureMonths <= 0) {
    return {
      monthlyEmi: 0,
      totalInterest: 0,
      totalAmount: 0,
      interestPercent: 0,
      principalPercent: 100,
      amortization: [],
    };
  }

  const r = annualRatePct > 0 ? annualRatePct / (12 * 100) : 0;
  let emi = 0;

  if (r === 0) {
    emi = principal / tenureMonths;
  } else {
    emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  }

  const totalAmount = emi * tenureMonths;
  const totalInterest = Math.max(0, totalAmount - principal);

  const interestPercent = totalAmount > 0 ? Math.round((totalInterest / totalAmount) * 100) : 0;
  const principalPercent = 100 - interestPercent;

  // Yearly schedule
  const amortization: EmiResult["amortization"] = [];
  let balance = principal;
  let yearP = 0;
  let yearI = 0;

  for (let m = 1; m <= tenureMonths; m++) {
    const interest = balance * r;
    const princ = emi - interest;
    balance = Math.max(0, balance - princ);
    yearI += interest;
    yearP += princ;

    if (m % 12 === 0 || m === tenureMonths) {
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
