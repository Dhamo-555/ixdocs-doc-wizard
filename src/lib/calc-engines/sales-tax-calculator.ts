/**
 * Sales Tax Calculator Engine (Forward & Reverse)
 */

export interface SalesTaxResult {
  netPrice: number;
  taxAmount: number;
  totalPrice: number;
  taxRatePercent: number;
}

export function calculateForwardSalesTax(
  priceBeforeTax: number,
  taxRatePercent: number,
): SalesTaxResult {
  const net = Math.max(0, priceBeforeTax);
  const rate = Math.max(0, taxRatePercent);
  const tax = (net * rate) / 100;
  const total = net + tax;

  const round2 = (n: number) => Math.round(n * 100) / 100;

  return {
    netPrice: round2(net),
    taxAmount: round2(tax),
    totalPrice: round2(total),
    taxRatePercent: rate,
  };
}

export function calculateReverseSalesTax(
  totalPriceWithTax: number,
  taxRatePercent: number,
): SalesTaxResult {
  const total = Math.max(0, totalPriceWithTax);
  const rate = Math.max(0, taxRatePercent);
  const net = rate > 0 ? total / (1 + rate / 100) : total;
  const tax = total - net;

  const round2 = (n: number) => Math.round(n * 100) / 100;

  return {
    netPrice: round2(net),
    taxAmount: round2(tax),
    totalPrice: round2(total),
    taxRatePercent: rate,
  };
}
