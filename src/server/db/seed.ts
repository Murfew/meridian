import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import {
  FRIDAY,
  getDayNumber,
  MONDAY,
  THURSDAY,
  TUESDAY,
  toMinutes,
  WEDNESDAY,
} from "@/lib/time";
import { accounts, availabilities, users } from "@/server/db/schema";
import { db } from "./index";

type InsertUser = typeof users.$inferInsert;
type InsertAvailability = typeof availabilities.$inferInsert;

type SeedAvailability = Omit<InsertAvailability, "ownerId">;
type SeedUser = InsertUser & { availabilities: SeedAvailability[] };

const seedUsers: SeedUser[] = [
  {
    name: "Alice Tremblay",
    email: "alice@example.com",
    emailVerified: true,
    username: "alice",
    displayUsername: "Alice's Hair Salon",
    description: "Product designer. Book a 30-minute intro call.",
    availabilities: [
      {
        dayOfWeek: getDayNumber(MONDAY),
        startMinute: toMinutes({ hours: 9, minutes: 0 }),
        endMinute: toMinutes({ hours: 12, minutes: 0 }),
      },
      {
        dayOfWeek: getDayNumber(TUESDAY),
        startMinute: toMinutes({ hours: 9, minutes: 0 }),
        endMinute: toMinutes({ hours: 17, minutes: 0 }),
      },

      {
        dayOfWeek: getDayNumber(WEDNESDAY),
        startMinute: toMinutes({ hours: 13, minutes: 0 }),
        endMinute: toMinutes({ hours: 17, minutes: 0 }),
      },
      {
        dayOfWeek: getDayNumber(THURSDAY),
        startMinute: toMinutes({ hours: 9, minutes: 0 }),
        endMinute: toMinutes({ hours: 12, minutes: 0 }),
      },
    ],
  },
  {
    name: "Bob Nakamura",
    email: "bob@example.com",
    emailVerified: true,
    username: "bob",
    displayUsername: "Bob's Barber Shop",
    timezone: "Asia/Tokyo",
    description: "Engineering mentor. 60-minute sessions.",
    defaultDurationMinutes: 60,
    availabilities: [
      {
        dayOfWeek: getDayNumber(WEDNESDAY),
        startMinute: toMinutes({ hours: 10, minutes: 0 }),
        endMinute: toMinutes({ hours: 16, minutes: 0 }),
      },
      {
        dayOfWeek: getDayNumber(FRIDAY),
        startMinute: toMinutes({ hours: 10, minutes: 0 }),
        endMinute: toMinutes({ hours: 16, minutes: 0 }),
      },
    ],
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  for (const seedUser of seedUsers) {
    await db.transaction(async (tx) => {
      const { availabilities: seedAvailabilities, ...userData } = seedUser;

      const [user] = await tx
        .insert(users)
        .values(seedUser)
        .onConflictDoUpdate({ target: users.email, set: userData })
        .returning();

      await tx
        .delete(availabilities)
        .where(eq(availabilities.ownerId, user.id));
      const insertedAvailabilities = await tx
        .insert(availabilities)
        .values(
          seedAvailabilities.map((availability) => ({
            ...availability,
            ownerId: user.id,
          })),
        )
        .returning();

      const passwordHash = await hashPassword(env.SEED_USER_PASSWORD);
      const existingAccount = await tx.query.accounts.findFirst({
        where: { userId: user.id, providerId: "credential" },
      });

      if (existingAccount) {
        await tx
          .update(accounts)
          .set({ password: passwordHash })
          .where(eq(accounts.id, existingAccount.id));
      } else {
        await tx.insert(accounts).values({
          id: randomUUID(),
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: passwordHash,
        });
      }

      console.log(
        `✅ ${user.username} (${user.timezone}) — ${insertedAvailabilities.length} availability rules`,
      );
    });
  }

  console.log("🏁 Seeding complete.");
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
