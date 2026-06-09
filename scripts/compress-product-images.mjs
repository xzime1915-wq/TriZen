/**
 * Convert large product PNGs → WebP for fast page loads.
 * Run: node scripts/compress-product-images.mjs
 */
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const productsDir = path.join(root, "public", "products");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.png$/i.test(entry.name)) files.push(full);
  }
  return files;
}

const pngs = await walk(productsDir);
let converted = 0;

for (const pngPath of pngs) {
  const webpPath = pngPath.replace(/\.png$/i, ".webp");
  const pngStat = await stat(pngPath);
  if (pngStat.size < 300_000) continue;

  const meta = await sharp(pngPath).metadata();
  const width = meta.width && meta.width > 2400 ? 2400 : undefined;

  await sharp(pngPath)
    .resize(width, undefined, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 86, effort: 4 })
    .toFile(webpPath);

  const webpStat = await stat(webpPath);
  const rel = path.relative(root, pngPath);
  console.log(
    `${rel}: ${(pngStat.size / 1024 / 1024).toFixed(1)}MB → ${(webpStat.size / 1024).toFixed(0)}KB`
  );
  converted++;
}

console.log(`\nDone — ${converted} WebP file(s) created/updated.`);
