const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();
const prisma = new PrismaClient();

const DEMO_PASSWORD = "DefaCtoAfreCano@159";
const DEMO_USERS = {
  superadmin: { name: "Super Admin", email: "superadmin@ushereel.com", role: "SUPER_ADMIN" },
  admin: { name: "Demo Admin", email: "demo.admin@ushereel.com", role: "ADMIN" },
  client: { name: "Demo Client", email: "demo.client@ushereel.com", role: "CLIENT" },
  usher1: { name: "Demo Usher One", email: "demo.usher1@ushereel.com", role: "USHER" },
  usher2: { name: "Demo Usher Two", email: "demo.usher2@ushereel.com", role: "USHER" },
};
const DEMO_EVENT_NAME = "Seeded E2E Event";

async function upsertUser(user, hashedPassword) {
  return prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: user.name,
      password: hashedPassword,
      role: user.role,
    },
    create: {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role,
    },
  });
}

async function main() {
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  const superadmin = await upsertUser(DEMO_USERS.superadmin, hashedPassword);
  const admin = await upsertUser(DEMO_USERS.admin, hashedPassword);
  const client = await upsertUser(DEMO_USERS.client, hashedPassword);
  const usherOneUser = await upsertUser(DEMO_USERS.usher1, hashedPassword);
  const usherTwoUser = await upsertUser(DEMO_USERS.usher2, hashedPassword);

  const usherOne = await prisma.usher.upsert({
    where: { userId: usherOneUser.id },
    update: {
      bio: "Bilingual usher for premium events",
      languages: ["ar", "en"],
      lat: 30.0444,
      lng: 31.2357,
      reliabilityScore: 100,
    },
    create: {
      userId: usherOneUser.id,
      bio: "Bilingual usher for premium events",
      languages: ["ar", "en"],
      lat: 30.0444,
      lng: 31.2357,
      reliabilityScore: 100,
    },
  });

  const usherTwo = await prisma.usher.upsert({
    where: { userId: usherTwoUser.id },
    update: {
      bio: "Arabic usher for activations and conferences",
      languages: ["ar"],
      lat: 30.055,
      lng: 31.25,
      reliabilityScore: 90,
    },
    create: {
      userId: usherTwoUser.id,
      bio: "Arabic usher for activations and conferences",
      languages: ["ar"],
      lat: 30.055,
      lng: 31.25,
      reliabilityScore: 90,
    },
  });

  let event = await prisma.event.findFirst({
    where: {
      name: DEMO_EVENT_NAME,
      clientId: client.id,
    },
  });

  const eventDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  if (!event) {
    event = await prisma.event.create({
      data: {
        clientId: client.id,
        name: DEMO_EVENT_NAME,
        lat: 30.048,
        lng: 31.231,
        date: eventDate,
        requiredUshers: 2,
        language: "ar",
        status: "OPEN",
      },
    });
  } else {
    event = await prisma.event.update({
      where: { id: event.id },
      data: {
        lat: 30.048,
        lng: 31.231,
        date: eventDate,
        requiredUshers: 2,
        language: "ar",
        status: "OPEN",
      },
    });
  }

  await prisma.checkin.deleteMany({ where: { eventId: event.id } });
  await prisma.rating.deleteMany({ where: { eventId: event.id } });
  await prisma.booking.deleteMany({ where: { eventId: event.id } });

  const bookingOne = await prisma.booking.create({
    data: {
      eventId: event.id,
      usherId: usherOne.id,
      status: "CONFIRMED",
    },
  });

  const bookingTwo = await prisma.booking.create({
    data: {
      eventId: event.id,
      usherId: usherTwo.id,
      status: "NO_SHOW",
    },
  });

  await prisma.checkin.create({
    data: {
      eventId: event.id,
      usherId: usherOne.id,
      lat: 30.0481,
      lng: 31.2312,
      distanceKm: 0.05,
      withinZone: true,
      kind: "IN",
    },
  });

  await prisma.rating.upsert({
    where: {
      eventId_usherId: {
        eventId: event.id,
        usherId: usherOne.id,
      },
    },
    update: {
      raterId: client.id,
      rating: 5,
      comment: "Seeded demo rating",
    },
    create: {
      eventId: event.id,
      usherId: usherOne.id,
      raterId: client.id,
      rating: 5,
      comment: "Seeded demo rating",
    },
  });

  await prisma.usher.update({
    where: { id: usherOne.id },
    data: { rating: 5, reliabilityScore: 100 },
  });

  await prisma.usher.update({
    where: { id: usherTwo.id },
    data: { reliabilityScore: 90 },
  });

  const seedOutput = {
    generatedAt: new Date().toISOString(),
    credentials: {
      password: DEMO_PASSWORD,
      superadmin: DEMO_USERS.superadmin.email,
      admin: DEMO_USERS.admin.email,
      client: DEMO_USERS.client.email,
      usher1: DEMO_USERS.usher1.email,
      usher2: DEMO_USERS.usher2.email,
    },
    ids: {
      eventId: event.id,
      booking1Id: bookingOne.id,
      booking2Id: bookingTwo.id,
      usher1Id: usherOne.id,
      usher2Id: usherTwo.id,
    },
  };

  const outputPath = path.join(__dirname, "seed-output.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(seedOutput, null, 2)}\n`, "utf8");

  console.log("Seed complete.");
  console.log(`Output written to ${outputPath}`);
  console.log(seedOutput);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
