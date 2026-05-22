/**
 * Reset admin login to match .env (VPS: npm run admin:reset)
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD in .env
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
    process.exit(1);
  }

  if (password.length < 12) {
    console.error("ADMIN_PASSWORD must be at least 12 characters.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  await prisma.admin.deleteMany({});

  await prisma.admin.create({
    data: {
      email,
      passwordHash: hash,
      name: "TriZen Admin",
    },
  });

  console.log("Admin reset OK.");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: (from ADMIN_PASSWORD in .env)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
