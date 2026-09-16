import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import "dotenv/config";
import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";
import { type Prisma, PrismaClient } from "~/generated/client";
import {
  FRIDAY,
  getDayNumber,
  MONDAY,
  minutesSinceMidnight,
  THURSDAY,
  TUESDAY,
  WEDNESDAY,
} from "~/lib/time";

const env = createEnv({
  server: { DATABASE_URL: z.url(), SEED_USER_PASSWORD: z.string().min(1) },
  experimental__runtimeEnv: {},
});

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const PASSWORD = env.SEED_USER_PASSWORD;

type SeedAvailability = Pick<
  Prisma.AvailabilityCreateManyInput,
  "dayOfWeek" | "startMinute" | "endMinute"
>;

type SeedUser = Omit<Prisma.UserCreateInput, "availability"> & {
  password: string;
  availability: SeedAvailability[];
};

const users: SeedUser[] = [
  {
    name: "Alice Tremblay",
    email: "alice@example.com",
    emailVerified: true,
    username: "alice",
    displayUsername: "Alice's Hair Salon",
    timezone: "America/Montreal",
    description: "Product designer. Book a 30-minute intro call.",
    defaultDurationMinutes: 30,
    password: PASSWORD,
    availability: [
      {
        dayOfWeek: getDayNumber(MONDAY),
        startMinute: minutesSinceMidnight(9),
        endMinute: minutesSinceMidnight(12),
      },
      {
        dayOfWeek: getDayNumber(TUESDAY),
        startMinute: minutesSinceMidnight(9),
        endMinute: minutesSinceMidnight(17),
      },

      {
        dayOfWeek: getDayNumber(WEDNESDAY),
        startMinute: minutesSinceMidnight(13),
        endMinute: minutesSinceMidnight(17),
      },
      {
        dayOfWeek: getDayNumber(THURSDAY),
        startMinute: minutesSinceMidnight(9),
        endMinute: minutesSinceMidnight(12),
      },
    ],
  },
  {
    name: "Bob Nakamura",
    email: "bob@example.com",
    emailVerified: true,
    username: "bob",
    displayUsername: "Bob's Barber Shop",
    timezone: "America/Vancouver",
    description: "Engineering mentor. 60-minute sessions.",
    defaultDurationMinutes: 60,
    password: PASSWORD,
    availability: [
      {
        dayOfWeek: getDayNumber(WEDNESDAY),
        startMinute: minutesSinceMidnight(10),
        endMinute: minutesSinceMidnight(16),
      },
      {
        dayOfWeek: getDayNumber(FRIDAY),
        startMinute: minutesSinceMidnight(10),
        endMinute: minutesSinceMidnight(16),
      },
    ],
  },
];

export async function main() {
  console.log("🌱 Starting database seed...");

  for (const seedUser of users) {
    const { availability, password, ...userData } = seedUser;

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData,
    });

    await prisma.availability.deleteMany({ where: { ownerId: user.id } });
    await prisma.availability.createMany({
      data: availability.map((a) => ({ ...a, ownerId: user.id })),
    });

    const passwordHash = await hashPassword(password);
    const existingAccount = await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
    });

    if (existingAccount) {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { password: passwordHash, updatedAt: new Date() },
      });
    } else {
      await prisma.account.create({
        data: {
          id: randomUUID(),
          userId: user.id,
          providerId: "credential",
          accountId: user.id,
          password: passwordHash,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    console.log(
      `✅ ${user.username} (${user.timezone}) — ${availability.length} availability rules`,
    );
  }

  console.log("🏁 Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
