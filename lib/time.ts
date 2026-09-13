export const SUNDAY = "Sunday";
export const MONDAY = "Monday";
export const TUESDAY = "Tuesday";
export const WEDNESDAY = "Wednesday";
export const THURSDAY = "Thursday";
export const FRIDAY = "Friday";
export const SATURDAY = "Saturday";

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

export function minutesSinceMidnight(hour: number, minute = 0) {
  return hour * 60 + minute;
}
