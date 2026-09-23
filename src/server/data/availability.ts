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
  const sessionUser = await requireUser();

  await db.transaction(async (tx) => {
    await tx
      .delete(availabilities)
      .where(eq(availabilities.ownerId, sessionUser.id));

    const daysToInsert = days.filter((day) => day.enabled);

    if (daysToInsert.length > 0) {
      await tx.insert(availabilities).values(
        daysToInsert.map((day) => ({
          ownerId: sessionUser.id,
          dayOfWeek: day.dayOfWeek,
          startMinute: day.startMinute,
          endMinute: day.endMinute,
        })),
      );
    }
  });
}

const DEFAULT_START_TIME: Time = { hours: 9, minutes: 0 };
const DEFAULT_END_TIME: Time = { hours: 17, minutes: 0 };

export async function getAvailability(): Promise<Day[]> {
  const sessionUser = await requireUser();

  const rows = await db.query.availabilities.findMany({
    where: { ownerId: sessionUser.id },
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
