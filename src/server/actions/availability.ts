"use server";

import * as Sentry from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDayNumber, minutesSinceMidnight } from "@/lib/time";
import { requireUser } from "@/server/auth-guard";
import { db } from "@/server/db";
import { availabilities } from "@/server/db/schema";
import type { Day } from "@/types/availability";

type SaveAvailabilityResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function saveAvailability(
  data: Day[],
): Promise<SaveAvailabilityResult> {
  const user = await requireUser();

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(availabilities)
        .where(eq(availabilities.ownerId, user.id));

      await tx.insert(availabilities).values(
        data
          .filter((availability) => availability.enabled)
          .map((availability) => ({
            ownerId: user.id,
            dayOfWeek: getDayNumber(availability.label),
            startMinute: minutesSinceMidnight(
              Number(availability.start.slice(0, 2)),
              Number(availability.start.slice(3)),
            ),
            endMinute: minutesSinceMidnight(
              Number(availability.end.slice(0, 2)),
              Number(availability.end.slice(3)),
            ),
          })),
      );
    });
  } catch (error) {
    Sentry.captureException(error);
    return {
      ok: false,
      error: "Error saving availability. Please try again.",
    };
  }

  revalidatePath("/availability");
  return { ok: true, message: "Availability saved successfully!" };
}
