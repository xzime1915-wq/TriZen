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

export async function buildInvoicePdf(
  order: OrderWithItems,
  settings: StoreSettings | null
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const storeName = settings?.storeName || "TriZen Store";
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

  // Header
  drawText(storeName, margin, 16, true);
  y -= 18;
  drawText(settings?.tagline || "Premium Esports Gear", margin, 10, false, rgb(0.4, 0.4, 0.4));

  y = page.getHeight() - margin;
  drawRight("INVOICE", 20, true);
  y -= 22;
  drawRight(order.invoiceNumber || order.orderNumber, 10);
  y -= 14;
  drawRight(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 10);
  y -= 14;
  drawRight(`Order: ${order.orderNumber}`, 10);

  y = page.getHeight() - margin - 70;

  // Bill To / From
  const col2 = margin + contentWidth / 2;
  drawText("BILL TO", margin, 9, true, rgb(0.5, 0.5, 0.5));
  drawText("FROM", col2, 9, true, rgb(0.5, 0.5, 0.5));

  y -= 16;
  const billY = y;
  const linesLeft = [
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    `${order.shippingAddress}, ${order.city}${order.country ? `, ${order.country}` : ""}`,
  ];
  const linesRight = [
    storeName,
    settings?.email || "",
    settings?.phone || "",
    settings?.address || "",
  ].filter(Boolean);

  let ly = billY;
  for (const line of linesLeft) {
    drawText(line, margin, 10);
    ly -= 14;
    y = ly;
  }

  ly = billY;
  for (const line of linesRight) {
    page.drawText(line, { x: col2, y: ly, size: 10, font, color: rgb(0, 0, 0) });
    ly -= 14;
  }

  y = Math.min(y, ly) - 24;

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
    thickness: 1.5,
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

  y -= 40;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 20;

  drawText(
    `Payment Method: Cash on Delivery (COD) — ${getStatusLabel(order.status)}`,
    margin,
    10
  );
  y -= 14;
  drawText(`Collect ${formatMoney(order.total)} in cash upon delivery.`, margin, 10);
  y -= 24;
  drawText(
    `Thank you for shopping at ${storeName}. For questions contact ${settings?.email || "support@trizenstore.com"}`,
    margin,
    8,
    false,
    rgb(0.5, 0.5, 0.5)
  );

  return pdf.save();
}
