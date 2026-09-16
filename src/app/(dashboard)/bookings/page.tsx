import { stringifyQueryParams } from "~/lib/query-params";
import { requireUser } from "~/server/auth-guard";

export default async function BookingsPage({
  searchParams,
}: PageProps<"/bookings">) {
  const query = stringifyQueryParams(await searchParams);
  await requireUser(query ? `/bookings?${query}` : "/bookings");

  return;
}
