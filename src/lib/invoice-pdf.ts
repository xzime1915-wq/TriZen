import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Order, OrderItem, StoreSettings } from "@prisma/client";
import { getStatusLabel } from "@/lib/utils";

type OrderWithItems = Order & { items: OrderItem[] };

function formatMoney(amount: number) {
  const n = amount.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `BDT ${n} Taka`;
}

function wrapText(
  text: string,
  maxWidth: number,
  measure: (line: string) => number
): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const pushLongWord = (word: string, lines: string[], carry: { value: string }) => {
    let chunk = carry.value;
    for (const ch of word) {
      const test = chunk + ch;
      if (measure(test) <= maxWidth) {
        chunk = test;
        continue;
      }
      if (chunk) lines.push(chunk);
      chunk = ch;
    }
    carry.value = chunk;
  };

  const words = trimmed.split(/\s+/);
  const lines: string[] = [];
  const carry = { value: "" };

  for (const word of words) {
    if (measure(word) > maxWidth) {
      if (carry.value) {
        lines.push(carry.value);
        carry.value = "";
      }
      pushLongWord(word, lines, carry);
      continue;
    }

    const next = carry.value ? `${carry.value} ${word}` : word;
    if (measure(next) <= maxWidth) {
      carry.value = next;
      continue;
    }
    if (carry.value) lines.push(carry.value);
    carry.value = word;
  }

  if (carry.value) lines.push(carry.value);
  return lines;
}

