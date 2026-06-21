/**
 * Upsert a temporary order-management admin without touching owner admins.
 * Usage: npm run admin:temp-order
 * Optional: set TEMP_ADMIN_EMAIL, TEMP_ADMIN_PASSWORD, and TEMP_ADMIN_DAYS first.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

function loadLocalEnv() {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = trimmed.slice(index + 1).trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (quoted) value = value.slice(1, -1);
    process.env[key] = value;
  }
}

loadLocalEnv();

const prisma = new PrismaClient();

async function main() {
  const email = (
    process.env.TEMP_ADMIN_EMAIL?.trim() || "trizenstore@gmail.com"
  ).toLowerCase();
  const days = Number(process.env.TEMP_ADMIN_DAYS?.trim() || "7");
  const password =
    process.env.TEMP_ADMIN_PASSWORD?.trim() ||
    randomBytes(18).toString("base64url");

  if (!Number.isFinite(days) || days <= 0) {
    throw new Error("TEMP_ADMIN_DAYS must be a positive number.");
  }

  if (password.length < 12) {
    throw new Error("TEMP_ADMIN_PASSWORD must be at least 12 characters.");
  }

  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      name: "TRIZEN Order Manager",
      role: "order_manager",
      expiresAt,
    },
    update: {
      passwordHash,
      name: "TRIZEN Order Manager",
      role: "order_manager",
      expiresAt,
    },
  });

  console.log("Temporary order admin ready.");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log("Role: order_manager");
  console.log(`Expires: ${expiresAt.toISOString()}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
