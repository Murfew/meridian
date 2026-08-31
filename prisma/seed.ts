import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import "dotenv/config";
import "@/lib/contsants";
import type { Prisma } from "@/app/generated/prisma/client";
import { FRI, MON, THU, TUE, WED } from "@/lib/contsants";
import { minutesSinceMidnight } from "@/lib/utils";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const PASSWORD = "Password123!";

type SeedAvailability = Pick<
  Prisma.AvailabilityCreateManyInput,
  "dayOfWeek" | "startMinute" | "endMinute"
>;

type SeedUser = Prisma.UserCreateInput & {
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
        dayOfWeek: MON,
        startMinute: minutesSinceMidnight(9),
        endMinute: minutesSinceMidnight(12),
      },
      {
        dayOfWeek: MON,
        startMinute: minutesSinceMidnight(13),
        endMinute: minutesSinceMidnight(17),
      },
      {
        dayOfWeek: TUE,
        startMinute: minutesSinceMidnight(9),
        endMinute: minutesSinceMidnight(17),
      },
      {
        dayOfWeek: WED,
        startMinute: minutesSinceMidnight(13),
        endMinute: minutesSinceMidnight(17),
      },
      {
        dayOfWeek: THU,
        startMinute: minutesSinceMidnight(9),
        endMinute: minutesSinceMidnight(12),
      },
      {
        dayOfWeek: TUE,
        startMinute: minutesSinceMidnight(18),
        endMinute: minutesSinceMidnight(20),
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
        dayOfWeek: WED,
        startMinute: minutesSinceMidnight(10),
        endMinute: minutesSinceMidnight(16),
      },
      {
        dayOfWeek: FRI,
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
