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
import type { Day } from "@/types/availability";

const AvailabilityContext = createContext<{
  data: Day[];
  setData: Dispatch<SetStateAction<Day[]>>;
} | null>(null);

const days = [
  { label: MONDAY, enabled: true, start: "09:00", end: "17:00" },
  { label: TUESDAY, enabled: true, start: "09:00", end: "17:00" },
  { label: WEDNESDAY, enabled: true, start: "09:00", end: "17:00" },
  { label: THURSDAY, enabled: true, start: "09:00", end: "17:00" },
  { label: FRIDAY, enabled: true, start: "09:00", end: "17:00" },
  { label: SATURDAY, enabled: false, start: "09:00", end: "17:00" },
  { label: SUNDAY, enabled: false, start: "09:00", end: "17:00" },
];

export function AvailabilityForm({ children }: { children: ReactNode }) {
  const [data, setData] = useState(days);
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
