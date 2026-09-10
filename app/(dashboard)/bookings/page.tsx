import { requireUser } from "@/lib/auth-guard";
import { stringifyQueryParams } from "@/lib/query-params";

export async function BookingsPage({ searchParams }: PageProps<"/bookings">) {
  const query = stringifyQueryParams(await searchParams);
  await requireUser(query ? `/bookings?${query}` : "/bookings");

  return;
}
