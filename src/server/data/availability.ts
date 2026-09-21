import "server-only";

import { eq } from "drizzle-orm";
import type { StoredDay } from "@/lib/validation/availability";
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
