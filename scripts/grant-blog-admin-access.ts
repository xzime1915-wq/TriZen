import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EMAIL = "trizenstore@gmail.com";

async function main() {
  const admin = await prisma.admin.findUnique({ where: { email: EMAIL } });

  if (!admin) {
    console.log(`Admin not found: ${EMAIL}`);
    console.log("Create the admin account first, then run this script again.");
    return;
  }

  await prisma.admin.update({
    where: { email: EMAIL },
    data: {
      role: "order_blog_manager",
      expiresAt: null,
    },
  });

  console.log(`Permanent order + blog admin access ready: ${EMAIL}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
