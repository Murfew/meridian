import "server-only";

import { eq } from "drizzle-orm";
import type { Days } from "@/lib/validation/availability";
import { requireUser } from "@/server/auth/session";
import { db } from "@/server/db";
import { availabilities } from "@/server/db/schema";

export async function saveAvailability(days: Days): Promise<void> {
  const user = await requireUser();

  await db.transaction(async (tx) => {
    await tx.delete(availabilities).where(eq(availabilities.ownerId, user.id));

    await tx.insert(availabilities).values(
      days
        .filter((availability) => availability.enabled)
        .map((availability) => ({
          ...availability,
          ownerId: user.id,
        })),
    );
  });
}
