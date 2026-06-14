import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { trizenBrandHtml } from "@/lib/trizen-brand";

const SUPPORT_EMAIL = "support@trizenstore.com.bd";

function productReviewUrl(slug: string) {
  return `${SITE_URL}/product/${slug}#reviews`;
}

function reviewInviteEmailHtml({
  customerName,
  products,
}: {
  customerName: string;
  products: { name: string; slug: string }[];
}) {
  const productBlocks = products
    .map(
      (product) => `<tr>
        <td style="padding:14px 16px;border:1px solid #e4e4e7;background:#fafafa">
          <p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#18181b;font-weight:600;text-align:left">
            ${product.name}
          </p>
          <a href="${productReviewUrl(product.slug)}" style="display:inline-block;padding:10px 18px;background:#18181b;color:#ffffff;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase">
            Leave a review
          </a>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Share your ${SITE_NAME} experience</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Orbitron,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #e4e4e7;">
            <tr>
              <td style="padding:28px 32px 24px;border-bottom:1px solid #e4e4e7;text-align:center;">
                <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;color:#71717a;">
                  Order delivered
                </p>
                <div style="margin:0;text-align:center;">
                  ${trizenBrandHtml({ fontSize: "28px", email: true })}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 28px;text-align:center;">
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.35;color:#18181b;">How was your order?</h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#52525b;">
                  Hi ${customerName}, your order has been delivered. Share a quick verified review and help other gamers choose the right gear.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                  ${productBlocks}
                </table>
                <p style="margin:0;font-size:13px;line-height:1.55;color:#a1a1aa;">
                  Reviews are only accepted from verified purchases.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 24px;border-top:1px solid #e4e4e7;background:#fafafa;text-align:center;">
                <p style="margin:0 0 8px;font-size:12px;line-height:1.55;color:#71717a;">
                  Questions about your order? Reply to this email and our support team will help.
                </p>
                <p style="margin:0;font-size:12px;line-height:1.55;color:#a1a1aa;">
                  <a href="${SITE_URL}" style="color:#18181b;text-decoration:none;font-weight:600;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
                  &nbsp;&middot;&nbsp;
                  <a href="mailto:${SUPPORT_EMAIL}" style="color:#71717a;text-decoration:none;">${SUPPORT_EMAIL}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function reviewInviteEmailText({
  customerName,
  products,
}: {
  customerName: string;
  products: { name: string; slug: string }[];
}) {
  const productLines = products.flatMap((product) => [
    product.name,
    `Review: ${productReviewUrl(product.slug)}`,
    "",
  ]);

  return [
    SITE_NAME.toUpperCase(),
    "ORDER DELIVERED",
    "",
    `Hi ${customerName},`,
    "",
    "Your order has been delivered. Leave a verified review:",
    "",
    ...productLines,
    "Reviews are only accepted from verified purchases.",
    "",
    "Questions? Reply to this email or contact support@trizenstore.com.bd",
    SITE_URL,
  ].join("\n");
}

export async function sendReviewInvitesForOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { select: { slug: true, name: true } },
          review: { select: { id: true } },
        },
      },
    },
  });

  if (!order || order.status !== "delivered") return;

  const products = order.items
    .filter((item) => !item.review)
    .map((item) => ({
      name: item.name,
      slug: item.product.slug,
    }));

  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.slug, product])).values()
  );

  if (uniqueProducts.length === 0 || !order.customerEmail) return;

  await sendEmail({
    to: order.customerEmail,
    subject: `How was your ${SITE_NAME} order?`,
    text: reviewInviteEmailText({
      customerName: order.customerName,
      products: uniqueProducts,
    }),
    html: reviewInviteEmailHtml({
      customerName: order.customerName,
      products: uniqueProducts,
    }),
    replyTo: SUPPORT_EMAIL,
  });
}
