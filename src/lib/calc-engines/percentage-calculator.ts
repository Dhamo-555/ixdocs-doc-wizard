/**
 * Percentage Calculator Engine
 */

export function calculatePercentOf(percentage: number, total: number): number {
  return Math.round(((percentage * total) / 100) * 10000) / 10000;
}

export function calculateWhatPercent(part: number, whole: number): number {
  if (whole === 0) return 0;
  return Math.round((part / whole) * 100 * 10000) / 10000;
}

export function calculatePercentChange(
  fromVal: number,
  toVal: number,
): { changePercent: number; isIncrease: boolean; difference: number } {
  const diff = toVal - fromVal;
  if (fromVal === 0) {
    return { changePercent: 0, isIncrease: diff >= 0, difference: diff };
  }
  const pct = (diff / Math.abs(fromVal)) * 100;
  return {
    changePercent: Math.round(Math.abs(pct) * 10000) / 10000,
    isIncrease: diff >= 0,
    difference: Math.round(diff * 10000) / 10000,
  };
}

export function calculatePercentDifference(val1: number, val2: number): number {
  const avg = (Math.abs(val1) + Math.abs(val2)) / 2;
  if (avg === 0) return 0;
  const diff = Math.abs(val1 - val2);
  return Math.round((diff / avg) * 100 * 10000) / 10000;
}
