/**
 * Time Calculator Engine (Add / Subtract Time and Durations)
 */

export interface TimeCalculationResult {
  hours: number;
  minutes: number;
  seconds: number;
  days: number;
  formatted12: string;
  formatted24: string;
}

export function addOrSubtractTime(
  baseH: number,
  baseM: number,
  baseS: number,
  deltaH: number,
  deltaM: number,
  deltaS: number,
  operation: "add" | "subtract",
): TimeCalculationResult {
  const baseSec = baseH * 3600 + baseM * 60 + baseS;
  const deltaSec = deltaH * 3600 + deltaM * 60 + deltaS;

  let netSec = operation === "add" ? baseSec + deltaSec : baseSec - deltaSec;

  let days = 0;
  if (netSec < 0) {
    const daysNeeded = Math.ceil(Math.abs(netSec) / 86400);
    days = -daysNeeded;
    netSec += daysNeeded * 86400;
  } else {
    days = Math.floor(netSec / 86400);
    netSec = netSec % 86400;
  }

  const h = Math.floor(netSec / 3600);
  const m = Math.floor((netSec % 3600) / 60);
  const s = netSec % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatted24 = `${pad(h)}:${pad(m)}:${pad(s)}`;

  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const formatted12 = `${h12}:${pad(m)}:${pad(s)} ${period}`;

  return {
    hours: h,
    minutes: m,
    seconds: s,
    days,
    formatted12,
    formatted24,
  };
}
