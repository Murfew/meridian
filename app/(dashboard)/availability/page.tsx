import requireUser from "@/lib/auth-guard";

export default async function AvailabilityPage() {
  await requireUser();
}
