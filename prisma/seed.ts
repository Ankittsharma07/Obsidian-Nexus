import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("changeme", 10);

  const admin = await prisma.user.upsert({
    where: { email: "ava@obsidian.dev" },
    update: {},
    create: {
      email: "ava@obsidian.dev",
      name: "Ava Patel",
      passwordHash,
      role: Role.ADMIN
    }
  });

  await prisma.account.upsert({
    where: { id: "seed-precision" },
    update: {},
    create: {
      id: "seed-precision",
      name: "Precision Labs",
      industry: "BioTech",
      annualRevenue: 42000000,
      healthScore: 82,
      ownerId: admin.id,
      contacts: {
        create: {
          name: "Dr. Ethan Wells",
          email: "ethan@precision.ai",
          title: "CTO"
        }
      }
    }
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
