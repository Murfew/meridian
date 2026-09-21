export const SUNDAY = "Sunday";
export const MONDAY = "Monday";
export const TUESDAY = "Tuesday";
export const WEDNESDAY = "Wednesday";
export const THURSDAY = "Thursday";
export const FRIDAY = "Friday";
export const SATURDAY = "Saturday";

export type Time = { hours: number; minutes: number };

export const DAYS = [
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
] as const;

export type DayName = (typeof DAYS)[number];
export type DayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function getDayNumber(dayName: DayName): DayNumber {
  return DAYS.indexOf(dayName) as DayNumber;
}

export function getDayName(dayNumber: DayNumber): DayName {
  return DAYS[dayNumber];
}

export function toMinutes(time: Time) {
  return time.hours * 60 + time.minutes;
}

export function fromMinutes(minutes: number): Time {
  const hours = Math.trunc(minutes / 60);
  return { hours, minutes: minutes - hours * 60 };
}

export function parseTime(time: string): Time {
  const hours = Number(time.slice(0, 2));
  const minutes = Number(time.slice(3));

  return { hours, minutes };
}

export function formatTime(time: Time): string {
  return `${time.hours.toString().padStart(2, "0")}:${time.minutes.toString().padStart(2, "0")}`;
}
