import * as z from "zod";
import { DAYS, getDayNumber, parseTime, toMinutes } from "@/lib/time";

export const daysSchema = z.array(
  z
    .object({
      label: z.enum(DAYS),
      enabled: z.boolean(),
      startTime: z.string(),
      endTime: z.string(),
    })
    .transform(({ label, enabled, startTime, endTime }) => ({
      dayOfWeek: getDayNumber(label),
      enabled,
      startMinute: toMinutes(parseTime(startTime)),
      endMinute: toMinutes(parseTime(endTime)),
    })),
);

export type Days = z.output<typeof daysSchema>;
export type DaysInput = z.input<typeof daysSchema>;
