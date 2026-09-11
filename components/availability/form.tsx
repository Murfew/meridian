"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import type { Day } from "@/types/availability";

const AvailabilityContext = createContext<{
  data: Day[];
  setData: Dispatch<SetStateAction<Day[]>>;
} | null>(null);

const days = [
  { label: "Monday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Wednesday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Thursday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Friday", enabled: true, start: "09:00", end: "17:00" },
  { label: "Saturday", enabled: false, start: "09:00", end: "17:00" },
  { label: "Sunday", enabled: false, start: "09:00", end: "17:00" },
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
