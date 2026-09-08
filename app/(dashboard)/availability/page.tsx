import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import requireUser from "@/lib/auth-guard";
import stringifyQueryParams from "@/lib/query-params";

const days = [
  { label: "Monday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Wednesday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Thursday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Friday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Saturday", enabled: false, start: "09:00", end: "17:00" },
  { label: "Sunday", enabled: false, start: "09:00", end: "17:00" },
];

export default async function AvailabilityPage({
  searchParams,
}: PageProps<"/availability">) {
  const query = stringifyQueryParams(await searchParams);
  await requireUser(query ? `/availability?${query}` : "/availability");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-medium">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Set the hours you&apos;re open for bookings. Clients can only book
          within these hours, shown in your local timezone.
        </p>
      </div>

      <Card>
        <CardContent>
          <ul className="flex flex-col">
            {days.map((day) => (
              <li
                key={day.label}
                className="flex flex-col gap-2 border-b py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex w-32 shrink-0 items-center gap-3">
                  <Switch defaultChecked={day.enabled} id={day.label} />
                  <label
                    htmlFor={day.label}
                    className="text-sm font-medium select-none"
                  >
                    {day.label}
                  </label>
                </div>

                {day.enabled ? (
                  <div className="flex flex-col items-start gap-1.5 pl-11 sm:flex-1 sm:flex-row sm:items-center sm:gap-2 sm:pl-0">
                    <Input
                      type="time"
                      defaultValue={day.start}
                      aria-label={`${day.label} start time`}
                      className="w-full sm:w-32"
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <Input
                      type="time"
                      defaultValue={day.end}
                      aria-label={`${day.label} end time`}
                      className="w-full sm:w-32"
                    />
                  </div>
                ) : (
                  <span className="pl-11 text-sm text-muted-foreground sm:flex-1 sm:pl-0">
                    Unavailable
                  </span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <p className="mr-auto text-xs text-muted-foreground">
            Timezone: America/Montreal
          </p>
          <LoadingButton type="button">Save changes</LoadingButton>
        </CardFooter>
      </Card>
    </div>
  );
}
