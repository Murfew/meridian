"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";

import type { Day } from "@/lib/validation/availability";

type AvailabilityContextValue = {
  days: Day[];
  setDays: Dispatch<SetStateAction<Day[]>>;
};

const AvailabilityContext = createContext<AvailabilityContextValue | null>(
  null,
);

export function AvailabilityProvider({
  children,
  availability,
}: {
  children: ReactNode;
  availability: Day[];
}) {
  const [days, setDays] = useState(availability);
  return (
    <AvailabilityContext value={{ days, setDays }}>
      {children}
    </AvailabilityContext>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error("useAvailability must be used within AvailabilityProvider");
  }
  return context;
}
