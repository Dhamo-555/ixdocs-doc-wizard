/**
 * Discount Calculator Engine
 */

export interface DiscountResult {
  finalPrice: number;
  youSave: number;
  effectiveDiscountPct: number;
  taxAmount: number;
  finalPriceWithTax: number;
}

export function calculateDiscount(
  originalPrice: number,
  discountPercent: number,
  extraDiscountPercent = 0,
  taxPercent = 0,
): DiscountResult {
  const p0 = Math.max(0, originalPrice);
  const d1 = Math.min(100, Math.max(0, discountPercent));
  const d2 = Math.min(100, Math.max(0, extraDiscountPercent));
  const tax = Math.max(0, taxPercent);

  // Step 1: First discount
  const afterD1 = p0 * (1 - d1 / 100);

  // Step 2: Extra discount
  const afterD2 = afterD1 * (1 - d2 / 100);

  const totalSaved = p0 - afterD2;
  const effectivePct = p0 > 0 ? (totalSaved / p0) * 100 : 0;

  // Step 3: Tax
  const taxAmt = (afterD2 * tax) / 100;
  const finalWithTax = afterD2 + taxAmt;

  const round2 = (n: number) => Math.round(n * 100) / 100;

  return {
    finalPrice: round2(afterD2),
    youSave: round2(totalSaved),
    effectiveDiscountPct: round2(effectivePct),
    taxAmount: round2(taxAmt),
    finalPriceWithTax: round2(finalWithTax),
  };
}
