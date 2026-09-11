import { AvailabilityEditor } from "@/components/availability/editor";
import { AvailabilityForm } from "@/components/availability/form";
import { AvailabilitySaveButton } from "@/components/availability/save-button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-guard";
import { stringifyQueryParams } from "@/lib/query-params";

export async function AvailabilityPage({
  searchParams,
}: PageProps<"/availability">) {
  const query = stringifyQueryParams(await searchParams);
  const user = await requireUser(
    query ? `/availability?${query}` : "/availability",
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-medium">Availability</h1>
        <p className="text-sm text-muted-foreground">
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
            <p className="mr-auto text-xs text-muted-foreground">
              Timezone: {user.timezone}
            </p>
            <AvailabilitySaveButton />
          </CardFooter>
        </Card>
      </AvailabilityForm>
    </div>
  );
}
