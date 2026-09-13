import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";

export default async function RootPage() {
  await requireUser();
  redirect("/availability");
}
