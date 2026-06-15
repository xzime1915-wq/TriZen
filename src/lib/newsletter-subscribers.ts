import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeNewsletterEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidNewsletterEmail(email: string) {
  return EMAIL_RE.test(normalizeNewsletterEmail(email));
}

export async function upsertNewsletterSubscriber(
  email: string,
  firstName = "",
) {
  const normalized = normalizeNewsletterEmail(email);
  return prisma.newsletterSubscriber.upsert({
    where: { email: normalized },
    create: {
      email: normalized,
      firstName: firstName.trim(),
      active: true,
    },
    update: {
      firstName: firstName.trim() || undefined,
      active: true,
    },
  });
}

export async function listActiveNewsletterSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
    select: { email: true, firstName: true },
  });
}
