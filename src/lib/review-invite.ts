import { sendEmail } from "@/lib/email";
import { displayImageSrc } from "@/lib/image-path";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { trizenBrandHtml } from "@/lib/trizen-brand";

const SUPPORT_EMAIL = "support@trizenstore.com.bd";

type ReviewProduct = {
  name: string;
  slug: string;
  image: string;
};

function productReviewUrl(slug: string) {
  return `${SITE_URL}/product/${slug}#reviews`;
}

function emailImageUrl(src: string) {
  const path = displayImageSrc(src?.trim() || "/og-image.png");
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function reviewInviteEmailHtml({
  customerName,
  products,
}: {
  customerName: string;
  products: ReviewProduct[];
}) {
  const productRows = products
    .map((product) => {
      const reviewUrl = productReviewUrl(product.slug);
      const imageUrl = emailImageUrl(product.image);
      return `<tr>
        <td style="padding:20px 0;border-top:1px solid #e4e4e7">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="80" valign="top" style="padding-right:16px">
                <a href="${reviewUrl}" style="text-decoration:none">
                  <img
                    src="${imageUrl}"
                    alt="${product.name}"
                    width="80"
                    height="80"
                    style="display:block;width:80px;height:80px;object-fit:contain;background:#fafafa"
                  />
                </a>
              </td>
              <td valign="middle" style="text-align:left">
                <a
                  href="${reviewUrl}"
                  style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#18181b;text-decoration:underline;line-height:1.4"
                >
                  ${product.name}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    })
    .join("");

  const primaryReviewUrl = productReviewUrl(products[0]?.slug ?? "");
  const ctaBlock =
    products.length === 1
      ? `<tr>
        <td style="padding:8px 0 0">
          <a
            href="${primaryReviewUrl}"
            style="display:block;padding:14px 20px;background:#18181b;color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;text-align:center"
          >
            Leave a review
          </a>
        </td>
      </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Share your ${SITE_NAME} experience</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background:#ffffff;font-family:Orbitron,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;">
            <tr>
              <td style="padding:0 0 24px;text-align:center;border-bottom:1px solid #e4e4e7;">
                ${trizenBrandHtml({ fontSize: "24px", email: true })}
              </td>
            </tr>
            <tr>
              <td style="padding:28px 0 8px;text-align:center;">
                <h1 style="margin:0 0 14px;font-size:14px;line-height:1.4;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#18181b;">
                  How was your order?
                </h1>
                <p style="margin:0;font-size:14px;line-height:1.65;color:#52525b;">
                  Hi ${customerName}, your order has been delivered. Tap a product below to leave a verified review.
                </p>
              </td>
            </tr>
            ${productRows}
            ${ctaBlock}
            <tr>
              <td style="padding:20px 0 0;text-align:center;">
                <p style="margin:0;font-size:11px;line-height:1.55;color:#a1a1aa;letter-spacing:0.04em;">
                  Verified purchases only
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 0 0;border-top:1px solid #e4e4e7;text-align:center;">
                <p style="margin:0 0 8px;font-size:11px;line-height:1.55;color:#a1a1aa;">
                  Questions? Reply to this email and we will help.
                </p>
                <p style="margin:0;font-size:11px;line-height:1.55;color:#71717a;">
                  <a href="${SITE_URL}" style="color:#18181b;text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
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
  products: ReviewProduct[];
}) {
  const productLines = products.flatMap((product) => [
    product.name,
    `Review: ${productReviewUrl(product.slug)}`,
    "",
  ]);

  return [
    SITE_NAME.toUpperCase(),
    "HOW WAS YOUR ORDER?",
    "",
    `Hi ${customerName},`,
    "",
    "Your order has been delivered. Leave a verified review:",
    "",
    ...productLines,
    "Verified purchases only.",
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
          product: { select: { slug: true, name: true, image: true } },
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
      image: item.product.image,
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
