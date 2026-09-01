import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function minutesSinceMidnight(hour: number, minute = 0) {
  return hour * 60 + minute;
}
