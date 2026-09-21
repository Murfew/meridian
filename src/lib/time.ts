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

export function getDayNumber(dayName: string) {
  return DAYS.indexOf(dayName);
}

export function getDayName(dayNumber: number) {
  return DAYS.at(dayNumber);
}

export function toMinutes(time: Time) {
  return time.hours * 60 + time.minutes;
}

export function fromMinutes(minutes: number): Time {
  const hours = minutes / 60;
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
