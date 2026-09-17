import { createId } from "@paralleldrive/cuid2";
import { snakeCase, text, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "@/server/db/schema/auth";

export const bookings = snakeCase.table(
  "bookings",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    ownerId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slotStartUtc: timestamp({ withTimezone: true, precision: 3 }).notNull(),
    slotEndUtc: timestamp({ withTimezone: true, precision: 3 }).notNull(),
    bookerName: text().notNull(),
    bookerEmail: text().notNull(),
    note: text().notNull(),
    idempotencyKey: text().unique(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [unique().on(table.ownerId, table.slotStartUtc)],
);
