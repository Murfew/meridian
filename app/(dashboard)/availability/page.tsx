import requireUser from "@/lib/auth-guard";
import stringifyQueryParams from "@/lib/query-params";

export default async function AvailabilityPage({
  searchParams,
}: PageProps<"/availability">) {
  const query = stringifyQueryParams(await searchParams);
  await requireUser(query ? `/availability?${query}` : "/availability");

  return;
}
