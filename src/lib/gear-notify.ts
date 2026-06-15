import {
  isCheckoutEmailAddress,
  normalizeCheckoutEmail,
} from "@/lib/checkout-email-verify";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import {
  isShopGearLine,
  SHOP_GEAR_COPY,
  type ShopGearLine,
} from "@/lib/shop-gears";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { trizenBrandHtml } from "@/lib/trizen-brand";

function gearShopUrl(gear: ShopGearLine) {
  return `${SITE_URL}/shop?gear=${gear}`;
}

function notifyEmailShell(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:48px 20px;background:#ffffff;font-family:Orbitron,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto">
      <tr>
        <td align="center" style="padding-bottom:28px">
          ${trizenBrandHtml({ fontSize: "24px", email: true })}
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #e4e4e7;padding-top:32px">
          <h1 style="margin:0 0 16px;font-size:20px;line-height:1.35;color:#18181b;text-align:center">${title}</h1>
          ${bodyHtml}
        </td>
      </tr>
      <tr>
        <td style="padding-top:32px">
          <p style="margin:0;font-size:13px;line-height:1.5;color:#a1a1aa;text-align:center">
            ${SITE_NAME} · support@trizenstore.com.bd
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendGearNotifyConfirmation(gear: ShopGearLine, email: string) {
  const label = SHOP_GEAR_COPY[gear].title;
  const url = gearShopUrl(gear);
  const text = [
    `${label} is coming soon at ${SITE_NAME}.`,
    "",
    "We saved your email and will notify you when products in this category launch.",
    "",
    `Shop: ${url}`,
    "",
    `${SITE_NAME}`,
    "support@trizenstore.com.bd",
  ].join("\n");

  await sendEmail({
    to: email,
    subject: `You're on the list for ${label}`,
    text,
    html: notifyEmailShell(
      "You're on the notify list",
      `<p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#52525b;text-align:center">
        Thanks for your interest in <strong style="color:#18181b">${label}</strong>.
        We will email you from <strong style="color:#18181b">support@trizenstore.com.bd</strong>
        as soon as it launches at ${SITE_NAME}.
      </p>
      <p style="margin:0;text-align:center">
        <a href="${url}" style="display:inline-block;padding:12px 20px;background:#18181b;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase">View category</a>
      </p>`,
    ),
    replyTo: "support@trizenstore.com.bd",
  });
}

export function gearNotifyLabel(gear: ShopGearLine) {
  return SHOP_GEAR_COPY[gear].title;
}

export async function subscribeGearNotify({
  gear,
  email,
  userId,
}: {
  gear: ShopGearLine;
  email: string;
  userId?: string | null;
}) {
  if (!isShopGearLine(gear)) {
    throw new Error("Invalid category.");
  }

  const normalized = normalizeCheckoutEmail(email);
  if (!isCheckoutEmailAddress(normalized)) {
    throw new Error("Enter a valid email address.");
  }

  const existing = await prisma.gearNotifyRequest.findUnique({
    where: {
      gear_email: {
        gear,
        email: normalized,
      },
    },
  });

  if (existing) {
    return { alreadySubscribed: true, email: normalized };
  }

  await prisma.gearNotifyRequest.create({
    data: {
      gear,
      email: normalized,
      userId: userId ?? null,
    },
  });

  await sendGearNotifyConfirmation(gear, normalized);

  return { alreadySubscribed: false, email: normalized };
}

export async function getGearNotifyStatus(gear: ShopGearLine, email: string) {
  const normalized = normalizeCheckoutEmail(email);
  if (!isCheckoutEmailAddress(normalized)) return false;

  const row = await prisma.gearNotifyRequest.findUnique({
    where: {
      gear_email: {
        gear,
        email: normalized,
      },
    },
  });

  return Boolean(row);
}
