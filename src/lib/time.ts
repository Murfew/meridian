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
];

export function getDayNumber(day: string) {
  return DAYS.indexOf(day);
}

export function toMinutes(time: Time) {
  return time.hours * 60 + time.minutes;
}

export function parseTime(time: string): Time {
  const hours = Number(time.slice(0, 2));
  const minutes = Number(time.slice(3));

  return { hours, minutes };
}
