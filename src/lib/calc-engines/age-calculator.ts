import {
  differenceInYears,
  differenceInMonths,
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  addYears,
  addMonths,
  format,
  isValid,
} from "date-fns";

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  formattedAge: string;
  dayOfWeekBorn: string;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthdayCountdown: {
    months: number;
    days: number;
    dayOfWeek: string;
    formatted: string;
  };
}

export function calculateAge(
  birthDate: Date,
  referenceDate: Date = new Date(),
): AgeCalculationResult {
  if (!isValid(birthDate) || !isValid(referenceDate)) {
    throw new Error("Invalid birth date or reference date");
  }

  if (birthDate > referenceDate) {
    throw new Error("Date of birth cannot be in the future");
  }

  const years = differenceInYears(referenceDate, birthDate);
  const afterYears = addYears(birthDate, years);
  const months = differenceInMonths(referenceDate, afterYears);
  const afterMonths = addMonths(afterYears, months);
  const days = differenceInCalendarDays(referenceDate, afterMonths);

  const totalDays = differenceInCalendarDays(referenceDate, birthDate);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = differenceInMonths(referenceDate, birthDate);
  const totalHours = differenceInHours(referenceDate, birthDate);
  const totalMinutes = differenceInMinutes(referenceDate, birthDate);

  const dayOfWeekBorn = format(birthDate, "EEEE");

  // Next birthday calculation
  let nextBirthday = new Date(
    referenceDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );
  if (nextBirthday < referenceDate) {
    nextBirthday = new Date(
      referenceDate.getFullYear() + 1,
      birthDate.getMonth(),
      birthDate.getDate(),
    );
  }

  const nextBdayDays = differenceInCalendarDays(nextBirthday, referenceDate);
  const nextBdayMonths = differenceInMonths(nextBirthday, referenceDate);
  const afterBdayMonths = addMonths(referenceDate, nextBdayMonths);
  const remainingBdayDays = differenceInCalendarDays(nextBirthday, afterBdayMonths);
  const nextBdayDayOfWeek = format(nextBirthday, "EEEE");

  return {
    years,
    months,
    days,
    formattedAge: `${years} years, ${months} months, and ${days} days`,
    dayOfWeekBorn,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    nextBirthdayCountdown: {
      months: nextBdayMonths,
      days: remainingBdayDays,
      dayOfWeek: nextBdayDayOfWeek,
      formatted: `${nextBdayDays} days (${nextBdayMonths}m ${remainingBdayDays}d) on a ${nextBdayDayOfWeek}`,
    },
  };
}
