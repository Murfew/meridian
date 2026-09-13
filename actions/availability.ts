"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { getDayNumber, minutesSinceMidnight } from "@/lib/time";
import type { Day } from "@/types/availability";

type SaveAvailabilityResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function saveAvailability(
  availabilities: Day[],
): Promise<SaveAvailabilityResult> {
  const user = await requireUser();

  try {
    await prisma.$transaction([
      prisma.availability.deleteMany({ where: { ownerId: user.id } }),
      prisma.availability.createMany({
        data: availabilities
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
      }),
    ]);
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
