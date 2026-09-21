import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/server/auth/config";

export async function requireUser(callbackUrl?: string) {
  const user = await getCurrentUser();

  if (!user) {
    const query = callbackUrl ? `?${new URLSearchParams({ callbackUrl })}` : "";
    redirect(`/sign-in${query}`);
  }

  return user;
}

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
});
