import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import "dotenv/config";
import "@/lib/contsants";
import { FRI, MON, THU, TUE, WED } from "@/lib/contsants";
import { minutesSinceMidnight } from "@/lib/util";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

type Seed = {
  name: string;
  email: string;
  username: string;
  timezone: string;
  description: string;
  defaultDurationMinutes: number;
  availability: { dayOfWeek: number; startMinute: number; endMinute: number }[];
};

const seeds: Seed[] = [
  {
    name: "Alice Tremblay",
    email: "alice@example.com",
    username: "alice",
    timezone: "America/Montreal",
    description: "Product designer. Book a 30-minute intro call.",
    defaultDurationMinutes: 30,
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
    username: "bob",
    timezone: "America/Vancouver",
    description: "Engineering mentor. 60-minute sessions.",
    defaultDurationMinutes: 60,
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

  for (const s of seeds) {
    const { availability, ...user } = s;

    const upserted = await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });

    await prisma.availability.deleteMany({ where: { ownerId: upserted.id } });
    await prisma.availability.createMany({
      data: availability.map((a) => ({ ...a, ownerId: upserted.id })),
    });

    console.log(
      `✅ ${upserted.username} (${upserted.timezone}) — ${availability.length} availability rules`,
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
