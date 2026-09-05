import requireUser from "@/lib/auth-guard";

export default async function AvailabilityPage({
  searchParams,
}: PageProps<"/availability">) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();

  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((val) => {
        params.append(key, val);
      });
    } else {
      params.append(key, value);
    }
  });

  const query = params.toString();

  await requireUser(query ? `/availability?${query}` : "/availability");

  return;
}
