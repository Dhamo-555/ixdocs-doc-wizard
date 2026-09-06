/**
 * Loan Payment Engine
 */

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortization: {
    year: number;
    interestPaid: number;
    principalPaid: number;
    remainingBalance: number;
  }[];
}

export function calculateLoan(
  principal: number,
  annualRatePct: number,
  termMonths: number,
): LoanResult {
  if (principal <= 0 || termMonths <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, amortization: [] };
  }

  const monthlyRate = annualRatePct > 0 ? annualRatePct / 100 / 12 : 0;
  let monthlyPayment = 0;

  if (monthlyRate === 0) {
    monthlyPayment = principal / termMonths;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;

  // Annual amortization breakdown
  const amortization: LoanResult["amortization"] = [];
  let balance = principal;
  let yearInterest = 0;
  let yearPrincipal = 0;

  for (let m = 1; m <= termMonths; m++) {
    const interest = balance * monthlyRate;
    const princ = monthlyPayment - interest;
    balance = Math.max(0, balance - princ);
    yearInterest += interest;
    yearPrincipal += princ;

    if (m % 12 === 0 || m === termMonths) {
      amortization.push({
        year: Math.ceil(m / 12),
        interestPaid: Math.round(yearInterest),
        principalPaid: Math.round(yearPrincipal),
        remainingBalance: Math.round(balance),
      });
      yearInterest = 0;
      yearPrincipal = 0;
    }
  }

  const round2 = (v: number) => Math.round(v * 100) / 100;

  return {
    monthlyPayment: round2(monthlyPayment),
    totalPayment: round2(totalPayment),
    totalInterest: round2(totalInterest),
    amortization,
  };
}
