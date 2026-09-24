import * as z from "zod";
import { DAYS, getDayNumber, parseTime, toMinutes } from "@/lib/time";

export const daySchema = z
  .object({
    dayName: z.enum(DAYS),
    enabled: z.boolean(),
    startTime: z.iso.time({ precision: -1 }),
    endTime: z.iso.time({ precision: -1 }),
  })
  .transform(({ dayName, enabled, startTime, endTime }) => ({
    dayOfWeek: getDayNumber(dayName),
    enabled,
    startMinute: toMinutes(parseTime(startTime)),
    endMinute: toMinutes(parseTime(endTime)),
  }))
  .refine((day) => day.startMinute < day.endMinute, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const weekSchema = z
  .array(daySchema)
  .length(7)
  .refine(
    (days) => days.length === new Set(days.map((day) => day.dayOfWeek)).size,
    {
      message: "Only one availability per day allowed",
    },
  );

export type StoredDay = z.output<typeof daySchema>;
export type Day = z.input<typeof daySchema>;
