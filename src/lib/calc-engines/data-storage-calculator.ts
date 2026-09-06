/**
 * Data Storage & Transfer Speed Engine
 */

export type StorageUnit = "B" | "KB" | "MB" | "GB" | "TB" | "PB";

const UNIT_EXPONENTS: Record<StorageUnit, number> = {
  B: 0,
  KB: 1,
  MB: 2,
  GB: 3,
  TB: 4,
  PB: 5,
};

export function convertStorage(
  value: number,
  fromUnit: StorageUnit,
  base: 1000 | 1024 = 1024,
): Record<StorageUnit, number> {
  const bytes = value * Math.pow(base, UNIT_EXPONENTS[fromUnit]);

  const result = {} as Record<StorageUnit, number>;
  for (const unit of Object.keys(UNIT_EXPONENTS) as StorageUnit[]) {
    const val = bytes / Math.pow(base, UNIT_EXPONENTS[unit]);
    result[unit] = Math.round(val * 10000) / 10000;
  }
  return result;
}

export function estimateDownloadTime(
  fileSize: number,
  fileUnit: StorageUnit,
  speedMbps: number,
): { seconds: number; formatted: string } {
  if (speedMbps <= 0 || fileSize <= 0) return { seconds: 0, formatted: "0 seconds" };
  // Convert file size to Megabits
  const bytes = fileSize * Math.pow(1024, UNIT_EXPONENTS[fileUnit]);
  const bits = bytes * 8;
  const speedBitsPerSec = speedMbps * 1_000_000;
  const seconds = Math.round((bits / speedBitsPerSec) * 10) / 10;

  if (seconds < 60) return { seconds, formatted: `${seconds} seconds` };
  if (seconds < 3600) {
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return { seconds, formatted: `${min}m ${sec}s` };
  }
  const hr = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  return { seconds, formatted: `${hr}h ${min}m` };
}
