import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";

export async function requireUser(callbackUrl?: string) {
  const session = await getSession();

  if (!session) {
    const query = callbackUrl ? `?${new URLSearchParams({ callbackUrl })}` : "";
    redirect(`/sign-in${query}`);
  }

  return session.user;
}
