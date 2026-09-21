"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import {
  FRIDAY,
  MONDAY,
  SATURDAY,
  SUNDAY,
  THURSDAY,
  TUESDAY,
  WEDNESDAY,
} from "@/lib/time";
import type { Day } from "@/lib/validation/availability";

const AvailabilityContext = createContext<{
  days: Day[];
  setDays: Dispatch<SetStateAction<Day[]>>;
} | null>(null);

const initial = [
  { dayName: MONDAY, enabled: true, startTime: "09:00", endTime: "17:00" },
  { dayName: TUESDAY, enabled: true, startTime: "09:00", endTime: "17:00" },
  { dayName: WEDNESDAY, enabled: true, startTime: "09:00", endTime: "17:00" },
  { dayName: THURSDAY, enabled: true, startTime: "09:00", endTime: "17:00" },
  { dayName: FRIDAY, enabled: true, startTime: "09:00", endTime: "17:00" },
  { dayName: SATURDAY, enabled: false, startTime: "09:00", endTime: "17:00" },
  { dayName: SUNDAY, enabled: false, startTime: "09:00", endTime: "17:00" },
];

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [days, setDays] = useState<Day[]>(initial);
  return (
    <AvailabilityContext value={{ days, setDays }}>
      {children}
    </AvailabilityContext>
  );
}

export function useAvailability() {
  const ctx = useContext(AvailabilityContext);
  if (!ctx) {
    throw new Error("useAvailability must be used within AvailabilityForm");
  }
  return ctx;
}
