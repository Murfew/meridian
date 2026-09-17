import {
  accounts,
  sessions,
  users,
  verifications,
} from "@/server/db/schema/auth";
import { availabilities } from "@/server/db/schema/availabilities";
import { bookings } from "@/server/db/schema/bookings";

export const schema = {
  availabilities,
  bookings,
  users,
  accounts,
  sessions,
  verifications,
};
