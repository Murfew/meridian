import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
  check,
  integer,
  snakeCase,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "@/server/db/schema/auth";

export const availabilities = snakeCase.table(
  "availabilities",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    ownerId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dayOfWeek: integer().notNull(), //0 = Sunday ... 6 = Saturday
    startMinute: integer().notNull(), // minutes from local midnight
    endMinute: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique().on(table.ownerId, table.dayOfWeek),
    check("valid_day_of_week", sql`${table.dayOfWeek} BETWEEN 0 AND 6`),
    check(
      "start_minute_before_end_minute",
      sql`${table.startMinute} < ${table.endMinute}`,
    ),
  ],
);
