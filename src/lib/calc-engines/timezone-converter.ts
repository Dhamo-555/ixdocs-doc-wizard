export interface TimezoneItem {
  id: string;
  label: string;
  city: string;
}

export const POPULAR_TIMEZONES: TimezoneItem[] = [
  { id: "UTC", label: "UTC / GMT (Coordinated Universal Time)", city: "UTC" },
  { id: "America/New_York", label: "New York (EDT/EST, UTC-4/5)", city: "New York" },
  { id: "America/Chicago", label: "Chicago (CDT/CST, UTC-5/6)", city: "Chicago" },
  { id: "America/Denver", label: "Denver (MDT/MST, UTC-6/7)", city: "Denver" },
  { id: "America/Los_Angeles", label: "Los Angeles (PDT/PST, UTC-7/8)", city: "Los Angeles" },
  { id: "Europe/London", label: "London (BST/GMT, UTC+1/0)", city: "London" },
  { id: "Europe/Paris", label: "Paris (CEST/CET, UTC+2/1)", city: "Paris" },
  { id: "Europe/Berlin", label: "Berlin (CEST/CET, UTC+2/1)", city: "Berlin" },
  { id: "Asia/Dubai", label: "Dubai (GST, UTC+4)", city: "Dubai" },
  { id: "Asia/Kolkata", label: "India / Mumbai (IST, UTC+5:30)", city: "Mumbai" },
  { id: "Asia/Singapore", label: "Singapore (SGT, UTC+8)", city: "Singapore" },
  { id: "Asia/Tokyo", label: "Tokyo (JST, UTC+9)", city: "Tokyo" },
  { id: "Australia/Sydney", label: "Sydney (AEST/AEDT, UTC+10/11)", city: "Sydney" },
  { id: "Pacific/Auckland", label: "Auckland (NZDT/NZST, UTC+13/12)", city: "Auckland" },
];

export interface TimezoneConversionResult {
  formattedDate: string;
  formattedTime: string;
  formattedFull: string;
  timeDifference: string;
  isDifferentDay: boolean;
  offsetHours: number;
}

export function convertTimezone(
  isoDateString: string, // YYYY-MM-DDTHH:mm
  fromTimezone: string,
  toTimezone: string,
): TimezoneConversionResult {
  try {
    // Parse the given date in the context of the fromTimezone
    // Create an object representing the year, month, day, hours, minutes
    const [datePart, timePart] = isoDateString.split("T");
    const dateArr = (datePart || "2026-01-01").split("-").map(Number);
    const timeArr = (timePart || "12:00").split(":").map(Number);
    const year = dateArr[0] ?? 2026;
    const month = dateArr[1] ?? 1;
    const day = dateArr[2] ?? 1;
    const hours = timeArr[0] ?? 12;
    const minutes = timeArr[1] ?? 0;

    // Approximate UTC time by finding offset of fromTimezone
    const fakeUtc = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

    // Get the offset of fromTimezone
    const fromOffsetMinutes = getTimezoneOffsetMinutes(fromTimezone, fakeUtc);
    const realUtcTimestamp = fakeUtc.getTime() - fromOffsetMinutes * 60 * 1000;
    const realUtcDate = new Date(realUtcTimestamp);

    // Now format this instant in the toTimezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: toTimezone,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const formattedFull = formatter.format(realUtcDate);

    const timeOnlyFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: toTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const formattedTime = timeOnlyFormatter.format(realUtcDate);

    const dateOnlyFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: toTimezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedDate = dateOnlyFormatter.format(realUtcDate);

    // Calculate hour difference between from and to
    const toOffsetMinutes = getTimezoneOffsetMinutes(toTimezone, realUtcDate);
    const diffMinutes = toOffsetMinutes - fromOffsetMinutes;
    const offsetHours = diffMinutes / 60;

    let timeDifference = "Same time";
    if (offsetHours > 0) {
      const h = Math.floor(offsetHours);
      const m = Math.round((offsetHours - h) * 60);
      timeDifference = m > 0 ? `+${h}h ${m}m ahead` : `+${h} hours ahead`;
    } else if (offsetHours < 0) {
      const abs = Math.abs(offsetHours);
      const h = Math.floor(abs);
      const m = Math.round((abs - h) * 60);
      timeDifference = m > 0 ? `-${h}h ${m}m behind` : `-${h} hours behind`;
    }

    return {
      formattedDate,
      formattedTime,
      formattedFull,
      timeDifference,
      isDifferentDay: formattedDate !== dateOnlyFormatter.format(fakeUtc),
      offsetHours,
    };
  } catch (err) {
    return {
      formattedDate: "Invalid date",
      formattedTime: "00:00",
      formattedFull: "Invalid Timezone or Date",
      timeDifference: "—",
      isDifferentDay: false,
      offsetHours: 0,
    };
  }
}

function getTimezoneOffsetMinutes(tz: string, date: Date): number {
  const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = date.toLocaleString("en-US", { timeZone: tz });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (tzDate.getTime() - utcDate.getTime()) / (60 * 1000);
}
