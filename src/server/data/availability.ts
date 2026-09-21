import "server-only";

import { eq } from "drizzle-orm";
import {
  DAYS,
  formatTime,
  fromMinutes,
  getDayNumber,
  type Time,
} from "@/lib/time";
import type { Day, StoredDay } from "@/lib/validation/availability";
import { requireUser } from "@/server/auth/session";
import { db } from "@/server/db";
import { availabilities } from "@/server/db/schema";

export async function saveAvailability(days: StoredDay[]): Promise<void> {
  const user = await requireUser();

  await db.transaction(async (tx) => {
    await tx.delete(availabilities).where(eq(availabilities.ownerId, user.id));

    const daysToInsert = days.filter((day) => day.enabled);

    if (daysToInsert.length > 0) {
      await tx.insert(availabilities).values(
        daysToInsert.map((day) => ({
          ...day,
          ownerId: user.id,
        })),
      );
    }
  });
}

const DEFAULT_START_TIME: Time = { hours: 9, minutes: 0 };
const DEFAULT_END_TIME: Time = { hours: 17, minutes: 0 };

export async function getAvailability(): Promise<Day[]> {
  const user = await requireUser();

  const rows = await db.query.availabilities.findMany({
    where: { ownerId: user.id },
    columns: { dayOfWeek: true, startMinute: true, endMinute: true },
  });

  const days: Day[] = [];
  for (const day of DAYS) {
    const row = rows.find((row) => row.dayOfWeek === getDayNumber(day));

    const enabled = !!row;
    const startTime = formatTime(
      enabled ? fromMinutes(row.startMinute) : DEFAULT_START_TIME,
    );
    const endTime = formatTime(
      enabled ? fromMinutes(row.endMinute) : DEFAULT_END_TIME,
    );

    days.push({
      dayName: day,
      enabled,
      startTime,
      endTime,
    });
  }

  return days;
}
