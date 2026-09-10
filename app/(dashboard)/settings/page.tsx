import { requireUser } from "@/lib/auth-guard";
import { stringifyQueryParams } from "@/lib/query-params";

export async function SettingsPage({ searchParams }: PageProps<"/settings">) {
  const query = stringifyQueryParams(await searchParams);
  await requireUser(query ? `/settings?${query}` : "/settings");

  return;
}
