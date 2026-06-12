/**
 * Convert product PNGs → high-quality WebP for fast, sharp page loads.
 * Run: node scripts/compress-product-images.mjs
 */
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const productsDir = path.join(root, "public", "products");

const MAX_WIDTH = 3840;
const WEBP_QUALITY = 93;
const MIN_PNG_BYTES = 80_000;

/** Handled by scripts/generate-hero-webp.mjs */
const SKIP_BASENAMES = new Set([
  "trizen-tripad-hero.png",
  "trizen-tripad-hero-display.png",
]);

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

function resizeWidth(meta) {
  if (!meta.width || meta.width <= MAX_WIDTH) return undefined;
  return MAX_WIDTH;
}

const pngs = await walk(productsDir);
let converted = 0;

for (const pngPath of pngs) {
  const base = path.basename(pngPath);
  if (SKIP_BASENAMES.has(base)) continue;

  const relFromProducts = path.relative(productsDir, pngPath);
  if (relFromProducts.startsWith(`our-gears${path.sep}`)) continue;

  const pngStat = await stat(pngPath);
  if (pngStat.size < MIN_PNG_BYTES) continue;

  const webpPath = pngPath.replace(/\.png$/i, ".webp");
  const meta = await sharp(pngPath).metadata();
  const width = resizeWidth(meta);
  const hasAlpha = meta.hasAlpha === true;

  let pipeline = sharp(pngPath);
  if (hasAlpha) pipeline = pipeline.ensureAlpha();
  if (width) {
    pipeline = pipeline.resize(width, null, {
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    });
  }

  await pipeline
    .webp({
      quality: WEBP_QUALITY,
      effort: 6,
      alphaQuality: hasAlpha ? 100 : undefined,
    })
    .toFile(webpPath);

  const webpStat = await stat(webpPath);
  const rel = path.relative(root, pngPath);
  console.log(
    `${rel}: ${(pngStat.size / 1024 / 1024).toFixed(1)}MB → ${(webpStat.size / 1024).toFixed(0)}KB (${meta.width}×${meta.height}${width ? ` → max ${width}w` : ""})`
  );
  converted++;
}

console.log(`\nDone — ${converted} WebP file(s) created/updated.`);
