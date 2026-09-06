/**
 * Statistical Analysis Engine
 */

export interface StatisticsResult {
  count: number;
  sum: number;
  mean: number;
  sampleVariance: number;
  populationVariance: number;
  sampleStdDev: number;
  populationStdDev: number;
  stdError: number;
  min: number;
  max: number;
  median: number;
  q1: number;
  q3: number;
  iqr: number;
}

export function calculateStatistics(numbers: number[]): StatisticsResult {
  const n = numbers.length;
  if (n === 0) {
    return {
      count: 0,
      sum: 0,
      mean: 0,
      sampleVariance: 0,
      populationVariance: 0,
      sampleStdDev: 0,
      populationStdDev: 0,
      stdError: 0,
      min: 0,
      max: 0,
      median: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
    };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  // Variances
  const sumSqDiff = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const popVar = sumSqDiff / n;
  const sampleVar = n > 1 ? sumSqDiff / (n - 1) : 0;
  const popStd = Math.sqrt(popVar);
  const sampleStd = Math.sqrt(sampleVar);
  const stdError = n > 0 ? sampleStd / Math.sqrt(n) : 0;

  // Percentiles
  const getPercentile = (p: number) => {
    const idx = p * (n - 1);
    const low = Math.floor(idx);
    const high = Math.ceil(idx);
    const weight = idx - low;
    return sorted[low]! * (1 - weight) + sorted[high]! * weight;
  };

  const median = getPercentile(0.5);
  const q1 = getPercentile(0.25);
  const q3 = getPercentile(0.75);
  const iqr = q3 - q1;

  const round4 = (v: number) => Math.round(v * 10000) / 10000;

  return {
    count: n,
    sum: round4(sum),
    mean: round4(mean),
    sampleVariance: round4(sampleVar),
    populationVariance: round4(popVar),
    sampleStdDev: round4(sampleStd),
    populationStdDev: round4(popStd),
    stdError: round4(stdError),
    min: sorted[0]!,
    max: sorted[n - 1]!,
    median: round4(median),
    q1: round4(q1),
    q3: round4(q3),
    iqr: round4(iqr),
  };
}
