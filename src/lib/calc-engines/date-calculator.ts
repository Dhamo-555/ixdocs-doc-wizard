import {
  differenceInCalendarDays,
  differenceInMonths,
  differenceInYears,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  format,
  isValid,
  isWeekend,
  eachDayOfInterval,
} from "date-fns";

export interface DateDifferenceResult {
  totalDays: number;
  totalWeeks: number;
  remainingDays: number;
  businessDays: number;
  weekendDays: number;
  years: number;
  months: number;
  days: number;
  formattedSummary: string;
}

export interface DateAddSubtractResult {
  resultingDate: Date;
  formattedDate: string;
  dayOfWeek: string;
}

export function calculateDateDifference(dateA: Date, dateB: Date): DateDifferenceResult {
  if (!isValid(dateA) || !isValid(dateB)) {
    throw new Error("Invalid input dates");
  }

  const [start, end] = dateA <= dateB ? [dateA, dateB] : [dateB, dateA];

  const totalDays = Math.abs(differenceInCalendarDays(end, start));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  // Breakdown in years, months, days
  const years = differenceInYears(end, start);
  const afterYears = addYears(start, years);
  const months = differenceInMonths(end, afterYears);
  const afterMonths = addMonths(afterYears, months);
  const days = differenceInCalendarDays(end, afterMonths);

  // Business days vs weekend days
  let businessDays = 0;
  let weekendDays = 0;
  if (totalDays > 0) {
    const daysInterval = eachDayOfInterval({ start, end });
    // Exclude the end day if standard duration (or include if inclusive)
    for (let i = 0; i < daysInterval.length - 1; i++) {
      const currentDay = daysInterval[i];
      if (currentDay && isWeekend(currentDay)) {
        weekendDays++;
      } else {
        businessDays++;
      }
    }
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);

  return {
    totalDays,
    totalWeeks,
    remainingDays,
    businessDays,
    weekendDays,
    years,
    months,
    days,
    formattedSummary: parts.join(", "),
  };
}

export function addOrSubtractFromDate(
  startDate: Date,
  amount: number,
  unit: "days" | "weeks" | "months" | "years",
  operation: "add" | "subtract",
): DateAddSubtractResult {
  if (!isValid(startDate)) {
    throw new Error("Invalid start date");
  }

  let result = new Date(startDate);
  const multiplier = operation === "add" ? 1 : -1;
  const val = amount * multiplier;

  switch (unit) {
    case "days":
      result = val >= 0 ? addDays(startDate, val) : subDays(startDate, Math.abs(val));
      break;
    case "weeks":
      result = val >= 0 ? addDays(startDate, val * 7) : subDays(startDate, Math.abs(val) * 7);
      break;
    case "months":
      result = val >= 0 ? addMonths(startDate, val) : subMonths(startDate, Math.abs(val));
      break;
    case "years":
      result = val >= 0 ? addYears(startDate, val) : subYears(startDate, Math.abs(val));
      break;
  }

  return {
    resultingDate: result,
    formattedDate: format(result, "MMMM d, yyyy"),
    dayOfWeek: format(result, "EEEE"),
  };
}
