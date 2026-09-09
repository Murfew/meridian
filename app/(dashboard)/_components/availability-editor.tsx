"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const days = [
  { label: "Monday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Wednesday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Thursday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Friday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Saturday", enabled: false, start: "09:00", end: "17:00" },
  { label: "Sunday", enabled: false, start: "09:00", end: "17:00" },
];

export default function AvailabilityEditor() {
  const [data, setData] = useState(days);

  return (
    <ul className="flex flex-col">
      {data.map((day) => (
        <li
          key={day.label}
          className="flex flex-col gap-2 border-b py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-4"
        >
          <div className="flex w-32 shrink-0 items-center gap-3">
            <Switch
              checked={day.enabled}
              id={day.label}
              onCheckedChange={(checked) =>
                setData(
                  data.map((d) => {
                    if (d.label === day.label) {
                      return { ...d, enabled: checked };
                    } else {
                      return d;
                    }
                  }),
                )
              }
            />
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
  );
}
