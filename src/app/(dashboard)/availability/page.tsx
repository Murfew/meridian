import { AvailabilityEditor } from "~/app/_components/availability/editor";
import { AvailabilityForm } from "~/app/_components/availability/form";
import { AvailabilitySaveButton } from "~/app/_components/availability/save-button";
import { Card, CardContent, CardFooter } from "~/app/_components/ui/card";
import { stringifyQueryParams } from "~/lib/query-params";
import { requireUser } from "~/server/auth-guard";

export default async function AvailabilityPage({
  searchParams,
}: PageProps<"/availability">) {
  const query = stringifyQueryParams(await searchParams);
  const user = await requireUser(
    query ? `/availability?${query}` : "/availability",
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-medium text-2xl">Availability</h1>
        <p className="text-muted-foreground text-sm">
          Set the hours you&apos;re open for bookings. Clients can only book
          within these hours, shown in your local timezone.
        </p>
      </div>

      <AvailabilityForm>
        <Card>
          <CardContent>
            <AvailabilityEditor />
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <p className="mr-auto text-muted-foreground text-xs">
              Timezone: {user.timezone}
            </p>
            <AvailabilitySaveButton />
          </CardFooter>
        </Card>
      </AvailabilityForm>
    </div>
  );
}
