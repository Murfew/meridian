import requireUser from "@/lib/auth-guard";

export default async function SettingsPage() {
  await requireUser();
}
