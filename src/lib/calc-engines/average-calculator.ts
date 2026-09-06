/**
 * Average and Central Tendency Engine
 */

export interface AverageResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  range: number;
  min: number;
  max: number;
  geometricMean?: number | undefined;
}

export function parseNumberList(input: string): number[] {
  return input
    .split(/[\s,;\n\t]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !isNaN(Number(s)))
    .map((s) => Number(s));
}

export function calculateAverages(numbers: number[]): AverageResult {
  if (numbers.length === 0) {
    return {
      count: 0,
      sum: 0,
      mean: 0,
      median: 0,
      modes: [],
      range: 0,
      min: 0,
      max: 0,
    };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = Math.round((sum / count) * 10000) / 10000;
  const min = sorted[0]!;
  const max = sorted[count - 1]!;
  const range = Math.round((max - min) * 10000) / 10000;

  // Median
  let median: number;
  const mid = Math.floor(count / 2);
  if (count % 2 === 0) {
    median = Math.round(((sorted[mid - 1]! + sorted[mid]!) / 2) * 10000) / 10000;
  } else {
    median = sorted[mid]!;
  }

  // Mode
  const counts = new Map<number, number>();
  let maxFreq = 0;
  for (const n of sorted) {
    const f = (counts.get(n) || 0) + 1;
    counts.set(n, f);
    if (f > maxFreq) maxFreq = f;
  }

  const modes: number[] = [];
  if (maxFreq > 1) {
    counts.forEach((freq, val) => {
      if (freq === maxFreq) modes.push(val);
    });
  }

  // Geometric mean (only if all numbers positive)
  let geometricMean: number | undefined;
  if (sorted.every((n) => n > 0)) {
    const logSum = sorted.reduce((acc, v) => acc + Math.log(v), 0);
    geometricMean = Math.round(Math.exp(logSum / count) * 10000) / 10000;
  }

  return {
    count,
    sum: Math.round(sum * 10000) / 10000,
    mean,
    median,
    modes,
    range,
    min,
    max,
    geometricMean,
  };
}

export function calculateWeightedAverage(items: { value: number; weight: number }[]): {
  weightedMean: number;
  totalWeight: number;
} {
  const valid = items.filter((i) => !isNaN(i.value) && !isNaN(i.weight) && i.weight > 0);
  if (valid.length === 0) return { weightedMean: 0, totalWeight: 0 };
  const totalWeight = valid.reduce((acc, i) => acc + i.weight, 0);
  const weightedSum = valid.reduce((acc, i) => acc + i.value * i.weight, 0);
  return {
    weightedMean: Math.round((weightedSum / totalWeight) * 10000) / 10000,
    totalWeight: Math.round(totalWeight * 10000) / 10000,
  };
}
