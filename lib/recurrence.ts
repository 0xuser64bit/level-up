import type { RecurrencePattern } from "@/generated/prisma";

// Ordered options for UI selects. Values match the Prisma enum exactly so the
// form submits valid enum members (the old UI sent lowercase strings).
export const RECURRENCE_OPTIONS: { value: RecurrencePattern; label: string }[] =
  [
    { value: "NONE", label: "None" },
    { value: "DAILY", label: "Daily" },
    { value: "WEEKDAYS", label: "Weekdays" },
    { value: "WEEKENDS", label: "Weekends" },
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
  ];

// 0 = Sunday .. 6 = Saturday
const WEEKDAY_PATTERN: Record<number, RecurrencePattern> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

// Is a recurring template due on the given calendar day?
export function isDueOn(pattern: RecurrencePattern, date: Date): boolean {
  const day = date.getDay();
  switch (pattern) {
    case "DAILY":
      return true;
    case "WEEKDAYS":
      return day >= 1 && day <= 5;
    case "WEEKENDS":
      return day === 0 || day === 6;
    case "NONE":
      return false;
    default:
      return WEEKDAY_PATTERN[day] === pattern;
  }
}