export async function buildInvoicePdf(
  order: OrderWithItems,
  settings: StoreSettings | null
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const storeName = settings?.storeName || "TRIZEN Store";
  const margin = 50;
  const pageWidth = page.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = page.getHeight() - margin;

  const drawText = (
    text: string,
    x: number,
    size: number,
    bold = false,
    color = rgb(0, 0, 0)
  ) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: bold ? fontBold : font,
      color,
    });
  };

  const drawRight = (text: string, size: number, bold = false, color = rgb(0, 0, 0)) => {
    const f = bold ? fontBold : font;
    const width = f.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: pageWidth - margin - width,
      y,
      size,
      font: f,
      color,
    });
  };

  // Header — brand logo
  const headerTop = page.getHeight() - margin;
  let headerBottom = headerTop - 20;
  try {
    const logoPath = path.join(process.cwd(), "public", "logo_b.png");
    const logoBytes = await readFile(logoPath);
    const logoImage = await pdf.embedPng(logoBytes);
    const logoW = 56;
    const logoH = (logoImage.height / logoImage.width) * logoW;
    const logoY = headerTop - logoH;
    const textX = margin + logoW + 14;
    const brandName = storeName;
    const tagline = settings?.tagline?.trim() || "Premium Esports Gear";

    page.drawImage(logoImage, {
      x: margin,
      y: logoY,
      width: logoW,
      height: logoH,
    });
    page.drawText(brandName, {
      x: textX,
      y: logoY + logoH - 20,
      size: 13,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    page.drawText(tagline, {
      x: textX,
      y: logoY + logoH - 36,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    headerBottom = logoY - 8;
  } catch {
    y = headerTop - 16;
    drawText(storeName, margin, 16, true);
    y -= 18;
    drawText(settings?.tagline || "Premium Esports Gear", margin, 10, false, rgb(0.4, 0.4, 0.4));
    headerBottom = y - 8;
  }

  y = page.getHeight() - margin;
  drawRight("INVOICE", 20, true);
  y -= 22;
  drawRight(order.invoiceNumber || order.orderNumber, 10);
  y -= 14;
  drawRight(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 10);
  y -= 14;
  drawRight(`Order: ${order.orderNumber}`, 10);

  const headerLineY = Math.min(headerBottom, y) - 14;
  page.drawLine({
    start: { x: margin, y: headerLineY },
    end: { x: pageWidth - margin, y: headerLineY },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  y = headerLineY - 24;

  // Bill To / From — fixed column width + word wrap (no overlap)
  const colGap = 20;
  const colWidth = contentWidth / 2 - colGap;
  const colRight = margin + contentWidth / 2 + colGap;
  const lineH = 14;
  const bodySize = 10;

  y -= 12;
  page.drawText("BILL TO", {
    x: margin,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText("FROM", {
    x: colRight,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0.5, 0.5, 0.5),
  });

  const measure = (line: string) => font.widthOfTextAtSize(line, bodySize);

  const linesLeft = [
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    order.shippingAddress,
    [order.city, order.country].filter(Boolean).join(", "),
  ].filter((line) => line?.trim());

  const linesRight = [
    storeName,
    settings?.email || "",
    settings?.phone || "",
    settings?.address || "",
  ].filter((line) => line?.trim());

  let leftY = y - 16;
  let rightY = y - 16;

  const drawColumn = (lines: string[], x: number, startY: number) => {
    let cy = startY;
    for (const line of lines) {
      const wrapped = wrapText(line, colWidth, measure);
      for (const part of wrapped) {
        page.drawText(part, { x, y: cy, size: bodySize, font, color: rgb(0, 0, 0) });
        cy -= lineH;
      }
    }
    return cy;
  };

  leftY = drawColumn(linesLeft, margin, leftY);
  rightY = drawColumn(linesRight, colRight, rightY);

  y = Math.min(leftY, rightY) - 20;

  // Table header line
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  y -= 16;

  const colQty = margin + 270;
  const colUnit = margin + 330;
  const colAmt = pageWidth - margin - 80;

  drawText("DESCRIPTION", margin, 9, true);
  page.drawText("QTY", { x: colQty, y, size: 9, font: fontBold, color: rgb(0, 0, 0) });
  page.drawText("UNIT PRICE", {
    x: colUnit,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  page.drawText("AMOUNT", {
    x: colAmt,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  y -= 20;

  for (const item of order.items) {
    drawText(item.name, margin, 10);
    page.drawText(String(item.quantity), { x: colQty, y, size: 10, font });
    page.drawText(formatMoney(item.price), { x: colUnit, y, size: 10, font });
    const amt = formatMoney(item.price * item.quantity);
    const amtW = font.widthOfTextAtSize(amt, 10);
    page.drawText(amt, { x: pageWidth - margin - amtW, y, size: 10, font });
    y -= 14;
    page.drawLine({
      start: { x: margin, y: y + 4 },
      end: { x: pageWidth - margin, y: y + 4 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    });
    y -= 8;
  }

  y -= 12;
  const totals: [string, number][] = [
    ["Subtotal", order.subtotal],
    ["Delivery Charge", order.shippingCost],
  ];

  for (const [label, amount] of totals) {
    const val = formatMoney(amount);
    const valW = font.widthOfTextAtSize(val, 10);
    page.drawText(label, {
      x: colAmt - 120,
      y,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    page.drawText(val, { x: pageWidth - margin - valW, y, size: 10, font });
    y -= 16;
  }

  page.drawLine({
    start: { x: colAmt - 120, y: y + 6 },
    end: { x: pageWidth - margin, y: y + 6 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  y -= 18;

  const totalStr = formatMoney(order.total);
  const totalW = fontBold.widthOfTextAtSize(totalStr, 12);
  page.drawText("Total Due", {
    x: colAmt - 120,
    y,
    size: 12,
    font: fontBold,
  });
  page.drawText(totalStr, {
    x: pageWidth - margin - totalW,
    y,
    size: 12,
    font: fontBold,
  });

  y -= 36;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  y -= 22;

  drawText(
    `Payment Method: Cash on Delivery (COD), ${getStatusLabel(order.status)}`,
    margin,
    10
  );
  y -= 14;
  drawText(`Collect ${formatMoney(order.total)} in cash upon delivery.`, margin, 10);
  y -= 24;
  drawText(
    `Thank you for shopping at ${storeName}. For questions contact ${settings?.email || "support@trizenstore.com.bd"}`,
    margin,
    8,
    false,
    rgb(0.5, 0.5, 0.5)
  );

  return pdf.save();
}
