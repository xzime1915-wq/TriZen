import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { trizenBrandHtml } from "@/lib/trizen-brand";

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
  const productLinks = products
    .map(
      (product) =>
        `<li style="margin:0 0 10px"><a href="${productReviewUrl(product.slug)}" style="color:#18181b;text-decoration:underline">${product.name}</a></li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:48px 20px;background:#ffffff;font-family:Orbitron,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto">
      <tr>
        <td align="center" style="padding-bottom:28px">
          ${trizenBrandHtml({ fontSize: "24px" })}
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #e4e4e7;padding-top:32px">
          <h1 style="margin:0 0 16px;font-size:20px;line-height:1.35;color:#18181b;text-align:center">How was your order?</h1>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#52525b;text-align:center">
            Hi ${customerName}, your order has been delivered. Leave a verified review and help other gamers choose the right gear.
          </p>
          <ul style="margin:0;padding:0 0 24px 20px;font-size:14px;line-height:1.6;color:#18181b">
            ${productLinks}
          </ul>
          <p style="margin:0;font-size:12px;line-height:1.6;color:#71717a;text-align:center">
            Reviews are only accepted from verified purchases.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
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

  const textLines = uniqueProducts.map(
    (product) => `${product.name}: ${productReviewUrl(product.slug)}`
  );

  await sendEmail({
    to: order.customerEmail,
    subject: `Share your ${SITE_NAME} experience`,
    text: [
      `Hi ${order.customerName},`,
      "",
      "Your order has been delivered. Leave a verified review:",
      "",
      ...textLines,
      "",
      "Reviews are only accepted from verified purchases.",
    ].join("\n"),
    html: reviewInviteEmailHtml({
      customerName: order.customerName,
      products: uniqueProducts,
    }),
  });
}
