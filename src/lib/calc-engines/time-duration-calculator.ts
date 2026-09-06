/**
 * Time Duration Calculator Engine
 */

export interface TimeDurationResult {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  totalMinutes: number;
  decimalHours: number;
  formatted: string;
}

export function calculateTimeDuration(
  startHour: number,
  startMinute: number,
  startSecond: number,
  endHour: number,
  endMinute: number,
  endSecond: number,
): TimeDurationResult {
  const startSec = startHour * 3600 + startMinute * 60 + startSecond;
  let endSec = endHour * 3600 + endMinute * 60 + endSecond;

  // Handle crossing midnight
  if (endSec < startSec) {
    endSec += 24 * 3600;
  }

  const diffSec = endSec - startSec;
  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  const s = diffSec % 60;

  const totalMin = Math.round((diffSec / 60) * 100) / 100;
  const decimalHours = Math.round((diffSec / 3600) * 1000) / 1000;

  return {
    hours: h,
    minutes: m,
    seconds: s,
    totalSeconds: diffSec,
    totalMinutes: totalMin,
    decimalHours,
    formatted: `${h} hr ${m} min ${s} sec`,
  };
}
