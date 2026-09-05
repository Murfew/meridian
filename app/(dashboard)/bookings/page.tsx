import requireUser from "@/lib/auth-guard";

export default async function BookingsPage() {
  await requireUser();
}
