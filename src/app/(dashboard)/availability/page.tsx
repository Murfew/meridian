import { AvailabilityProvider } from "@/app/(dashboard)/availability/_components/context";
import { AvailabilityEditor } from "@/app/(dashboard)/availability/_components/editor";
import { AvailabilitySaveButton } from "@/app/(dashboard)/availability/_components/save-button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getAvailability } from "@/server/data/availability";
import { getCurrentUserSettings } from "@/server/data/user";

export default async function AvailabilityPage() {
  const availabilityData = getAvailability();
  const userSettingsData = getCurrentUserSettings();

  const [availability, userSettings] = await Promise.all([
    availabilityData,
    userSettingsData,
  ]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-medium">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Set the hours you&apos;re open for bookings. Clients can only book
          within these hours, shown in your local timezone.
        </p>
      </div>

      <AvailabilityProvider availability={availability}>
        <Card>
          <CardContent>
            <AvailabilityEditor />
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <p className="mr-auto text-xs text-muted-foreground">
              Timezone: {userSettings.timezone}
            </p>
            <AvailabilitySaveButton />
          </CardFooter>
        </Card>
      </AvailabilityProvider>
    </div>
  );
}
