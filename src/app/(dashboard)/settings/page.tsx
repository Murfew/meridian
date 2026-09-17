import { stringifyQueryParams } from "@/lib/query-params";
import { requireUser } from "@/server/auth-guard";

export default async function SettingsPage({
  searchParams,
}: PageProps<"/settings">) {
  const query = stringifyQueryParams(await searchParams);
  await requireUser(query ? `/settings?${query}` : "/settings");

  return;
}
