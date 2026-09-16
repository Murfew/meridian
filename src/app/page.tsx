import { redirect } from "next/navigation";
import { requireUser } from "@/server/auth-guard";

export default async function RootPage() {
  await requireUser();
  redirect("/availability");
}
