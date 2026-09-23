import "server-only";

import { requireUser } from "@/server/auth/session";
import { db } from "@/server/db";
import type { users } from "@/server/db/schema";

type User = typeof users.$inferSelect;
type CurrentUserSettings = Pick<User, "timezone">;

export async function getCurrentUserSettings(): Promise<CurrentUserSettings> {
  const sessionUser = await requireUser();

  const userData = await db.query.users.findFirst({
    where: { id: sessionUser.id },
    columns: { timezone: true },
  });

  if (!userData) {
    throw new Error(`Session user ${sessionUser.id} has no users row`);
  }

  return { timezone: userData.timezone };
}
