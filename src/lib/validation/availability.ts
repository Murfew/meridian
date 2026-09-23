import * as z from "zod";
import { DAYS, getDayNumber, parseTime, toMinutes } from "@/lib/time";

export const daySchema = z
  .object({
    dayName: z.enum(DAYS),
    enabled: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
  })
  .transform(({ dayName, enabled, startTime, endTime }) => ({
    dayOfWeek: getDayNumber(dayName),
    enabled,
    startMinute: toMinutes(parseTime(startTime)),
    endMinute: toMinutes(parseTime(endTime)),
  }));

export const weekSchema = z.array(daySchema).length(7);

export type StoredDay = z.output<typeof daySchema>;
export type Day = z.input<typeof daySchema>;
