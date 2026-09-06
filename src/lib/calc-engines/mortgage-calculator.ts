/**
 * Mortgage Calculation Engine
 */
import { calculateLoan } from "./loan-calculator";

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  annualPropertyTax: number;
  annualHomeInsurance: number;
  monthlyHoa: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPrincipalInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  totalMonthlyPayment: number;
  totalLoanPayment: number;
  totalInterest: number;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const loanAmount = Math.max(0, input.homePrice - input.downPayment);
  const termMonths = Math.max(1, input.loanTermYears * 12);
  const loan = calculateLoan(loanAmount, input.interestRate, termMonths);

  const monthlyTax = Math.round(((input.annualPropertyTax || 0) / 12) * 100) / 100;
  const monthlyInsurance = Math.round(((input.annualHomeInsurance || 0) / 12) * 100) / 100;
  const monthlyHoa = Math.round((input.monthlyHoa || 0) * 100) / 100;

  const totalMonthly =
    Math.round((loan.monthlyPayment + monthlyTax + monthlyInsurance + monthlyHoa) * 100) / 100;

  return {
    loanAmount,
    monthlyPrincipalInterest: loan.monthlyPayment,
    monthlyTax,
    monthlyInsurance,
    monthlyHoa,
    totalMonthlyPayment: totalMonthly,
    totalLoanPayment: loan.totalPayment,
    totalInterest: loan.totalInterest,
  };
}
