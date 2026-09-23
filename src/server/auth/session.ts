import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/server/auth/config";

export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

const getSessionUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
});
