import {
  isCheckoutEmailAddress,
  normalizeCheckoutEmail,
} from "@/lib/checkout-email-verify";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { isProductAvailable, isUpcoming } from "@/lib/product-status";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

type ProductForNotify = {
  id: string;
  name: string;
  slug: string;
  tag: string | null;
  stock: number;
  price: number;
};

function productUrl(slug: string) {
  return `${SITE_URL}/product/${slug}`;
}

function notifyEmailShell(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:48px 20px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto">
      <tr>
        <td align="center" style="padding-bottom:28px">
          <span style="font-size:24px;font-weight:700;letter-spacing:-0.03em;color:#18181b">TRIZEN</span>
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

async function sendProductNotifyConfirmation(
  product: Pick<ProductForNotify, "name" | "slug">,
  email: string
) {
  const url = productUrl(product.slug);
  const text = [
    `${product.name} is coming soon at ${SITE_NAME}.`,
    "",
    "We saved your email and will notify you when it is available to order.",
    "",
    `Product page: ${url}`,
    "",
    `${SITE_NAME}`,
    "support@trizenstore.com.bd",
  ].join("\n");

  await sendEmail({
    to: email,
    subject: `You're on the list for ${product.name}`,
    text,
    html: notifyEmailShell(
      "You're on the notify list",
      `<p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#52525b;text-align:center">
        Thanks for your interest in <strong style="color:#18181b">${product.name}</strong>.
        We will email you from <strong style="color:#18181b">support@trizenstore.com.bd</strong>
        as soon as it is available on the site.
      </p>
      <p style="margin:0;text-align:center">
        <a href="${url}" style="display:inline-block;padding:12px 20px;background:#18181b;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase">View product</a>
      </p>`
    ),
    replyTo: "support@trizenstore.com.bd",
  });
}

async function sendProductAvailableEmail(
  product: Pick<ProductForNotify, "name" | "slug">,
  email: string
) {
  const url = productUrl(product.slug);
  const text = [
    `${product.name} is now available at ${SITE_NAME}.`,
    "",
    "You asked us to notify you when this product launched. It is ready to order now.",
    "",
    `Shop now: ${url}`,
    "",
    `${SITE_NAME}`,
    "support@trizenstore.com.bd",
  ].join("\n");

  await sendEmail({
    to: email,
    subject: `${product.name} is now available`,
    text,
    html: notifyEmailShell(
      `${product.name} is now available`,
      `<p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#52525b;text-align:center">
        The product you were waiting for is live on ${SITE_NAME}.
        Order now before stock runs out.
      </p>
      <p style="margin:0;text-align:center">
        <a href="${url}" style="display:inline-block;padding:12px 20px;background:#18181b;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase">Shop now</a>
      </p>`
    ),
    replyTo: "support@trizenstore.com.bd",
  });
}

export async function subscribeProductNotify({
  productId,
  email,
  userId,
}: {
  productId: string;
  email: string;
  userId?: string | null;
}) {
  const normalized = normalizeCheckoutEmail(email);
  if (!isCheckoutEmailAddress(normalized)) {
    throw new Error("Enter a valid email address.");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !isUpcoming(product.tag)) {
    throw new Error("This product is not open for notifications.");
  }

  const existing = await prisma.productNotifyRequest.findUnique({
    where: {
      productId_email: {
        productId,
        email: normalized,
      },
    },
  });

  if (existing) {
    return { alreadySubscribed: true, email: normalized };
  }

  await prisma.productNotifyRequest.create({
    data: {
      productId,
      email: normalized,
      userId: userId ?? null,
    },
  });

  await sendProductNotifyConfirmation(product, normalized);

  return { alreadySubscribed: false, email: normalized };
}

export async function getProductNotifyStatus(productId: string, email: string) {
  const normalized = normalizeCheckoutEmail(email);
  if (!isCheckoutEmailAddress(normalized)) return false;

  const row = await prisma.productNotifyRequest.findUnique({
    where: {
      productId_email: {
        productId,
        email: normalized,
      },
    },
  });

  return Boolean(row);
}

export async function notifyProductWaitlist(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !isProductAvailable(product)) {
    return { sent: 0, skipped: true };
  }

  const pending = await prisma.productNotifyRequest.findMany({
    where: { productId, notifiedAt: null },
  });

  let sent = 0;
  for (const request of pending) {
    try {
      await sendProductAvailableEmail(product, request.email);
      await prisma.productNotifyRequest.update({
        where: { id: request.id },
        data: { notifiedAt: new Date() },
      });
      sent += 1;
    } catch (error) {
      console.error(
        `Failed to notify ${request.email} for ${product.slug}:`,
        error
      );
    }
  }

  return { sent, skipped: false };
}
