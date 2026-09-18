import { defineRelations, defineRelationsPart } from "drizzle-orm";
import {
  accounts,
  availabilities,
  bookings,
  sessions,
  users,
  verifications,
} from "@/server/db/schema";

const appRelations = defineRelations(
  { bookings, availabilities, users },
  (r) => ({
    bookings: {
      owner: r.one.users({
        from: r.bookings.ownerId,
        to: r.users.id,
        optional: false,
      }),
    },
    availabilities: {
      owner: r.one.users({
        from: r.availabilities.ownerId,
        to: r.users.id,
        optional: false,
      }),
    },
  }),
);

const authRelations = defineRelationsPart(
  { users, sessions, accounts, verifications },
  (r) => ({
    users: {
      sessions: r.many.sessions({
        from: r.users.id,
        to: r.sessions.userId,
      }),
      accounts: r.many.accounts({
        from: r.users.id,
        to: r.accounts.userId,
      }),
    },
    sessions: {
      user: r.one.users({
        from: r.sessions.userId,
        to: r.users.id,
      }),
    },
    accounts: {
      user: r.one.users({
        from: r.accounts.userId,
        to: r.users.id,
      }),
    },
  }),
);

export const relations = { ...appRelations, ...authRelations };
