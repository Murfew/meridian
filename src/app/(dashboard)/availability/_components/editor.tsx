"use client";

import { useAvailability } from "@/app/(dashboard)/availability/_components/context";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Day } from "@/lib/validation/availability";

export function AvailabilityEditor() {
  const { days, setDays } = useAvailability();

  function updateDay(dayName: string, changes: Partial<Day>) {
    setDays(
      days.map((day) => {
        if (day.dayName === dayName) {
          return { ...day, ...changes };
        } else {
          return day;
        }
      }),
    );
  }

  return (
    <ul className="flex flex-col">
      {days.map((day) => (
        <li
          key={day.dayName}
          className="flex flex-col gap-2 border-b py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-4"
        >
          <div className="flex w-32 shrink-0 items-center gap-3">
            <Switch
              checked={day.enabled}
              id={day.dayName}
              onCheckedChange={(checked) =>
                updateDay(day.dayName, { enabled: checked })
              }
            />
            <label
              htmlFor={day.dayName}
              className="text-sm font-medium select-none"
            >
              {day.dayName}
            </label>
          </div>

          {day.enabled ? (
            <div className="flex flex-col items-start gap-1.5 pl-11 sm:flex-1 sm:flex-row sm:items-center sm:gap-2 sm:pl-0">
              <Input
                type="time"
                value={day.startTime}
                onValueChange={(value) =>
                  updateDay(day.dayName, { startTime: value })
                }
                aria-label={`${day.dayName} start time`}
                className="w-full sm:w-32"
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="time"
                value={day.endTime}
                onValueChange={(value) =>
                  updateDay(day.dayName, { endTime: value })
                }
                aria-label={`${day.dayName} end time`}
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
  );
}
