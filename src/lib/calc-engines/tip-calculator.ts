/**
 * Tip and Bill Split Engine
 */

export interface TipResult {
  tipAmount: number;
  totalBill: number;
  tipPerPerson: number;
  totalPerPerson: number;
}

export function calculateTip(billAmount: number, tipPercent: number, splitCount = 1): TipResult {
  const bill = Math.max(0, billAmount);
  const tipPct = Math.max(0, tipPercent);
  const people = Math.max(1, Math.floor(splitCount));

  const tipAmount = (bill * tipPct) / 100;
  const totalBill = bill + tipAmount;
  const tipPerPerson = tipAmount / people;
  const totalPerPerson = totalBill / people;

  const round2 = (n: number) => Math.round(n * 100) / 100;

  return {
    tipAmount: round2(tipAmount),
    totalBill: round2(totalBill),
    tipPerPerson: round2(tipPerPerson),
    totalPerPerson: round2(totalPerPerson),
  };
}
