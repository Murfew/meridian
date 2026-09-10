import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireUser(callbackUrl?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const query = callbackUrl ? `?${new URLSearchParams({ callbackUrl })}` : "";
    redirect(`/sign-in${query}`);
  }

  return session.user;
}
