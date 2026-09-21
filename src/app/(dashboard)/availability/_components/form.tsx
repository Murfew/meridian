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
import type { DaysInput } from "@/lib/validation/availability";

const AvailabilityContext = createContext<{
  data: DaysInput;
  setData: Dispatch<SetStateAction<DaysInput>>;
} | null>(null);

const days = [
  { label: MONDAY, enabled: true, startTime: "09:00", endTime: "17:00" },
  { label: TUESDAY, enabled: true, startTime: "09:00", endTime: "17:00" },
  { label: WEDNESDAY, enabled: true, startTime: "09:00", endTime: "17:00" },
  { label: THURSDAY, enabled: true, startTime: "09:00", endTime: "17:00" },
  { label: FRIDAY, enabled: true, startTime: "09:00", endTime: "17:00" },
  { label: SATURDAY, enabled: false, startTime: "09:00", endTime: "17:00" },
  { label: SUNDAY, enabled: false, startTime: "09:00", endTime: "17:00" },
];

export function AvailabilityForm({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DaysInput>(days);
  return (
    <AvailabilityContext value={{ data, setData }}>
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
