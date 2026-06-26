import { prisma } from "./prisma";

const BARCODE_PREFIX = "890";
const BARCODE_SEQUENCE_WIDTH = 9;
const BARCODE_PATTERN = /^890(\d{9})$/;

export function barcodeFromSequence(sequence: number) {
  return `${BARCODE_PREFIX}${String(sequence).padStart(BARCODE_SEQUENCE_WIDTH, "0")}`;
}

export async function generateUniqueBarcode() {
  const products = await prisma.product.findMany({
    select: { barcode: true },
  });

  const used = new Set(products.map((product) => product.barcode).filter(Boolean));
  let nextSequence = 1;

  for (const barcode of used) {
    const match = barcode.match(BARCODE_PATTERN);
    if (!match) continue;
    nextSequence = Math.max(nextSequence, Number(match[1]) + 1);
  }

  for (let attempt = 0; attempt < 10_000; attempt += 1) {
    const candidate = barcodeFromSequence(nextSequence + attempt);
    if (!used.has(candidate)) return candidate;
  }

  throw new Error("Could not generate a unique barcode.");
}
